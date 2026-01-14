<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const categories = [
  { id: 'sizes', label: 'Sizes & Fit', icon: '📏' },
  { id: 'shipping', label: 'Shipping', icon: '📦' },
  { id: 'orders', label: 'Orders', icon: '🛒' },
  { id: 'returns', label: 'Returns & Refunds', icon: '↩️' },
  { id: 'products', label: 'Products', icon: '👕' }
]

const activeCategory = ref('sizes')

const faqs = {
  sizes: [
    {
      question: 'How do I choose the right size?',
      answer: 'Use our size guide below. Measure yourself and compare with our charts. Our fits are regular/standard. If between sizes, size up for comfort.'
    },
    {
      question: 'T-Shirt Size Chart',
      answer: `
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-neon-green/30">
              <th class="py-2 px-4">Size</th>
              <th class="py-2 px-4">Chest (cm)</th>
              <th class="py-2 px-4">Length (cm)</th>
              <th class="py-2 px-4">Shoulder (cm)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-black-lighter">
              <td class="py-2 px-4 font-semibold text-neon-green">S</td>
              <td class="py-2 px-4">94-98</td>
              <td class="py-2 px-4">70</td>
              <td class="py-2 px-4">44</td>
            </tr>
            <tr class="border-b border-black-lighter">
              <td class="py-2 px-4 font-semibold text-neon-green">M</td>
              <td class="py-2 px-4">98-102</td>
              <td class="py-2 px-4">72</td>
              <td class="py-2 px-4">46</td>
            </tr>
            <tr class="border-b border-black-lighter">
              <td class="py-2 px-4 font-semibold text-neon-green">L</td>
              <td class="py-2 px-4">102-108</td>
              <td class="py-2 px-4">74</td>
              <td class="py-2 px-4">48</td>
            </tr>
            <tr class="border-b border-black-lighter">
              <td class="py-2 px-4 font-semibold text-neon-green">XL</td>
              <td class="py-2 px-4">108-114</td>
              <td class="py-2 px-4">76</td>
              <td class="py-2 px-4">50</td>
            </tr>
            <tr>
              <td class="py-2 px-4 font-semibold text-neon-green">XXL</td>
              <td class="py-2 px-4">114-120</td>
              <td class="py-2 px-4">78</td>
              <td class="py-2 px-4">52</td>
            </tr>
          </tbody>
        </table>
      `
    },
    {
      question: 'Hoodie Size Chart',
      answer: `
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-neon-green/30">
              <th class="py-2 px-4">Size</th>
              <th class="py-2 px-4">Chest (cm)</th>
              <th class="py-2 px-4">Length (cm)</th>
              <th class="py-2 px-4">Sleeve (cm)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-black-lighter">
              <td class="py-2 px-4 font-semibold text-neon-green">S</td>
              <td class="py-2 px-4">100-104</td>
              <td class="py-2 px-4">68</td>
              <td class="py-2 px-4">64</td>
            </tr>
            <tr class="border-b border-black-lighter">
              <td class="py-2 px-4 font-semibold text-neon-green">M</td>
              <td class="py-2 px-4">104-108</td>
              <td class="py-2 px-4">70</td>
              <td class="py-2 px-4">66</td>
            </tr>
            <tr class="border-b border-black-lighter">
              <td class="py-2 px-4 font-semibold text-neon-green">L</td>
              <td class="py-2 px-4">108-114</td>
              <td class="py-2 px-4">72</td>
              <td class="py-2 px-4">68</td>
            </tr>
            <tr class="border-b border-black-lighter">
              <td class="py-2 px-4 font-semibold text-neon-green">XL</td>
              <td class="py-2 px-4">114-120</td>
              <td class="py-2 px-4">74</td>
              <td class="py-2 px-4">70</td>
            </tr>
            <tr>
              <td class="py-2 px-4 font-semibold text-neon-green">XXL</td>
              <td class="py-2 px-4">120-126</td>
              <td class="py-2 px-4">76</td>
              <td class="py-2 px-4">72</td>
            </tr>
          </tbody>
        </table>
      `
    }
  ],
  shipping: [
    {
      question: 'Shipping costs?',
      answer: 'Free shipping on all orders in France. International shipping calculated at checkout.'
    },
    {
      question: 'Delivery time?',
      answer: '3-5 business days in France. 7-14 days international. Tracking provided.'
    }
  ],
  orders: [
    {
      question: 'Can I modify my order?',
      answer: 'Contact us within 1 hour of ordering. Once shipped, modifications are not possible.'
    },
    {
      question: 'Order tracking?',
      answer: 'You receive a tracking number via email once shipped. Check status anytime.'
    }
  ],
  returns: [
    {
      question: 'Return policy?',
      answer: '30-day returns. Items must be unworn, unwashed, with tags. Shipping costs are yours.'
    },
    {
      question: 'Refund time?',
      answer: '5-7 business days after we receive the item. Original payment method.'
    }
  ],
  products: [
    {
      question: 'Material quality?',
      answer: '100% organic cotton. 180g/m² for T-shirts. 300g/m² for hoodies. Pre-shrunk.'
    },
    {
      question: 'Care instructions?',
      answer: 'Machine wash 30°C. Turn inside out. No bleach. Tumble dry low. Iron low heat.'
    }
  ]
}

onMounted(() => {
  const hash = router.currentRoute.value.hash.replace('#', '')
  if (hash && categories.find(c => c.id === hash)) {
    activeCategory.value = hash
    setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }
})
</script>

<template>
  <div class="min-h-screen bg-black-deep text-white pt-24 pb-16">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-black mb-4 text-gradient">FAQ</h1>
        <p class="text-xl text-gray-400">Everything you need to know</p>
      </div>

      <!-- Category Tabs -->
      <div class="flex flex-wrap gap-3 mb-8 justify-center">
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="activeCategory = cat.id"
          :class="[
            'px-6 py-3 rounded-lg font-semibold transition-all',
            activeCategory === cat.id
              ? 'bg-gradient-to-r from-neon-green to-neon-cyan text-black-deep'
              : 'bg-black-light border-2 border-black-lighter hover:border-neon-green/50'
          ]"
        >
          <span class="mr-2">{{ cat.icon }}</span>
          {{ cat.label }}
        </button>
      </div>

      <!-- FAQ Content -->
      <div class="space-y-4">
        <div
          v-for="(faq, index) in faqs[activeCategory]"
          :key="index"
          :id="index === 0 ? activeCategory : null"
          class="bg-black-light border-2 border-black-lighter rounded-lg p-6 hover:border-neon-green/30 transition-all"
        >
          <h3 class="text-xl font-bold mb-3 text-neon-green">{{ faq.question }}</h3>
          <div
            class="text-gray-300 leading-relaxed"
            v-html="faq.answer"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-gradient {
  background: linear-gradient(135deg, var(--neon-green), var(--neon-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
