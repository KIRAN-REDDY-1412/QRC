# SmartQR Menu – Complete QR Menu SaaS for Restaurants in India

A production-oriented, responsive QR Menu SaaS platform designed specifically for restaurants, cafes, dhabas, bistros, and luxury dining establishments across India.

---

## 🌟 Key Highlights & Features

### 1. Three Dedicated User Roles
1. **Super Admin**: Platform control center to manage all restaurants, configure subscription plan prices in Indian Rupees (₹), toggle feature flags, assign templates to tiers, and monitor platform metrics.
2. **Restaurant Owner**: Full dashboard to manage restaurant profile, categories, dishes, photos, dietary tags, live design studio, template marketplace, table QR generator, and billing.
3. **Customer (Diner)**: Zero-friction contactless mobile menu opened via permanent QR URL `/menu/:restaurantSlug`. No app install or account required.

### 2. 15 Distinct Customer-Facing Menu Templates
- **3 Free Forever Templates**:
  - `Classic Menu`: Traditional printed restaurant board with dotted price leaders.
  - `Simple Restaurant`: Clean minimalist list layout for fast-casual ordering.
  - `Basic Modern`: Balanced card grid with pill navigation.
- **6 Premium Templates**:
  - `Modern Food Gallery`: Large appetite-inducing photography cards and horizontal swipe.
  - `Elegant Restaurant`: Warm editorial typography with Playfair Display serifs.
  - `Minimal White`: High-contrast Scandinavian minimalism with micro-typography.
  - `Dark Food Menu`: Deep charcoal and slate dark mode with neon accents.
  - `Colorful Cafe`: Playful pastels and rounded cards for brunch & bakeries.
  - `Premium Dining`: European artisanal bistro styling with chef special crests.
- **6 Premium Plus Luxury Templates**:
  - `Luxury Black Gold`: Obsidian velvet backdrop, metallic gold foil trim, and Cinzel roman typography.
  - `Fine Dining`: Haute cuisine presentation with sommelier wine pairing notes.
  - `Royal Indian Heritage`: Maharaja palace aesthetic with jali patterns, brass, and saffron tones.
  - `Glassmorphism Menu`: Frosted glass translucency with backdrop blur and dynamic lighting.
  - `Advanced Food Showcase`: Interactive culinary lab with expandable calorie and nutrition macros.
  - `Exclusive Signature`: Bespoke celebrity signature menu with platinum borders and VIP private dining aesthetics.

### 3. Dynamic Subscription Pricing in INR (₹)
- **Zero hardcoded pricing**: Super Admin can update monthly & yearly prices, yearly discount %, and feature access in real time.
- **Free Plan**: Free forever with permanent QR code, 3 classic templates, and basic items.
- **Premium Plan**: Unlocks food photography, 6 premium templates, custom colors/fonts, multi-language, and removes SaaS branding.
- **Premium Plus Plan**: Unlocks all 15 luxury templates, table-specific QR codes, and priority support.
- **Graceful Downgrade Policy**: Downgrades keep paid access until billing period ends and **never delete restaurant menu data, dishes, or QR codes**.

### 4. Indian Regulatory & FSSAI Standards
- Authentic FSSAI dietary badges:
  - 🟢 **Vegetarian**: Green dot in square
  - 🔴 **Non-Vegetarian**: Red triangle in square
  - 🟡 **Egg**: Yellow circle in square
  - **Jain** & **Vegan** tags
- Multi-language menu support for English, Hindi (हिन्दी), Marathi (मराठी), Gujarati (ગુજરાતી), Bengali (বাংলা), Tamil (தமிழ்).

### 5. Permanent QR Code Studio
- Points to `/menu/:restaurantSlug` (or `?table=1` for table-specific QRs).
- High-res PNG & vector SVG downloads.
- Printable tabletop standee / tent card generator with instant print styling.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase credentials and Razorpay key:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_RAZORPAY_KEY_ID=rzp_test_YourKeyHere
```
*(Note: If you run without keys, the app automatically runs in local offline sandbox mode with pre-seeded demo data!)*

### 3. Run Supabase Database Migration
In your Supabase Dashboard -> **SQL Editor**, run the SQL script located at:
`supabase/migrations/00001_initial_schema.sql`

This creates:
- `profiles`, `restaurants`, `subscription_plans`, `subscriptions`, `payments`
- `menu_categories`, `menu_items`, `menu_templates`, `restaurant_template_settings`
- `restaurant_tables`, `analytics_events`
- Row Level Security (RLS) policies and seed data for all 15 templates and default pricing!

### 4. Start Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

---

## 🧭 Routes Map
- `/`: Public high-converting SaaS Landing Page with dynamic pricing & interactive phone preview
- `/menu/:restaurantSlug`: Customer mobile-first QR menu (e.g. `/menu/saffron-darbar`)
- `/dashboard`: Restaurant Owner Dashboard (Overview, Profile, Menu, Design Studio, Templates, QR Studio, Tables, Analytics, Billing, Settings)
- `/admin`: Super Admin Command Center (Pricing Matrix, Template Entitlements, All Restaurants)
