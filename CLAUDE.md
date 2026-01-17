# NainVert - Claude Code Context

A psychedelic streetwear e-commerce platform ("Le Nain Vert" / "The Green Dwarf") selling custom t-shirts and hoodies with an admin panel for order management.

## Tech Stack

- **Frontend:** Vue 3 (Composition API), Vite, Vue Router, Pinia
- **Styling:** Tailwind CSS 4, dark theme with neon green accents (#39FF14)
- **Backend:** Firebase (Firestore, Auth, Storage, Cloud Functions)
- **Payments:** Stripe (test mode)
- **Images:** Cloudinary for product image uploads

## Project Structure

```
src/
├── pages/           # Full-page components (Home, Designs, Admin, etc.)
├── components/      # Reusable components
│   ├── admin/       # Admin panel tabs (DesignsTab, OrdersTab, StockTab, etc.)
│   └── shop/        # Product display (DesignCard, SizeSelector)
├── composables/     # Reusable reactive logic (useDesigns, useOrders, useStock)
├── stores/          # Pinia stores (cart.js, admin.js)
├── services/        # External API integrations (stripe, cloudinary, email)
├── config/          # Firebase configuration
├── router/          # Vue Router setup with SEO meta tags
└── styles/          # Global CSS (main.css, legal-pages.css)
functions/           # Firebase Cloud Functions (Stripe webhooks, email)
documentation/       # Extensive feature documentation (21 files)
```

## Essential Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build to /dist
npm run preview      # Preview production build
npm run import-firebase     # Seed Firestore with initial data
npm run test-firebase       # Test Firestore connection
```

## Key Files

- `src/config/firebase.js` - Firebase initialization
- `src/router/index.js` - Route definitions with SEO meta
- `src/stores/cart.js` - Cart state management with localStorage
- `src/stores/admin.js` - Admin authentication state
- `firestore.rules` - Database security rules
- `.env` - Environment variables (not in git)

## Environment Variables

Required in `.env` (see `.env.example`):
- `VITE_FIREBASE_*` - Firebase configuration
- `VITE_CLOUDINARY_*` - Cloudinary credentials
- `VITE_STRIPE_PUBLIC_KEY` - Stripe publishable key
- `VITE_STRIPE_FUNCTION_URL` - Cloud Function endpoint

## Firestore Collections

| Collection | Purpose | Access |
|------------|---------|--------|
| `designs` | Product designs | Public read, admin write |
| `garments` | Clothing types (T-shirt, Hoodie) | Public read, admin write |
| `stock` | Inventory per design | Admin only |
| `orders` | Customer orders | Public create, admin read/write |
| `messages` | Contact submissions | Public create, admin read |
| `honeypot_logs` | Security: login attempts | Admin read |

## Admin Routes

- `/admin` - Honeypot (fake admin panel for security)
- `/rho` - Real admin panel (Firebase Auth protected)

## Language

Code, comments, and UI are in **French**.

---

## Additional Documentation

Check these files for specialized topics:

### Architecture & Patterns
- `.claude/docs/architectural_patterns.md` - Code patterns and conventions

### Existing Documentation (documentation/)
| File | Topic |
|------|-------|
| `QUICKSTART.md` | Getting started guide |
| `FIREBASE_SETUP.md` | Firebase project configuration |
| `STOCK_SYSTEM.md` | Stock management logic |
| `CHECKOUT_SYSTEM.md` | Checkout flow details |
| `SHIPPING_SYSTEM.md` | Shipping integration |
| `STRIPE_SENDGRID_SETUP.md` | Payment and email setup |
| `HONEYPOT_SETUP.md` | Security honeypot system |
| `CLOUDINARY_SETUP.md` | Image upload configuration |
| `DESIGN_GUIDE.md` | Visual branding guidelines |
| `TODO.md` / `TODO_BEFORE_LAUNCH.md` | Pending tasks |
| `NainVert_Architecture_Cahier_des_Charges.txt` | Full specifications (French) |
