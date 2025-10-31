<template>
  <div class="legal-page">
    <div class="container">
      <div class="content">
        <h1 class="title">🚚 Livraison</h1>

        <section class="section">
          <h2>Zones de livraison</h2>
          <p>Nous livrons actuellement uniquement en <strong>France métropolitaine</strong>.</p>
        </section>

        <section class="section">
          <h2>Délais de livraison</h2>
          <ul>
            <li><strong>France métropolitaine :</strong> 3-5 jours ouvrés</li>
          </ul>
          <p class="note">Les délais peuvent varier pendant les périodes de forte activité (soldes, fêtes de fin d'année, etc.).</p>
        </section>

        <section class="section">
          <h2>Frais de livraison</h2>
          <ul>
            <li><strong>Tarif standard :</strong> 4,90€</li>
            <li><strong>Livraison gratuite</strong> à partir de 50€ d'achat</li>
          </ul>
        </section>

        <section class="section">
          <h2>Suivi de commande</h2>
          <p>Un numéro de suivi vous sera envoyé par email dès l'expédition de votre commande. Vous pourrez suivre votre colis en temps réel.</p>
        </section>

        <section class="section">
          <h2>Problème de livraison</h2>
          <p>En cas de problème avec votre livraison, contactez-nous via notre <router-link to="/contact" class="link">formulaire de contact</router-link>.</p>
        </section>

        <router-link to="/" class="back-link">← Retour à l'accueil</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'Livraison | NainVert'
})
</script>

<style scoped src="../styles/legal-pages.css"></style>
