/**
 * Script pour créer un design de test dans Firestore
 * Structure simplifiée sans colors et availableOn
 */

const testDesign = {
  slug: 'test-design',
  name: 'Test Design',
  tagline: 'Un design de test pour vérifier la structure',
  description: 'Description complète du design de test pour s\'assurer que tout fonctionne correctement.',
  story: 'L\'histoire inspirante derrière ce design de test.',
  featured: true,
  inStock: true,
  images: [
    'https://via.placeholder.com/800x800/39FF14/000000?text=Test+Design+1',
    'https://via.placeholder.com/800x800/39FF14/000000?text=Test+Design+2'
  ],
  createdAt: new Date()
};

console.log('📋 Structure du design à créer:');
console.log(JSON.stringify(testDesign, null, 2));

console.log('\n✅ Champs présents:');
Object.keys(testDesign).forEach(key => {
  console.log(`  - ${key}: ${typeof testDesign[key]}`);
});

console.log('\n❌ Champs supprimés:');
console.log('  - colors (non présent)');
console.log('  - availableOn (non présent)');

console.log('\n💡 Pour créer ce design:');
console.log('1. Va dans l\'admin panel');
console.log('2. Onglet "Designs"');
console.log('3. Clique sur "Nouveau Design"');
console.log('4. Remplis les champs et upload des images');
console.log('5. Le design sera créé sans les champs colors et availableOn');
