-- ==============================================================================
-- SMARTQR MENU - SUPABASE PRODUCTION DATABASE SCHEMA & INITIAL MIGRATION
-- Tailored for Restaurants in India
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Stores user roles: super_admin, restaurant_owner, customer)
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

-- 2. SUBSCRIPTION PLANS TABLE (Super Admin Configurable Pricing in INR)
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL CHECK (code IN ('free', 'premium', 'premium_plus')),
    name TEXT NOT NULL,
    description TEXT,
    monthly_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    yearly_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    yearly_discount_percent INTEGER NOT NULL DEFAULT 20,
    is_active BOOLEAN NOT NULL DEFAULT true,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    max_categories INTEGER DEFAULT 5,
    max_items INTEGER DEFAULT 25,
    allow_food_images BOOLEAN DEFAULT false,
    allow_custom_colors BOOLEAN DEFAULT false,
    allow_custom_fonts BOOLEAN DEFAULT false,
    allow_multi_language BOOLEAN DEFAULT false,
    remove_saas_branding BOOLEAN DEFAULT false,
    allow_table_qr BOOLEAN DEFAULT false,
    allowed_template_tiers TEXT[] NOT NULL DEFAULT ARRAY['free'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RESTAURANTS TABLE
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
    opening_time TEXT DEFAULT '10:00 AM',
    closing_time TEXT DEFAULT '11:00 PM',
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_pure_veg BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on restaurant slug for instant customer menu lookup
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_owner_id ON public.restaurants(owner_id);

-- 4. SUBSCRIPTIONS TABLE (Tracks current restaurant subscription)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'past_due', 'canceled', 'expired', 'downgrade_scheduled')),
    billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly', 'lifetime')),
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_period_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 month'),
    auto_renew BOOLEAN NOT NULL DEFAULT true,
    scheduled_downgrade_plan_id UUID REFERENCES public.subscription_plans(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_restaurant ON public.subscriptions(restaurant_id);

-- 5. PAYMENTS TABLE (Razorpay audit logs)
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
    billing_cycle TEXT NOT NULL DEFAULT 'monthly',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_restaurant ON public.payments(restaurant_id);

-- 6. MENU CATEGORIES TABLE
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

-- 7. MENU ITEMS TABLE
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

-- 8. MENU TEMPLATES TABLE (15 Unique Templates)
CREATE TABLE IF NOT EXISTS public.menu_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    tier TEXT NOT NULL CHECK (tier IN ('free', 'premium', 'premium_plus')),
    thumbnail_url TEXT,
    description TEXT,
    vibe TEXT,
    badge_label TEXT,
    features_list JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. RESTAURANT TEMPLATE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.restaurant_template_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID UNIQUE NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES public.menu_templates(id),
    accent_color TEXT DEFAULT '#10b981',
    font_family TEXT DEFAULT 'Plus Jakarta Sans',
    card_style TEXT DEFAULT 'modern',
    show_photos BOOLEAN DEFAULT true,
    show_dietary_badges BOOLEAN DEFAULT true,
    show_spice_level BOOLEAN DEFAULT true,
    show_prices BOOLEAN DEFAULT true,
    custom_css TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. RESTAURANT LANGUAGES & TRANSLATIONS
CREATE TABLE IF NOT EXISTS public.restaurant_languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    language_code TEXT NOT NULL, -- 'en', 'hi', 'mr', 'gu', 'ta', 'bn'
    language_name TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    UNIQUE(restaurant_id, language_code)
);

CREATE TABLE IF NOT EXISTS public.menu_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('restaurant', 'category', 'item')),
    entity_id UUID NOT NULL,
    language_code TEXT NOT NULL,
    translated_name TEXT,
    translated_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(entity_type, entity_id, language_code)
);

-- 11. RESTAURANT TABLES (Table-specific QR codes for Premium Plus)
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

-- 12. ANALYTICS EVENTS (QR scans & item views)
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL CHECK (event_type IN ('qr_scan', 'menu_view', 'item_click', 'language_change', 'category_filter')),
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
ALTER TABLE public.restaurant_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view & edit their own profile; Super Admins can view all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Super admins can view all profiles" ON public.profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Subscription Plans: Public readable so owners & landing page can see prices; Super Admin write
CREATE POLICY "Anyone can view active subscription plans" ON public.subscription_plans FOR SELECT USING (true);
CREATE POLICY "Super admins can manage plans" ON public.subscription_plans FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Restaurants: Public can view active restaurants (for customer menu); Owners can manage own
CREATE POLICY "Public can view active restaurants" ON public.restaurants FOR SELECT USING (is_active = true);
CREATE POLICY "Owners can manage own restaurants" ON public.restaurants FOR ALL USING (owner_id = auth.uid());
CREATE POLICY "Super admins can manage all restaurants" ON public.restaurants FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Menu Categories & Items: Public read for published active menus; Owners manage own
CREATE POLICY "Public can view active categories" ON public.menu_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Owners can manage categories" ON public.menu_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = menu_categories.restaurant_id AND owner_id = auth.uid())
);

CREATE POLICY "Public can view menu items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Owners can manage items" ON public.menu_items FOR ALL USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = menu_items.restaurant_id AND owner_id = auth.uid())
);

-- Templates: Public read; Super Admin manage
CREATE POLICY "Anyone can view active templates" ON public.menu_templates FOR SELECT USING (is_active = true);
CREATE POLICY "Super admin can manage templates" ON public.menu_templates FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- Restaurant Template Settings: Public can read for rendering; Owner can update
CREATE POLICY "Public can view template settings" ON public.restaurant_template_settings FOR SELECT USING (true);
CREATE POLICY "Owners can update template settings" ON public.restaurant_template_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = restaurant_template_settings.restaurant_id AND owner_id = auth.uid())
);

-- Analytics: Anyone can insert qr_scan events; Owner can view own analytics
CREATE POLICY "Anyone can record analytics" ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can view own analytics" ON public.analytics_events FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = analytics_events.restaurant_id AND owner_id = auth.uid())
);

-- Subscriptions & Payments: Owners view own; Super Admin manage all
CREATE POLICY "Owners can view own subscriptions" ON public.subscriptions FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = subscriptions.restaurant_id AND owner_id = auth.uid())
);
CREATE POLICY "Super admins can manage all subscriptions" ON public.subscriptions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
);

CREATE POLICY "Owners can view own payments" ON public.payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = payments.restaurant_id AND owner_id = auth.uid())
);

-- ==============================================================================
-- SEED DATA: SUBSCRIPTION PLANS (Prices in INR ₹ - Super Admin Configurable)
-- ==============================================================================
INSERT INTO public.subscription_plans 
(code, name, description, monthly_price, yearly_price, yearly_discount_percent, features, max_categories, max_items, allow_food_images, allow_custom_colors, allow_custom_fonts, allow_multi_language, remove_saas_branding, allow_table_qr, allowed_template_tiers)
VALUES
(
    'free',
    'Free Forever',
    'Perfect for small food stalls, dhabas, and chai points starting their digital journey.',
    0.00,
    0.00,
    0,
    '["Basic customer menu", "3 Classic templates", "Permanent restaurant QR code", "Basic menu categorization", "SmartQR branding badge", "Real-time item availability toggle"]'::jsonb,
    5,
    30,
    false,
    false,
    false,
    false,
    false,
    false,
    ARRAY['free']
),
(
    'premium',
    'Premium',
    'Designed for thriving cafes, multi-cuisine diners, and cloud kitchens wanting high conversion.',
    799.00,
    7990.00,
    17,
    '["All Free features", "Access to 6 Premium templates", "High-resolution food photos", "Rich food descriptions & dietary badges", "Custom brand colors & fonts", "Featured chef specials & offer banners", "Multi-language menu support", "Remove SmartQR branding", "Advanced scan & engagement analytics"]'::jsonb,
    25,
    200,
    true,
    true,
    true,
    true,
    true,
    false,
    ARRAY['free', 'premium']
),
(
    'premium_plus',
    'Premium Plus Luxury',
    'The ultimate bespoke showcase for luxury fine-dining, royal Indian heritage restaurants, and 5-star lounges.',
    1999.00,
    19990.00,
    20,
    '["All Premium features", "Access to ALL 15 templates including 6 Luxury templates", "Exclusive Black Gold & Royal Indian themes", "Glassmorphic animations & micro-interactions", "Table-specific QR codes with table numbering", "Tasting menu & wine pairing notes", "Priority 24/7 VIP onboarding support", "Full white-label custom domain ready"]'::jsonb,
    100,
    1000,
    true,
    true,
    true,
    true,
    true,
    true,
    ARRAY['free', 'premium', 'premium_plus']
)
ON CONFLICT (code) DO UPDATE SET
    monthly_price = EXCLUDED.monthly_price,
    yearly_price = EXCLUDED.yearly_price,
    features = EXCLUDED.features;

-- ==============================================================================
-- SEED DATA: 15 UNIQUE MENU TEMPLATES
-- ==============================================================================
INSERT INTO public.menu_templates (code, name, tier, description, vibe, badge_label, features_list)
VALUES
-- FREE TEMPLATES (1-3)
(
    'classic_menu',
    'Classic Menu',
    'free',
    'Traditional, neat, high-legibility restaurant printed menu aesthetic with subtle borders and clear price columns.',
    'Traditional & Familiar',
    'Free Forever',
    '["Fast scan & read", "Compact price tags", "Clear section headers", "Low bandwidth optimized"]'::jsonb
),
(
    'simple_restaurant',
    'Simple Restaurant',
    'free',
    'Clean, streamlined list design focused on quick ordering and zero distraction for fast-casual dining.',
    'Minimalist Fast Casual',
    'Free Forever',
    '["List layout", "Instant search", "Lightweight rendering", "FSSAI Veg/Non-Veg badges"]'::jsonb
),
(
    'basic_modern',
    'Basic Modern',
    'free',
    'Contemporary card grid with balanced white space, rounded pill category pills, and intuitive mobile ergonomics.',
    'Modern Everyday',
    'Free Forever',
    '["Card grid", "Sticky category bar", "Item count badges", "Clean typography"]'::jsonb
),

-- PREMIUM TEMPLATES (4-9)
(
    'modern_food_gallery',
    'Modern Food Gallery',
    'premium',
    'Visual-first layout featuring appetizing large food photography cards, horizontal category swipe, and hero banners.',
    'Instagrammable & Visual',
    'Popular',
    '["Full-width food photos", "Horizontal touch scroll", "Featured badge glow", "Discount tags"]'::jsonb
),
(
    'elegant_restaurant',
    'Elegant Restaurant',
    'premium',
    'Sophisticated editorial styling with warm muted tones, serif headings, and refined culinary descriptions.',
    'Warm Editorial & Wine',
    'Premium',
    '["Editorial serif typography", "Warm cream & slate palette", "Tasting notes", "Curated sections"]'::jsonb
),
(
    'minimal_white',
    'Minimal White',
    'premium',
    'Scandinavian architectural minimalism with stark contrasts, immaculate whitespace, and discreet icons.',
    'Nordic High Fashion',
    'Premium',
    '["Monochrome elegance", "Spacious layout", "Micro-typography", "Subtle divider lines"]'::jsonb
),
(
    'dark_food_menu',
    'Dark Food Menu',
    'premium',
    'Atmospheric deep charcoal and slate dark mode tailored for vibrant cocktail bars, lounges, and late-night diners.',
    'Nocturnal Lounge',
    'Night Mode',
    '["True dark background", "Emerald & amber neon accents", "OLED battery saving", "High-contrast food cards"]'::jsonb
),
(
    'colorful_cafe',
    'Colorful Cafe',
    'premium',
    'Playful, vibrant pastel tones with rounded card geometry, bouncy accents, and energetic brunch vibe.',
    'Cheery Brunch & Bakery',
    'Vibrant',
    '["Pastel accents", "Playful badge tags", "Pill buttons", "Warm welcoming vibe"]'::jsonb
),
(
    'premium_dining',
    'Premium Dining',
    'premium',
    'Contemporary European bistro aesthetics with structured double-column cards and chef recommendation badges.',
    'Artisanal Bistro',
    'Premium',
    '["Bistro borders", "Chef special crest", "Spicy meter", "Dietary filter pills"]'::jsonb
),

-- PREMIUM PLUS TEMPLATES (10-15)
(
    'luxury_black_gold',
    'Luxury Black Gold',
    'premium_plus',
    'The pinnacle of opulence. Rich obsidian backdrop adorned with brushed metallic gold trim, Cinzel type, and cinematic cards.',
    '5-Star Luxury Lounge',
    'Exclusive',
    '["Gold metallic foil borders", "Obsidian velvet tone", "Cinematic dish hero", "Prestige typography"]'::jsonb
),
(
    'fine_dining',
    'Fine Dining Haute Cuisine',
    'premium_plus',
    'Haute cuisine presentation with course-by-course pairing, sommelier notes, and delicate culinary spacing.',
    'Michelin-Star Haute',
    'Luxury',
    '["Multi-course grouping", "Sommelier wine recommendations", "Allergen matrix", "Refined gold serifs"]'::jsonb
),
(
    'royal_restaurant',
    'Royal Indian Heritage',
    'premium_plus',
    'Majestic Indian palace design with heritage jali patterns, brass accents, royal saffron touches, and thali highlights.',
    'Maharaja Palace & Heritage',
    'Royal Heritage',
    '["Indian palace jali motif", "Brass & saffron accents", "Thali special frames", "Devanagari title styling"]'::jsonb
),
(
    'glassmorphism_menu',
    'Glassmorphism Modern',
    'premium_plus',
    'Cutting-edge frosted glass translucency with blurred floating backdrops, dynamic lighting gradients, and iOS-like depth.',
    'Futuristic Translucent',
    'Trending',
    '["Frosted backdrop-blur", "Floating glass layers", "Dynamic gradient glow", "Silky smooth scrolling"]'::jsonb
),
(
    'advanced_food_showcase',
    'Advanced Food Showcase',
    'premium_plus',
    'Interactive gourmet experience featuring expandable nutritional macros, chef notes, allergen alerts, and live spice scales.',
    'Interactive Culinary Lab',
    'Advanced',
    '["Expandable nutrition & calorie meters", "Spice scale meter", "Chef preparation tags", "Quick search drawer"]'::jsonb
),
(
    'exclusive_signature',
    'Exclusive Signature',
    'premium_plus',
    'Bespoke signature menu with dark velvet textures, platinum borders, custom monogram crest, and VIP aesthetics.',
    'Bespoke Celebrity Signature',
    'Signature',
    '["Platinum trim", "Velvet dark backdrop", "Exclusive signature watermarks", "Deluxe touch animations"]'::jsonb
)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    tier = EXCLUDED.tier,
    description = EXCLUDED.description,
    vibe = EXCLUDED.vibe,
    badge_label = EXCLUDED.badge_label,
    features_list = EXCLUDED.features_list;
