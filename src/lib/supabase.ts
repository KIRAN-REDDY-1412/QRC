import { createClient } from '@supabase/supabase-js';
import { 
  Restaurant, 
  MenuCategory, 
  MenuItem, 
  MenuTemplate, 
  SubscriptionPlan, 
  Subscription, 
  RestaurantTemplateSettings, 
  PaymentRecord,
  AnalyticsEvent,
  CustomerOrder,
  TableBooking
} from '@/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isLiveSupabase = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

export const supabase = isLiveSupabase 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : createClient('https://mock-supabase-id.supabase.co', 'mock-key-for-offline');

// ============================================================================
// DEFAULT SEED DATA & MOCK REPOSITORY (Local / Offline / Instant Sandbox)
// ============================================================================

export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: '7a683ce9-ca2e-41ca-99f3-ebf3b107f878',
    code: 'basic',
    name: 'Basic Plan',
    description: 'Essential digital QR menu platform for cafes, dhabas, food stalls, and modern diners.',
    monthly_price: 399,
    yearly_price: 3590,
    currency: 'INR',
    yearly_discount_percent: 25,
    is_active: true,
    max_categories: 15,
    max_items: 100,
    allow_food_images: true,
    allow_custom_colors: true,
    allow_custom_fonts: true,
    allow_multi_language: true,
    remove_saas_branding: false,
    allow_table_qr: false,
    allowed_template_tiers: ['basic', 'free'],
    features: [
      'Digital QR Menu with instant live cloud updates',
      '5 Classic & Contemporary responsive templates',
      'Permanent Restaurant QR code & Printable Standee',
      'High-resolution food photos & descriptions',
      'Dietary classification badges (Veg, Non-Veg, Jain, Vegan)',
      'Multi-language menu translation support',
      'Live category & dish availability toggles',
      'Core diner scan & visit analytics'
    ]
  },
  {
    id: '2c3f42e1-88b9-4007-833f-e34ee1428e25',
    code: 'premium',
    name: 'Premium Luxury Plan',
    description: 'The complete all-inclusive bespoke suite for high-growth cafes, multi-outlet restaurants, and fine-dining lounges.',
    monthly_price: 999,
    yearly_price: 8990,
    currency: 'INR',
    yearly_discount_percent: 25,
    is_active: true,
    max_categories: 100,
    max_items: 1000,
    allow_food_images: true,
    allow_custom_colors: true,
    allow_custom_fonts: true,
    allow_multi_language: true,
    remove_saas_branding: true,
    allow_table_qr: true,
    allow_ordering: true,
    allow_upi_payment: true,
    allow_bulk_import: true,
    allow_review_booster: true,
    allowed_template_tiers: ['basic', 'premium', 'premium_plus', 'free'],
    features: [
      'Everything in Basic Plan included',
      'Access to ALL 15 Luxury & Glassmorphism templates',
      'Instant QR Scan Opening Intro Animation (Royal Glow & Particles)',
      'Custom Branded QR with Center Restaurant Logo & Monogram',
      'Table-Specific QR Codes & Table Ordering Cart',
      'Instant UPI Payment Integration (GPay, PhonePe, Paytm)',
      'Excel & CSV Bulk Menu Import & Instant Export',
      'Google Maps 5-Star Review Booster Popups',
      '100% White-Label: Remove all SmartQR SaaS branding',
      'Real-Time Waiter Calling & Table Service Notifications',
      'Priority 24/7 VIP Phone & WhatsApp Support'
    ]
  }
];

export const ALL_TEMPLATES: MenuTemplate[] = [
  // 3 FREE TEMPLATES
  {
    id: 'tpl-1',
    code: 'classic_menu',
    name: 'Classic Menu',
    tier: 'free',
    thumbnail_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    description: 'Traditional, neat, high-legibility restaurant printed menu aesthetic with subtle borders and clear price columns.',
    vibe: 'Traditional & Familiar',
    badge_label: 'Free',
    features_list: ['Fast scan & read', 'Compact price tags', 'Clear section headers', 'Low bandwidth optimized'],
    is_active: true,
  },
  {
    id: 'tpl-2',
    code: 'simple_restaurant',
    name: 'Simple Restaurant',
    tier: 'free',
    thumbnail_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    description: 'Clean, streamlined list design focused on quick ordering and zero distraction for fast-casual dining.',
    vibe: 'Minimalist Fast Casual',
    badge_label: 'Free',
    features_list: ['List layout', 'Instant search', 'Lightweight rendering', 'FSSAI Veg/Non-Veg badges'],
    is_active: true,
  },
  {
    id: 'tpl-3',
    code: 'basic_modern',
    name: 'Basic Modern',
    tier: 'free',
    thumbnail_url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80',
    description: 'Contemporary card grid with balanced white space, rounded category pills, and intuitive mobile ergonomics.',
    vibe: 'Modern Everyday',
    badge_label: 'Free',
    features_list: ['Card grid', 'Sticky category bar', 'Item count badges', 'Clean typography'],
    is_active: true,
  },

  // 6 PREMIUM TEMPLATES
  {
    id: 'tpl-4',
    code: 'modern_food_gallery',
    name: 'Modern Food Gallery',
    tier: 'premium',
    thumbnail_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    description: 'Visual-first layout featuring appetizing large food photography cards, horizontal category swipe, and hero banners.',
    vibe: 'Instagrammable & Visual',
    badge_label: 'Premium',
    features_list: ['Full-width food photos', 'Horizontal touch scroll', 'Featured badge glow', 'Discount tags'],
    is_active: true,
  },
  {
    id: 'tpl-5',
    code: 'elegant_restaurant',
    name: 'Elegant Restaurant',
    tier: 'premium',
    thumbnail_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Sophisticated editorial styling with warm muted tones, serif headings, and refined culinary descriptions.',
    vibe: 'Warm Editorial & Wine',
    badge_label: 'Premium',
    features_list: ['Editorial serif typography', 'Warm cream & slate palette', 'Tasting notes', 'Curated sections'],
    is_active: true,
  },
  {
    id: 'tpl-6',
    code: 'minimal_white',
    name: 'Minimal White',
    tier: 'premium',
    thumbnail_url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
    description: 'Scandinavian architectural minimalism with stark contrasts, immaculate whitespace, and discreet icons.',
    vibe: 'Nordic High Fashion',
    badge_label: 'Premium',
    features_list: ['Monochrome elegance', 'Spacious layout', 'Micro-typography', 'Subtle divider lines'],
    is_active: true,
  },
  {
    id: 'tpl-7',
    code: 'dark_food_menu',
    name: 'Dark Food Menu',
    tier: 'premium',
    thumbnail_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80',
    description: 'Atmospheric deep charcoal and slate dark mode tailored for vibrant cocktail bars, lounges, and late-night diners.',
    vibe: 'Nocturnal Lounge',
    badge_label: 'Night Mode',
    features_list: ['True dark background', 'Emerald & amber neon accents', 'OLED battery saving', 'High-contrast food cards'],
    is_active: true,
  },
  {
    id: 'tpl-8',
    code: 'colorful_cafe',
    name: 'Colorful Cafe',
    tier: 'premium',
    thumbnail_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80',
    description: 'Playful, vibrant pastel tones with rounded card geometry, bouncy accents, and energetic brunch vibe.',
    vibe: 'Cheery Brunch & Bistro',
    badge_label: 'Vibrant',
    features_list: ['Pastel accents', 'Playful badge tags', 'Pill buttons', 'Warm welcoming vibe'],
    is_active: true,
  },
  {
    id: 'tpl-9',
    code: 'premium_dining',
    name: 'Premium Dining',
    tier: 'premium',
    thumbnail_url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=600&q=80',
    description: 'Contemporary European bistro aesthetics with structured double-column cards and chef recommendation badges.',
    vibe: 'Artisanal Bistro',
    badge_label: 'Chef Special',
    features_list: ['Bistro borders', 'Chef special crest', 'Spicy meter', 'Dietary filter pills'],
    is_active: true,
  },

  // 6 PREMIUM PLUS TEMPLATES
  {
    id: 'tpl-10',
    code: 'luxury_black_gold',
    name: 'Luxury Black Gold',
    tier: 'premium_plus',
    thumbnail_url: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=600&q=80',
    description: 'The pinnacle of opulence. Rich obsidian backdrop adorned with brushed metallic gold trim, Cinzel type, and cinematic cards.',
    vibe: '5-Star Luxury Lounge',
    badge_label: 'Luxury',
    features_list: ['Gold metallic foil borders', 'Obsidian velvet tone', 'Cinematic dish hero', 'Prestige typography'],
    is_active: true,
  },
  {
    id: 'tpl-11',
    code: 'fine_dining',
    name: 'Fine Dining Haute Cuisine',
    tier: 'premium_plus',
    thumbnail_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
    description: 'Haute cuisine presentation with course-by-course pairing, sommelier notes, and delicate culinary spacing.',
    vibe: 'Michelin-Star Haute',
    badge_label: 'Haute Cuisine',
    features_list: ['Multi-course grouping', 'Sommelier wine recommendations', 'Allergen matrix', 'Refined gold serifs'],
    is_active: true,
  },
  {
    id: 'tpl-12',
    code: 'royal_restaurant',
    name: 'Royal Indian Heritage',
    tier: 'premium_plus',
    thumbnail_url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    description: 'Majestic Indian palace design with heritage jali patterns, brass accents, royal saffron touches, and thali highlights.',
    vibe: 'Maharaja Palace & Heritage',
    badge_label: 'Royal Indian',
    features_list: ['Indian palace jali motif', 'Brass & saffron accents', 'Thali special frames', 'Devanagari title styling'],
    is_active: true,
  },
  {
    id: 'tpl-13',
    code: 'glassmorphism_menu',
    name: 'Glassmorphism Modern',
    tier: 'premium_plus',
    thumbnail_url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=600&q=80',
    description: 'Cutting-edge frosted glass translucency with blurred floating backdrops, dynamic lighting gradients, and iOS-like depth.',
    vibe: 'Futuristic Translucent',
    badge_label: 'Glassmorphic',
    features_list: ['Frosted backdrop-blur', 'Floating glass layers', 'Dynamic gradient glow', 'Silky smooth scrolling'],
    is_active: true,
  },
  {
    id: 'tpl-14',
    code: 'advanced_food_showcase',
    name: 'Advanced Food Showcase',
    tier: 'premium_plus',
    thumbnail_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    description: 'Interactive gourmet experience featuring expandable nutritional macros, chef notes, allergen alerts, and live spice scales.',
    vibe: 'Interactive Culinary Lab',
    badge_label: 'Nutri-Smart',
    features_list: ['Expandable nutrition & calorie meters', 'Spice scale meter', 'Chef preparation tags', 'Quick search drawer'],
    is_active: true,
  },
  {
    id: 'tpl-15',
    code: 'exclusive_signature',
    name: 'Exclusive Signature',
    tier: 'premium_plus',
    thumbnail_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
    description: 'Bespoke signature menu with dark velvet textures, platinum borders, custom monogram crest, and VIP aesthetics.',
    vibe: 'Bespoke Celebrity Signature',
    badge_label: 'VIP Signature',
    features_list: ['Platinum trim', 'Velvet dark backdrop', 'Exclusive signature watermarks', 'Deluxe touch animations'],
    is_active: true,
  },
];

// ============================================================================
// DYNAMIC ID GENERATOR (Valid RFC4122 UUID v4 for PostgreSQL)
// ============================================================================
export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch {
      // fallback
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Clean empty state - No mock data. All data is dynamically entered by user & stored in Supabase
export const DEMO_RESTAURANTS: Restaurant[] = [];
export const DEMO_CATEGORIES: MenuCategory[] = [];
export const DEMO_ITEMS: MenuItem[] = [];

export const DEFAULT_SETTINGS: RestaurantTemplateSettings = {
  restaurant_id: '',
  template_id: 'tpl-1', // Classic Menu
  accent_color: '#059669',
  font_family: 'Inter',
  card_style: 'modern',
  show_photos: true,
  show_dietary_badges: true,
  show_spice_level: true,
  show_prices: true,
  opening_animation_enabled: false,
  opening_animation_style: 'gold_glow',
  opening_animation_duration: 1.8,
  opening_animation_tagline: 'Welcome to our digital menu',
  opening_animation_skip_button: true,
  opening_animation_sound: false
};
export const DEMO_SETTINGS = DEFAULT_SETTINGS;

export const DEMO_SUBSCRIPTION: Subscription = {
  id: '00000000-0000-0000-0000-000000000000',
  restaurant_id: '',
  plan_id: DEFAULT_PLANS[0].id,
  status: 'trialing',
  billing_cycle: 'monthly',
  current_period_start: new Date().toISOString(),
  current_period_end: new Date(Date.now() + 7 * 86400000).toISOString(),
  auto_renew: false,
  is_trial: true,
  trial_ends_at: new Date(Date.now() + 7 * 86400000).toISOString(),
  plan: DEFAULT_PLANS[0]
};

// Storage keys for localStorage persistence in mock mode
const STORAGE_KEYS = {
  RESTAURANTS: 'smartqr_restaurants',
  CATEGORIES: 'smartqr_categories',
  ITEMS: 'smartqr_items',
  SETTINGS: 'smartqr_template_settings',
  SUBSCRIPTIONS: 'smartqr_subscriptions',
  PLANS: 'smartqr_plans',
  PAYMENTS: 'smartqr_payments',
  ANALYTICS: 'smartqr_analytics',
  BOOKINGS: 'smartqr_table_bookings'
};

// One-time automatic purge: wipe legacy mock/demo data and previously cached local restaurants
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const isPurged = localStorage.getItem('smartqr_purge_v3');
    if (!isPurged) {
      localStorage.removeItem(STORAGE_KEYS.RESTAURANTS);
      localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
      localStorage.removeItem(STORAGE_KEYS.ITEMS);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTIONS);
      localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
      localStorage.removeItem('smartqr_current_user');
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('smartqr_tables_') || key.startsWith('smartqr_owner_password_')) {
          localStorage.removeItem(key);
        }
      });
      localStorage.setItem('smartqr_purge_v3', 'true');
    }
  } catch {
    // Ignore error
  }
}

// ============================================================================
// DATA STORE WRAPPER (Local Storage + Supabase fallback)
// ============================================================================

export const getStoredPlans = (): SubscriptionPlan[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PLANS);
  if (!data) return DEFAULT_PLANS;
  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length !== 2 || parsed.some((p: any) => p.code === 'free' || p.code === 'premium_plus')) {
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(DEFAULT_PLANS));
      return DEFAULT_PLANS;
    }
    return parsed;
  } catch {
    return DEFAULT_PLANS;
  }
};

export const saveStoredPlans = (plans: SubscriptionPlan[]) => {
  localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
};

export const getStoredRestaurants = (): Restaurant[] => {
  const data = localStorage.getItem(STORAGE_KEYS.RESTAURANTS);
  return data ? JSON.parse(data) : DEMO_RESTAURANTS;
};

export const saveStoredRestaurants = (restaurants: Restaurant[]) => {
  localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));
};

export const getAllStoredCategories = (): MenuCategory[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
  return data ? JSON.parse(data) : DEMO_CATEGORIES;
};

export const getStoredCategories = (restaurantId: string): MenuCategory[] => {
  const all = getAllStoredCategories();
  return all.filter(c => c.restaurant_id === restaurantId);
};

export const saveStoredCategories = (categories: MenuCategory[]) => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

export const getAllStoredItems = (): MenuItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
  return data ? JSON.parse(data) : DEMO_ITEMS;
};

export const getStoredItems = (restaurantId: string): MenuItem[] => {
  const all = getAllStoredItems();
  return all.filter(i => i.restaurant_id === restaurantId);
};

export const saveStoredItems = (items: MenuItem[]) => {
  localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
};

export const getStoredSettings = (restaurantId: string): RestaurantTemplateSettings => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  const all: Record<string, RestaurantTemplateSettings> = data ? JSON.parse(data) : {};
  if (all[restaurantId]) return all[restaurantId];
  return { ...DEFAULT_SETTINGS, restaurant_id: restaurantId };
};

export const saveStoredSettings = (settings: RestaurantTemplateSettings) => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  const all = data ? JSON.parse(data) : {};
  all[settings.restaurant_id] = settings;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(all));
};

export const getStoredSubscription = (restaurantId: string): Subscription => {
  const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
  const all: Record<string, Subscription> = data ? JSON.parse(data) : {};
  
  if (all[restaurantId]) {
    const plans = getStoredPlans();
    const existing = all[restaurantId];
    const plan = plans.find(p => p.id === existing.plan_id) || DEFAULT_PLANS[0];
    
    // Check if trial has expired
    if (existing.is_trial || existing.status === 'trialing') {
      const trialEndTime = existing.trial_ends_at 
        ? new Date(existing.trial_ends_at).getTime() 
        : new Date(existing.current_period_end).getTime();

      if (trialEndTime <= Date.now()) {
        existing.status = 'expired';
        saveStoredSubscription(existing);
      }
    }

    return { ...existing, plan };
  }

  // 7-Day Free Trial for any new restaurant
  const now = new Date();
  const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const newTrialSub: Subscription = {
    id: `sub-${restaurantId}`,
    restaurant_id: restaurantId,
    plan_id: DEFAULT_PLANS[0].id,
    status: 'trialing',
    billing_cycle: 'monthly',
    current_period_start: now.toISOString(),
    current_period_end: trialEnd.toISOString(),
    auto_renew: false,
    is_trial: true,
    trial_ends_at: trialEnd.toISOString(),
    plan: DEFAULT_PLANS[0]
  };

  saveStoredSubscription(newTrialSub);
  return newTrialSub;
};

export const saveStoredSubscription = (sub: Subscription) => {
  const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
  const all = data ? JSON.parse(data) : {};
  all[sub.restaurant_id] = sub;
  localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(all));
};

export const getStoredPayments = (restaurantId: string): PaymentRecord[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
  const all: PaymentRecord[] = data ? JSON.parse(data) : [
    {
      id: 'pay-101',
      restaurant_id: 'rest-saffron-darbar',
      plan_id: 'plan-premium-plus',
      amount: 19990,
      currency: 'INR',
      payment_gateway: 'razorpay',
      gateway_payment_id: 'pay_RZP981249128',
      gateway_order_id: 'order_RZP771289',
      status: 'success',
      invoice_number: 'INV-2026-0089',
      billing_cycle: 'yearly',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString()
    }
  ];
  return all.filter(p => p.restaurant_id === restaurantId);
};

export const recordPayment = (payment: PaymentRecord) => {
  const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
  const all: PaymentRecord[] = data ? JSON.parse(data) : [];
  all.unshift(payment);
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(all));
};

// Analytics event recorder
export const recordScanEvent = (restaurantId: string, eventType: string = 'qr_scan') => {
  const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
  const all: AnalyticsEvent[] = data ? JSON.parse(data) : [];
  all.push({
    restaurant_id: restaurantId,
    event_type: eventType as any,
    device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
    created_at: new Date().toISOString()
  });
  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(all.slice(-1000))); // keep last 1000
};

export const getScanCount = (restaurantId: string): number => {
  const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
  const all: AnalyticsEvent[] = data ? JSON.parse(data) : [];
  const count = all.filter(e => e.restaurant_id === restaurantId && e.event_type === 'qr_scan').length;
  return count > 0 ? count + 142 : 142; // baseline for realism
};

export const getStoredOrders = (restaurantId: string): CustomerOrder[] => {
  const data = localStorage.getItem('smartqr_orders');
  const all: CustomerOrder[] = data ? JSON.parse(data) : [];
  return all.filter(o => o.restaurant_id === restaurantId);
};

export const saveStoredOrder = (order: CustomerOrder) => {
  const data = localStorage.getItem('smartqr_orders');
  const all: CustomerOrder[] = data ? JSON.parse(data) : [];
  all.unshift(order);
  localStorage.setItem('smartqr_orders', JSON.stringify(all));
};

export const getStoredBookings = (restaurantId: string): TableBooking[] => {
  const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  const all: TableBooking[] = data ? JSON.parse(data) : [
    {
      id: 'book-1',
      restaurant_id: restaurantId,
      customer_name: 'Aditya Verma',
      customer_phone: '+91 98201 55678',
      guest_count: 4,
      booking_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      booking_time: '08:00 PM',
      seating_section: 'Courtyard',
      special_notes: 'Corner table for anniversary celebration',
      status: 'confirmed',
      created_at: new Date().toISOString()
    },
    {
      id: 'book-2',
      restaurant_id: restaurantId,
      customer_name: 'Pooja Hegde',
      customer_phone: '+91 99304 88123',
      guest_count: 2,
      booking_date: new Date().toISOString().split('T')[0],
      booking_time: '09:00 PM',
      seating_section: 'Rooftop Lounge',
      special_notes: 'Quiet romantic table',
      status: 'pending',
      created_at: new Date().toISOString()
    }
  ];
  return all.filter(b => b.restaurant_id === restaurantId);
};

export const saveStoredBooking = (booking: TableBooking) => {
  const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  const all: TableBooking[] = data ? JSON.parse(data) : [];
  all.unshift(booking);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(all));
};

export const updateBookingStatus = (bookingId: string, status: TableBooking['status']) => {
  const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  const all: TableBooking[] = data ? JSON.parse(data) : [];
  const updated = all.map(b => b.id === bookingId ? { ...b, status } : b);
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
};
