<template>
  <div class="interactive-plan">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
    </div>

    <!-- No Plan State -->
    <div v-else-if="!plan?.imageUrl" class="no-plan-container">
      <h1 class="text-4xl font-black text-gradient mb-4">LE NAIN VERT</h1>
      <p class="text-[var(--color-text-secondary)]">Site en cours de configuration</p>
    </div>

    <!-- Plan Display -->
    <div v-else class="plan-container">
      <div class="plan-wrapper">
        <img
          :src="plan.imageUrl"
          alt="Plan du site Le Nain Vert"
          class="plan-image"
          @load="imageLoaded = true"
        >

        <!-- Hotspots (invisible markers, visible on hover) -->
        <template v-if="imageLoaded">
          <component
            v-for="hotspot in visibleHotspots"
            :key="hotspot.id"
            :is="hotspot.linkType === 'external' ? 'a' : 'router-link'"
            :to="hotspot.linkType === 'internal' ? hotspot.link : undefined"
            :href="hotspot.linkType === 'external' ? hotspot.link : undefined"
            :target="hotspot.linkType === 'external' ? '_blank' : undefined"
            :style="getHotspotStyle(hotspot)"
            class="hotspot"
            :title="hotspot.label"
          >
            <!-- Invisible hit area with hover effect -->
            <div
              class="hotspot-zone"
              :style="{ '--hotspot-color': hotspot.color || '#39FF14' }"
            >
              <!-- Outer glow ring (appears on hover) -->
              <span class="hotspot-ring"></span>
              <!-- Inner pulse (appears on hover) -->
              <span class="hotspot-pulse"></span>
              <!-- Center dot (appears on hover) -->
              <span class="hotspot-center"></span>
            </div>

            <!-- Label (appears on hover) -->
            <span class="hotspot-label">{{ hotspot.label }}</span>
          </component>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePlan } from '@/composables/usePlan'

const { plan, loading, loadPlan } = usePlan()

const imageLoaded = ref(false)

const visibleHotspots = computed(() =>
  plan.value?.hotspots?.filter(h => h.isVisible !== false) || []
)

const getHotspotStyle = (hotspot) => ({
  left: `${hotspot.x}%`,
  top: `${hotspot.y}%`
})

onMounted(() => {
  loadPlan()
})
</script>

<style scoped>
.interactive-plan {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0a0a;
}

.loading-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(57, 255, 20, 0.2);
  border-top-color: var(--color-neon-green);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.no-plan-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.plan-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.plan-wrapper {
  position: relative;
  max-width: 100%;
  max-height: 100%;
  display: inline-block;
}

.plan-image {
  display: block;
  max-width: 100vw;
  max-height: 100vh;
  width: auto;
  height: auto;
  object-fit: contain;
}

/* Hotspot Styles - Hidden by default, visible on hover */
.hotspot {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  text-decoration: none;
  z-index: 10;
}

.hotspot-zone {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

/* Outer ring - hidden by default */
.hotspot-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--hotspot-color);
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.3s ease;
}

/* Pulse animation ring - hidden by default */
.hotspot-pulse {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  background: var(--hotspot-color);
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* Center dot - hidden by default */
.hotspot-center {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--hotspot-color);
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
  box-shadow: 0 0 15px var(--hotspot-color);
}

/* Hover states - reveal the hotspot */
.hotspot:hover .hotspot-ring {
  opacity: 0.6;
  transform: scale(1);
}

.hotspot:hover .hotspot-pulse {
  opacity: 0.15;
  animation: pulse-ring 1.5s ease-out infinite;
}

.hotspot:hover .hotspot-center {
  opacity: 1;
  transform: scale(1);
}

/* Label - hidden by default */
.hotspot-label {
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  margin-top: 8px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.95);
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  border: 1px solid var(--hotspot-color);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.hotspot:hover .hotspot-label {
  opacity: 1;
  transform: translateX(-50%) translateY(4px);
}

/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.15;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

/* Responsive - proportional hit areas on mobile */
@media (max-width: 768px) {
  .hotspot-zone {
    width: 100px;
    height: 100px;
  }

  .hotspot-center {
    width: 16px;
    height: 16px;
  }

  .hotspot-label {
    font-size: 0.75rem;
    padding: 6px 12px;
  }
}

/* Slightly smaller on very small screens */
@media (max-width: 480px) {
  .hotspot-zone {
    width: 88px;
    height: 88px;
  }
}
</style>
