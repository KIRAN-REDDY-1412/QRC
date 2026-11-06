export type UserRole = 'super_admin' | 'restaurant_owner' | 'customer';

export type PlanCode = 'basic' | 'premium' | 'free' | 'premium_plus';

export type DietaryType = 'veg' | 'non_veg' | 'egg' | 'vegan' | 'jain';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  created_at?: string;
}

export interface SubscriptionPlan {
  id: string;
  code: PlanCode;
  name: string;
  description: string;
  monthly_price: number;
  yearly_price: number;
  currency: string;
  yearly_discount_percent: number;
  is_active: boolean;
  features: string[];
  max_categories: number;
  max_items: number;
  allow_food_images: boolean;
  allow_custom_colors: boolean;
  allow_custom_fonts: boolean;
  allow_multi_language: boolean;
  remove_saas_branding: boolean;
  allow_table_qr: boolean;
  allow_ordering?: boolean;
  allow_upi_payment?: boolean;
  allow_bulk_import?: boolean;
  allow_review_booster?: boolean;
  allowed_template_tiers: PlanCode[];
  created_at?: string;
  updated_at?: string;
}

export interface Restaurant {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  phone?: string;
  email?: string;
  fssai_license?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  currency: string;
  logo_url?: string;
  banner_url?: string;
  opening_time?: string;
  closing_time?: string;
  whatsapp_number?: string;
  upi_id?: string;
  google_review_url?: string;
  enable_ordering?: boolean;
  enable_upi?: boolean;
  enable_reviews?: boolean;
  is_active: boolean;
  is_pure_veg: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MenuCategory {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string;
  icon?: string;
  order_index: number;
  is_active: boolean;
  created_at?: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  discount_price?: number;
  image_url?: string;
  is_available: boolean;
  is_featured: boolean;
  dietary_type: DietaryType;
  spice_level: number; // 0 (mild) to 3 (extra hot)
  calories?: number;
  preparation_time?: string;
  order_index: number;
  created_at?: string;
}

export interface MenuTemplate {
  id: string;
  code: string;
  name: string;
  tier: PlanCode;
  thumbnail_url?: string;
  description: string;
  vibe: string;
  badge_label?: string;
  features_list: string[];
  is_active: boolean;
}

export type OpeningAnimationStyle = 'minimal' | 'gold_glow' | 'luxury_particles' | 'cinematic';

export interface RestaurantTemplateSettings {
  id?: string;
  restaurant_id: string;
  template_id: string;
  accent_color: string;
  font_family: string;
  card_style: string;
  show_photos: boolean;
  show_dietary_badges: boolean;
  show_spice_level: boolean;
  show_prices: boolean;
  custom_css?: string;
  // Instant QR Scan Opening Animation Experience
  opening_animation_enabled?: boolean;
  opening_animation_style?: OpeningAnimationStyle;
  opening_animation_duration?: number; // duration in seconds (1.0 to 2.5)
  opening_animation_tagline?: string;
  opening_animation_skip_button?: boolean;
  opening_animation_sound?: boolean;
}

export interface Subscription {
  id: string;
  restaurant_id: string;
  plan_id: string;
  status: 'active' | 'past_due' | 'canceled' | 'expired' | 'downgrade_scheduled' | 'trialing';
  billing_cycle: 'monthly' | 'yearly';
  current_period_start: string;
  current_period_end: string;
  auto_renew: boolean;
  scheduled_downgrade_plan_id?: string;
  plan?: SubscriptionPlan;
  is_trial?: boolean;
  trial_ends_at?: string;
}

export interface PaymentRecord {
  id: string;
  restaurant_id: string;
  plan_id: string;
  amount: number;
  currency: string;
  payment_gateway: string;
  gateway_order_id?: string;
  gateway_payment_id?: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  invoice_number?: string;
  billing_cycle: 'monthly' | 'yearly';
  created_at: string;
}

export interface RestaurantLanguage {
  id?: string;
  restaurant_id: string;
  language_code: string;
  language_name: string;
  is_default: boolean;
  is_active: boolean;
}

export interface MenuTranslation {
  id?: string;
  restaurant_id: string;
  entity_type: 'restaurant' | 'category' | 'item';
  entity_id: string;
  language_code: string;
  translated_name?: string;
  translated_description?: string;
}

export interface RestaurantTable {
  id: string;
  restaurant_id: string;
  table_number: string;
  section_name?: string;
  capacity: number;
  qr_code_svg?: string;
}

export interface AnalyticsEvent {
  id?: string;
  restaurant_id: string;
  event_type: 'qr_scan' | 'menu_view' | 'item_click' | 'language_change' | 'category_filter';
  device_type?: string;
  table_number?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export interface CustomerOrder {
  id: string;
  restaurant_id: string;
  table_number: string;
  customer_name?: string;
  customer_phone?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total_amount: number;
  status: 'new' | 'in_kitchen' | 'ready' | 'completed' | 'cancelled';
  payment_method?: 'cash' | 'upi' | 'card';
  payment_status: 'pending' | 'paid';
  created_at: string;
}
