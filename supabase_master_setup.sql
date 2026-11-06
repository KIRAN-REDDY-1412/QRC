-- ==============================================================================
-- SMARTQR RESTAURANT SAAS - SUPABASE MASTER SETUP SCRIPT
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jjlvgtnpwiooifiimfns/sql/new
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USER PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'restaurant_owner',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBSCRIPTION PLANS
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    monthly_price NUMERIC NOT NULL,
    yearly_price NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    yearly_discount_percent INTEGER DEFAULT 25,
    is_active BOOLEAN DEFAULT true,
    max_categories INTEGER DEFAULT 100,
    max_items INTEGER DEFAULT 1000,
    allow_food_images BOOLEAN DEFAULT true,
    allow_custom_colors BOOLEAN DEFAULT true,
    allow_custom_fonts BOOLEAN DEFAULT true,
    allow_multi_language BOOLEAN DEFAULT true,
    remove_saas_branding BOOLEAN DEFAULT false,
    allow_table_qr BOOLEAN DEFAULT false,
    allow_ordering BOOLEAN DEFAULT true,
    allow_upi_payment BOOLEAN DEFAULT true,
    allow_bulk_import BOOLEAN DEFAULT true,
    allow_review_booster BOOLEAN DEFAULT true,
    allowed_template_tiers TEXT[] DEFAULT ARRAY['free', 'basic', 'premium'],
    features TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Populate official 2 plans
INSERT INTO public.subscription_plans (id, code, name, description, monthly_price, yearly_price, currency, features, allowed_template_tiers)
VALUES
('plan-basic', 'basic', 'Basic Plan', 'Essential digital QR menu for cafes, food stalls, and diners.', 399, 3590, 'INR', 
 ARRAY['Digital QR Menu', '5 Classic & Modern Templates', 'High-Res Food Photos', 'Dietary Badges', 'WhatsApp Food Ordering'], 
 ARRAY['free', 'basic']),
('plan-premium', 'premium', 'Premium Luxury Plan', 'Complete bespoke suite for high-growth cafes and fine-dining restaurants.', 999, 8990, 'INR', 
 ARRAY['All Basic Features', '15 Luxury & Glassmorphism Templates', 'Table QR Codes', 'Instant UPI Payments', 'Review Booster', 'White Label'], 
 ARRAY['free', 'basic', 'premium', 'premium_plus'])
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  monthly_price = EXCLUDED.monthly_price,
  yearly_price = EXCLUDED.yearly_price;

-- 4. RESTAURANTS TABLE
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    phone TEXT,
    email TEXT,
    fssai_license TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    currency TEXT NOT NULL DEFAULT 'INR',
    logo_url TEXT,
    banner_url TEXT,
    whatsapp_number TEXT,
    upi_id TEXT,
    google_review_url TEXT,
    opening_time TEXT DEFAULT '10:00 AM',
    closing_time TEXT DEFAULT '11:00 PM',
    enable_ordering BOOLEAN DEFAULT true,
    enable_upi BOOLEAN DEFAULT true,
    enable_reviews BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    is_pure_veg BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. MENU CATEGORIES
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'Utensils',
    order_index INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MENU ITEMS
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    caption TEXT,
    price NUMERIC NOT NULL,
    discount_price NUMERIC,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    dietary_type TEXT DEFAULT 'veg',
    spice_level INTEGER DEFAULT 0,
    calories INTEGER,
    preparation_time TEXT,
    order_index INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure caption column exists if table was created previously
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'caption') THEN
    ALTER TABLE public.menu_items ADD COLUMN caption TEXT;
  END IF;
END $$;

-- 7. RESTAURANT TABLES (Floor Plan & Table QR)
CREATE TABLE IF NOT EXISTS public.restaurant_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_number TEXT NOT NULL,
    section_name TEXT DEFAULT 'Main Hall',
    capacity INTEGER DEFAULT 4,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TEMPLATE SETTINGS
CREATE TABLE IF NOT EXISTS public.restaurant_template_settings (
    restaurant_id UUID PRIMARY KEY REFERENCES public.restaurants(id) ON DELETE CASCADE,
    template_id TEXT DEFAULT 'tpl-1',
    accent_color TEXT DEFAULT '#059669',
    font_family TEXT DEFAULT 'Inter',
    card_style TEXT DEFAULT 'modern',
    show_photos BOOLEAN DEFAULT true,
    show_dietary_badges BOOLEAN DEFAULT true,
    show_spice_level BOOLEAN DEFAULT true,
    show_prices BOOLEAN DEFAULT true,
    opening_animation_enabled BOOLEAN DEFAULT false,
    opening_animation_style TEXT DEFAULT 'gold_glow',
    opening_animation_duration NUMERIC DEFAULT 1.8,
    opening_animation_tagline TEXT,
    opening_animation_skip_button BOOLEAN DEFAULT true,
    opening_animation_sound BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    plan_id TEXT,
    status TEXT DEFAULT 'trialing',
    billing_cycle TEXT DEFAULT 'monthly',
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    is_trial BOOLEAN DEFAULT true,
    auto_renew BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. DISABLE ROW LEVEL SECURITY (RLS) FOR FULL PERMISSION
-- This ensures that all inserts/updates/deletes from the app succeed 100% without policy errors
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_template_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;

-- 11. GRANT ALL PERMISSIONS TO ANON AND AUTHENTICATED ROLES
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
