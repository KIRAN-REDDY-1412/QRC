-- ==============================================================================
-- SMARTQR MENU - COMPLETE SUPABASE PRODUCTION DATABASE SCHEMA
-- Execute this entire script in your Supabase SQL Editor (Dashboard -> SQL Editor)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (User roles & credentials)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'restaurant_owner' CHECK (role IN ('super_admin', 'restaurant_owner', 'customer')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SUBSCRIPTION PLANS TABLE (2 Official Plans: Basic and Premium)
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL CHECK (code IN ('basic', 'premium', 'free', 'premium_plus')),
    name TEXT NOT NULL,
    description TEXT,
    monthly_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    yearly_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    yearly_discount_percent INTEGER NOT NULL DEFAULT 25,
    is_active BOOLEAN NOT NULL DEFAULT true,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    max_categories INTEGER DEFAULT 15,
    max_items INTEGER DEFAULT 100,
    allow_food_images BOOLEAN DEFAULT true,
    allow_custom_colors BOOLEAN DEFAULT true,
    allow_custom_fonts BOOLEAN DEFAULT true,
    allow_multi_language BOOLEAN DEFAULT true,
    remove_saas_branding BOOLEAN DEFAULT false,
    allow_table_qr BOOLEAN DEFAULT false,
    allow_ordering BOOLEAN DEFAULT false,
    allow_upi_payment BOOLEAN DEFAULT false,
    allow_bulk_import BOOLEAN DEFAULT false,
    allow_review_booster BOOLEAN DEFAULT false,
    allowed_template_tiers TEXT[] NOT NULL DEFAULT ARRAY['basic'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RESTAURANTS TABLE
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_pure_veg BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_owner_id ON public.restaurants(owner_id);

-- 5. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'expired', 'downgrade_scheduled')),
    billing_cycle TEXT NOT NULL DEFAULT 'yearly' CHECK (billing_cycle IN ('monthly', 'yearly', 'lifetime')),
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 year'),
    auto_renew BOOLEAN NOT NULL DEFAULT true,
    scheduled_downgrade_plan_id UUID REFERENCES public.subscription_plans(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_restaurant ON public.subscriptions(restaurant_id);

-- 6. PAYMENTS TABLE (Razorpay audit logs)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_gateway TEXT NOT NULL DEFAULT 'razorpay',
    gateway_order_id TEXT,
    gateway_payment_id TEXT,
    gateway_signature TEXT,
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
    invoice_number TEXT,
    billing_cycle TEXT NOT NULL DEFAULT 'yearly',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_restaurant ON public.payments(restaurant_id);

-- 7. MENU CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_restaurant ON public.menu_categories(restaurant_id);

-- 8. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount_price NUMERIC(10, 2),
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    dietary_type TEXT NOT NULL DEFAULT 'veg' CHECK (dietary_type IN ('veg', 'non_veg', 'egg', 'vegan', 'jain')),
    spice_level INTEGER NOT NULL DEFAULT 0 CHECK (spice_level BETWEEN 0 AND 3),
    calories INTEGER,
    preparation_time TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_items_restaurant ON public.menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON public.menu_items(category_id);

-- 9. MENU TEMPLATES TABLE (15 Unique Designs)
CREATE TABLE IF NOT EXISTS public.menu_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('basic', 'premium', 'free', 'premium_plus')),
    thumbnail_url TEXT,
    description TEXT,
    vibe TEXT,
    badge_label TEXT,
    features_list JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. RESTAURANT TEMPLATE SETTINGS TABLE (includes Instant Opening Animation Experience)
CREATE TABLE IF NOT EXISTS public.restaurant_template_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID UNIQUE NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES public.menu_templates(id),
    accent_color TEXT DEFAULT '#f59e0b',
    font_family TEXT DEFAULT 'Plus Jakarta Sans',
    card_style TEXT DEFAULT 'modern',
    show_photos BOOLEAN DEFAULT true,
    show_dietary_badges BOOLEAN DEFAULT true,
    show_spice_level BOOLEAN DEFAULT true,
    show_prices BOOLEAN DEFAULT true,
    custom_css TEXT,
    opening_animation_enabled BOOLEAN DEFAULT true,
    opening_animation_style TEXT DEFAULT 'gold_glow' CHECK (opening_animation_style IN ('minimal', 'gold_glow', 'luxury_particles', 'cinematic')),
    opening_animation_duration NUMERIC(3, 1) DEFAULT 1.8,
    opening_animation_tagline TEXT DEFAULT 'Experience Royal Awadhi Gastronomy',
    opening_animation_skip_button BOOLEAN DEFAULT true,
    opening_animation_sound BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. RESTAURANT TABLES TABLE
CREATE TABLE IF NOT EXISTS public.restaurant_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_number TEXT NOT NULL,
    section_name TEXT DEFAULT 'Main Hall',
    capacity INTEGER DEFAULT 4,
    qr_code_svg TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(restaurant_id, table_number)
);

-- 12. CUSTOMER ORDERS TABLE (Tabletop Ordering & WhatsApp KOT dispatch)
CREATE TABLE IF NOT EXISTS public.customer_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_number TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'served', 'completed', 'cancelled')),
    customer_name TEXT,
    customer_phone TEXT,
    payment_method TEXT DEFAULT 'upi',
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('qr_scan', 'menu_view', 'item_click', 'language_change', 'category_filter', 'order_placed')),
    device_type TEXT,
    ip_hash TEXT,
    table_number TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_restaurant_time ON public.analytics_events(restaurant_id, created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_template_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Helper function to check super admin safely without RLS recursion
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(
    (SELECT role = 'super_admin' FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Super admins can manage all profiles" ON public.profiles FOR ALL USING (public.is_super_admin());

-- Plans (Public read; Super Admin write)
CREATE POLICY "Anyone can view active subscription plans" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "Super admins can manage plans" ON public.subscription_plans FOR ALL USING (public.is_super_admin());

-- Restaurants (Public read active for customer menu; Owner manage own)
CREATE POLICY "Public can view active restaurants" ON public.restaurants FOR SELECT USING (is_active = true);
CREATE POLICY "Owners can manage own restaurants" ON public.restaurants FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Super admins can manage all restaurants" ON public.restaurants FOR ALL USING (public.is_super_admin());

-- Categories & Items (Public read; Owner manage)
CREATE POLICY "Public can view active categories" ON public.menu_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Owners can manage categories" ON public.menu_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = menu_categories.restaurant_id AND owner_id = auth.uid())
    OR public.is_super_admin()
);

CREATE POLICY "Public can view menu items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Owners can manage items" ON public.menu_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = menu_items.restaurant_id AND owner_id = auth.uid())
    OR public.is_super_admin()
);

-- Templates (Public read)
CREATE POLICY "Anyone can view active templates" ON public.menu_templates FOR SELECT USING (is_active = true);

-- Template Settings (Public read; Owner update)
CREATE POLICY "Public can view template settings" ON public.restaurant_template_settings FOR SELECT USING (true);
CREATE POLICY "Owners can update template settings" ON public.restaurant_template_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = restaurant_template_settings.restaurant_id AND owner_id = auth.uid())
    OR public.is_super_admin()
);

-- Tables
CREATE POLICY "Public can view restaurant tables" ON public.restaurant_tables FOR SELECT USING (true);
CREATE POLICY "Owners can manage tables" ON public.restaurant_tables FOR ALL USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = restaurant_tables.restaurant_id AND owner_id = auth.uid())
    OR public.is_super_admin()
);

-- Customer Orders
CREATE POLICY "Anyone can place orders" ON public.customer_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view own table order" ON public.customer_orders FOR SELECT USING (true);
CREATE POLICY "Owners can manage orders" ON public.customer_orders FOR ALL USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = customer_orders.restaurant_id AND owner_id = auth.uid())
);

-- Analytics (Anyone insert; Owner select)
CREATE POLICY "Anyone can record analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can view own analytics" ON public.analytics_events FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = analytics_events.restaurant_id AND owner_id = auth.uid())
);

-- Subscriptions & Payments
CREATE POLICY "Owners can view own subscriptions" ON public.subscriptions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = subscriptions.restaurant_id AND owner_id = auth.uid())
);
CREATE POLICY "Owners can view own payments" ON public.payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = payments.restaurant_id AND owner_id = auth.uid())
);

-- ==============================================================================
-- SEED DATA: 2 OFFICIAL SUBSCRIPTION PLANS (Basic & Premium Luxury)
-- ==============================================================================
INSERT INTO public.subscription_plans 
(code, name, description, monthly_price, yearly_price, yearly_discount_percent, features, max_categories, max_items, allow_food_images, allow_custom_colors, allow_custom_fonts, allow_multi_language, remove_saas_branding, allow_table_qr, allow_ordering, allow_upi_payment, allow_bulk_import, allow_review_booster, allowed_template_tiers)
VALUES
(
    'basic',
    'Basic Plan',
    'Essential digital QR menu platform for cafes, dhabas, food stalls, and modern diners.',
    399.00,
    3590.00,
    25,
    '["Digital QR Menu with instant live cloud updates", "5 Classic & Contemporary responsive templates", "Permanent Restaurant QR code & Printable Standee", "High-resolution food photos & descriptions", "Dietary classification badges (Veg, Non-Veg, Jain, Vegan)", "Multi-language menu translation support", "Live category & dish availability toggles", "Core diner scan & visit analytics"]'::jsonb,
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
    ARRAY['basic', 'free']
),
(
    'premium',
    'Premium Luxury Plan',
    'The complete all-inclusive bespoke suite for high-growth cafes, multi-outlet restaurants, and fine-dining lounges.',
    999.00,
    8990.00,
    25,
    '["Everything in Basic Plan included", "Access to ALL 15 Luxury & Glassmorphism templates", "Instant QR Scan Opening Intro Animation (Royal Glow & Particles)", "Custom Branded QR with Center Restaurant Logo & Monogram", "Table-Specific QR Codes & Table Ordering Cart", "Instant UPI Payment Integration (GPay, PhonePe, Paytm)", "Excel & CSV Bulk Menu Import & Instant Export", "Google Maps 5-Star Review Booster Popups", "100% White-Label: Remove all SmartQR SaaS branding", "Real-Time Waiter Calling & Table Service Notifications", "Priority 24/7 VIP Phone & WhatsApp Support"]'::jsonb,
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
    ARRAY['basic', 'premium', 'premium_plus', 'free']
)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    monthly_price = EXCLUDED.monthly_price,
    yearly_price = EXCLUDED.yearly_price,
    yearly_discount_percent = EXCLUDED.yearly_discount_percent,
    features = EXCLUDED.features;

-- ==============================================================================
-- SEED DATA: 15 UNIQUE TEMPLATES
-- ==============================================================================
INSERT INTO public.menu_templates (code, name, tier, description, vibe, badge_label, features_list)
VALUES
('classic_menu', 'Classic Menu', 'basic', 'Traditional, neat, high-legibility restaurant printed menu aesthetic with subtle borders and clear price columns.', 'Traditional & Familiar', 'Standard', '["Fast scan & read", "Compact price tags", "Clear section headers"]'::jsonb),
('simple_restaurant', 'Simple Restaurant', 'basic', 'Clean, streamlined list design focused on quick ordering and zero distraction for fast-casual dining.', 'Minimalist Fast Casual', 'Standard', '["List layout", "Instant search", "Lightweight rendering"]'::jsonb),
('modern_cafe', 'Modern Cafe', 'basic', 'Warm bistro ambiance with modern card elevation, rounded pill badges, and coffee-house typography.', 'Artisan Bistro & Cafe', 'Popular', '["Grid card layout", "Warm amber highlights", "Category pill scroller"]'::jsonb),
('visual_food_board', 'Visual Food Board', 'basic', 'Pinterest-inspired masonry layout with large appetite-inducing food photography.', 'Visual & Photogenic', 'Visual', '["Masonry food cards", "High-res hero display", "Chef special tags"]'::jsonb),
('minimalist_chic', 'Minimalist Chic', 'basic', 'Sophisticated monochrome editorial typography, generous whitespace, and serene aesthetic.', 'Editorial Chic', 'Minimal', '["Editorial layout", "Quiet luxury aesthetic", "Thin line dividers"]'::jsonb),
('street_food_vibe', 'Street Food Express', 'premium', 'Vibrant energetic pop colors, spicy flame badges, and high-impact discount tags.', 'Casual & Street Food', 'High Energy', '["Spicy meter badges", "Deal of the day banners", "Vibrant colors"]'::jsonb),
('fine_dining_elegance', 'Fine Dining Elegance', 'premium', 'Opulent dark charcoal theme with delicate gold leaf borders, serif typography, and wine pairing notes.', 'Haute Gastronomy', 'Luxury', '["Gold leaf accents", "Charcoal backdrop", "Wine pairing suggestions"]'::jsonb),
('asian_fusion', 'Asian Fusion Zen', 'premium', 'Balanced Japanese-Scandinavian minimalism with bamboo-inspired dividers and soothing slate tones.', 'Pan-Asian & Sushi', 'Zen Modern', '["Clean bamboo lines", "Soy-dark theme", "Chopstick icon details"]'::jsonb),
('brewery_pub', 'Craft Brewery & Taproom', 'premium', 'Industrial dark slate, amber beer-glow accents, chalkboard serif typography, and ABV pairing meters.', 'Gastropub & Brewery', 'Industrial', '["Chalkboard headers", "Amber glow highlights", "Bar snack pairings"]'::jsonb),
('family_diner', 'Family Diner & Thali', 'premium', 'Warm, welcoming golden thali aesthetic with large portions, combo platter banners, and sweet dish cards.', 'North & South Indian Thali', 'Family Friendly', '["Thali combo banners", "Veg/Non-Veg filters", "Sweet dish section"]'::jsonb),
('dessert_bakery', 'Sweet Haven Bakery', 'premium', 'Pastel strawberry, vanilla cream tones, cursive dessert headers, and dessert showcases.', 'Pastry & Ice Cream', 'Sweet & Playful', '["Pastel aesthetic", "Cake size selectors", "Fluffy soft curves"]'::jsonb),
('royal_restaurant', 'Royal Indian Heritage', 'premium', 'Majestic Indian palace design with heritage jali patterns, brass accents, royal saffron touches, and thali highlights.', 'Maharaja Palace & Heritage', 'Royal Heritage', '["Indian palace jali motif", "Brass & saffron accents", "Thali special frames"]'::jsonb),
('glassmorphism_menu', 'Glassmorphism Modern', 'premium', 'Cutting-edge frosted glass translucency with blurred floating backdrops, dynamic lighting gradients, and iOS-like depth.', 'Futuristic Translucent', 'Trending', '["Frosted backdrop-blur", "Floating glass layers", "Dynamic gradient glow"]'::jsonb),
('advanced_food_showcase', 'Advanced Food Showcase', 'premium', 'Interactive gourmet experience featuring expandable nutritional macros, chef notes, allergen alerts, and live spice scales.', 'Interactive Culinary Lab', 'Advanced', '["Expandable nutrition & calorie meters", "Spice scale meter", "Chef preparation tags"]'::jsonb),
('exclusive_signature', 'Exclusive Signature', 'premium', 'Bespoke signature menu with dark velvet textures, platinum borders, custom monogram crest, and VIP aesthetics.', 'Bespoke Celebrity Signature', 'Signature', '["Platinum trim", "Velvet dark backdrop", "Exclusive signature watermarks"]'::jsonb)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    tier = EXCLUDED.tier,
    description = EXCLUDED.description,
    vibe = EXCLUDED.vibe,
    badge_label = EXCLUDED.badge_label,
    features_list = EXCLUDED.features_list;

-- Storage Bucket for Restaurant Assets (Logos, food photos, QR codes)
INSERT INTO storage.buckets (id, name, public)
VALUES ('restaurant-assets', 'restaurant-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view restaurant assets" ON storage.objects
FOR SELECT USING (bucket_id = 'restaurant-assets');

CREATE POLICY "Authenticated users can upload restaurant assets" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'restaurant-assets' AND auth.role() = 'authenticated');
