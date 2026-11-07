-- ==============================================================================
-- SMARTQR RESTAURANT SAAS - MASTER SUPABASE FIX & SETUP SCRIPT
-- Execute this entire script once in Supabase SQL Editor:
-- Link: https://supabase.com/dashboard/project/jjlvgtnpwiooifiimfns/sql/new
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CRITICAL FIX: Remove foreign key constraints that block user & restaurant creation
-- Profiles must be allowed to create independent of Supabase Auth email limits
ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE IF EXISTS public.profiles ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Restaurants owner_id should not block restaurant creation if profile is syncing
ALTER TABLE IF EXISTS public.restaurants DROP CONSTRAINT IF EXISTS restaurants_owner_id_fkey;
ALTER TABLE IF EXISTS public.restaurants ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- 3. Ensure caption column exists in menu_items
ALTER TABLE IF EXISTS public.menu_items ADD COLUMN IF NOT EXISTS caption TEXT;

-- 4. Ensure restaurant_tables has UUID default
ALTER TABLE IF EXISTS public.restaurant_tables ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- 5. DISABLE ROW LEVEL SECURITY (RLS) FOR FULL WEB APP ACCESS
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscription_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.restaurants DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.menu_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.restaurant_tables DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.restaurant_template_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.customer_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.analytics_events DISABLE ROW LEVEL SECURITY;

-- 6. GRANT ALL PERMISSIONS TO ANON AND AUTHENTICATED
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 7. UPSERT OFFICIAL PLANS (Basic and Premium with matched UUIDs)
INSERT INTO public.subscription_plans (
  id, code, name, description, monthly_price, yearly_price, currency, yearly_discount_percent, is_active, max_categories, max_items, allow_food_images, allow_custom_colors, allow_custom_fonts, allow_multi_language, remove_saas_branding, allow_table_qr, allow_ordering, allow_upi_payment, allow_bulk_import, allow_review_booster, allowed_template_tiers, features
) VALUES 
(
  '7a683ce9-ca2e-41ca-99f3-ebf3b107f878',
  'basic',
  'Basic Plan',
  'Essential digital QR menu platform for cafes, dhabas, food stalls, and modern diners.',
  399,
  3590,
  'INR',
  25,
  true,
  15,
  100,
  true,
  true,
  true,
  true,
  false,
  false,
  false,
  false,
  false,
  false,
  ARRAY['basic', 'free'],
  '["Digital QR Menu with instant live cloud updates", "5 Classic & Contemporary responsive templates", "Permanent Restaurant QR code & Printable Standee", "High-resolution food photos & descriptions", "Dietary classification badges (Veg, Non-Veg, Jain, Vegan)", "Multi-language menu translation support", "Live category & dish availability toggles", "Core diner scan & visit analytics"]'::jsonb
),
(
  '2c3f42e1-88b9-4007-833f-e34ee1428e25',
  'premium',
  'Premium Luxury Plan',
  'The complete all-inclusive bespoke suite for high-growth cafes, multi-outlet restaurants, and fine-dining lounges.',
  999,
  8990,
  'INR',
  25,
  true,
  100,
  1000,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  ARRAY['basic', 'premium', 'premium_plus', 'free'],
  '["Everything in Basic Plan included", "Access to ALL 15 Luxury & Glassmorphism templates", "Instant QR Scan Opening Intro Animation (Royal Glow & Particles)", "Custom Branded QR with Center Restaurant Logo & Monogram", "Table-Specific QR Codes & Table Ordering Cart", "Instant UPI Payment Integration (GPay, PhonePe, Paytm)", "Excel & CSV Bulk Menu Import & Instant Export", "Google Maps 5-Star Review Booster Popups", "100% White-Label: Remove all SmartQR SaaS branding", "Real-Time Waiter Calling & Table Service Notifications", "Priority 24/7 VIP Phone & WhatsApp Support"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  monthly_price = EXCLUDED.monthly_price,
  yearly_price = EXCLUDED.yearly_price,
  currency = EXCLUDED.currency,
  yearly_discount_percent = EXCLUDED.yearly_discount_percent,
  is_active = EXCLUDED.is_active,
  max_categories = EXCLUDED.max_categories,
  max_items = EXCLUDED.max_items,
  allow_food_images = EXCLUDED.allow_food_images,
  allow_custom_colors = EXCLUDED.allow_custom_colors,
  allow_custom_fonts = EXCLUDED.allow_custom_fonts,
  allow_multi_language = EXCLUDED.allow_multi_language,
  remove_saas_branding = EXCLUDED.remove_saas_branding,
  allow_table_qr = EXCLUDED.allow_table_qr,
  allow_ordering = EXCLUDED.allow_ordering,
  allow_upi_payment = EXCLUDED.allow_upi_payment,
  allow_bulk_import = EXCLUDED.allow_bulk_import,
  allow_review_booster = EXCLUDED.allow_review_booster,
  allowed_template_tiers = EXCLUDED.allowed_template_tiers,
  features = EXCLUDED.features;
