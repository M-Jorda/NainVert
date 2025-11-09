<template>
  <div class="not-found-page">
    <div class="container">
      <div class="content">
        <div class="glitch-wrapper">
          <h1 class="glitch" data-text="404">404</h1>
        </div>
        
        <p class="subtitle">🍄 Tu t'es perdu dans les champignons psychédéliques...</p>
        
        <p class="description">
          Cette page n'existe pas (ou elle a disparu dans une autre dimension).
        </p>

        <div class="actions">
          <router-link to="/" class="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Retour à l'accueil
          </router-link>
          
          <router-link to="/designs" class="btn-secondary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
            Voir nos designs
          </router-link>
        </div>

        <div class="ascii-art">
          <pre>
    🌿
   /|\
  / | \
    |
   / \
  /   \
          </pre>
          <p class="ascii-caption">Le Nain Vert te surveille...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = '404 - Page non trouvée | NainVert'
})
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  position: relative;
  overflow: hidden;
}

.not-found-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(57, 255, 20, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(57, 255, 20, 0.05) 0%, transparent 50%);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.container {
  max-width: 800px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.content {
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(57, 255, 20, 0.3);
  border-radius: 20px;
  padding: 3rem 2rem;
  backdrop-filter: blur(10px);
}

.glitch-wrapper {
  margin-bottom: 2rem;
}

.glitch {
  font-size: 8rem;
  font-weight: bold;
  text-transform: uppercase;
  position: relative;
  color: var(--color-neon-green);
  letter-spacing: 0.5rem;
  animation: glitch-skew 1s infinite linear alternate-reverse;
  text-shadow: 
    0 0 20px rgba(57, 255, 20, 0.8),
    0 0 40px rgba(57, 255, 20, 0.4);
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  left: 2px;
  text-shadow: -2px 0 #ff00ff;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim 5s infinite linear alternate-reverse;
}

.glitch::after {
  left: -2px;
  text-shadow: -2px 0 #00ffff;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim2 5s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
  0% { clip: rect(10px, 9999px, 31px, 0); transform: skew(0.5deg); }
  5% { clip: rect(70px, 9999px, 71px, 0); transform: skew(0.2deg); }
  10% { clip: rect(30px, 9999px, 91px, 0); transform: skew(0.8deg); }
  15% { clip: rect(60px, 9999px, 1px, 0); transform: skew(0.3deg); }
  20% { clip: rect(10px, 9999px, 81px, 0); transform: skew(0.6deg); }
  25% { clip: rect(40px, 9999px, 11px, 0); transform: skew(0.4deg); }
  30% { clip: rect(50px, 9999px, 61px, 0); transform: skew(0.7deg); }
  100% { clip: rect(20px, 9999px, 51px, 0); transform: skew(0.1deg); }
}

@keyframes glitch-anim2 {
  0% { clip: rect(65px, 9999px, 99px, 0); transform: skew(0.3deg); }
  5% { clip: rect(25px, 9999px, 33px, 0); transform: skew(0.7deg); }
  10% { clip: rect(15px, 9999px, 85px, 0); transform: skew(0.2deg); }
  15% { clip: rect(85px, 9999px, 15px, 0); transform: skew(0.9deg); }
  20% { clip: rect(55px, 9999px, 45px, 0); transform: skew(0.4deg); }
  25% { clip: rect(35px, 9999px, 75px, 0); transform: skew(0.6deg); }
  30% { clip: rect(5px, 9999px, 95px, 0); transform: skew(0.5deg); }
  100% { clip: rect(45px, 9999px, 25px, 0); transform: skew(0.8deg); }
}

@keyframes glitch-skew {
  0% { transform: skew(0deg); }
  10% { transform: skew(-2deg); }
  20% { transform: skew(2deg); }
  30% { transform: skew(-1deg); }
  40% { transform: skew(1deg); }
  50% { transform: skew(0deg); }
  60% { transform: skew(1deg); }
  70% { transform: skew(-1deg); }
  80% { transform: skew(2deg); }
  90% { transform: skew(-2deg); }
  100% { transform: skew(0deg); }
}

.subtitle {
  font-size: 1.5rem;
  color: var(--color-neon-green);
  margin-bottom: 1rem;
  font-weight: 600;
}

.description {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid;
}

.btn-primary {
  background: var(--color-neon-green);
  color: var(--color-black);
  border-color: var(--color-neon-green);
}

.btn-primary:hover {
  background: transparent;
  color: var(--color-neon-green);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(57, 255, 20, 0.3);
}

.btn-secondary {
  background: transparent;
  color: var(--color-neon-green);
  border-color: rgba(57, 255, 20, 0.5);
}

.btn-secondary:hover {
  background: rgba(57, 255, 20, 0.1);
  border-color: var(--color-neon-green);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(57, 255, 20, 0.2);
}

.ascii-art {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(57, 255, 20, 0.2);
}

.ascii-art pre {
  color: var(--color-neon-green);
  font-size: 1rem;
  line-height: 1.2;
  margin: 0 auto 1rem;
  display: inline-block;
  filter: drop-shadow(0 0 10px rgba(57, 255, 20, 0.5));
}

.ascii-caption {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-style: italic;
}

@media (max-width: 768px) {
  .glitch {
    font-size: 5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .description {
    font-size: 1rem;
  }

  .content {
    padding: 2rem 1rem;
  }

  .actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
