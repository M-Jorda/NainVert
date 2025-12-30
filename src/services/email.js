/**
 * Service Email pour NainVert
 * Appelle les Cloud Functions Firebase pour envoyer des emails
 */

import { getFunctions, httpsCallable } from 'firebase/functions'

// Instance des fonctions (lazy loaded)
let functionsInstance = null

/**
 * Récupère l'instance Firebase Functions
 */
const getFunctionsInstance = () => {
  if (!functionsInstance) {
    functionsInstance = getFunctions()
  }
  return functionsInstance
}

/**
 * Envoie un email d'expédition au client
 * @param {Object} params
 * @param {string} params.orderId - ID du document commande
 * @param {string} params.trackingNumber - Numéro de suivi
 * @param {string} params.carrier - Transporteur (colissimo, chronopost, etc.)
 * @returns {Promise<{success: boolean}>}
 */
export const sendShippingEmail = async ({ orderId, trackingNumber, carrier }) => {
  try {
    const functions = getFunctionsInstance()
    const sendEmail = httpsCallable(functions, 'sendShippingEmail')
    
    const result = await sendEmail({ orderId, trackingNumber, carrier })
    return result.data
    
  } catch (error) {
    console.error('❌ Erreur envoi email expédition:', error)
    throw error
  }
}

/**
 * Envoie un email personnalisé (admin seulement)
 * @param {Object} params
 * @param {string} params.to - Email destinataire
 * @param {string} params.subject - Sujet
 * @param {string} params.html - Contenu HTML
 * @returns {Promise<{success: boolean}>}
 */
export const sendCustomEmail = async ({ to, subject, html }) => {
  try {
    const functions = getFunctionsInstance()
    const sendEmail = httpsCallable(functions, 'sendCustomEmail')
    
    const result = await sendEmail({ to, subject, html })
    return result.data
    
  } catch (error) {
    console.error('❌ Erreur envoi email:', error)
    throw error
  }
}

/**
 * Templates d'emails pré-définis
 */
export const emailTemplates = {
  /**
   * Template pour relance de paiement
   */
  paymentReminder: (orderData) => ({
    subject: `⏰ Votre commande ${orderData.orderNumber} attend votre paiement`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #0a0a0a; color: #ffffff; padding: 30px;">
        <h1 style="color: #39FF14;">Rappel de paiement</h1>
        <p>Bonjour ${orderData.customer?.name},</p>
        <p>Votre commande <strong>${orderData.orderNumber}</strong> est toujours en attente de paiement.</p>
        <p>Montant: <strong style="color: #39FF14;">${orderData.total?.toFixed(2)}€</strong></p>
        <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        <p style="margin-top: 30px;">L'équipe NainVert 🌿</p>
      </div>
    `
  }),

  /**
   * Template pour problème de livraison
   */
  deliveryIssue: (orderData, message) => ({
    subject: `📦 Information sur votre commande ${orderData.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #0a0a0a; color: #ffffff; padding: 30px;">
        <h1 style="color: #39FF14;">Information livraison</h1>
        <p>Bonjour ${orderData.customer?.name},</p>
        <p>Concernant votre commande <strong>${orderData.orderNumber}</strong> :</p>
        <p style="background: #1a1a1a; padding: 15px; border-radius: 8px;">${message}</p>
        <p>Nous restons à votre disposition pour toute question.</p>
        <p style="margin-top: 30px;">L'équipe NainVert 🌿</p>
      </div>
    `
  }),

  /**
   * Template pour commande livrée
   */
  delivered: (orderData) => ({
    subject: `✅ Votre commande ${orderData.orderNumber} a été livrée !`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #0a0a0a; color: #ffffff; padding: 30px;">
        <h1 style="color: #39FF14;">Commande livrée ! 🎉</h1>
        <p>Bonjour ${orderData.customer?.name},</p>
        <p>Votre commande <strong>${orderData.orderNumber}</strong> a été livrée avec succès.</p>
        <p>Nous espérons que vous apprécierez vos nouveaux articles NainVert !</p>
        <p>N'hésitez pas à nous laisser un avis sur Instagram @nainvert</p>
        <p style="margin-top: 30px;">Merci pour votre confiance ! 🌿</p>
      </div>
    `
  })
}

export default {
  sendShippingEmail,
  sendCustomEmail,
  emailTemplates
}
