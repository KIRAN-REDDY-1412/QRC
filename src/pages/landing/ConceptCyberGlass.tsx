import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  QrCode, 
  Smartphone, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Zap, 
  Globe, 
  CreditCard, 
  Utensils, 
  Play, 
  Layers,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  Clock,
  Star
} from 'lucide-react';
import { ALL_TEMPLATES } from '@/lib/supabase';

interface ConceptProps {
  onSelectConcept?: (name: string) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const ConceptCyberGlass: React.FC<ConceptProps> = ({ onSelectConcept, onOpenAuth }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isScanning, setIsScanning] = useState(false);
  const [phoneMenuState, setPhoneMenuState] = useState<'qr' | 'dishes'>('dishes');
  const [selectedTemplateTier, setSelectedTemplateTier] = useState<'all' | 'free' | 'premium' | 'premium_plus'>('all');

  // Interactive 3D tilt calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // tilt range
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    setMousePos({ x, y });
  };

  const handleResetTilt = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setPhoneMenuState(prev => prev === 'qr' ? 'dishes' : 'qr');
    }, 1200);
  };

  const filteredTemplates = ALL_TEMPLATES.filter(t => 
    selectedTemplateTier === 'all' ? true : t.tier === selectedTemplateTier
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background Animated Neon Mesh Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-indigo-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Live Floor Ticker */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Next-Gen Motion QR Platform for Modern Indian Dining</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Turn Diners' Phones Into <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                A 3D Interactive Feasting Experience.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Eliminate faded paper menus forever. Offer lightning-fast QR scanning, WhatsApp kitchen dispatch, instant tabletop UPI payment, and 15 handcrafted visual themes designed for India.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button 
                onClick={() => onOpenAuth ? onOpenAuth('register') : null}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-xl shadow-emerald-500/25 transform active:scale-95"
              >
                <span>Launch Your Free Menu Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={handleSimulateScan}
                className="px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-700/80 transition flex items-center gap-2 backdrop-blur-md"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Simulate Phone Scan</span>
              </button>
            </div>

            {/* Live Floor Activity Ticker */}
            <div className="pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2 mb-2 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Live Dining Floor Stream</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-2 backdrop-blur-sm">
                  <span className="text-emerald-400 font-bold">Table 4</span>
                  <span className="text-slate-300">ordered 2x Galouti Kebab</span>
                  <span className="text-[10px] text-slate-500 font-mono ml-auto">12s ago</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-2 backdrop-blur-sm">
                  <span className="text-amber-400 font-bold">Table 7</span>
                  <span className="text-slate-300">paid ₹1,850 via UPI</span>
                  <span className="text-[10px] text-slate-500 font-mono ml-auto">45s ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Tilting Phone Mockup with Interactive Scanner */}
          <div 
            className="lg:col-span-5 flex justify-center perspective-[1200px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleResetTilt}
          >
            <div 
              className="relative w-full max-w-[340px] h-[640px] bg-slate-950 rounded-[48px] border-[8px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(16,185,129,0.3)] transition-transform duration-200 ease-out flex flex-col overflow-hidden ring-1 ring-emerald-500/20"
              style={{
                transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`
              }}
            >
              {/* Phone Speaker Notch */}
              <div className="w-full bg-slate-950 py-2 flex justify-center sticky top-0 z-30">
                <div className="w-24 h-4 bg-slate-800 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-950 mr-2" />
                  <div className="w-3 h-1 bg-slate-900 rounded-full" />
                </div>
              </div>

              {/* Scanning Laser Beam Overlay */}
              {isScanning && (
                <div className="absolute inset-0 z-40 bg-emerald-500/10 pointer-events-none flex flex-col justify-start">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-[bounce_1.2s_infinite]" />
                </div>
              )}

              {/* Phone Screen Content */}
              <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-4 bg-slate-950">
                {phoneMenuState === 'qr' ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-48 h-48 mx-auto p-4 rounded-3xl bg-white shadow-2xl relative">
                      <div className="w-full h-full border-2 border-slate-900 rounded-2xl flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-slate-900" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Table 3 • Saffron Darbar</h4>
                      <p className="text-[11px] text-slate-400 mt-1">Tap below to scan and open menu</p>
                    </div>
                    <button
                      onClick={handleSimulateScan}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                    >
                      Scan QR Code
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Header in Phone */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">TABLE 3 • DINE-IN</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">Pure Veg & Non-Veg</span>
                      </div>
                      <h3 className="font-black text-white text-lg leading-tight">Saffron Heritage Darbar</h3>
                      <p className="text-[10px] text-slate-400">Royal Awadhi & Mughlai Cuisine</p>
                    </div>

                    {/* Category Pills in Phone */}
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
                      <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-full whitespace-nowrap">Starters (8)</span>
                      <span className="px-3 py-1 bg-slate-900 text-slate-400 rounded-full whitespace-nowrap">Mains</span>
                      <span className="px-3 py-1 bg-slate-900 text-slate-400 rounded-full whitespace-nowrap">Dum Biryani</span>
                    </div>

                    {/* Sample Dishes in Phone */}
                    <div className="space-y-2">
                      <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between gap-3 shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80" 
                          alt="" 
                          className="w-14 h-14 rounded-xl object-cover" 
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-white truncate">Galouti Kebab</h4>
                          <span className="text-[10px] text-slate-400 line-clamp-1">Awadhi 32-spice recipe</span>
                          <span className="text-xs font-black text-emerald-400 mt-1 block">₹495</span>
                        </div>
                        <button className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px]">
                          + ADD
                        </button>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between gap-3 shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=200&q=80" 
                          alt="" 
                          className="w-14 h-14 rounded-xl object-cover" 
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-white truncate">Dal Bukhara</h4>
                          <span className="text-[10px] text-slate-400 line-clamp-1">24-hour slow simmered</span>
                          <span className="text-xs font-black text-emerald-400 mt-1 block">₹425</span>
                        </div>
                        <button className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-[10px]">
                          + ADD
                        </button>
                      </div>
                    </div>

                    {/* Floating Phone Cart */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white flex items-center justify-between shadow-lg">
                      <div className="text-[11px]">
                        <span className="font-bold block">Table Order (2 items)</span>
                        <span className="text-[10px] opacity-80">Tap to WhatsApp Kitchen</span>
                      </div>
                      <span className="font-black text-xs">₹920 &rarr;</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars with Glowing Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
            Zero-App Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Built for High-Turnover Indian Dining
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Every feature is engineered to speed up table orders, eliminate print costs, and increase diner average bill spend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-xl space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Instant Sub-Second Scan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No bulky app downloads. Diners point their default phone camera at the QR code and browse your kitchen's daily specials in under 400 milliseconds.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-xl space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Direct Tabletop UPI Payments</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Diners request the bill and pay via dynamic QR code using Google Pay, PhonePe, or Paytm with 5% GST automatically tallied.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 shadow-xl space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Google 5★ Review Booster</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated review booster prompts happy diners to leave a 5-star Google review immediately, while routing 1–3 star feedback privately to management.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive 15-Template Carousel */}
      <section className="py-20 bg-slate-900/30 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">Visual Diversity</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">15 Bespoke Dining Themes</h2>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {(['all', 'free', 'premium', 'premium_plus'] as const).map(tier => (
                <button
                  key={tier}
                  onClick={() => setSelectedTemplateTier(tier)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                    selectedTemplateTier === tier ? 'bg-emerald-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {tier.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredTemplates.slice(0, 5).map(tpl => (
              <div key={tpl.id} className="group rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-emerald-500/60 transition-all shadow-lg flex flex-col justify-between">
                <img src={tpl.thumbnail_url} alt="" className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-3">
                  <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">{tpl.tier}</span>
                  <h4 className="font-bold text-xs text-white mt-1 truncate">{tpl.name}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{tpl.vibe}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to Select Banner */}
      <div className="p-8 bg-slate-950 border-t border-slate-800 text-center">
        <button
          onClick={() => onSelectConcept ? onSelectConcept('Cyber-Glass') : null}
          className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm transition shadow-xl shadow-emerald-600/30 inline-flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>Select Concept 1 (Cyber-Glass & Interactive Phone)</span>
        </button>
      </div>
    </div>
  );
};