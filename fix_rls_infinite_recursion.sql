-- ==============================================================================
-- FIX FOR SUPABASE RLS INFINITE RECURSION
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/jjlvgtnpwiooifiimfns/sql
-- ==============================================================================

-- 1. Create a SECURITY DEFINER helper to safely check if the caller is super_admin
--    without triggering RLS recursion on the profiles table
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

-- 2. Drop existing recursive policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles read" ON public.profiles;

-- 3. Re-create non-recursive policies on profiles
CREATE POLICY "Users can view own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Super admins can manage all profiles" ON public.profiles 
  FOR ALL USING (public.is_super_admin());

-- 4. Update subscription_plans policies
DROP POLICY IF EXISTS "Anyone can view active subscription plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Super admins can manage plans" ON public.subscription_plans;

CREATE POLICY "Anyone can view active subscription plans" ON public.subscription_plans 
  FOR SELECT USING (true);

CREATE POLICY "Super admins can manage plans" ON public.subscription_plans 
  FOR ALL USING (public.is_super_admin());

-- 5. Update restaurants policies
DROP POLICY IF EXISTS "Public can view active restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Owners can manage own restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Owners can view own restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Super admins can manage all restaurants" ON public.restaurants;

-- Public diners can view active restaurant profiles by slug for the QR menu
CREATE POLICY "Public can view active restaurants" ON public.restaurants 
  FOR SELECT USING (is_active = true);

-- Restaurant owners can view, insert, update and delete only their own restaurants
CREATE POLICY "Owners can manage own restaurants" ON public.restaurants 
  FOR ALL USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Super admins can view and manage all restaurants
CREATE POLICY "Super admins can manage all restaurants" ON public.restaurants 
  FOR ALL USING (public.is_super_admin());

-- 6. Update categories policies
DROP POLICY IF EXISTS "Public can view active categories" ON public.menu_categories;
DROP POLICY IF EXISTS "Owners can manage categories" ON public.menu_categories;

CREATE POLICY "Public can view active categories" ON public.menu_categories 
  FOR SELECT USING (is_active = true);

CREATE POLICY "Owners can manage categories" ON public.menu_categories 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = menu_categories.restaurant_id AND owner_id = auth.uid())
    OR public.is_super_admin()
  );

-- 7. Update items policies
DROP POLICY IF EXISTS "Public can view menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Owners can manage items" ON public.menu_items;

CREATE POLICY "Public can view menu items" ON public.menu_items 
  FOR SELECT USING (true);

CREATE POLICY "Owners can manage items" ON public.menu_items 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = menu_items.restaurant_id AND owner_id = auth.uid())
    OR public.is_super_admin()
  );

-- 8. Update templates policies
DROP POLICY IF EXISTS "Anyone can view active templates" ON public.menu_templates;
CREATE POLICY "Anyone can view active templates" ON public.menu_templates 
  FOR SELECT USING (is_active = true);

-- 9. Update template settings policies
DROP POLICY IF EXISTS "Public can view template settings" ON public.restaurant_template_settings;
DROP POLICY IF EXISTS "Owners can update template settings" ON public.restaurant_template_settings;

CREATE POLICY "Public can view template settings" ON public.restaurant_template_settings 
  FOR SELECT USING (true);

CREATE POLICY "Owners can update template settings" ON public.restaurant_template_settings 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = restaurant_template_settings.restaurant_id AND owner_id = auth.uid())
    OR public.is_super_admin()
  );

-- 10. Update tables policies
DROP POLICY IF EXISTS "Public can view restaurant tables" ON public.restaurant_tables;
DROP POLICY IF EXISTS "Owners can manage tables" ON public.restaurant_tables;

CREATE POLICY "Public can view restaurant tables" ON public.restaurant_tables 
  FOR SELECT USING (true);

CREATE POLICY "Owners can manage tables" ON public.restaurant_tables 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = restaurant_tables.restaurant_id AND owner_id = auth.uid())
    OR public.is_super_admin()
  );

-- 11. Customer orders policies
DROP POLICY IF EXISTS "Public can create orders" ON public.customer_orders;
DROP POLICY IF EXISTS "Owners can view and manage restaurant orders" ON public.customer_orders;

CREATE POLICY "Public can create orders" ON public.customer_orders 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Owners can view and manage restaurant orders" ON public.customer_orders 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = customer_orders.restaurant_id AND owner_id = auth.uid())
    OR public.is_super_admin()
  );

-- 12. Analytics events
DROP POLICY IF EXISTS "Public can record analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "Owners can view restaurant analytics" ON public.analytics_events;

CREATE POLICY "Public can record analytics" ON public.analytics_events 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Owners can view restaurant analytics" ON public.analytics_events 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = analytics_events.restaurant_id AND owner_id = auth.uid())
    OR public.is_super_admin()
  );
