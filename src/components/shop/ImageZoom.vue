<template>
  <div class="image-zoom-container" ref="containerRef">
    <!-- Main image with hover detection -->
    <div
      class="main-image-wrapper"
      :class="{ 'is-hovering': isHovering }"
      @mouseenter="handleMouseEnter"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
      ref="imageWrapperRef"
    >
      <img
        :src="src"
        :alt="alt"
        class="main-image"
        ref="imageRef"
      >

      <!-- Zoom indicator box (shows what area is being magnified) -->
      <div
        v-if="isHovering"
        class="zoom-indicator"
        :style="indicatorStyle"
      ></div>
    </div>

    <!-- Magnified preview panel (appears to the right) -->
    <Teleport to="body">
      <Transition name="zoom-panel">
        <div
          v-if="isHovering && panelPosition"
          class="zoom-panel"
          :style="panelStyle"
        >
          <div
            class="zoom-panel-content"
            :style="zoomContentStyle"
          ></div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  zoomLevel: {
    type: Number,
    default: 2.5
  },
  panelWidth: {
    type: Number,
    default: 400
  },
  panelHeight: {
    type: Number,
    default: 400
  }
})

const containerRef = ref(null)
const imageWrapperRef = ref(null)
const imageRef = ref(null)
const isHovering = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const imageRect = ref(null)
const panelPosition = ref(null)

// Size of the indicator box (what portion is being magnified)
const indicatorSize = computed(() => {
  if (!imageRect.value) return { width: 0, height: 0 }
  return {
    width: props.panelWidth / props.zoomLevel,
    height: props.panelHeight / props.zoomLevel
  }
})

// Position and style for the indicator box
const indicatorStyle = computed(() => {
  if (!imageRect.value) return {}

  const halfWidth = indicatorSize.value.width / 2
  const halfHeight = indicatorSize.value.height / 2

  // Clamp position to stay within image bounds
  let left = mouseX.value - halfWidth
  let top = mouseY.value - halfHeight

  left = Math.max(0, Math.min(left, imageRect.value.width - indicatorSize.value.width))
  top = Math.max(0, Math.min(top, imageRect.value.height - indicatorSize.value.height))

  return {
    width: `${indicatorSize.value.width}px`,
    height: `${indicatorSize.value.height}px`,
    left: `${left}px`,
    top: `${top}px`
  }
})

// Calculate panel position (to the right of the image)
const panelStyle = computed(() => {
  if (!panelPosition.value) return {}

  return {
    position: 'fixed',
    left: `${panelPosition.value.left}px`,
    top: `${panelPosition.value.top}px`,
    width: `${props.panelWidth}px`,
    height: `${props.panelHeight}px`,
    zIndex: 9999
  }
})

// Background position for the zoomed image in the panel
const zoomContentStyle = computed(() => {
  if (!imageRect.value) return {}

  const halfWidth = indicatorSize.value.width / 2
  const halfHeight = indicatorSize.value.height / 2

  // Clamp position
  let posX = mouseX.value - halfWidth
  let posY = mouseY.value - halfHeight

  posX = Math.max(0, Math.min(posX, imageRect.value.width - indicatorSize.value.width))
  posY = Math.max(0, Math.min(posY, imageRect.value.height - indicatorSize.value.height))

  // Calculate background position percentage
  const bgX = (posX / (imageRect.value.width - indicatorSize.value.width)) * 100 || 0
  const bgY = (posY / (imageRect.value.height - indicatorSize.value.height)) * 100 || 0

  return {
    backgroundImage: `url(${props.src})`,
    backgroundSize: `${imageRect.value.width * props.zoomLevel}px ${imageRect.value.height * props.zoomLevel}px`,
    backgroundPosition: `${bgX}% ${bgY}%`,
    width: '100%',
    height: '100%'
  }
})

const updateImageRect = () => {
  if (imageWrapperRef.value) {
    const rect = imageWrapperRef.value.getBoundingClientRect()
    imageRect.value = {
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom
    }

    // Position panel to the right of the image
    const gap = 16
    let panelLeft = rect.right + gap
    let panelTop = rect.top

    // Check if panel fits on the right, otherwise position on left
    if (panelLeft + props.panelWidth > window.innerWidth - 20) {
      panelLeft = rect.left - props.panelWidth - gap
    }

    // Ensure panel doesn't go off screen vertically
    if (panelTop + props.panelHeight > window.innerHeight - 20) {
      panelTop = window.innerHeight - props.panelHeight - 20
    }
    if (panelTop < 20) {
      panelTop = 20
    }

    panelPosition.value = {
      left: panelLeft,
      top: panelTop
    }
  }
}

const handleMouseEnter = () => {
  updateImageRect()
  isHovering.value = true
}

const handleMouseMove = (e) => {
  if (!imageRect.value) return

  const rect = imageWrapperRef.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top

  // Clamp to image bounds
  mouseX.value = Math.max(0, Math.min(mouseX.value, rect.width))
  mouseY.value = Math.max(0, Math.min(mouseY.value, rect.height))
}

const handleMouseLeave = () => {
  isHovering.value = false
}

// Update rect on resize
const handleResize = () => {
  if (isHovering.value) {
    updateImageRect()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  window.addEventListener('scroll', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('scroll', handleResize)
})
</script>

<style scoped>
.image-zoom-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

.main-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: crosshair;
  border-radius: 0.5rem;
  overflow: hidden;
}

.main-image-wrapper.is-hovering {
  /* Subtle dimming effect when zoom is active */
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.zoom-indicator {
  position: absolute;
  border: 2px solid var(--color-neon-green, #39FF14);
  background: rgba(57, 255, 20, 0.1);
  pointer-events: none;
  box-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
  transition: none;
}

.zoom-panel {
  background: var(--color-black-light, #1a1a1a);
  border: 2px solid rgba(57, 255, 20, 0.4);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow:
    0 0 30px rgba(57, 255, 20, 0.2),
    0 25px 50px -12px rgba(0, 0, 0, 0.8);
  pointer-events: none;
}

.zoom-panel-content {
  background-repeat: no-repeat;
  border-radius: 0.5rem;
}

/* Transition for panel appearance */
.zoom-panel-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.zoom-panel-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.zoom-panel-enter-from,
.zoom-panel-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
