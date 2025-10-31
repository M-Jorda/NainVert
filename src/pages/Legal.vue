<template>
  <div class="legal-page">
    <div class="container">
      <div class="content">
        <h1 class="title">⚖️ Mentions Légales</h1>

        <section class="section">
          <h2>1. Éditeur du site</h2>
          <p><strong>Nom de l'entreprise :</strong> NainVert</p>
          <p><strong>Forme juridique :</strong> Auto-entrepreneur / Micro-entreprise</p>
          <p><strong>Adresse :</strong> [Adresse à compléter]</p>
          <p><strong>Email :</strong> contact@nainvert.fr</p>
          <p><strong>SIRET :</strong> [Numéro à compléter]</p>
        </section>

        <section class="section">
          <h2>2. Directeur de la publication</h2>
          <p><strong>Nom :</strong> [Nom à compléter]</p>
        </section>

        <section class="section">
          <h2>3. Hébergement</h2>
          <p><strong>Hébergeur :</strong> Firebase Hosting (Google LLC)</p>
          <p><strong>Adresse :</strong> 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA</p>
          <p><strong>Site web :</strong> <a href="https://firebase.google.com" target="_blank" rel="noopener noreferrer" class="link">firebase.google.com</a></p>
        </section>

        <section class="section">
          <h2>4. Propriété intellectuelle</h2>
          <p>L'ensemble du contenu de ce site (textes, images, vidéos, logos, etc.) est protégé par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable.</p>
          <p>Les marques et logos présents sur le site sont la propriété de NainVert ou font l'objet d'une autorisation d'utilisation.</p>
        </section>

        <section class="section">
          <h2>5. Données personnelles (RGPD)</h2>
          <p>Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants concernant vos données personnelles :</p>
          <ul>
            <li><strong>Droit d'accès :</strong> Vous pouvez demander à consulter les données que nous détenons sur vous</li>
            <li><strong>Droit de rectification :</strong> Vous pouvez demander la correction de vos données si elles sont inexactes</li>
            <li><strong>Droit à l'effacement :</strong> Vous pouvez demander la suppression définitive de vos données</li>
            <li><strong>Droit d'opposition :</strong> Vous pouvez refuser le traitement de vos données pour des finalités spécifiques</li>
            <li><strong>Droit à la portabilité :</strong> Vous pouvez demander à récupérer vos données dans un format structuré et lisible</li>
          </ul>
          <p>Pour exercer ces droits, contactez-nous via notre <router-link to="/contact" class="link">formulaire de contact</router-link> en précisant le droit que vous souhaitez exercer.</p>
        </section>

        <section class="section">
          <h2>6. Collecte des données</h2>
          <p>Nous collectons uniquement les données nécessaires au traitement de votre demande :</p>
          <ul>
            <li>Nom, prénom, email (via le formulaire de contact)</li>
            <li>Données de navigation (cookies techniques essentiels au fonctionnement du site)</li>
          </ul>
          <p class="note">
            <strong>Note :</strong> NainVert ne nécessite pas de création de compte. Aucune donnée n'est collectée lors de la navigation sur le site, sauf si vous nous contactez volontairement via le formulaire de contact.
          </p>
          <p><strong>Finalité :</strong> Répondre à vos demandes de contact, amélioration de l'expérience utilisateur.</p>
          <p><strong>Conservation :</strong> Les messages de contact sont conservés le temps nécessaire au traitement de votre demande, puis supprimés conformément à nos politiques internes.</p>
        </section>

        <section class="section">
          <h2>7. Cookies</h2>
          <p>Ce site utilise des cookies techniques nécessaires au fonctionnement du site (panier, session utilisateur). Aucun cookie publicitaire ou de tracking n'est utilisé sans votre consentement.</p>
          <p>Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, mais cela peut affecter certaines fonctionnalités du site.</p>
        </section>

        <section class="section">
          <h2>8. Sécurité</h2>
          <p>Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour garantir la sécurité de vos données personnelles :</p>
          <ul>
            <li>Chiffrement SSL/TLS pour les connexions</li>
            <li>Hébergement sécurisé Firebase</li>
            <li>Accès restreint aux données</li>
            <li>Sauvegardes régulières</li>
          </ul>
        </section>

        <section class="section">
          <h2>9. Liens externes</h2>
          <p>Notre site peut contenir des liens vers des sites externes. Nous ne sommes pas responsables du contenu de ces sites ni de leurs pratiques en matière de protection des données.</p>
        </section>

        <section class="section">
          <h2>10. Droit applicable</h2>
          <p>Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>
        </section>

        <section class="section">
          <h2>11. Contact</h2>
          <p>Pour toute question concernant ces mentions légales ou vos données personnelles, contactez-nous :</p>
          <ul>
            <li><strong>Email :</strong> contact@nainvert.fr</li>
            <li><strong>Formulaire :</strong> <router-link to="/contact" class="link">Page de contact</router-link></li>
          </ul>
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
  document.title = 'Mentions Légales | NainVert'
})
</script>

<style scoped src="../styles/legal-pages.css"></style>
