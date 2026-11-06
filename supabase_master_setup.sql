-- ==============================================================================
-- SMARTQR RESTAURANT SAAS - RUN THIS IN SUPABASE SQL EDITOR
-- Link: https://supabase.com/dashboard/project/jjlvgtnpwiooifiimfns/sql/new
-- ==============================================================================

-- 1. Ensure extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Ensure caption column exists in menu_items
ALTER TABLE public.menu_items ADD COLUMN IF NOT EXISTS caption TEXT;

-- 3. DISABLE ROW LEVEL SECURITY (RLS) FOR FULL APP ACCESS
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

-- 4. GRANT ALL PERMISSIONS TO ANON AND AUTHENTICATED
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
