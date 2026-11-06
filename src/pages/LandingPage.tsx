import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlan } from '@/context/PlanContext';
import { useAuth } from '@/context/AuthContext';
import { 
  QrCode, 
  Smartphone, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Store, 
  ShieldCheck, 
  Crown, 
  Palette, 
  Zap, 
  Globe, 
  ChevronRight,
  Utensils,
  Play,
  CreditCard,
  Eye,
  EyeOff
} from 'lucide-react';
import { ALL_TEMPLATES } from '@/lib/supabase';
import { useRestaurant } from '@/context/RestaurantContext';
import { LandingPageMasterpiece } from './LandingPageMasterpiece';
import { ConceptSensoryLuxury } from './landing/ConceptSensoryLuxury';
import { ConceptMotionLive } from './landing/ConceptMotionLive';
import { ConceptCyberGlass } from './landing/ConceptCyberGlass';
import { ConceptRoyalGold } from './landing/ConceptRoyalGold';
import { ConceptKitchenPulse } from './landing/ConceptKitchenPulse';

export const LandingPage: React.FC = () => {
  const { plans } = usePlan();
  const { login, register, isAuthenticated } = useAuth();
  const { addRestaurant } = useRestaurant();
  const navigate = useNavigate();

  const [activeConcept, setActiveConcept] = useState<'masterpiece' | 'sensory' | 'live' | 'cyber' | 'royal' | 'kitchen' | 'classic'>('masterpiece');
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const basicPlan = plans.find(p => p.code === 'basic') || plans[0];
  const premiumPlan = plans.find(p => p.code === 'premium') || plans[1];

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (authMode === 'register') {
      const registeredUser = await register(email, name || 'Restaurant Owner');
      const restName = name.trim() || 'My Restaurant';
      const cleanSlug = restName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `restaurant-${Date.now()}`;
      addRestaurant({
        owner_id: registeredUser.id,
        name: restName,
        slug: cleanSlug,
        tagline: 'Authentic Dining & Crafted Menus',
        description: 'Welcome to our digital menu. Explore freshly prepared culinary specials and order right from your table.',
        phone: '+91 98765 43210',
        email: registeredUser.email,
        address: 'Main Street, City Center',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        currency: 'INR',
        logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
        banner_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        opening_time: '11:00 AM',
        closing_time: '11:00 PM',
        whatsapp_number: '919876543210',
        upi_id: `${cleanSlug}@upi`,
        enable_ordering: true,
        enable_upi: true,
        enable_reviews: true,
        is_active: true,
        is_pure_veg: false,
      });
    } else {
      await login(email);
    }
    setPassword('');
    setIsAuthModalOpen(false);
    navigate('/dashboard');
  };

  const conceptSwitcher = showSwitcher ? (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] max-w-[95vw] overflow-x-auto">
      <div className="bg-[#111412]/95 backdrop-blur-xl border border-white/20 p-1.5 rounded-full shadow-2xl flex items-center gap-1">
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-white/80 pl-3 pr-2 whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-300" />
          Select Design:
        </span>
        <button
          onClick={() => setActiveConcept('masterpiece')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeConcept === 'masterpiece'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg scale-105 font-black'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
          👑 Final Masterpiece (Your 2 Photos)
        </button>
        <button
          onClick={() => setActiveConcept('sensory')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
            activeConcept === 'sensory'
              ? 'bg-white text-slate-900 shadow-md font-bold'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          🌿 Atelier Minimal
        </button>
        <button
          onClick={() => setActiveConcept('live')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
            activeConcept === 'live'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
        >
          Kinetic Live ⚡
        </button>
        <button
          onClick={() => setActiveConcept('classic')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
            activeConcept === 'classic'
              ? 'bg-slate-700 text-white'
              : 'text-white/40 hover:text-white hover:bg-white/10'
          }`}
        >
          Classic
        </button>
        <button
          onClick={() => setShowSwitcher(false)}
          className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white ml-1 text-xs"
          title="Close switcher"
        >
          ✕
        </button>
      </div>
    </div>
  ) : (
    <button
      onClick={() => setShowSwitcher(true)}
      className="fixed bottom-4 right-4 z-[90] px-3.5 py-2 rounded-full bg-black/60 hover:bg-black/90 text-white/60 hover:text-white border border-white/15 backdrop-blur-xl text-xs font-mono tracking-wider flex items-center gap-1.5 shadow-2xl transition"
    >
      <Palette className="w-3.5 h-3.5 text-amber-400" />
      <span>Theme Variations</span>
    </button>
  );

  if (activeConcept === 'masterpiece') {
    return (
      <div className="relative">
        {conceptSwitcher}
        <LandingPageMasterpiece />
      </div>
    );
  }

  if (activeConcept === 'sensory') {
    return (
      <div className="relative pt-12">
        {conceptSwitcher}
        <ConceptSensoryLuxury onOpenAuth={(mode) => { setAuthMode(mode); setIsAuthModalOpen(true); }} />
      </div>
    );
  }

  if (activeConcept === 'live') {
    return (
      <div className="relative pt-12">
        {conceptSwitcher}
        <ConceptMotionLive onOpenAuth={(mode) => { setAuthMode(mode); setIsAuthModalOpen(true); }} />
      </div>
    );
  }

  if (activeConcept === 'cyber') {
    return (
      <div className="relative pt-12">
        {conceptSwitcher}
        <ConceptCyberGlass />
      </div>
    );
  }

  if (activeConcept === 'royal') {
    return (
      <div className="relative pt-12">
        {conceptSwitcher}
        <ConceptRoyalGold />
      </div>
    );
  }

  if (activeConcept === 'kitchen') {
    return (
      <div className="relative pt-12">
        {conceptSwitcher}
        <ConceptKitchenPulse />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pt-12">
      {conceptSwitcher}
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-emerald-500/20">
              QR
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight block leading-none">SmartQR Menu</span>
              <span className="text-[10px] text-emerald-400 font-mono tracking-wider">INDIA'S PREMIER QR SAAS</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#templates" className="hover:text-white transition">15 Templates</a>
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="#pricing" className="hover:text-white transition">Pricing (₹ INR)</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <span>Owner Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20"
                >
                  Create Free Menu
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-emerald-500/15 via-teal-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored for Restaurants, Cafes & Fine Dining in India</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Turn Dining Tables Into Instant{' '}
              <span className="text-emerald-400">
                Digital Menus
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Give your diners a blistering-fast, mobile-first menu with 15 unique luxury aesthetics, FSSAI dietary badges, multi-language switching, and permanent table QR codes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => {
                  setAuthMode('register');
                  setIsAuthModalOpen(true);
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition"
              >
                <span>Launch Restaurant Menu Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="/menu/saffron-darbar"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-800 flex items-center justify-center gap-2 transition"
              >
                <Play className="w-4 h-4 text-emerald-400 fill-current" />
                <span>Experience Demo Diner Menu</span>
              </a>
            </div>

            {/* Micro Social Proof */}
            <div className="pt-6 border-t border-slate-900 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero App Download for Guests</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Permanent QR Never Breaks</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>FSSAI Veg/Non-Veg Standards</span>
              </div>
            </div>
          </div>

          {/* Interactive Hero Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px]">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-[50px] blur-xl opacity-30" />
              <div className="relative bg-slate-950 rounded-[48px] border-4 border-slate-800 shadow-2xl p-4 overflow-hidden">
                {/* Mock Phone Notch */}
                <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-4" />

                {/* Mini Mock Screen */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">Royal Mughlai</span>
                      <h4 className="text-sm font-bold text-white">Saffron Heritage Darbar</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                      Table 4
                    </span>
                  </div>

                  {/* Sample Mock Dish Item */}
                  <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="badge-fssai-nonveg" />
                        <span className="text-xs font-bold text-white">Awadhi Galouti Kebab</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-300">₹495</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Smoked minced mutton with 32 hand-ground royal spices.
                    </p>
                  </div>

                  <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="badge-fssai-veg" />
                        <span className="text-xs font-bold text-white">Angari Malai Paneer</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400">₹395</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Cottage cheese marinated in clotted cream & saffron.
                    </p>
                  </div>

                  <div className="pt-2 text-center">
                    <a
                      href="/menu/saffron-darbar"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition"
                    >
                      Open Live Mobile Menu ➔
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15 TEMPLATES SHOWCASE */}
      <section id="templates" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold">
            <Palette className="w-3.5 h-3.5" /> 15 DISTINCT DESIGNS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Not Just Different Colors. 15 Handcrafted Layouts.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            From classic printed menus and minimalist white cards to opulent black-and-gold luxury and frosted glassmorphism.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-slate-900/60 rounded-3xl overflow-hidden border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between group shadow-xl"
            >
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img
                  src={tpl.thumbnail_url}
                  alt={tpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    tpl.tier === 'premium_plus'
                      ? 'bg-amber-500 text-slate-950'
                      : tpl.tier === 'premium'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tpl.tier.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{tpl.name}</h3>
                  <span className="text-[11px] text-slate-400 font-medium">{tpl.vibe}</span>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{tpl.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900 bg-slate-950/40">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
            Simple 4-Step Onboarding
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            From Register to Printed QR in 5 Minutes
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Register Restaurant', desc: 'Create your account and set your restaurant name, address, and FSSAI license.' },
            { step: '02', title: 'Add Dishes & Photos', desc: 'Organize starters, mains, and desserts with prices and dietary veg/non-veg tags.' },
            { step: '03', title: 'Pick A Theme', desc: 'Choose from 15 distinct responsive templates matching your restaurant vibe.' },
            { step: '04', title: 'Download & Print QR', desc: 'Print tabletop standees. Your permanent QR code never needs reprinting!' }
          ].map((st, i) => (
            <div key={i} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-2xl font-black font-mono text-emerald-400 block">{st.step}</span>
              <h3 className="font-bold text-base text-white">{st.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DYNAMIC PRICING SECTION */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
            <CreditCard className="w-3.5 h-3.5" /> TRANSPARENT INDIAN PRICING
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Fair Pricing in Indian Rupees (₹)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Start completely free. Upgrade anytime via Razorpay UPI, NetBanking, or Cards.
          </p>

          {/* Billing Switcher */}
          <div className="pt-4 flex items-center justify-center">
            <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                  billingCycle === 'monthly' ? 'bg-slate-800 text-white' : 'text-slate-400'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-1.5 ${
                  billingCycle === 'yearly' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                }`}
              >
                <span>Yearly Billing</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-extrabold">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards: Both Plans in One Frame */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* BASIC PLAN */}
          <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Standard Tier</span>
              <h3 className="text-2xl font-bold text-white">{basicPlan?.name || 'Basic Plan'}</h3>
              
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-baseline justify-between pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Rate</span>
                    <span className="text-2xl font-black text-white">₹{basicPlan?.monthly_price || 399}</span>
                    <span className="text-xs text-slate-400"> / month</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Billed monthly</span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] uppercase font-bold text-amber-300 block">Yearly Rate</span>
                      <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1 rounded">Save 25%</span>
                    </div>
                    <span className="text-2xl font-black text-amber-300">₹{Math.round((basicPlan?.yearly_price || 3590) / 12)}</span>
                    <span className="text-xs text-slate-400"> / mo</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">₹{(basicPlan?.yearly_price || 3590).toLocaleString('en-IN')}</span>
                    <span className="text-[9px] text-slate-500 block">billed annually</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                {basicPlan?.description || 'Essential contactless QR menu for food stalls, tea cafes, and modern diners.'}
              </p>

              <div className="pt-4 border-t border-slate-800 space-y-2.5">
                {[
                  'Permanent Restaurant QR code & Standee',
                  '5 Responsive Menu Templates',
                  'High-res food photography uploads',
                  'FSSAI Veg, Non-Veg, Jain & Vegan badges',
                  'Multi-language menu translations',
                  'Up to 100 food items & 15 categories'
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setAuthMode('register');
                setIsAuthModalOpen(true);
              }}
              className="mt-8 w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition text-center border border-slate-700"
            >
              Get Started with Basic
            </button>
          </div>

          {/* PREMIUM LUXURY PLAN */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 p-8 rounded-3xl border-2 border-amber-500 shadow-2xl flex flex-col justify-between relative ring-1 ring-amber-500/30">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-full shadow-md flex items-center gap-1">
              <Crown className="w-3 h-3" />
              <span>Most Popular &bull; Full Suite</span>
            </div>

            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">All-Inclusive Luxury</span>
              <h3 className="text-2xl font-bold text-white">{premiumPlan?.name || 'Premium Luxury Plan'}</h3>
              
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-2">
                <div className="flex items-baseline justify-between pb-2 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Rate</span>
                    <span className="text-2xl font-black text-white">₹{premiumPlan?.monthly_price || 999}</span>
                    <span className="text-xs text-slate-400"> / month</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Billed monthly</span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] uppercase font-bold text-amber-300 block">Yearly Rate</span>
                      <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1 rounded">Save 25%</span>
                    </div>
                    <span className="text-2xl font-black text-amber-300">₹{Math.round((premiumPlan?.yearly_price || 8990) / 12)}</span>
                    <span className="text-xs text-slate-400"> / mo</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">₹{(premiumPlan?.yearly_price || 8990).toLocaleString('en-IN')}</span>
                    <span className="text-[9px] text-slate-500 block">billed annually</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                {premiumPlan?.description || 'The complete suite for high-volume restaurants, fine dining, and franchise brands.'}
              </p>

              <div className="pt-4 border-t border-slate-800 space-y-2.5">
                {[
                  'Access to ALL 15 Luxury & Glassmorphism Templates',
                  'Instant QR Scan Opening Intro Animation (Royal Glow & Particles)',
                  'Custom QR Studio (Center Logo & Monogram Badges)',
                  'Tabletop Ordering Cart & Instant UPI QR Payments',
                  'Excel / CSV Bulk Menu Import & Instant Export',
                  '100% White-Label: Remove all SmartQR SaaS branding',
                  'Google 5-Star Review Booster & Waiter Notifications'
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setAuthMode('register');
                setIsAuthModalOpen(true);
              }}
              className="mt-8 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition shadow-lg shadow-amber-500/25 text-center"
            >
              Choose Premium Luxury
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-900 text-center text-xs text-slate-500 space-y-3">
        <p>© 2026 SmartQR Menu SaaS. Handcrafted for the Food & Beverage Industry in India.</p>
        <p>Supports UPI, RuPay, Visa, Mastercard, and NetBanking via Razorpay.</p>
      </footer>

      {/* Auth Modal (Login / Register) */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">
                {authMode === 'register' ? 'Register Restaurant' : 'Sign In to SmartQR'}
              </h3>
              <button onClick={() => setIsAuthModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Malhotra"
                    className="w-full px-3.5 py-2.5 bg-slate-950 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@saffrondarbar.in"
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-300">Password *</label>
                  {password && (
                    <button
                      type="button"
                      onClick={() => setPassword('')}
                      className="text-[10px] text-slate-500 hover:text-slate-300"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={authMode === 'register' ? 'Create a secure password' : 'Enter your password'}
                    autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                    className="w-full px-3.5 py-2.5 bg-slate-950 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition"
              >
                {authMode === 'register' ? 'Create Account & Start' : 'Sign In'}
              </button>
            </form>

            <div className="text-center pt-2 text-xs text-slate-400">
              {authMode === 'register' ? (
                <span>
                  Already registered?{' '}
                  <button onClick={() => setAuthMode('login')} className="text-emerald-400 font-bold hover:underline">
                    Sign in here
                  </button>
                </span>
              ) : (
                <span>
                  New to SmartQR?{' '}
                  <button onClick={() => setAuthMode('register')} className="text-emerald-400 font-bold hover:underline">
                    Create free account
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
