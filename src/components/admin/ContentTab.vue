<template>
  <div class="content-tab">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Home Page Content -->
      <div class="content-section">
        <h2 class="text-2xl font-bold mb-4 text-white flex items-center gap-2">
          <span>🏠</span> Page d'accueil
        </h2>
        <!-- Hero Section -->
        <div class="content-card">
          <h3 class="text-lg font-semibold mb-4 text-[var(--color-neon-green)]">Section Hero</h3>
          <div class="flex flex-col gap-3">
            <div>
              <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Titre</label>
              <input v-model="siteContent.home.title" class="form-input" @blur="$emit('auto-save', 'home', 'title', siteContent.home.title)">
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Sous-titre</label>
              <input v-model="siteContent.home.subtitle" class="form-input" @blur="$emit('auto-save', 'home', 'subtitle', siteContent.home.subtitle)">
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Call-to-Action</label>
              <input v-model="siteContent.home.cta" class="form-input" @blur="$emit('auto-save', 'home', 'cta', siteContent.home.cta)">
            </div>
          </div>
        </div>
      </div>
      <!-- Contact Page Content -->
      <div class="content-section">
        <h2 class="text-2xl font-bold mb-4 text-white flex items-center gap-2">
          <span>📧</span> Page Contact
        </h2>
        <div class="content-card">
          <h3 class="text-lg font-semibold mb-4 text-[var(--color-neon-green)]">Informations</h3>
          <div class="flex flex-col gap-3">
            <div>
              <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Titre</label>
              <input v-model="siteContent.contact.title" class="form-input" @blur="$emit('auto-save', 'contact', 'title', siteContent.contact.title)">
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Sous-titre</label>
              <textarea v-model="siteContent.contact.subtitle" class="form-textarea" rows="3" @blur="$emit('auto-save', 'contact', 'subtitle', siteContent.contact.subtitle)"></textarea>
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Email</label>
              <input v-model="siteContent.contact.email" type="email" class="form-input" @blur="$emit('auto-save', 'contact', 'email', siteContent.contact.email)">
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Instagram</label>
              <input v-model="siteContent.contact.instagram" class="form-input" @blur="$emit('auto-save', 'contact', 'instagram', siteContent.contact.instagram)">
            </div>
            <div>
              <label class="block text-sm font-semibold mb-2 text-[var(--color-text-secondary)]">Horaires</label>
              <input v-model="siteContent.contact.hours" class="form-input" @blur="$emit('auto-save', 'contact', 'hours', siteContent.contact.hours)">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Easter Eggs Section (après Accueil et Contact) -->
    <div class="content-section mt-8">
      <h2 class="text-2xl font-bold mb-4 text-white flex items-center gap-2">
        <span>🥚</span> Easter Eggs
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="egg in easterEggsList" :key="egg.key" class="p-6 bg-[rgba(57,255,20,0.05)] border border-[rgba(57,255,20,0.2)] rounded-lg hover:border-[var(--color-neon-green)] transition-all">
          <div class="flex items-start gap-4 mb-4">
            <input v-model="egg.icon" @blur="$emit('update-easter-egg', egg.key, { icon: egg.icon })" class="text-4xl w-16 text-center bg-transparent border-b-2 border-transparent hover:border-[rgba(57,255,20,0.3)] focus:border-[var(--color-neon-green)] transition-colors outline-none" maxlength="2">
            <div class="flex-1">
              <input v-model="egg.title" @blur="$emit('update-easter-egg', egg.key, { title: egg.title })" class="w-full text-xl font-bold text-white bg-transparent border-b-2 border-transparent hover:border-[rgba(57,255,20,0.3)] focus:border-[var(--color-neon-green)] transition-colors outline-none mb-1">
              <div class="text-xs text-[var(--color-text-secondary)] font-mono">Clé: {{ egg.key }} | Ordre: {{ egg.order }}</div>
            </div>
          </div>
          <textarea v-model="egg.text" @blur="$emit('update-easter-egg', egg.key, { text: egg.text })" class="w-full text-sm text-[var(--color-text-secondary)] italic bg-transparent border border-transparent hover:border-[rgba(57,255,20,0.3)] focus:border-[var(--color-neon-green)] transition-colors outline-none rounded p-2 mb-3 min-h-[100px] resize-none"></textarea>
          <input v-model="egg.author" @blur="$emit('update-easter-egg', egg.key, { author: egg.author || null })" class="w-full text-xs text-[var(--color-text-secondary)] text-right bg-transparent border-b border-transparent hover:border-[rgba(57,255,20,0.3)] focus:border-[var(--color-neon-green)] transition-colors outline-none" placeholder="Auteur (optionnel)">
          <div class="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(57,255,20,0.1)]">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" v-model="egg.active" @change="$emit('update-easter-egg', egg.key, { active: egg.active })" class="w-4 h-4 rounded border-[rgba(57,255,20,0.3)] bg-transparent checked:bg-[var(--color-neon-green)]">
              <span class="text-xs text-[var(--color-text-secondary)]">{{ egg.active ? 'Actif' : 'Désactivé' }}</span>
            </label>
            <span class="px-2 py-1 text-xs rounded" :class="egg.active ? 'bg-[var(--color-neon-green)]/10 text-[var(--color-neon-green)]' : 'bg-gray-500/10 text-gray-500'">{{ egg.active ? '✓ Visible' : '✗ Caché' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  siteContent: {
    type: Object,
    required: true
  },
  easterEggsList: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['auto-save', 'update-easter-egg'])
</script>
