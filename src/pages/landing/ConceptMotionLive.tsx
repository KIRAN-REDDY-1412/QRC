import React, { useState, useEffect, useRef } from 'react';
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
  Star,
  Flame,
  Volume2,
  CheckCircle2,
  Send,
  Coffee,
  Pizza,
  Wine
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_TEMPLATES } from '@/lib/supabase';

interface ConceptProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const ConceptMotionLive: React.FC<ConceptProps> = ({ onOpenAuth }) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'menu' | 'dispatch'>('scan');
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [liveOrdersCount, setLiveOrdersCount] = useState(14820);
  const [cartItemsCount, setCartItemsCount] = useState(2);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Interactive ROI calculation state
  const [tableCount, setTableCount] = useState(25);
  const [avgBill, setAvgBill] = useState(850);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background Interactive Kinetic Particles Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
    }> = [];

    const colors = ['#10b981', '#06b6d4', '#6366f1', '#f59e0b'];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.5 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 110) * 0.15;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Live order ticker auto-incrementing
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveOrdersCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Floating notifications rotating periodically
  const recentActivities = [
    { table: 'Table 4', item: 'Truffle Woodfired Pizza', price: '₹540', status: 'Sent to WhatsApp Kitchen' },
    { table: 'Table 11', item: '2x Dal Makhani & Garlic Naan', price: '₹620', status: 'Paid via GPay UPI' },
    { table: 'Table 8', item: 'Cold Brew & Tiramisu', price: '₹410', status: '5-Star Google Review Added' },
    { table: 'Table 2', item: 'Paneer Tikka Platter', price: '₹480', status: 'Preparing in Kitchen' }
  ];

  const [activeToastIndex, setActiveToastIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveToastIndex(prev => (prev + 1) % recentActivities.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const triggerLiveCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    setToastMessage('🎉 Order Dispatched to Kitchen in 0.3s!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const sampleDishes = [
    { name: 'Smoked Butter Chicken', price: '₹480', rating: '4.9', tag: 'Chef Special', fssai: 'nonveg' },
    { name: 'Paneer Angara Tikka', price: '₹360', rating: '4.8', tag: 'Bestseller', fssai: 'veg' },
    { name: 'Wild Mushroom Risotto', price: '₹490', rating: '4.7', tag: 'Trending', fssai: 'veg' }
  ];

  const currentTemplate = ALL_TEMPLATES[selectedTemplateIndex] || ALL_TEMPLATES[0];

  // ROI calculations
  const monthlyBills = tableCount * 4 * 30; // 4 turns per day * 30 days
  const printingSaved = Math.round(tableCount * 120);
  const turnoverBonus = Math.round(monthlyBills * (avgBill * 0.12));
  const aggregatorSaved = Math.round(monthlyBills * (avgBill * 0.08));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
      
      {/* Background Interactive Kinetic Canvas */}
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 pointer-events-none z-0 opacity-70"
      />

      {/* Atmospheric Ambient Glowing Orbs */}
      <div className="fixed top-20 left-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="fixed bottom-20 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none animate-pulse" />
      <div className="fixed top-1/2 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none animate-float-slow" />

      {/* TOP DUAL KINETIC MOVING MARQUEES */}
      <div className="relative z-10 pt-4 pb-2 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md overflow-hidden">
        <div className="animate-marquee-left text-xs font-mono font-semibold tracking-wider text-emerald-400 gap-8 items-center py-1">
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> 0.4s LIGHTNING QR SCAN</span>
          <span className="text-slate-600">✦</span>
          <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-cyan-400" /> 15 LUXURY RESTAURANT THEMES</span>
          <span className="text-slate-600">✦</span>
          <span className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> 1-TAP WHATSAPP KITCHEN DISPATCH</span>
          <span className="text-slate-600">✦</span>
          <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-teal-300" /> ZERO-COMMISSION DIRECT UPI SETTLEMENT</span>
          <span className="text-slate-600">✦</span>
          <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> 5-STAR GOOGLE REVIEW BOOSTER</span>
          <span className="text-slate-600">✦</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> BAD RATING MANAGER SHIELD</span>
          <span className="text-slate-600">✦</span>
          {/* Duplicate set for infinite seamless loop */}
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-400" /> 0.4s LIGHTNING QR SCAN</span>
          <span className="text-slate-600">✦</span>
          <span className="flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5 text-cyan-400" /> 15 LUXURY RESTAURANT THEMES</span>
          <span className="text-slate-600">✦</span>
          <span className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> 1-TAP WHATSAPP KITCHEN DISPATCH</span>
          <span className="text-slate-600">✦</span>
          <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-teal-300" /> ZERO-COMMISSION DIRECT UPI SETTLEMENT</span>
          <span className="text-slate-600">✦</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Live Pulse Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold backdrop-blur-xl shadow-lg shadow-emerald-500/10 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span>LIVE KINETIC DINING PLATFORM · INDIA</span>
              <span className="hidden sm:inline bg-emerald-400/20 px-2 py-0.5 rounded text-[10px] text-emerald-300">
                {liveOrdersCount.toLocaleString()} Orders Placed Today
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]">
              Say Goodbye to Faded Menus. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Experience Live Motion Dining.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Empower your guests to scan smart QR standees, browse high-definition cinematic digital menus, order directly to the kitchen via WhatsApp, and settle via UPI in under 5 seconds.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onOpenAuth ? onOpenAuth('register') : null}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm sm:text-base transition-all shadow-xl shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 flex items-center gap-2.5"
              >
                <span>Launch Your Free Menu Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={triggerLiveCelebration}
                className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700/80 transition-all hover:border-emerald-500/50 flex items-center gap-2 backdrop-blur-md shadow-lg group"
              >
                <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
                <span>Simulate Instant Order</span>
              </button>
            </div>

            {/* Live Trust Metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-xl mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white font-mono">0.4s</p>
                <p className="text-xs text-slate-400">Fastest QR Load</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">₹0</p>
                <p className="text-xs text-slate-400">Zero Commission</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-teal-300 font-mono">15+</p>
                <p className="text-xs text-slate-400">Luxury Templates</p>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Kinetic Floating 3D Hologram Phone */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            
            {/* Pulsing ambient backdrop rings */}
            <div className="absolute w-[360px] h-[360px] rounded-full border border-emerald-500/20 animate-pulse-ring pointer-events-none" />
            <div className="absolute w-[450px] h-[450px] rounded-full border border-cyan-500/10 animate-pulse-ring pointer-events-none" style={{ animationDelay: '1s' }} />

            {/* Orbiting Live Badge: Table 4 WhatsApp Dispatch */}
            <div className="absolute -top-6 -left-6 z-30 hidden sm:flex items-center gap-3 bg-slate-900/90 border border-emerald-500/40 p-3 rounded-2xl shadow-2xl backdrop-blur-xl animate-float-slow">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] font-bold text-white">Kitchen WhatsApp</span>
                </div>
                <p className="text-[10px] text-slate-400">Table 4: 2 Items Dispatched</p>
              </div>
            </div>

            {/* Orbiting Live Badge: Instant UPI Settlement */}
            <div className="absolute -bottom-6 -right-6 z-30 hidden sm:flex items-center gap-3 bg-slate-900/90 border border-teal-500/40 p-3 rounded-2xl shadow-2xl backdrop-blur-xl animate-float-reverse">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span className="text-[11px] font-bold text-white">Direct UPI Paid</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-mono">₹1,250 · 0% commission</p>
              </div>
            </div>

            {/* The Floating Smartphone Device */}
            <div className="w-[300px] sm:w-[320px] rounded-[44px] bg-slate-900 border-4 border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(16,185,129,0.3)] p-3 relative z-20 animate-float-slow">
              
              {/* Speaker / Dynamic Island notch */}
              <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-3 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-800" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/70 animate-pulse" />
              </div>

              {/* Phone Interactive Screen Container */}
              <div className="rounded-[32px] bg-slate-950 border border-slate-800 overflow-hidden text-slate-200 min-h-[480px] flex flex-col justify-between relative">

                {/* Mode Selector Pill inside Phone */}
                <div className="p-2.5 bg-slate-900/90 border-b border-slate-800 flex justify-between gap-1 text-[10px] font-bold">
                  <button 
                    onClick={() => setActiveTab('scan')}
                    className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1 ${
                      activeTab === 'scan' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-3 h-3" /> Scan
                  </button>
                  <button 
                    onClick={() => setActiveTab('menu')}
                    className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1 ${
                      activeTab === 'menu' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Utensils className="w-3 h-3" /> Menu
                  </button>
                  <button 
                    onClick={() => setActiveTab('dispatch')}
                    className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1 ${
                      activeTab === 'dispatch' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MessageCircle className="w-3 h-3" /> Order
                  </button>
                </div>

                {/* TAB 1: LIVE LASER SCANNING QR */}
                {activeTab === 'scan' && (
                  <div className="p-5 flex-1 flex flex-col items-center justify-center text-center space-y-4 relative">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">Table 4 Standee</span>
                    
                    {/* QR with Moving Laser Beam */}
                    <div className="relative w-44 h-44 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center overflow-hidden border-2 border-emerald-400/60">
                      
                      {/* Laser Beam sweeping up and down */}
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_15px_#10b981] animate-laser-sweep z-20 pointer-events-none" />
                      
                      {/* Stylized QR Code */}
                      <div className="w-full h-full border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center bg-slate-50 text-slate-950 relative">
                        <QrCode className="w-24 h-24 text-slate-900" />
                        <span className="text-[9px] font-black tracking-tight mt-1 text-slate-700">THE BISTRO QR</span>
                        
                        {/* Center Custom Logo Badge */}
                        <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-md">
                          QR
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-white">Continuous Instant Scan</p>
                      <p className="text-[10px] text-slate-400">Point phone camera &bull; No app download required</p>
                    </div>

                    <button
                      onClick={() => setActiveTab('menu')}
                      className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <span>Open Menu Live</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* TAB 2: LIVE MENU EXPERIENCE */}
                {activeTab === 'menu' && (
                  <div className="p-3.5 flex-1 space-y-3 overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div>
                        <h4 className="font-black text-white text-xs">The Royal Bistro</h4>
                        <span className="text-[9px] text-emerald-400">Theme: {currentTemplate.name}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                        Table #4
                      </span>
                    </div>

                    {/* Dish Items */}
                    <div className="space-y-2">
                      {sampleDishes.map((dish, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between hover:border-emerald-500/40 transition">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2.5 h-2.5 rounded-full ${dish.fssai === 'veg' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                              <span className="font-bold text-xs text-white">{dish.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span className="font-bold text-emerald-400">{dish.price}</span>
                              <span>&bull;</span>
                              <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                                <Star className="w-2.5 h-2.5 fill-amber-400" /> {dish.rating}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setCartItemsCount(c => c + 1);
                              triggerLiveCelebration();
                            }}
                            className="w-7 h-7 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-black text-sm flex items-center justify-center transition"
                          >
                            +
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* View Cart Pill */}
                    <button 
                      onClick={() => setActiveTab('dispatch')}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center justify-between px-3 shadow-md"
                    >
                      <span className="flex items-center gap-1">
                        <Utensils className="w-3.5 h-3.5" /> Cart ({cartItemsCount})
                      </span>
                      <span>Review & Order &rarr;</span>
                    </button>
                  </div>
                )}

                {/* TAB 3: LIVE DISPATCH & INSTANT UPI */}
                {activeTab === 'dispatch' && (
                  <div className="p-4 flex-1 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-white">Table #4 Bill</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">₹840.00</span>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp Kitchen Sync</span>
                        </div>
                        <p className="text-[10px] text-slate-300">
                          Order is formatted into KOT and forwarded instantly to Chef's kitchen WhatsApp number.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-white">
                          <span className="flex items-center gap-1.5">
                            <CreditCard className="w-4 h-4 text-teal-400" /> Instant UPI QR
                          </span>
                          <span className="text-[10px] text-emerald-400">0% Commission</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          Money settles straight to your HDFC, ICICI, or SBI bank account via UPI.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={triggerLiveCelebration}
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Simulate Kitchen Dispatch</span>
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECOND ENDLESS MARQUEE (REVERSE DIRECTION) */}
      <div className="relative z-10 py-3 bg-slate-900/60 border-y border-slate-800/80 overflow-hidden">
        <div className="animate-marquee-right text-xs font-mono font-semibold tracking-wider text-slate-400 gap-8 items-center py-0.5">
          <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-rose-500" /> OVER 12,000+ RESTAURANTS IN INDIA</span>
          <span className="text-slate-700">&bull;</span>
          <span className="text-white">📍 MUMBAI</span>
          <span className="text-slate-700">&bull;</span>
          <span className="text-white">📍 DELHI NCR</span>
          <span className="text-slate-700">&bull;</span>
          <span className="text-white">📍 BENGALURU</span>
          <span className="text-slate-700">&bull;</span>
          <span className="text-white">📍 HYDERABAD</span>
          <span className="text-slate-700">&bull;</span>
          <span className="text-white">📍 PUNE</span>
          <span className="text-slate-700">&bull;</span>
          <span className="text-white">📍 GOA</span>
          <span className="text-slate-700">&bull;</span>
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 99.98% CLOUD UPTIME</span>
          <span className="text-slate-700">&bull;</span>
          {/* Duplicate set */}
          <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-rose-500" /> OVER 12,000+ RESTAURANTS IN INDIA</span>
          <span className="text-slate-700">&bull;</span>
          <span className="text-white">📍 MUMBAI</span>
          <span className="text-slate-700">&bull;</span>
          <span className="text-white">📍 DELHI NCR</span>
          <span className="text-slate-700">&bull;</span>
          <span className="text-white">📍 BENGALURU</span>
          <span className="text-slate-700">&bull;</span>
        </div>
      </div>

      {/* INTERACTIVE 15 TEMPLATES LIVE TESTER */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase">
            Designed for Fine Dining, Cafes, Rooftops & Pubs
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            15 Handcrafted Visual Themes. Pick Yours.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">
            Switch your restaurant's mood anytime from the Super Admin or Owner panel with one click.
          </p>
        </div>

        {/* Template Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {ALL_TEMPLATES.map((tmpl, index) => (
            <div 
              key={tmpl.id}
              onClick={() => {
                setSelectedTemplateIndex(index);
                setActiveTab('menu');
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden group ${
                selectedTemplateIndex === index 
                  ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/20 scale-[1.03]'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              <div 
                className="w-full h-20 rounded-xl mb-3 flex items-center justify-center font-black text-xs text-white shadow-inner relative overflow-hidden bg-gradient-to-tr from-emerald-800 to-slate-900"
              >
                <img 
                  src={tmpl.thumbnail_url} 
                  alt={tmpl.name} 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-300" 
                />
                <span className="z-10 tracking-wider drop-shadow-md text-center px-1 font-bold">{tmpl.name}</span>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">{tmpl.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    tmpl.tier === 'free' ? 'bg-slate-800 text-slate-300' :
                    tmpl.tier === 'premium' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {tmpl.tier === 'premium_plus' ? 'Plus' : tmpl.tier}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">{tmpl.vibe || tmpl.badge_label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE ROI PROFIT CALCULATOR WITH LIVE SLIDERS */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Live Profit Simulator
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              How Much Money Will SmartQR Save You?
            </h3>
            <p className="text-slate-400 text-sm">
              Drag the sliders below to calculate your estimated annual operational savings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center text-sm font-bold mb-2">
                  <span className="text-white">Active Restaurant Tables:</span>
                  <span className="text-emerald-400 font-mono text-base">{tableCount} Tables</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  value={tableCount}
                  onChange={e => setTableCount(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-sm font-bold mb-2">
                  <span className="text-white">Average Bill Per Table (₹):</span>
                  <span className="text-emerald-400 font-mono text-base">₹{avgBill}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3500"
                  step="50"
                  value={avgBill}
                  onChange={e => setAvgBill(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Eliminate ₹{printingSaved.toLocaleString()} in reprinted paper menus every quarter.</span>
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>30% faster table turnover with 1-click WhatsApp KOT and UPI billing.</span>
                </p>
              </div>
            </div>

            {/* Live Savings Display Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-tr from-emerald-950/40 to-slate-950 border border-emerald-500/30 text-center space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                Estimated Annual Savings
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                ₹{(turnoverBonus + printingSaved * 4 + aggregatorSaved).toLocaleString()}
                <span className="text-xs text-emerald-400 font-normal block font-sans mt-1">
                  additional net profit per year
                </span>
              </div>
              <button
                onClick={() => onOpenAuth ? onOpenAuth('register') : null}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
              >
                <span>Claim Your Savings &bull; Start Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING REAL-TIME TOAST NOTIFICATION (BOTTOM-LEFT) */}
      <div className="fixed bottom-5 left-5 z-50 pointer-events-none">
        <div className="bg-slate-900/95 border border-emerald-500/40 p-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 animate-bounce">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-white">{recentActivities[activeToastIndex].table}</span>
              <span className="text-[10px] text-slate-400">&bull; {recentActivities[activeToastIndex].status}</span>
            </div>
            <p className="text-[11px] text-emerald-400 font-semibold">
              {recentActivities[activeToastIndex].item} ({recentActivities[activeToastIndex].price})
            </p>
          </div>
        </div>
      </div>

      {/* TOAST POPUP FOR ACTIONS */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl font-black text-xs shadow-2xl animate-fade-in flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 py-8 px-4 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} SmartQR Menu. Designed for restaurants across India.</p>
      </footer>

    </div>
  );
};
