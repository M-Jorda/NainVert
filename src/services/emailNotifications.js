/**
 * Service d'envoi d'emails pour les notifications admin
 * Utilise EmailJS pour envoyer des emails directement depuis le frontend
 *
 * EmailJS est conçu pour les appels frontend - la clé publique est safe à exposer
 * Limite gratuite: 200 emails/mois
 *
 * Setup requis:
 * 1. Créer un compte sur https://www.emailjs.com/
 * 2. Créer un "Email Service" (connecter Gmail, Outlook, etc.)
 * 3. Créer un "Email Template" avec les variables: {{client_name}}, {{client_email}}, {{tag_change}}, {{timestamp}}, {{admin_link}}
 * 4. Copier le Service ID, Template ID, et Public Key dans .env
 */

// Configuration EmailJS depuis les variables d'environnement
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

// Email(s) admin pour les notifications (peut être étendu pour récupérer depuis Firestore)
const ADMIN_EMAILS = import.meta.env.VITE_ADMIN_EMAIL || 'contact@nainvert.com'

/**
 * Vérifie si le service EmailJS est configuré
 */
export const isEmailServiceConfigured = () => {
  return !!(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY)
}

/**
 * Initialise EmailJS (à appeler au démarrage de l'app si nécessaire)
 */
export const initEmailJS = async () => {
  if (!isEmailServiceConfigured()) {
    return false
  }

  // Charger le SDK EmailJS dynamiquement
  if (!window.emailjs) {
    try {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'
      script.async = true
      document.head.appendChild(script)

      await new Promise((resolve, reject) => {
        script.onload = resolve
        script.onerror = reject
      })

      window.emailjs.init(EMAILJS_PUBLIC_KEY)
      return true
    } catch (error) {
      return false
    }
  }

  return true
}

/**
 * Labels des tags pour l'affichage
 */
const tagLabels = {
  'vip': '⭐ VIP - Client premium',
  'good': '👍 Bon client',
  'neutral': '😐 Neutre',
  'watch': '⚠️ À surveiller',
  'problematic': '🚫 Problématique',
  '': 'Aucun tag'
}

/**
 * Envoie une notification par email quand un tag client est modifié
 * @param {Object} params - Paramètres de la notification
 * @param {string} params.clientEmail - Email du client
 * @param {string} params.clientName - Nom du client
 * @param {string} params.newTag - Nouveau tag
 * @param {string} params.previousTag - Ancien tag
 * @param {string} params.privateNote - Note privée (optionnel)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendTagChangeNotification = async ({
  clientEmail,
  clientName,
  newTag,
  previousTag,
  privateNote = ''
}) => {
  // Vérifier la configuration
  if (!isEmailServiceConfigured()) {
    return { success: false, error: 'EmailJS non configuré' }
  }

  // S'assurer que EmailJS est initialisé
  if (!window.emailjs) {
    const initialized = await initEmailJS()
    if (!initialized) {
      return { success: false, error: 'Impossible d\'initialiser EmailJS' }
    }
  }

  const newTagLabel = tagLabels[newTag] || newTag || 'Aucun tag'
  const previousTagLabel = tagLabels[previousTag] || previousTag || 'Aucun tag'
  const timestamp = new Date().toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris',
    dateStyle: 'full',
    timeStyle: 'short'
  })

  try {
    // Paramètres pour le template EmailJS
    const templateParams = {
      to_email: ADMIN_EMAILS,
      client_name: clientName || 'Inconnu',
      client_email: clientEmail,
      previous_tag: previousTagLabel,
      new_tag: newTagLabel,
      tag_change: `${previousTagLabel} → ${newTagLabel}`,
      private_note: privateNote || 'Aucune note',
      timestamp: timestamp,
      admin_link: 'https://nainvert.com/rho',
      subject: `🏷️ Tag client modifié: ${clientName || clientEmail}`
    }

    await window.emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    )

    return { success: true }

  } catch (error) {
    return { success: false, error: error.text || error.message }
  }
}

/**
 * Envoie une notification pour un changement de statut de commande
 * @param {Object} params - Paramètres de la notification
 * @param {string} params.orderNumber - Numéro de commande
 * @param {string} params.customerName - Nom du client
 * @param {string} params.newStatus - Nouveau statut
 * @param {string} params.previousStatus - Ancien statut
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const sendStatusChangeNotification = async ({
  orderNumber,
  customerName,
  newStatus,
  previousStatus
}) => {
  if (!isEmailServiceConfigured()) {
    return { success: false, error: 'EmailJS non configuré' }
  }

  if (!window.emailjs) {
    const initialized = await initEmailJS()
    if (!initialized) {
      return { success: false, error: 'Impossible d\'initialiser EmailJS' }
    }
  }

  const statusLabels = {
    'pending': '⏳ En attente',
    'paid': '💳 Payée',
    'shipped': '📦 Expédiée',
    'delivered': '✅ Livrée',
    'cancelled': '❌ Annulée'
  }

  const newStatusLabel = statusLabels[newStatus] || newStatus
  const previousStatusLabel = statusLabels[previousStatus] || previousStatus
  const timestamp = new Date().toLocaleString('fr-FR', {
    timeZone: 'Europe/Paris',
    dateStyle: 'full',
    timeStyle: 'short'
  })

  try {
    const templateParams = {
      to_email: ADMIN_EMAILS,
      client_name: customerName || 'Client',
      order_number: orderNumber,
      previous_status: previousStatusLabel,
      new_status: newStatusLabel,
      status_change: `${previousStatusLabel} → ${newStatusLabel}`,
      timestamp: timestamp,
      admin_link: 'https://nainvert.com/rho',
      subject: `📦 Statut commande modifié: ${orderNumber}`
    }

    await window.emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    )

    return { success: true }

  } catch (error) {
    return { success: false, error: error.text || error.message }
  }
}

/**
 * Alternative: Envoi via API REST (pour services comme Brevo/Resend)
 * Note: Cette méthode expose la clé API côté client - à utiliser avec précaution
 * Préférer EmailJS ou un backend pour la production
 */
export const sendEmailViaAPI = async (to, subject, htmlContent) => {
  const apiKey = import.meta.env.VITE_EMAIL_API_KEY
  const apiUrl = import.meta.env.VITE_EMAIL_API_URL

  if (!apiKey || !apiUrl) {
    return { success: false, error: 'API non configurée' }
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        to: Array.isArray(to) ? to : [to],
        subject,
        html: htmlContent
      })
    })

    if (response.ok) {
      return { success: true }
    } else {
      const error = await response.json()
      return { success: false, error: error.message }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
