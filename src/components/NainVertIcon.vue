<template>
  <router-link to="/" class="nainvert-icon" title="Retour au plan">
    <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class="icon-svg">
      <!-- Gnome hat (pointy) -->
      <polygon
        points="30,5 45,35 15,35"
        fill="#39FF14"
        class="hat"
      />
      <!-- Hat band -->
      <rect x="15" y="32" width="30" height="5" rx="2" fill="#2dd912" class="hat-band"/>

      <!-- Face -->
      <ellipse cx="30" cy="42" rx="12" ry="10" fill="#ffd9b3" class="face"/>

      <!-- Beard -->
      <ellipse cx="30" cy="52" rx="10" ry="8" fill="white" class="beard"/>
      <ellipse cx="30" cy="48" rx="8" ry="5" fill="white"/>

      <!-- Eyes -->
      <circle cx="26" cy="40" r="2" fill="#1a1a1a" class="eye"/>
      <circle cx="34" cy="40" r="2" fill="#1a1a1a" class="eye"/>

      <!-- Nose -->
      <ellipse cx="30" cy="44" rx="3" ry="2" fill="#e6c9a8"/>

      <!-- Cheeks (blush) -->
      <circle cx="22" cy="44" r="2" fill="#ff9999" opacity="0.5"/>
      <circle cx="38" cy="44" r="2" fill="#ff9999" opacity="0.5"/>
    </svg>
    <span class="icon-glow"></span>
  </router-link>
</template>

<script setup>
</script>

<style scoped>
.nainvert-icon {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 10, 10, 0.9);
  border: 2px solid rgba(57, 255, 20, 0.4);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  overflow: visible;
}

.nainvert-icon:hover {
  transform: scale(1.1);
  border-color: var(--color-neon-green);
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.5);
}

.icon-svg {
  width: 36px;
  height: 36px;
  transition: transform 0.3s ease;
}

.nainvert-icon:hover .icon-svg {
  transform: scale(1.05);
}

.nainvert-icon:hover .hat {
  filter: drop-shadow(0 0 8px rgba(57, 255, 20, 0.8));
}

.icon-glow {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(57, 255, 20, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.nainvert-icon:hover .icon-glow {
  opacity: 1;
}

/* Animation for eyes blinking */
@keyframes blink {
  0%, 90%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
}

.eye {
  transform-origin: center;
  animation: blink 4s ease-in-out infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .nainvert-icon {
    width: 44px;
    height: 44px;
    top: 0.75rem;
    left: 0.75rem;
  }

  .icon-svg {
    width: 30px;
    height: 30px;
  }
}
</style>
