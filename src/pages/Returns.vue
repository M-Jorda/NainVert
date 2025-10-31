<template>
  <div class="legal-page">
    <div class="container">
      <div class="content">
        <h1 class="title">↩️ Retours & Remboursements</h1>

        <section class="section">
          <h2>Droit de rétractation</h2>
          <p>Conformément à la législation en vigueur, vous disposez d'un délai de <strong>14 jours</strong> à compter de la réception de votre commande pour exercer votre droit de rétractation.</p>
        </section>

        <section class="section">
          <h2>Conditions de retour</h2>
          <p>Pour être accepté, le produit doit être :</p>
          <ul>
            <li>Dans son état d'origine</li>
            <li>Non porté et non lavé</li>
            <li>Avec toutes les étiquettes attachées</li>
            <li>Dans son emballage d'origine</li>
          </ul>
        </section>

        <section class="section">
          <h2>Procédure de retour</h2>
          <ol>
            <li>Contactez-nous via notre <router-link to="/contact" class="link">formulaire de contact</router-link></li>
            <li>Nous vous enverrons une étiquette de retour</li>
            <li>Renvoyez le colis à l'adresse indiquée</li>
            <li>Dès réception, nous procéderons au remboursement sous 14 jours</li>
          </ol>
        </section>

        <section class="section">
          <h2>Frais de retour</h2>
          <p>Les frais de retour sont à votre charge, sauf en cas de produit défectueux ou d'erreur de notre part.</p>
        </section>

        <section class="section">
          <h2>Remboursement</h2>
          <p>Le remboursement sera effectué dans un délai de 14 jours suivant la réception du produit retourné, sur le même moyen de paiement que celui utilisé lors de l'achat.</p>
        </section>

        <section class="section">
          <h2>Échange</h2>
          <p>Nous n'effectuons pas d'échanges directs. Pour changer de taille ou de modèle, veuillez retourner votre article et passer une nouvelle commande.</p>
        </section>

        <router-link to="/" class="back-link">← Retour à l'accueil</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'Retours & Remboursements | NainVert'
})
</script>

<style scoped src="../styles/legal-pages.css"></style>
