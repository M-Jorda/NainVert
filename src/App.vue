<template>
  <div id="app" class="min-h-screen flex flex-col bg-[var(--color-black)]">
    <!-- NainVert icon for navigation (shows on all pages except home) -->
    <NainVertIcon v-if="showNavIcon" />

    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer v-if="showFooter" />
    <Cart />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NainVertIcon from './components/NainVertIcon.vue'
import Footer from './components/Footer.vue'
import Cart from './components/Cart.vue'

const route = useRoute()

// Le footer et l'icone ne s'affichent pas sur la page d'accueil
const showFooter = computed(() => route.name !== 'Home')
const showNavIcon = computed(() => route.name !== 'Home')
</script>

<style scoped>
/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
