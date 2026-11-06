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
  CustomerOrder
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
    id: 'plan-basic',
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
    id: 'plan-premium',
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

// Sample Initial Restaurant for Demo
export const DEMO_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-saffron-darbar',
    owner_id: 'user-owner-1',
    name: 'Saffron Heritage Darbar',
    slug: 'saffron-darbar',
    tagline: 'Royal Awadhi & Mughlai Culinary Heritage',
    description: 'Experience centuries-old culinary grandeur crafted with royal slow-cooked dum techniques and fragrant saffron infused delicacies.',
    phone: '+91 98200 12345',
    email: 'contact@saffrondarbar.in',
    fssai_license: '11521008000451',
    address: 'Plot 42, Heritage Enclave, Colaba Causeway',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400005',
    currency: 'INR',
    logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
    banner_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    opening_time: '12:00 PM',
    closing_time: '11:30 PM',
    whatsapp_number: '+919820012345',
    upi_id: 'saffrondarbar@okaxis',
    google_review_url: 'https://g.page/r/saffron-heritage-darbar/review',
    enable_ordering: true,
    enable_upi: true,
    enable_reviews: true,
    is_active: true,
    is_pure_veg: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'rest-bombay-cafe',
    owner_id: 'user-owner-2',
    name: 'The Bombay Roast & Bistro',
    slug: 'bombay-roast',
    tagline: 'Artisanal Brews, Sourdough Pizzas & All-Day Breakfast',
    description: 'A sunlit neighborhood cafe celebrating slow-roasted Coorg beans, hand-stretched sourdough, and vibrant bowls.',
    phone: '+91 98450 67890',
    email: 'hi@bombayroast.com',
    fssai_license: '11220002000321',
    address: '80 Feet Road, 4th Block, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    currency: 'INR',
    logo_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=200&q=80',
    banner_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    opening_time: '08:00 AM',
    closing_time: '11:00 PM',
    whatsapp_number: '+919845067890',
    upi_id: 'bombayroast@icici',
    google_review_url: 'https://g.page/r/bombay-roast-bistro/review',
    enable_ordering: true,
    enable_upi: true,
    enable_reviews: true,
    is_active: true,
    is_pure_veg: false,
    created_at: new Date().toISOString()
  }
];

export const DEMO_CATEGORIES: MenuCategory[] = [
  {
    id: 'cat-starters',
    restaurant_id: 'rest-saffron-darbar',
    name: 'Shahi Starters & Kebabs',
    description: 'Charcoal grilled skewers marinated in Kashmiri saffron and hand-ground spices.',
    icon: 'Flame',
    order_index: 1,
    is_active: true
  },
  {
    id: 'cat-mains',
    restaurant_id: 'rest-saffron-darbar',
    name: 'Royal Dawat Mains',
    description: 'Rich slow-cooked gravies perfected over gentle simmer.',
    icon: 'Utensils',
    order_index: 2,
    is_active: true
  },
  {
    id: 'cat-biryani',
    restaurant_id: 'rest-saffron-darbar',
    name: 'Dum Pukht Biryanis',
    description: 'Long-grain aged basmati layered with aromatic herbs, sealed in clay handis.',
    icon: 'Sparkles',
    order_index: 3,
    is_active: true
  },
  {
    id: 'cat-breads',
    restaurant_id: 'rest-saffron-darbar',
    name: 'Tandoori Roti & Naan',
    description: 'Freshly baked in traditional clay ovens with generous desi ghee.',
    icon: 'Layers',
    order_index: 4,
    is_active: true
  },
  {
    id: 'cat-desserts',
    restaurant_id: 'rest-saffron-darbar',
    name: 'Mithai & Shahi Desserts',
    description: 'Rich royal sweets garnished with 24k edible silver vark and pistachio slivers.',
    icon: 'Award',
    order_index: 5,
    is_active: true
  },
  {
    id: 'cat-beverages',
    restaurant_id: 'rest-saffron-darbar',
    name: 'Coolers & Sharbats',
    description: 'Refreshing traditional infusions of rose, khus, and kokum.',
    icon: 'Wine',
    order_index: 6,
    is_active: true
  },
  // The Bombay Roast & Bistro categories
  {
    id: 'cat-bombay-coffee',
    restaurant_id: 'rest-bombay-cafe',
    name: 'Specialty Coffee & Brews',
    description: 'Single-origin estate beans roasted to perfection, brewed manually & espresso-based.',
    icon: 'Coffee',
    order_index: 1,
    is_active: true
  },
  {
    id: 'cat-bombay-toasts',
    restaurant_id: 'rest-bombay-cafe',
    name: 'Sourdough Toasts & Melts',
    description: '48-hour fermented wild yeast country sourdough with organic toppings.',
    icon: 'Utensils',
    order_index: 2,
    is_active: true
  },
  {
    id: 'cat-bombay-pizzas',
    restaurant_id: 'rest-bombay-cafe',
    name: 'Woodfired Neapolitan Pizzas',
    description: 'Hand-stretched dough fired at 450°C with Fior di Latte mozzarella.',
    icon: 'Flame',
    order_index: 3,
    is_active: true
  },
  {
    id: 'cat-bombay-desserts',
    restaurant_id: 'rest-bombay-cafe',
    name: 'Bakery & Sweet Plates',
    description: 'Freshly baked viennoiserie, cruffins, and artisanal entremets.',
    icon: 'Sparkles',
    order_index: 4,
    is_active: true
  }
];

export const DEMO_ITEMS: MenuItem[] = [
  {
    id: 'item-galouti-kebab',
    restaurant_id: 'rest-saffron-darbar',
    category_id: 'cat-starters',
    name: 'Awadhi Melt-in-Mouth Galouti Kebab',
    description: 'Finely minced mutton smoked with cloves and 32 proprietary spices, served on coin ulta tawa parathas with mint chutney.',
    price: 495,
    discount_price: 450,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    is_featured: true,
    dietary_type: 'non_veg',
    spice_level: 2,
    calories: 420,
    preparation_time: '18 mins',
    order_index: 1
  },
  {
    id: 'item-paneer-tikka',
    restaurant_id: 'rest-saffron-darbar',
    category_id: 'cat-starters',
    name: 'Angari Malai Paneer Tikka',
    description: 'Fresh cottage cheese cubes marinated in rich clotted cream, crushed yellow chili, and saffron, chargrilled in tandoor.',
    price: 395,
    image_url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    is_featured: true,
    dietary_type: 'veg',
    spice_level: 1,
    calories: 360,
    preparation_time: '15 mins',
    order_index: 2
  },
  {
    id: 'item-dahi-kebab',
    restaurant_id: 'rest-saffron-darbar',
    category_id: 'cat-starters',
    name: 'Dahi Ke Shahi Kebab',
    description: 'Crisp hung yogurt patties infused with crushed green cardamom, bell peppers, and fresh coriander seeds.',
    price: 365,
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    is_featured: false,
    dietary_type: 'veg',
    spice_level: 1,
    calories: 310,
    preparation_time: '12 mins',
    order_index: 3
  },
  {
    id: 'item-murgh-makhani',
    restaurant_id: 'rest-saffron-darbar',
    category_id: 'cat-mains',
    name: 'Purani Dilli Butter Chicken (Murgh Makhani)',
    description: 'Tandoor-charred chicken steeped in velvety vine-ripened tomato gravy, tempered with Kasuri methi and farmhouse butter.',
    price: 545,
    image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    is_featured: true,
    dietary_type: 'non_veg',
    spice_level: 1,
    calories: 580,
    preparation_time: '20 mins',
    order_index: 1
  },
  {
    id: 'item-dal-makhani',
    restaurant_id: 'rest-saffron-darbar',
    category_id: 'cat-mains',
    name: '24-Hour Slow Simmered Dal Bukhara',
    description: 'Whole black lentils, red kidney beans cooked overnight over charcoal fire with tomato reduction and unsalted white butter.',
    price: 425,
    image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    is_featured: true,
    dietary_type: 'veg',
    spice_level: 1,
    calories: 460,
    preparation_time: '10 mins',
    order_index: 2
  },
  {
    id: 'item-nalli-nihari',
    restaurant_id: 'rest-saffron-darbar',
    category_id: 'cat-mains',
    name: 'Shahi Gosht Nalli Nihari',
    description: 'Tender baby lamb shanks braised in aromatic bone-marrow jus with ginger juliennes and vetiver essence.',
    price: 645,
    image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    is_featured: true,
    dietary_type: 'non_veg',
    spice_level: 3,
    calories: 650,
    preparation_time: '25 mins',
    order_index: 3
  },
  {
    id: 'item-mutton-biryani',
    restaurant_id: 'rest-saffron-darbar',
    category_id: 'cat-biryani',
    name: 'Kolkata Style Awadhi Mutton Biryani',
    description: 'Fragrant Basmati rice cooked with succulent goat meat, golden brown baby potatoes, and meetha ittr. Served with burani raita.',
    price: 595,
    discount_price: 545,
    image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    is_featured: true,
    dietary_type: 'non_veg',
    spice_level: 2,
    calories: 680,
    preparation_time: '22 mins',
    order_index: 1
  },
  {
    id: 'item-veg-biryani',
    restaurant_id: 'rest-saffron-darbar',
    category_id: 'cat-biryani',
    name: 'Subz Nizami Handi Biryani',
    description: 'Seasonal florets, French beans, carrots, and saffron paneer tossed with aged basmati in sealed dough pot.',
    price: 445,
    image_url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    is_featured: false,
    dietary_type: 'veg',
    spice_level: 2,
    calories: 490,
    preparation_time: '18 mins',
    order_index: 2
  },
  {
    id: 'item-garlic-naan',
    restaurant_id: 'rest-saffron-darbar',
    category_id: 'cat-breads',
    name: 'Crispy Truffle & Roasted Garlic Naan',
    description: 'Leavened flatbread brushed with crushed roasted garlic, sea salt, and white truffle infused desi ghee.',
    price: 145,
    image_url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    is_featured: false,
    dietary_type: 'veg',
    spice_level: 0,
    calories: 220,
    preparation_time: '8 mins',
    order_index: 1
  },
  {
    id: 'item-shahi-tukda',
    restaurant_id: 'rest-saffron-darbar',
    category_id: 'cat-desserts',
    name: 'Zafrani Shahi Tukda with Rabri',
    description: 'Crisp ghee-fried brioche soaked in saffron cardamom syrup, smothered with thickened saffron malai and almond flakes.',
    price: 295,
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    is_featured: true,
    dietary_type: 'veg',
    spice_level: 0,
    calories: 420,
    preparation_time: '10 mins',
    order_index: 1
  },
  {
    id: 'item-kesar-pista-kulfi',
    restaurant_id: 'rest-saffron-darbar',
    category_id: 'cat-desserts',
    name: 'Matka Kesar Pista Kulfi',
    description: 'Traditional slow-reduced milk kulfi set in earthen pots with fragrant royal saffron and whole Iranian pistachios.',
    price: 245,
    image_url: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    is_featured: false,
    dietary_type: 'veg',
    spice_level: 0,
    calories: 280,
    preparation_time: '5 mins',
    order_index: 2
  },
  {
    id: 'item-gulab-sharbat',
    restaurant_id: 'rest-saffron-darbar',
    category_id: 'cat-beverages',
    name: 'Kannauj Rose Petal & Chia Cooler',
    description: 'Distilled Damascus rose essence with crushed ice, sweet basil seeds, and a dash of mountain honey.',
    price: 195,
    image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    is_featured: false,
    dietary_type: 'veg',
    spice_level: 0,
    calories: 140,
    preparation_time: '5 mins',
    order_index: 1
  },
  // The Bombay Roast & Bistro items
  {
    id: 'item-bombay-pour-over',
    restaurant_id: 'rest-bombay-cafe',
    category_id: 'cat-bombay-coffee',
    name: 'Coorg Estate V60 Pour Over',
    description: 'Light roast washed Arabica with notes of wild orange blossom, jasmine, and sugarcane sweetness.',
    price: 240,
    discount_price: 220,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    is_featured: true,
    dietary_type: 'vegan',
    spice_level: 0,
    calories: 10,
    preparation_time: '6 mins',
    order_index: 1
  },
  {
    id: 'item-bombay-flat-white',
    restaurant_id: 'rest-bombay-cafe',
    category_id: 'cat-bombay-coffee',
    name: 'Velvet Microfoam Flat White',
    description: 'Double ristretto shot with silky steamed milk and subtle caramel crema art.',
    price: 220,
    image_url: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    is_featured: false,
    dietary_type: 'veg',
    spice_level: 0,
    calories: 120,
    preparation_time: '5 mins',
    order_index: 2
  },
  {
    id: 'item-bombay-avocado-toast',
    restaurant_id: 'rest-bombay-cafe',
    category_id: 'cat-bombay-toasts',
    name: 'Hass Avocado & Danish Feta Tartine',
    description: 'Toasted seeded sourdough, smashed Haas avocados, crumbled Danish feta, pomegranate pearls, and lemon dukkah.',
    price: 380,
    discount_price: 350,
    image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    is_featured: true,
    dietary_type: 'veg',
    spice_level: 0,
    calories: 340,
    preparation_time: '10 mins',
    order_index: 1
  },
  {
    id: 'item-bombay-burrata-pizza',
    restaurant_id: 'rest-bombay-cafe',
    category_id: 'cat-bombay-pizzas',
    name: 'Truffle Burrata & San Marzano Pizza',
    description: 'Whole Pugliese burrata center, San Marzano tomato coulis, wild rocket, basil oil, and white truffle glaze.',
    price: 620,
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    is_featured: true,
    dietary_type: 'veg',
    spice_level: 0,
    calories: 680,
    preparation_time: '15 mins',
    order_index: 1
  },
  {
    id: 'item-bombay-croissant',
    restaurant_id: 'rest-bombay-cafe',
    category_id: 'cat-bombay-desserts',
    name: 'Double Baked Almond & Frangipane Croissant',
    description: 'Golden flaky French butter pastry stuffed with almond cream, toasted flakes, and vanilla snow.',
    price: 260,
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    is_available: true,
    is_featured: false,
    dietary_type: 'egg',
    spice_level: 0,
    calories: 390,
    preparation_time: '5 mins',
    order_index: 1
  }
];

export const DEMO_SETTINGS: RestaurantTemplateSettings = {
  restaurant_id: 'rest-saffron-darbar',
  template_id: 'tpl-10', // Luxury Black Gold by default for demonstration
  accent_color: '#f59e0b',
  font_family: 'Plus Jakarta Sans',
  card_style: 'luxury',
  show_photos: true,
  show_dietary_badges: true,
  show_spice_level: true,
  show_prices: true,
  opening_animation_enabled: true,
  opening_animation_style: 'luxury_particles',
  opening_animation_duration: 1.8,
  opening_animation_tagline: 'Experience Royal Awadhi Gastronomy',
  opening_animation_skip_button: true,
  opening_animation_sound: false
};

export const DEMO_SUBSCRIPTION: Subscription = {
  id: 'sub-saffron-1',
  restaurant_id: 'rest-saffron-darbar',
  plan_id: 'plan-premium',
  status: 'active',
  billing_cycle: 'yearly',
  current_period_start: new Date(Date.now() - 30 * 86400000).toISOString(),
  current_period_end: new Date(Date.now() + 335 * 86400000).toISOString(),
  auto_renew: true,
  plan: DEFAULT_PLANS[1]
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
  ANALYTICS: 'smartqr_analytics'
};

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
  const all: Record<string, RestaurantTemplateSettings> = data ? JSON.parse(data) : { [DEMO_SETTINGS.restaurant_id]: DEMO_SETTINGS };
  if (all[restaurantId]) return all[restaurantId];
  
  if (restaurantId === 'rest-bombay-cafe') {
    return {
      restaurant_id: 'rest-bombay-cafe',
      template_id: 'tpl-8', // Colorful Cafe
      accent_color: '#ea580c',
      font_family: 'Outfit',
      card_style: 'modern',
      show_photos: true,
      show_dietary_badges: true,
      show_spice_level: true,
      show_prices: true,
      opening_animation_enabled: true,
      opening_animation_style: 'gold_glow',
      opening_animation_duration: 1.6,
      opening_animation_tagline: 'Freshly Brewed & Artisanal Bakes',
      opening_animation_skip_button: true,
      opening_animation_sound: false
    };
  }

  return { ...DEMO_SETTINGS, restaurant_id: restaurantId };
};

export const saveStoredSettings = (settings: RestaurantTemplateSettings) => {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  const all = data ? JSON.parse(data) : {};
  all[settings.restaurant_id] = settings;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(all));
};

export const getStoredSubscription = (restaurantId: string): Subscription => {
  const data = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
  const all: Record<string, Subscription> = data ? JSON.parse(data) : { [DEMO_SUBSCRIPTION.restaurant_id]: DEMO_SUBSCRIPTION };
  if (all[restaurantId]) {
    const plans = getStoredPlans();
    const plan = plans.find(p => p.id === all[restaurantId].plan_id) || DEFAULT_PLANS[0];
    return { ...all[restaurantId], plan };
  }
  return {
    id: `sub-${restaurantId}`,
    restaurant_id: restaurantId,
    plan_id: 'plan-basic',
    status: 'active',
    billing_cycle: 'monthly',
    current_period_start: new Date().toISOString(),
    current_period_end: new Date(Date.now() + 365 * 86400000).toISOString(),
    auto_renew: true,
    plan: DEFAULT_PLANS[0]
  };
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
