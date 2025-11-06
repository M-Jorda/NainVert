<template>
  <div class="minimalist-home">
    <!-- Logo centré -->
    <div class="logo-container">
      <h1 class="text-[clamp(3.5rem,9vw,7rem)] font-black flex flex-col gap-2 items-center">
        <span class="text-gradient">LE NAIN</span>
        <span class="neon-text">VERT</span>
      </h1>
    </div>

    <!-- Bouton Champignon -->
    <div class="mushroom-button-container">
      <router-link to="/products" class="mushroom-button" title="Découvrir la collection">
        <svg class="mushroom-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <!-- Chapeau du champignon -->
          <ellipse cx="100" cy="80" rx="80" ry="50" fill="#FF6B6B" class="mushroom-cap"/>
          <ellipse cx="100" cy="80" rx="60" ry="40" fill="#FF8787" opacity="0.6"/>
          <!-- Points blancs sur le chapeau -->
          <circle cx="70" cy="70" r="8" fill="white" opacity="0.9"/>
          <circle cx="110" cy="65" r="6" fill="white" opacity="0.9"/>
          <circle cx="90" cy="85" r="7" fill="white" opacity="0.9"/>
          <circle cx="125" cy="80" r="5" fill="white" opacity="0.9"/>
          <circle cx="55" cy="85" r="6" fill="white" opacity="0.9"/>
          <!-- Pied du champignon -->
          <rect x="85" y="80" width="30" height="70" rx="15" fill="#F0E68C" class="mushroom-stem"/>
          <ellipse cx="100" cy="145" rx="20" ry="8" fill="#D4AF37" opacity="0.6"/>
        </svg>
        <span class="mushroom-text">ENTRER</span>
      </router-link>
    </div>

  </div>
</template>

<script setup>
</script>

<style scoped>
.minimalist-home {
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  overflow: hidden;
  padding: 2rem 1rem;
}

/* Effet de fond animé */
.minimalist-home::before {
  content: '';
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(57, 255, 20, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(0, 255, 136, 0.05) 0%, transparent 50%);
  animation: pulse 10s ease-in-out infinite;
}

.logo-container {
  z-index: 10;
  animation: float-in 1.5s ease-out;
}

.text-gradient {
  background: linear-gradient(135deg, #39FF14 0%, #00FF88 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(57, 255, 20, 0.5));
}

.neon-text {
  color: var(--color-neon-green);
  text-shadow: 
    0 0 10px var(--color-neon-green),
    0 0 20px var(--color-neon-green),
    0 0 40px var(--color-neon-green);
}

/* Bouton Champignon */
.mushroom-button-container {
  margin-top: 2rem;
  margin-bottom: 2rem;
  z-index: 10;
  animation: float-in 1.5s ease-out 0.3s backwards;
}

.mushroom-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}

.mushroom-button:hover {
  transform: translateY(-10px) scale(1.05);
}

.mushroom-svg {
  width: 160px;
  height: 160px;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
  transition: all 0.4s ease;
}

.mushroom-button:hover .mushroom-svg {
  filter: 
    drop-shadow(0 10px 40px rgba(255, 107, 107, 0.6))
    drop-shadow(0 0 20px rgba(57, 255, 20, 0.4));
}

.mushroom-cap {
  transform-origin: center;
  animation: wobble 3s ease-in-out infinite;
}

.mushroom-stem {
  transform-origin: center bottom;
  animation: sway 3s ease-in-out infinite;
}

.mushroom-text {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  color: var(--color-neon-green);
  text-shadow: 0 0 10px rgba(57, 255, 20, 0.8);
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.mushroom-button:hover .mushroom-text {
  color: #FF6B6B;
  text-shadow: 0 0 20px rgba(255, 107, 107, 0.8);
  transform: scale(1.1);
}

.contact-link svg {
  width: 24px;
  height: 24px;
}

/* Responsive */
@keyframes float-in {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes wobble {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-2deg);
  }
  75% {
    transform: rotate(2deg);
  }
}

@keyframes sway {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(3px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .minimalist-home {
    padding: 1.5rem 1rem;
  }
  
  .mushroom-svg {
    width: 130px;
    height: 130px;
  }
}
</style>
