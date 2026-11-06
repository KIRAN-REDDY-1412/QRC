import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  Restaurant, 
  MenuCategory, 
  MenuItem, 
  RestaurantTemplateSettings, 
  DietaryType,
  CartItem 
} from '@/types';
import { 
  getStoredRestaurants, 
  getStoredCategories, 
  getStoredItems, 
  getStoredSettings, 
  ALL_TEMPLATES, 
  recordScanEvent,
  getStoredSubscription
} from '@/lib/supabase';
import { TemplateRenderer } from '@/templates/TemplateRenderer';
import { MenuCartDrawer } from '@/components/menu/MenuCartDrawer';
import { UpiPaymentModal } from '@/components/menu/UpiPaymentModal';
import { GoogleReviewBooster } from '@/components/menu/GoogleReviewBooster';
import { OpeningExperienceOverlay } from '@/components/menu/OpeningExperienceOverlay';
import { 
  Search, 
  Globe, 
  Utensils, 
  AlertCircle, 
  PowerOff, 
  Phone, 
  MapPin, 
  RefreshCw,
  ShoppingBag,
  Bell,
  CreditCard,
  Plus,
  Check,
  Sparkles,
  Crown,
  X,
  MessageSquare
} from 'lucide-react';

export const CustomerMenu: React.FC = () => {
  const { restaurantSlug } = useParams<{ restaurantSlug: string }>();
  const [searchParams] = useSearchParams();
  const tableParam = searchParams.get('table');
  const tableLabel = tableParam ? `Table ${tableParam}` : 'Table 1';

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<RestaurantTemplateSettings | null>(null);
  const [templateCode, setTemplateCode] = useState<string>('classic_menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryType | 'all'>('all');
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showSaasBranding, setShowSaasBranding] = useState<boolean>(true);

  // Instant Opening Animation Experience State
  const [showOpeningAnimation, setShowOpeningAnimation] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('replay_intro') === 'true') return true;
    if (urlParams.get('skip_intro') === 'true') return false;
    const sessionKey = `smartqr_intro_seen_${restaurantSlug?.toLowerCase()}`;
    return sessionStorage.getItem(sessionKey) !== 'true';
  });

  // Premium Plus Feature Gating
  const [isPremiumPlus, setIsPremiumPlus] = useState<boolean>(false);

  // Cart & Ordering States (WhatsApp Food Ordering)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState<boolean>(false);
  const [isDishPickerOpen, setIsDishPickerOpen] = useState<boolean>(false);
  const [waiterToast, setWaiterToast] = useState<string | null>(null);

  useEffect(() => {
    loadMenu();
  }, [restaurantSlug]);

  const loadMenu = () => {
    setIsLoading(true);
    setError(null);

    const allRestaurants = getStoredRestaurants();
    const found = allRestaurants.find(r => r.slug.toLowerCase() === restaurantSlug?.toLowerCase());

    if (!found) {
      setError(`Restaurant "${restaurantSlug}" could not be found.`);
      setIsLoading(false);
      return;
    }

    setRestaurant(found);

    // If restaurant is deactivated and not an admin preview, show inactive screen
    const isPreview = searchParams.get('preview') === 'true';
    if (!found.is_active && !isPreview) {
      setIsLoading(false);
      return;
    }

    // Check if 7-day trial has concluded without paid subscription
    const sub = getStoredSubscription(found.id);
    const isTrialExpired = sub.status === 'expired' || 
      ((sub.is_trial || sub.status === 'trialing') && new Date(sub.trial_ends_at || sub.current_period_end).getTime() <= Date.now());

    if (isTrialExpired && !isPreview) {
      setError(`This restaurant's digital menu is temporarily unavailable. The 7-day free trial has concluded and subscription renewal is pending.`);
      setIsLoading(false);
      return;
    }

    const loadedCats = getStoredCategories(found.id);
    const loadedItems = getStoredItems(found.id);
    const loadedSettings = getStoredSettings(found.id);

    setCategories(loadedCats);
    setItems(loadedItems);
    setSettings(loadedSettings);

    // Resolve template code
    const tpl = ALL_TEMPLATES.find(t => t.id === loadedSettings.template_id);
    setTemplateCode(tpl ? tpl.code : 'classic_menu');

    // Check SaaS subscription branding and tier
    setShowSaasBranding(!sub.plan?.remove_saas_branding);
    setIsPremiumPlus(sub.plan?.code === 'premium_plus');

    // Record scan event
    recordScanEvent(found.id, 'qr_scan');

    setIsLoading(false);
  };

  // Cart Operations
  const handleAddToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const match = prev.find(ci => ci.item.id === item.id);
      if (match) {
        return prev.map(ci => ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(ci => {
        if (ci.item.id === itemId) {
          const newQty = ci.quantity + delta;
          return newQty > 0 ? { ...ci, quantity: newQty } : null;
        }
        return ci;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(ci => ci.item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCallWaiter = (serviceType: string = 'Assistance') => {
    setWaiterToast(`Staff notified: ${serviceType} requested for ${tableLabel}!`);
    setTimeout(() => setWaiterToast(null), 3500);
  };

  const handleOpeningAnimationComplete = () => {
    setShowOpeningAnimation(false);
    if (restaurantSlug) {
      sessionStorage.setItem(`smartqr_intro_seen_${restaurantSlug.toLowerCase()}`, 'true');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-lg font-bold tracking-wide">Opening Menu...</p>
        <p className="text-xs text-slate-400 mt-1">Connecting to kitchen & daily specials</p>
      </div>
    );
  }

  if (error || !restaurant || !settings) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center text-slate-800">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold">Restaurant Menu Not Found</h1>
        <p className="text-sm text-slate-500 mt-2 max-w-sm">{error || "Please verify the QR code URL."}</p>
        <a 
          href="/" 
          className="mt-6 px-6 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition"
        >
          Return to SmartQR Home
        </a>
      </div>
    );
  }

  if (restaurant && !restaurant.is_active && searchParams.get('preview') !== 'true') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-100">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-5 shadow-2xl">
          <PowerOff className="w-10 h-10" />
        </div>
        <span className="text-[11px] font-mono uppercase tracking-widest text-rose-400 font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 mb-3">
          Menu Temporarily Offline
        </span>
        <h1 className="text-2xl font-black text-white">{restaurant.name}</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-sm">
          This restaurant's digital menu has been deactivated or paused by administration. Please ask your server or check back soon.
        </p>

        {(restaurant.address || restaurant.phone) && (
          <div className="mt-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1.5 max-w-xs text-left">
            {restaurant.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                <span>{restaurant.address}, {restaurant.city}</span>
              </div>
            )}
            {restaurant.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <span>{restaurant.phone}</span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={loadMenu}
          className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Menu Status</span>
        </button>
      </div>
    );
  }

  const cartTotalAmount = cartItems.reduce((acc, ci) => acc + (ci.item.price * ci.quantity), 0);
  const totalCartCount = cartItems.reduce((acc, ci) => acc + ci.quantity, 0);

  return (
    <div className="relative min-h-screen selection:bg-emerald-500 selection:text-white pb-32">
      {/* Instant QR Scan Opening Animation Experience Overlay */}
      {showOpeningAnimation && restaurant && settings?.opening_animation_enabled !== false && (
        <OpeningExperienceOverlay
          restaurant={restaurant}
          animationStyle={settings?.opening_animation_style || 'gold_glow'}
          duration={settings?.opening_animation_duration || 1.8}
          tagline={settings?.opening_animation_tagline}
          showSkipButton={settings?.opening_animation_skip_button ?? true}
          soundEnabled={settings?.opening_animation_sound ?? false}
          tableLabel={tableLabel}
          isPreview={searchParams.get('preview') === 'true'}
          onComplete={handleOpeningAnimationComplete}
        />
      )}

      {/* Toast Alert for Waiter Call */}
      {waiterToast && (
        <div className="fixed top-4 inset-x-4 max-w-md mx-auto z-50 bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-4">
          <Bell className="w-4 h-4 text-emerald-400 animate-bounce flex-shrink-0" />
          <span className="text-xs font-bold">{waiterToast}</span>
        </div>
      )}

      {/* Search Header Overlay */}
      {isSearchOpen && (
        <div className="fixed top-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur-md p-4 shadow-xl border-b border-slate-700 animate-in fade-in slide-in-from-top-2">
          <div className="max-w-md mx-auto flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes, ingredients..."
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 bg-slate-800 text-white placeholder-slate-400 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchQuery('');
              }}
              className="px-3 py-2 text-xs font-bold text-slate-300 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Template Rendering */}
      <TemplateRenderer
        templateCode={templateCode}
        restaurant={restaurant}
        categories={categories}
        items={items}
        settings={settings}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        dietaryFilter={dietaryFilter}
        currentLanguage={currentLanguage}
        tableNumber={tableLabel}
      />

      {/* FEATURE 5: Google Review Booster (Premium Plus Only) */}
      {isPremiumPlus && (
        <div className="max-w-md mx-auto px-4 mt-6">
          <GoogleReviewBooster restaurant={restaurant} />
        </div>
      )}

      {/* Floating Action Controls Deck */}
      <div className="fixed bottom-4 inset-x-4 max-w-md mx-auto z-40 space-y-2">
        {/* Floating WhatsApp Cart Bar (When Items in Cart) */}
        {cartItems.length > 0 && (
          <div
            onClick={() => setIsCartOpen(true)}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-[#25D366] via-[#1fb855] to-[#128C7E] hover:opacity-95 text-white shadow-2xl shadow-emerald-500/35 flex items-center justify-between cursor-pointer transition transform active:scale-95 animate-in slide-in-from-bottom-2 border border-emerald-400/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black/25 flex items-center justify-center font-black text-xs">
                {totalCartCount}
              </div>
              <div>
                <span className="font-extrabold text-xs block leading-tight">View Your Order</span>
                <span className="text-[10px] text-emerald-100 font-medium">Tap to review & order on WhatsApp</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-black text-sm">₹{cartTotalAmount}</span>
              <span className="text-[10px] bg-black/25 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
                <MessageSquare className="w-3 h-3 fill-white" />
                <span>Order via WhatsApp &rarr;</span>
              </span>
            </div>
          </div>
        )}

        {/* Bottom Floating Navigation Toolbar */}
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 p-2 rounded-2xl shadow-2xl flex items-center justify-between gap-1 text-white">
          {/* Quick Veg Filter Toggle */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl">
            <button
              onClick={() => setDietaryFilter('all')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                dietaryFilter === 'all' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDietaryFilter(dietaryFilter === 'veg' ? 'all' : 'veg')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                dietaryFilter === 'veg' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              <span className="badge-fssai-veg" />
              <span>Veg</span>
            </button>
            <button
              onClick={() => setDietaryFilter(dietaryFilter === 'non_veg' ? 'all' : 'non_veg')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                dietaryFilter === 'non_veg' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              <span className="badge-fssai-nonveg" />
              <span>Non-Veg</span>
            </button>
          </div>

          {/* Quick Actions (WhatsApp Order / Waiter / UPI / Search) */}
          <div className="flex items-center gap-1.5">
            {/* Direct WhatsApp Food Ordering Button */}
            <button
              onClick={() => {
                if (cartItems.length > 0) {
                  setIsCartOpen(true);
                } else {
                  setIsDishPickerOpen(true);
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba5a] hover:to-[#0f7a6c] text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-md shadow-emerald-600/30 whitespace-nowrap active:scale-95"
              title="Order food through WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>{cartItems.length > 0 ? `Cart (${totalCartCount})` : 'Order Food'}</span>
            </button>

            {/* Call Waiter */}
            <button
              onClick={() => handleCallWaiter('Assistance')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Call Waiter"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Pay Bill via UPI */}
            <button
              onClick={() => setIsUpiModalOpen(true)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition"
              title="Request Bill & Pay via UPI"
            >
              <CreditCard className="w-4 h-4" />
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Search menu"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setCurrentLanguage(currentLanguage === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{currentLanguage === 'en' ? 'EN' : 'हि'}</span>
            </button>
          </div>
        </div>

        {/* SmartQR SaaS Branding */}
        {showSaasBranding && (
          <div className="text-center mt-2">
            <a 
              href="/" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-sans text-slate-400 hover:text-slate-200 transition bg-black/40 backdrop-blur px-2.5 py-0.5 rounded-full"
            >
              <Utensils className="w-3 h-3 text-emerald-400" /> Powered by <span className="font-bold text-white">SmartQR Menu</span>
            </a>
          </div>
        )}
      </div>

      {/* MODAL: QUICK ADD DISH SHEET (FEATURE 1) */}
      {isDishPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="relative bg-slate-950 border border-slate-800 rounded-t-[32px] sm:rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6">
            <div className="p-4 px-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <h3 className="font-extrabold text-base text-white">Add Dishes to Table Order</h3>
                <p className="text-xs text-slate-400">Tap "+ Add" to include in your kitchen order</p>
              </div>
              <button
                onClick={() => setIsDishPickerOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar divide-y divide-slate-800/80">
              {items.map(item => {
                const inCart = cartItems.find(ci => ci.item.id === item.id);
                return (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 flex-shrink-0">
                          <Utensils className="w-5 h-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-white truncate">{item.name}</h4>
                        <span className="font-bold text-xs text-amber-400">₹{item.price}</span>
                      </div>
                    </div>

                    <div>
                      {inCart ? (
                        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="w-5 text-center text-xs font-bold text-white">{inCart.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">{totalCartCount} dishes in cart</span>
                <span className="font-black text-sm text-white">₹{cartTotalAmount}</span>
              </div>
              <button
                onClick={() => {
                  setIsDishPickerOpen(false);
                  setIsCartOpen(true);
                }}
                disabled={cartItems.length === 0}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-extrabold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Review Order &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TABLE CART DRAWER (FEATURE 1) */}
      <MenuCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        restaurant={restaurant}
        tableNumber={tableLabel}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenUpiPayment={() => setIsUpiModalOpen(true)}
      />


      {/* MODAL: UPI INSTANT PAYMENT (FEATURE 3) */}
      <UpiPaymentModal
        isOpen={isUpiModalOpen}
        onClose={() => setIsUpiModalOpen(false)}
        restaurantName={restaurant.name}
        upiId={restaurant.upi_id || 'saffrondarbar@okaxis'}
        totalAmount={cartTotalAmount > 0 ? (cartTotalAmount * 1.05) : 850}
        tableNumber={tableLabel}
        onPaymentSuccess={() => {
          handleClearCart();
          setIsCartOpen(false);
        }}
      />
    </div>
  );
};