# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
React 18+, Vite, TypeScript, Tailwind CSS, Supabase (Auth, Postgres, Storage, Edge Functions), npm qrcode, React Router v6, Lucide React, Razorpay checkout integration.

## Users
1. **Restaurant Owners & Managers in India**: From local cafes, street-food bistros, and cloud kitchens to fine-dining establishments who need to digitize their menus, customize their brand presentation, download print-ready QR codes, and upgrade plans to grow.
2. **Dining Customers (Guests)**: Diners who scan physical or digital table/counter QR codes on their mobile smartphones (iOS & Android) to instantly view categories, food photos, prices, dietary tags (Veg/Non-Veg/Spicy), and switch languages without logging in or downloading an app.
3. **Super Admin**: Platform operator managing restaurant accounts, subscription plans (Free, Premium, Premium Plus) with dynamic INR pricing, template access, analytics, and platform-wide settings.

## Product Purpose
Deliver an end-to-end, high-performance, mobile-first QR menu SaaS tailored for Indian restaurants, combining self-serve digital menu management, 15+ visually distinctive interactive templates, instant QR code generation, multi-language support, and Razorpay-powered subscription tiers.

## Positioning
Unlike generic, plain PDF-based QR viewers or rigid international SaaS tools, SmartQR Menu offers 15 genuinely distinct visual menu aesthetics (from street cafe to royal fine dining), full Indian FSSAI dietary badges (Green dot veg / Red triangle non-veg / Halal / Jain options), dual-language Indian regional support, and Super Admin configurable INR pricing.

## Operating Context
- Fast-paced restaurant dining rooms, counters, and table tents where guests scan QR codes on various mobile devices (low bandwidth mobile data, diverse screen sizes).
- Restaurant back-office or manager smartphones/laptops for updating daily specials, toggling dish availability in seconds, and editing prices.
- Indian payment ecosystem: UPI, Cards, NetBanking via Razorpay.

## Capabilities and Constraints
- **Public Customer Menu**: Dynamic `/menu/:restaurantSlug` route with sub-second loading, sticky category navigation, instant search, Veg/Non-Veg filter, allergen/spice indicators, multi-language switcher, and template renderer.
- **15 Distinct Templates**: 3 Free (Classic, Simple Restaurant, Basic Modern), 6 Premium (Modern Food Gallery, Elegant Restaurant, Minimal White, Dark Food Menu, Colorful Cafe, Premium Dining), 6 Premium Plus (Luxury Black Gold, Fine Dining, Royal Restaurant, Glassmorphism Menu, Advanced Food Showcase, Exclusive Signature).
- **Template Access Control & Enforcment**: Frontend badge/locking + upgrade dialog; backend schema & RLS validation preventing unentitled template activation.
- **Restaurant Management**: Menu items, categories, reordering, food photos upload (Supabase Storage), availability toggle, featured tags.
- **QR Code Studio**: Vector SVG and raster PNG downloads, print-ready cards, customizable center logo, table-specific QR codes for Premium Plus.
- **Subscription & Billing**: Super Admin dynamic pricing in INR (₹), Free forever, Premium, Premium Plus with monthly/yearly billing cycles, Razorpay sandbox integration, graceful downgrade preservation (no data loss, existing links preserved).
- **Multi-Language**: Owner translation input and diner language switching.
- **Analytics**: QR scan counting, popular category/item engagement.

## Brand Commitments
- Name: **SmartQR Menu**
- Currency: Indian Rupee (₹, INR)
- Indian dietary visual standards (Green Veg dot, Red Non-Veg triangle)
- Modern, clean, trustworthy SaaS branding with emerald, amber, and slate accents.

## Evidence on Hand
- Detailed prompt specification outlining all 20 architectural, functional, and design phases.
- Active Supabase project credentials ready to configure in `.env`.

## Product Principles
1. **Diners First (Zero Friction)**: Diners scan and see the menu in under a second; no app install, no account creation, no laggy popups.
2. **Distinct Aesthetic Authority**: Templates are not color swaps; each template is an intentional, handcrafted layout with unique card geometry, typography, and category navigation.
3. **Fail-Safe Menu Availability**: Permanent QR URLs never break even if plans, templates, or items change. Downgrades never delete restaurant menu data.
4. **Configurable Economics**: Zero hardcoded subscription pricing; the platform owner has complete control over Indian market pricing, feature entitlements, and discounts.

## Accessibility & Inclusion
- WCAG AA contrast ratio compliance across light and dark templates.
- Mobile touch targets >= 44x44px for category tabs and filters.
- Clear non-color-dependent veg/non-veg symbols and dietary tags for dietary requirements.
- Screen-reader friendly semantic markup and multi-language support.
