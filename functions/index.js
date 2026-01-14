/**
 * Firebase Cloud Functions pour NainVert
 * Gère les paiements Stripe et l'envoi d'emails
 */

const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })

// Initialiser Firebase Admin
admin.initializeApp()

// Importer Stripe avec la clé secrète (depuis les variables d'environnement Firebase)
const stripe = require('stripe')(functions.config().stripe?.secret || process.env.STRIPE_SECRET_KEY)

// Importer SendGrid pour les emails
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(functions.config().sendgrid?.api_key || process.env.SENDGRID_API_KEY)

// ============================================================================
// 1. CRÉATION DE PAYMENTINTENT (Stripe)
// ============================================================================

/**
 * Crée un PaymentIntent Stripe pour une commande
 * Appelé par le frontend avant d'afficher le formulaire de paiement
 */
exports.createPaymentIntent = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // Vérifier la méthode HTTP
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Méthode non autorisée' })
    }

    try {
      const { amount, currency, orderId, customer, metadata } = req.body

      if (!orderId) {
        return res.status(400).json({ error: 'ID de commande requis' })
      }

      // CRITICAL: Validate amount against actual order in Firestore
      const db = admin.firestore()
      const ordersSnapshot = await db.collection('orders')
        .where('orderNumber', '==', orderId)
        .limit(1)
        .get()

      if (ordersSnapshot.empty) {
        return res.status(404).json({ error: 'Commande non trouvée' })
      }

      const orderDoc = ordersSnapshot.docs[0]
      const orderData = orderDoc.data()

      // Calculate expected amount from order (convert to cents)
      const expectedAmount = Math.round((orderData.total || 0) * 100)

      // Validate the amount matches the order total (with small tolerance for rounding)
      if (!amount || Math.abs(amount - expectedAmount) > 1) {
        console.error(`❌ Montant invalide: reçu ${amount}, attendu ${expectedAmount} pour commande ${orderId}`)
        return res.status(400).json({ error: 'Montant ne correspond pas à la commande' })
      }

      // Minimum 1€ (100 centimes)
      if (expectedAmount < 100) {
        return res.status(400).json({ error: 'Montant invalide (minimum 1€)' })
      }

      // Créer le PaymentIntent with validated amount
      const paymentIntent = await stripe.paymentIntents.create({
        amount: expectedAmount, // Use server-validated amount, not client amount
        currency: currency || 'eur',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          orderId: orderId,
          customerEmail: customer?.email || orderData.customer?.email || '',
          ...metadata
        },
        receipt_email: customer?.email || orderData.customer?.email || null,
        description: `Commande NainVert ${orderId}`
      })

      console.log(`✅ PaymentIntent créé: ${paymentIntent.id} pour commande ${orderId}`)

      // Retourner le clientSecret au frontend
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      })

    } catch (error) {
      console.error('❌ Erreur création PaymentIntent:', error)
      res.status(500).json({ error: error.message })
    }
  })
})

// ============================================================================
// 2. WEBHOOK STRIPE (Confirmation de paiement)
// ============================================================================

/**
 * Webhook Stripe pour recevoir les notifications de paiement
 * Configure l'URL dans le Dashboard Stripe: /stripeWebhook
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature']
  const endpointSecret = functions.config().stripe?.webhook_secret || process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    // Vérifier la signature du webhook
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret)
  } catch (err) {
    console.error('❌ Erreur signature webhook:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Gérer les différents types d'événements
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(event.data.object)
      break
    
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object)
      break
    
    default:
      console.log(`ℹ️ Événement non géré: ${event.type}`)
  }

  res.status(200).json({ received: true })
})

/**
 * Gère un paiement réussi
 */
async function handlePaymentSucceeded(paymentIntent) {
  const orderId = paymentIntent.metadata?.orderId
  
  if (!orderId) {
    console.error('❌ Pas d\'orderId dans le PaymentIntent')
    return
  }

  console.log(`✅ Paiement réussi pour commande: ${orderId}`)

  // Mettre à jour la commande dans Firestore
  const db = admin.firestore()
  
  // Chercher la commande par numéro de commande
  const ordersSnapshot = await db.collection('orders')
    .where('orderNumber', '==', orderId)
    .limit(1)
    .get()

  if (ordersSnapshot.empty) {
    console.error(`❌ Commande non trouvée: ${orderId}`)
    return
  }

  const orderDoc = ordersSnapshot.docs[0]
  
  // Mettre à jour le statut de la commande
  await orderDoc.ref.update({
    status: 'paid',
    'payment.status': 'succeeded',
    'payment.method': 'stripe',
    'payment.transactionId': paymentIntent.id,
    'payment.paidAt': admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  })

  console.log(`✅ Commande ${orderId} mise à jour: paid`)

  // Envoyer l'email de confirmation
  const orderData = orderDoc.data()
  await sendOrderConfirmationEmail(orderData, paymentIntent)
}

/**
 * Gère un paiement échoué
 */
async function handlePaymentFailed(paymentIntent) {
  const orderId = paymentIntent.metadata?.orderId
  
  if (!orderId) return

  console.log(`❌ Paiement échoué pour commande: ${orderId}`)

  const db = admin.firestore()
  const ordersSnapshot = await db.collection('orders')
    .where('orderNumber', '==', orderId)
    .limit(1)
    .get()

  if (!ordersSnapshot.empty) {
    const orderDoc = ordersSnapshot.docs[0]
    await orderDoc.ref.update({
      'payment.status': 'failed',
      'payment.lastError': paymentIntent.last_payment_error?.message || 'Paiement refusé',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    })
  }
}

// ============================================================================
// 3. EMAILS TRANSACTIONNELS (SendGrid)
// ============================================================================

/**
 * Envoie un email de confirmation de commande
 */
async function sendOrderConfirmationEmail(orderData, paymentIntent) {
  const customerEmail = orderData.customer?.email
  
  if (!customerEmail) {
    console.error('❌ Pas d\'email client pour la confirmation')
    return
  }

  try {
    const msg = {
      to: customerEmail,
      from: {
        email: functions.config().sendgrid?.from_email || 'contact@nainvert.com',
        name: 'NainVert'
      },
      subject: `🌿 Confirmation de commande ${orderData.orderNumber}`,
      html: generateOrderConfirmationHTML(orderData, paymentIntent)
    }

    await sgMail.send(msg)
    console.log(`✅ Email de confirmation envoyé à ${customerEmail}`)

    // Envoyer aussi une notification à l'admin
    await sendAdminNotificationEmail(orderData)

  } catch (error) {
    console.error('❌ Erreur envoi email:', error)
  }
}

/**
 * Envoie une notification à l'admin pour une nouvelle commande
 */
async function sendAdminNotificationEmail(orderData) {
  const adminEmail = functions.config().admin?.email || 'contact@nainvert.com'

  try {
    const msg = {
      to: adminEmail,
      from: {
        email: functions.config().sendgrid?.from_email || 'contact@nainvert.com',
        name: 'NainVert - Notifications'
      },
      subject: `🛒 Nouvelle commande payée: ${orderData.orderNumber}`,
      html: generateAdminNotificationHTML(orderData)
    }

    await sgMail.send(msg)
    console.log(`✅ Notification admin envoyée`)

  } catch (error) {
    console.error('❌ Erreur envoi notification admin:', error)
  }
}

/**
 * Envoie un email d'expédition avec numéro de suivi
 */
exports.sendShippingEmail = functions.https.onCall(async (data, context) => {
  // Vérifier l'authentification admin
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Non autorisé')
  }

  const { orderId, trackingNumber, carrier } = data

  const db = admin.firestore()
  const orderDoc = await db.collection('orders').doc(orderId).get()

  if (!orderDoc.exists) {
    throw new functions.https.HttpsError('not-found', 'Commande non trouvée')
  }

  const orderData = orderDoc.data()
  const customerEmail = orderData.customer?.email

  if (!customerEmail) {
    throw new functions.https.HttpsError('invalid-argument', 'Email client manquant')
  }

  try {
    const msg = {
      to: customerEmail,
      from: {
        email: functions.config().sendgrid?.from_email || 'contact@nainvert.com',
        name: 'NainVert'
      },
      subject: `📦 Votre commande ${orderData.orderNumber} a été expédiée !`,
      html: generateShippingEmailHTML(orderData, trackingNumber, carrier)
    }

    await sgMail.send(msg)
    console.log(`✅ Email d'expédition envoyé à ${customerEmail}`)

    return { success: true }

  } catch (error) {
    console.error('❌ Erreur envoi email expédition:', error)
    throw new functions.https.HttpsError('internal', error.message)
  }
})

// ============================================================================
// 4. TEMPLATES HTML POUR EMAILS
// ============================================================================

/**
 * Génère le HTML pour l'email de confirmation de commande
 */
function generateOrderConfirmationHTML(orderData, paymentIntent) {
  const items = orderData.items || []
  const itemsHTML = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #2a2a2a;">
        <strong style="color: #ffffff;">${item.name}</strong><br>
        <span style="color: #b0b0b0; font-size: 12px;">${item.type === 'tshirt' ? 'T-Shirt' : 'Hoodie'} • Taille ${item.size}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #2a2a2a; text-align: center; color: #b0b0b0;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #2a2a2a; text-align: right; color: #39FF14; font-weight: bold;">
        ${(item.price * item.quantity).toFixed(2)}€
      </td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Montserrat', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="text-align: center; padding: 30px 0; border-bottom: 2px solid #39FF14;">
          <h1 style="color: #39FF14; font-size: 32px; margin: 0; text-transform: uppercase; letter-spacing: 4px;">
            NainVert
          </h1>
          <p style="color: #b0b0b0; margin: 10px 0 0 0; font-size: 14px;">
            L'art qui habille vos idées
          </p>
        </div>

        <!-- Confirmation -->
        <div style="text-align: center; padding: 40px 20px;">
          <div style="width: 60px; height: 60px; background: rgba(57, 255, 20, 0.1); border: 2px solid #39FF14; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #39FF14; font-size: 30px;">✓</span>
          </div>
          <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 10px 0;">
            Merci pour votre commande !
          </h2>
          <p style="color: #b0b0b0; margin: 0;">
            Votre paiement a été confirmé avec succès.
          </p>
        </div>

        <!-- Numéro de commande -->
        <div style="background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <p style="color: #b0b0b0; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase;">
            Numéro de commande
          </p>
          <p style="color: #39FF14; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
            ${orderData.orderNumber}
          </p>
        </div>

        <!-- Articles -->
        <div style="background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; margin-bottom: 20px;">
          <div style="padding: 15px 20px; border-bottom: 1px solid #2a2a2a;">
            <h3 style="color: #ffffff; margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
              Récapitulatif
            </h3>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #0a0a0a;">
                <th style="padding: 12px; text-align: left; color: #666666; font-size: 12px; text-transform: uppercase;">Article</th>
                <th style="padding: 12px; text-align: center; color: #666666; font-size: 12px; text-transform: uppercase;">Qté</th>
                <th style="padding: 12px; text-align: right; color: #666666; font-size: 12px; text-transform: uppercase;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          <div style="padding: 15px 20px; border-top: 2px solid #39FF14;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #b0b0b0;">Sous-total</td>
                <td style="text-align: right; color: #ffffff;">${orderData.subtotal?.toFixed(2) || orderData.total?.toFixed(2)}€</td>
              </tr>
              <tr>
                <td style="color: #b0b0b0;">Livraison</td>
                <td style="text-align: right; color: #39FF14;">Gratuite</td>
              </tr>
              <tr>
                <td style="padding-top: 15px; color: #ffffff; font-size: 18px; font-weight: bold;">TOTAL</td>
                <td style="padding-top: 15px; text-align: right; color: #39FF14; font-size: 24px; font-weight: bold;">${orderData.total?.toFixed(2)}€</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Adresse de livraison -->
        <div style="background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <h3 style="color: #ffffff; margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
            📍 Adresse de livraison
          </h3>
          <p style="color: #b0b0b0; margin: 0; line-height: 1.6;">
            ${orderData.customer?.name}<br>
            ${orderData.customer?.address?.street}<br>
            ${orderData.customer?.address?.postalCode} ${orderData.customer?.address?.city}<br>
            ${orderData.customer?.address?.country || 'France'}
          </p>
        </div>

        <!-- Prochaines étapes -->
        <div style="text-align: center; padding: 30px 20px; background: rgba(57, 255, 20, 0.05); border-radius: 12px; margin-bottom: 20px;">
          <h3 style="color: #39FF14; margin: 0 0 15px 0;">Prochaines étapes</h3>
          <p style="color: #b0b0b0; margin: 0; line-height: 1.8;">
            1️⃣ Nous préparons votre commande<br>
            2️⃣ Vous recevrez un email avec le numéro de suivi<br>
            3️⃣ Livraison sous 5-7 jours ouvrés
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 30px 0; border-top: 1px solid #2a2a2a;">
          <p style="color: #666666; font-size: 12px; margin: 0 0 10px 0;">
            Des questions ? Contactez-nous à <a href="mailto:contact@nainvert.com" style="color: #39FF14;">contact@nainvert.com</a>
          </p>
          <p style="color: #666666; font-size: 12px; margin: 0;">
            © 2025 NainVert - Tous droits réservés
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}

/**
 * Génère le HTML pour la notification admin
 */
function generateAdminNotificationHTML(orderData) {
  const items = orderData.items || []
  const itemsList = items.map(item => 
    `• ${item.quantity}x ${item.name} (${item.type}, ${item.size}) - ${(item.price * item.quantity).toFixed(2)}€`
  ).join('<br>')

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: Arial, sans-serif; background: #0a0a0a; color: #ffffff; padding: 20px;">
      <h1 style="color: #39FF14;">🛒 Nouvelle commande payée !</h1>
      
      <p><strong>Numéro:</strong> ${orderData.orderNumber}</p>
      <p><strong>Total:</strong> ${orderData.total?.toFixed(2)}€</p>
      
      <h3>Client</h3>
      <p>
        ${orderData.customer?.name}<br>
        ${orderData.customer?.email}<br>
        ${orderData.customer?.phone}
      </p>
      
      <h3>Adresse</h3>
      <p>
        ${orderData.customer?.address?.street}<br>
        ${orderData.customer?.address?.postalCode} ${orderData.customer?.address?.city}
      </p>
      
      <h3>Articles</h3>
      <p>${itemsList}</p>
      
      ${orderData.notes ? `<h3>⚠️ Notes client</h3><p style="color: #ff6b6b;">${orderData.notes}</p>` : ''}
      
      <p style="margin-top: 30px;">
        <a href="https://nainvert.com/rho" style="background: #39FF14; color: #0a0a0a; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Voir dans l'admin →
        </a>
      </p>
    </body>
    </html>
  `
}

/**
 * Génère le HTML pour l'email d'expédition
 */
function generateShippingEmailHTML(orderData, trackingNumber, carrier) {
  const trackingUrl = getTrackingUrl(carrier, trackingNumber)

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Montserrat', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="text-align: center; padding: 30px 0; border-bottom: 2px solid #39FF14;">
          <h1 style="color: #39FF14; font-size: 32px; margin: 0; text-transform: uppercase; letter-spacing: 4px;">
            NainVert
          </h1>
        </div>

        <!-- Contenu -->
        <div style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 60px; margin-bottom: 20px;">📦</div>
          <h2 style="color: #ffffff; font-size: 24px; margin: 0 0 10px 0;">
            Votre commande est en route !
          </h2>
          <p style="color: #b0b0b0; margin: 0;">
            Commande ${orderData.orderNumber}
          </p>
        </div>

        <!-- Tracking -->
        <div style="background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: center;">
          <p style="color: #b0b0b0; margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase;">
            Numéro de suivi
          </p>
          <p style="color: #39FF14; margin: 0 0 20px 0; font-size: 20px; font-weight: bold; letter-spacing: 1px;">
            ${trackingNumber}
          </p>
          <a href="${trackingUrl}" style="display: inline-block; background: #39FF14; color: #0a0a0a; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
            Suivre mon colis →
          </a>
        </div>

        <!-- Transporteur -->
        <div style="background: rgba(57, 255, 20, 0.05); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
          <p style="color: #b0b0b0; margin: 0 0 5px 0; font-size: 12px;">Transporteur</p>
          <p style="color: #ffffff; margin: 0; font-size: 16px; font-weight: bold;">
            ${carrier === 'colissimo' ? 'Colissimo' : carrier === 'chronopost' ? 'Chronopost' : carrier}
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 30px 0; border-top: 1px solid #2a2a2a;">
          <p style="color: #666666; font-size: 12px; margin: 0;">
            © 2025 NainVert - Tous droits réservés
          </p>
        </div>

      </div>
    </body>
    </html>
  `
}

/**
 * Retourne l'URL de suivi selon le transporteur
 */
function getTrackingUrl(carrier, trackingNumber) {
  const urls = {
    colissimo: `https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`,
    chronopost: `https://www.chronopost.fr/tracking-no-cms/suivi-page?liession=${trackingNumber}`,
    mondial_relay: `https://www.mondialrelay.fr/suivi-de-colis/?numeroExpedition=${trackingNumber}`,
    ups: `https://www.ups.com/track?tracknum=${trackingNumber}`,
    dhl: `https://www.dhl.com/fr-fr/home/tracking.html?tracking-id=${trackingNumber}`
  }

  return urls[carrier] || urls.colissimo
}

// ============================================================================
// 5. FONCTION UTILITAIRE : Envoyer un email personnalisé
// ============================================================================

exports.sendCustomEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Non autorisé')
  }

  const { to, subject, html } = data

  try {
    const msg = {
      to,
      from: {
        email: functions.config().sendgrid?.from_email || 'contact@nainvert.com',
        name: 'NainVert'
      },
      subject,
      html
    }

    await sgMail.send(msg)
    return { success: true }

  } catch (error) {
    console.error('❌ Erreur envoi email:', error)
    throw new functions.https.HttpsError('internal', error.message)
  }
})
