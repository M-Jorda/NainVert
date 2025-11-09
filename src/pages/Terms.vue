<template>
  <div class="legal-page">
    <div class="container">
      <div class="content">
        <h1 class="title">📋 Conditions Générales de Vente</h1>

        <section class="section">
          <h2>1. Objet</h2>
          <p>Les présentes Conditions Générales de Vente (CGV) régissent les ventes de produits proposés par NainVert sur son site internet.</p>
        </section>

        <section class="section">
          <h2>2. Prix</h2>
          <p>Les prix sont indiqués en euros (€) TTC. NainVert se réserve le droit de modifier ses prix à tout moment, mais les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.</p>
        </section>

        <section class="section">
          <h2>3. Commande</h2>
          <p>Toute commande suppose l'adhésion sans réserve aux présentes CGV. Toute commande validée est considérée comme ferme et définitive.</p>
          <p>Le processus de commande se déroule comme suit :</p>
          <ul>
            <li>Sélection des articles</li>
            <li>Validation du panier</li>
            <li>Saisie des informations de livraison</li>
            <li>Validation des informations</li>
            <li>Choix du mode de paiement et paiement</li>
            <li>Confirmation de commande par email</li>
          </ul>
          <p class="note">
            <strong>Note :</strong> Aucune création de compte n'est nécessaire pour passer commande sur NainVert.
          </p>
        </section>

        <section class="section">
          <h2>4. Paiement</h2>
          <p>Le paiement s'effectue en ligne de manière sécurisée. Nous acceptons les moyens de paiement suivants :</p>
          <ul>
            <li>Carte bancaire (Visa, Mastercard, American Express)</li>
            <li>PayPal</li>
          </ul>
        </section>

        <section class="section">
          <h2>5. Livraison</h2>
          <p>Les délais et conditions de livraison sont détaillés sur notre <router-link to="/shipping" class="link">page Livraison</router-link>.</p>
        </section>

        <section class="section">
          <h2>6. Droit de rétractation</h2>
          <p>Conformément aux dispositions légales, vous disposez d'un délai de 14 jours pour exercer votre droit de rétractation. Plus d'informations sur notre <router-link to="/returns" class="link">page Retours</router-link>.</p>
        </section>

        <section class="section">
          <h2>7. Garanties</h2>
          <p>Tous nos produits bénéficient de la garantie légale de conformité et de la garantie des vices cachés, conformément aux dispositions du Code de la consommation.</p>
        </section>

        <section class="section">
          <h2>8. Responsabilité</h2>
          <p>NainVert ne saurait être tenu responsable de l'inexécution du contrat en cas de force majeure, de perturbation ou grève totale ou partielle des services postaux et moyens de transport.</p>
        </section>

        <section class="section">
          <h2>9. Données personnelles</h2>
          <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour plus d'informations, consultez nos <router-link to="/legal" class="link">mentions légales</router-link>.</p>
        </section>

        <section class="section">
          <h2>10. Litiges</h2>
          <p>En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux français seront seuls compétents.</p>
        </section>

        <section class="section">
          <h2>11. Contact</h2>
          <p>Pour toute question relative aux CGV, contactez-nous via notre <router-link to="/contact" class="link">formulaire de contact</router-link>.</p>
        </section>

        <p class="update-date">Dernière mise à jour : Octobre 2025</p>

        <router-link to="/" class="back-link">← Retour à l'accueil</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'Conditions Générales de Vente | NainVert'
})
</script>

<style scoped src="../styles/legal-pages.css"></style>
