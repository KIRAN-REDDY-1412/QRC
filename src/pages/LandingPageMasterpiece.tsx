import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlan } from '@/context/PlanContext';
import { useAuth } from '@/context/AuthContext';
import {
  QrCode,
  Search,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Check,
  Star,
  Zap,
  MessageCircle,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Flame,
  Award,
  Utensils,
  Smartphone,
  TrendingUp,
  FileSpreadsheet,
  Palette,
  Eye,
  EyeOff,
  Lock,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALL_TEMPLATES, DEFAULT_PLANS } from '@/lib/supabase';
import { useRestaurant } from '@/context/RestaurantContext';

export const LandingPageMasterpiece: React.FC = () => {
  const { plans } = usePlan();
  const { user, login, register, isAuthenticated } = useAuth();
  const { addRestaurant } = useRestaurant();
  const navigate = useNavigate();

  // 3D Motion & Parallax State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Navigation & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('Home');

  // Interactive QR Modal simulator (from Reference Image 2)
  const [isQrModalOpen, setIsQrModalOpen] = useState(true);
  const [manualCode, setManualCode] = useState('Table 4');
  const [scannedMenuOpen, setScannedMenuOpen] = useState(false);

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Billing cycle state
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Selected template filter in showcase
  const [selectedTier, setSelectedTier] = useState<'all' | 'free' | 'premium' | 'premium_plus'>('all');

  // Track cursor for 3D parallax motion
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 3D Moving Particle Constellation Background Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // 3D particle cloud with depth (Z axis)
    const count = 70;
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      radius: number;
      color: string;
      speedZ: number;
    }> = [];

    const colors = ['#f59e0b', '#fbbf24', '#d97706', '#10b981', '#ffffff'];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: (Math.random() - 0.5) * w * 1.6,
        y: (Math.random() - 0.5) * h * 1.6,
        z: Math.random() * 800 - 100, // depth from -100 to 700
        radius: Math.random() * 2.2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedZ: Math.random() * 0.7 + 0.3
      });
    }

    const focalLength = 400;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.z -= p.speedZ; // move smoothly towards camera

        // Reset when particle passes camera
        if (p.z <= -focalLength + 50) {
          p.z = 800;
          p.x = (Math.random() - 0.5) * w * 1.6;
          p.y = (Math.random() - 0.5) * h * 1.6;
        }

        const scale = focalLength / (focalLength + p.z);
        // Perspective shift with mouse tilt
        const projX = cx + (p.x - mousePos.x * 50) * scale;
        const projY = cy + (p.y - mousePos.y * 50) * scale;
        const projRadius = Math.max(0.6, p.radius * scale);
        const alpha = Math.min(1, Math.max(0.12, (1 - p.z / 800) * 0.8));

        if (projX >= -50 && projX <= w + 50 && projY >= -50 && projY <= h + 50) {
          ctx.beginPath();
          ctx.arc(projX, projY, projRadius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;
          ctx.shadowBlur = p.color === '#ffffff' ? 6 : 14;
          ctx.shadowColor = p.color;
          ctx.fill();

          // 3D Connecting mesh lines to nearby particles
          for (let j = i + 1; j < Math.min(i + 4, particles.length); j++) {
            const p2 = particles[j];
            const dist3D = Math.hypot(p.x - p2.x, p.y - p2.y, p.z - p2.z);
            if (dist3D < 160) {
              const scale2 = focalLength / (focalLength + p2.z);
              const projX2 = cx + (p2.x - mousePos.x * 50) * scale2;
              const projY2 = cy + (p2.y - mousePos.y * 50) * scale2;

              ctx.beginPath();
              ctx.moveTo(projX, projY);
              ctx.lineTo(projX2, projY2);
              ctx.strokeStyle = '#f59e0b';
              ctx.globalAlpha = (1 - dist3D / 160) * 0.16 * alpha;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, [mousePos]);

  const handleShowMenu = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
    setScannedMenuOpen(true);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const isSuper = email.trim().toLowerCase() === 'kiran@gmail.com';
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
    setIsAuthModalOpen(false);
    if (isSuper) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const basicPlan = plans.find(p => p.code === 'basic') || DEFAULT_PLANS[0];
  const premiumPlan = plans.find(p => p.code === 'premium') || DEFAULT_PLANS[1];

  const filteredTemplates = ALL_TEMPLATES.filter(t =>
    selectedTier === 'all' ? true : t.tier === selectedTier
  );

  return (
    <div className="min-h-screen bg-[#0c0f0e] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden relative">

      {/* 3D Motion Depth Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-75"
      />

      {/* Floating 3D Ambient Glowing Light Spheres */}
      <div
        className="fixed top-20 -left-20 w-[550px] h-[550px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none animate-float-slow -z-10"
        style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
      />
      <div
        className="fixed bottom-10 -right-20 w-[650px] h-[650px] bg-emerald-500/10 rounded-full blur-[180px] pointer-events-none animate-float-reverse -z-10"
        style={{ transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px)` }}
      />
      <div
        className="fixed top-1/2 left-1/3 w-[450px] h-[450px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse -z-10"
      />

      {/* =========================================================================
          HEADER / TOP NAVIGATION (Matches Reference Image 1)
         ========================================================================= */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#0c0f0e]/85 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo (Left): Monogram crest inspired by Reference 1 */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-amber-500/20">
              QR
            </div>
            <div>
              <span className="font-serif tracking-widest text-sm text-white font-bold block uppercase">
                SMARTQR MENU
              </span>
              <span className="text-[9px] font-mono tracking-widest text-amber-400 uppercase block">
                INDIA'S PREMIER QR PLATFORM
              </span>
            </div>
          </div>

          {/* Centered Translucent Navigation Capsule */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
            {[
              { name: 'Features', href: '#features' },
              { name: 'QR Studio', href: '#qr-studio' },
              { name: '15 Templates', href: '#templates' },
              { name: 'Table Ordering', href: '#table-ordering' },
              { name: 'Pricing (₹)', href: '#pricing' }
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setActiveNav(item.name)}
                className={`px-4 py-1.5 rounded-full text-xs tracking-wider uppercase transition-all ${activeNav === item.name
                    ? 'bg-white/15 text-white font-semibold shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right Actions: Search Box, Cart/Dashboard, and Start Free */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full px-3 py-1.5 text-xs text-white/50 focus-within:border-amber-400/50 transition">
              <Search className="w-3.5 h-3.5 text-white/40" />
              <input
                type="text"
                placeholder="Search templates, features..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-white placeholder-white/40 w-24 lg:w-36 text-xs"
              />
            </div>

            {isAuthenticated ? (
              <button
                onClick={() => navigate(user?.role === 'super_admin' ? '/admin' : '/dashboard')}
                className={`px-5 py-2 rounded-full ${
                  user?.role === 'super_admin'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold'
                } text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-1.5`}
              >
                <span>{user?.role === 'super_admin' ? 'Super Admin Portal' : 'Owner Dashboard'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="hidden sm:block text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white px-3 py-1.5"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
                >
                  Start Free (₹0)
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* =========================================================================
          SECTION 1: HERO (Matches Reference Image 1)
          Warm amber fine dining atmosphere + luxury serif typography
         ========================================================================= */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[92vh] flex flex-col justify-center">

        {/* Background Atmosphere Image Container with 3D Parallax Tilt */}
        <div
          className="absolute inset-0 z-0 rounded-[40px] overflow-hidden mx-4 sm:mx-6 lg:mx-8 my-6 border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.85)] transition-transform duration-300 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${mousePos.y * -3.5}deg) rotateY(${mousePos.x * 3.5}deg) scale(1.01)`
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2200&q=85"
            alt="Fine Dining Luxury Restaurant Ambience"
            className="w-full h-full object-cover brightness-[0.40] contrast-[1.15] transition-transform duration-500 ease-out"
            style={{
              transform: `translate(${mousePos.x * -12}px, ${mousePos.y * -12}px) scale(1.08)`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0f0e] via-black/45 to-black/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        </div>

        {/* Hero Content Box */}
        <div className="relative z-10 max-w-3xl space-y-6 sm:space-y-8 pl-4 sm:pl-10">

          {/* Pill Tag from Reference 1 */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-white/15 text-amber-400 text-xs font-mono tracking-widest uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Smart Contactless Dining For India</span>
          </div>

          {/* Main Title: Your Culinary Adventure Begins Here */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-white tracking-tight leading-[1.08]">
            Your Restaurant's Future <br />
            <span className="italic font-normal text-amber-200">Begins With SmartQR</span>
          </h1>

          {/* Project Tailored Subtitle */}
          <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-2xl">
            Replace torn, outdated paper menus with interactive digital dining. Empower guests to scan custom logo QR standees, browse 15 luxury templates with Veg/Non-Veg badges, dispatch orders directly to your kitchen via WhatsApp, and settle bills instantly via UPI with 0% commission.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                setAuthMode('register');
                setIsAuthModalOpen(true);
              }}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-widest transition shadow-xl shadow-amber-500/25 flex items-center gap-2 group"
            >
              <span>Launch Your 7 Days Free Trail &bull; ₹0</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#qr-studio"
              className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs uppercase tracking-widest transition backdrop-blur-md flex items-center gap-2"
            >
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>Test Live QR Simulator</span>
            </a>
          </div>

          {/* Live Trust Metrics */}
          <div className="pt-6 grid grid-cols-3 gap-6 border-t border-white/10 max-w-xl text-left">
            <div>
              <p className="text-2xl sm:text-3xl font-serif text-white font-bold">0.4s</p>
              <p className="text-[11px] text-white/50 uppercase tracking-wider">Instant QR Load</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-serif text-amber-400 font-bold">₹0</p>
              <p className="text-[11px] text-white/50 uppercase tracking-wider">Direct UPI Fees</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-serif text-white font-bold">15+</p>
              <p className="text-[11px] text-white/50 uppercase tracking-wider">Luxury Themes</p>
            </div>
          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 2: OUR EXCLUSIVE ITEMS & CORE MODULES (Exact Match to Reference 1)
          3 capsule cards with floating round plates connected by a dashed arc line
         ========================================================================= */}
      <section id="features" className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center space-y-3 mb-24">
          <span className="text-xs font-mono tracking-widest text-amber-400 uppercase">
            Signature Dining Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
            Our Core Dining Modules
          </h2>
          <p className="text-xs sm:text-sm text-white/50 max-w-lg mx-auto font-light">
            Everything your dining room needs to eliminate waiter bottlenecks, reduce reprinted menu costs, and elevate guest delight.
          </p>
        </div>

        {/* 3 Connected Capsule Cards Container */}
        <div className="relative">

          {/* Thin curved connecting arc line weaving behind plates */}
          <svg
            className="absolute top-12 inset-x-0 w-full h-32 hidden md:block pointer-events-none z-0"
            viewBox="0 0 1000 120"
            fill="none"
          >
            <path
              d="M 120 70 Q 300 10, 500 70 T 880 70"
              stroke="rgba(245, 158, 11, 0.25)"
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />
          </svg>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-8 relative z-10">

            {/* CARD 1: CONTACTLESS DIGITAL MENU */}
            <div className="flex flex-col items-center group">
              <div className="relative w-56 h-56 sm:w-60 sm:h-60 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-[#181d1a] overflow-hidden -mb-20 z-20 animate-float-slow transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
                  alt="Artisanal Bowl"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full max-w-[320px] rounded-[36px] bg-[#131715] border border-white/10 pt-24 pb-8 px-6 text-center space-y-4 shadow-2xl transition-all duration-300 group-hover:border-amber-400/40">
                <h3 className="text-2xl font-serif text-white tracking-wide">Contactless Menus</h3>
                <p className="text-xs text-white/60 leading-relaxed font-light">
                  Lightning 0.4s scan speed. Diners view rich food photos, official FSSAI Veg/Non-Veg indicators, and allergens without installing any app.
                </p>
                <div className="pt-2">
                  <a
                    href="#templates"
                    className="text-xs font-serif italic text-amber-300 hover:text-amber-200 transition tracking-wider underline underline-offset-4"
                  >
                    Explore 15 Templates &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* CARD 2: WHATSAPP KITCHEN ORDERING */}
            <div className="flex flex-col items-center group">
              <div className="relative w-56 h-56 sm:w-60 sm:h-60 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-[#181d1a] overflow-hidden -mb-20 z-20 animate-float-reverse transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80"
                  alt="Chef Specialties"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full max-w-[320px] rounded-[36px] bg-[#131715] border border-white/10 pt-24 pb-8 px-6 text-center space-y-4 shadow-2xl transition-all duration-300 group-hover:border-amber-400/40">
                <h3 className="text-2xl font-serif text-white tracking-wide">WhatsApp KOT Dispatch</h3>
                <p className="text-xs text-white/60 leading-relaxed font-light">
                  Guests order directly from their table. Formatted Kitchen Order Tickets (KOT) arrive on your chef's WhatsApp instantly with table numbers and notes.
                </p>
                <div className="pt-2">
                  <a
                    href="#table-ordering"
                    className="text-xs font-serif italic text-amber-300 hover:text-amber-200 transition tracking-wider underline underline-offset-4"
                  >
                    View Kitchen Flow &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* CARD 3: ZERO-FEE UPI & GOOGLE REVIEWS */}
            <div className="flex flex-col items-center group">
              <div
                className="relative w-56 h-56 sm:w-60 sm:h-60 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-4 border-[#181d1a] overflow-hidden -mb-20 z-20 animate-float-slow transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2"
                style={{ animationDelay: '1.5s' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80"
                  alt="Dessert & Drinks"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="w-full max-w-[320px] rounded-[36px] bg-[#131715] border border-white/10 pt-24 pb-8 px-6 text-center space-y-4 shadow-2xl transition-all duration-300 group-hover:border-amber-400/40">
                <h3 className="text-2xl font-serif text-white tracking-wide">Instant UPI & 5★ Reviews</h3>
                <p className="text-xs text-white/60 leading-relaxed font-light">
                  Settle table bills via Google Pay, PhonePe, or Paytm with 0% commissions. Happy diners are automatically directed to leave 5-Star Google reviews.
                </p>
                <div className="pt-2">
                  <a
                    href="#pricing"
                    className="text-xs font-serif italic text-amber-300 hover:text-amber-200 transition tracking-wider underline underline-offset-4"
                  >
                    Inspect Plan Tiers &rarr;
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 3: THE "QR Menu" SHOWCASE (Exact Match to Reference Image 2)
          Vibrant Terracotta / Amber Enclosure + Laptop Device with Scanner Target Modal
         ========================================================================= */}
      <section id="qr-studio" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Vibrant Terracotta Container with Curved Rounded Corners */}
        <div className="rounded-[44px] bg-gradient-to-b from-[#e67e22] via-[#d35400] to-[#b94400] p-6 sm:p-12 relative overflow-hidden shadow-2xl border-4 border-amber-300/30 text-slate-900">

          {/* Big Stylized Header: "QR" (filled) + "Menu" (outline) from Reference 2 */}
          <div className="text-center space-y-1 mb-8">
            <div className="flex items-center justify-center gap-3">
              <span className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight drop-shadow-md">
                QR
              </span>
              <span
                className="text-5xl sm:text-7xl lg:text-8xl font-black text-transparent tracking-tight drop-shadow-md"
                style={{ WebkitTextStroke: '2.5px #ffffff' }}
              >
                Menu
              </span>
            </div>
            <p className="text-white/95 text-xs sm:text-sm font-semibold tracking-wider uppercase">
              Interactive Tabletop Simulator &bull; Scan Custom Logo Standee &bull; Settle In 5 Seconds
            </p>
          </div>

          {/* Laptop Mockup (MacBook Pro from Reference 2) */}
          <div className="max-w-4xl mx-auto relative">

            <div
              className="rounded-[24px] bg-[#1a1b1d] p-3 shadow-2xl border border-white/20 transition-transform duration-300 ease-out"
              style={{
                transform: `perspective(1200px) rotateX(${mousePos.y * -4.5}deg) rotateY(${mousePos.x * 4.5}deg)`
              }}
            >

              <div className="rounded-[18px] bg-[#23150d] min-h-[460px] sm:min-h-[520px] relative overflow-hidden p-6 sm:p-10 flex flex-col justify-center items-center">

                {/* Background Dimmed Restaurant Ambience */}
                <div className="absolute inset-0 bg-cover bg-center opacity-40">
                  <img
                    src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80"
                    alt="Restaurant Dining Scene"
                    className="w-full h-full object-cover filter blur-[2px]"
                  />
                  <div className="absolute inset-0 bg-black/60" />
                </div>

                {/* THE FLOATING QR SCANNER MODAL (Exact match to Reference 2) */}
                {isQrModalOpen ? (
                  <div className="relative z-20 w-full max-w-md bg-white rounded-[28px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6)] text-center text-slate-800 space-y-5 animate-fade-in">

                    {/* Modal Top Bar */}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <button
                        onClick={() => setIsQrModalOpen(false)}
                        className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-slate-800">You can scan by QR to view the menu</span>
                      <div className="w-6" />
                    </div>

                    {/* QR Code Container with 4 Corner Brackets from Reference 2 */}
                    <div className="relative w-48 h-48 sm:w-52 sm:h-52 mx-auto flex items-center justify-center p-4">

                      {/* Corner Target Brackets */}
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-slate-900" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-slate-900" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-slate-900" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-slate-900" />

                      {/* Moving Laser Sweep Line */}
                      <div className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_12px_#f59e0b] animate-laser-sweep pointer-events-none" />

                      {/* Styled QR Code with Center Restaurant Logo (Premium & Plus feature) */}
                      <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center shadow-inner relative">
                        <QrCode className="w-28 h-28 sm:w-32 sm:h-32 text-slate-900" />
                        <span className="text-[10px] font-black tracking-widest text-slate-800 mt-1 uppercase">
                          TABLE #4 &bull; SMARTQR
                        </span>

                        {/* Center Logo Badge (Highlighted in User Requirements) */}
                        <div className="absolute inset-0 m-auto w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-md">
                          QR
                        </div>
                      </div>

                    </div>

                    {/* Subtitle instructions from Reference 2 */}
                    <p className="text-[11px] text-slate-500 font-medium">
                      The QR code will be automatically detected when you position it between the guide lines
                    </p>

                    {/* Or enter code section from Reference 2 */}
                    <div className="pt-1 space-y-3">
                      <div className="relative flex items-center justify-center">
                        <span className="text-xs font-semibold text-slate-400 bg-white px-2 z-10">Or enter code</span>
                        <div className="absolute inset-x-0 h-[1px] bg-slate-200" />
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="e.g. Table 4"
                          value={manualCode}
                          onChange={e => setManualCode(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-center font-mono text-xs focus:outline-none focus:border-amber-500 uppercase tracking-widest text-slate-900 font-bold"
                        />
                        <button
                          onClick={handleShowMenu}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/30"
                        >
                          Show menu
                        </button>
                        <a
                          href="/menu/saffron-darbar?replay_intro=true&table=4"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 border border-slate-700 shadow-md"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Experience Live QR Scan Intro &rarr;</span>
                        </a>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="relative z-20 text-center space-y-4">
                    <p className="text-white text-lg font-serif">Scanner Preview Minimized</p>
                    <button
                      onClick={() => setIsQrModalOpen(true)}
                      className="px-6 py-3 rounded-full bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-xl"
                    >
                      Reopen Standee Scanner
                    </button>
                  </div>
                )}

              </div>

              {/* Laptop Bottom Chin */}
              <div className="pt-2 text-center text-[10px] text-slate-500 font-mono">
                MacBook Pro &bull; SmartQR Digital Standee Simulator
              </div>
            </div>

            {/* Laptop Base Stand */}
            <div className="w-[60%] h-3 bg-[#262729] rounded-b-xl mx-auto shadow-xl" />

          </div>

        </div>

      </section>

      {/* =========================================================================
          SECTION 4: OUR CULINARY CANVAS & THE CULINARY VISIONARY (From Reference 1)
          Two-column visual narrative customized for Indian dining & operations
         ========================================================================= */}
      <section id="table-ordering" className="relative z-10 py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Column A: "Our Culinary Canvas" */}
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-mono tracking-widest text-amber-400 uppercase">
                Atmosphere & Speed
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight leading-tight">
                Our Culinary Canvas
              </h2>
            </div>

            <p className="text-sm text-white/70 font-light leading-relaxed">
              Designed For High-Energy Bistros, Rooftops, Fine Dining, And Cozy Family Restaurants. SmartQR Blends Tactile Visual Beauty With Unmatched Operational Speed. Your Servers Focus On True Hospitality While The Digital Menu Handles Instant Scanning, Dietary Selections, And Kitchen Synchronization.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[28px] overflow-hidden h-64 border border-white/10 shadow-2xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80"
                  alt="Upscale Dining Atmosphere"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-amber-300">
                  Rooftop Dining
                </div>
              </div>

              <div className="rounded-[28px] overflow-hidden h-64 border border-white/10 shadow-2xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80"
                  alt="Bistro Dining Tables"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-amber-300">
                  Zero Table Waiting
                </div>
              </div>
            </div>
          </div>

          {/* Column B: "Meet The Culinary Visionary Behind Us" */}
          <div className="space-y-8 lg:pl-6">
            <div className="space-y-3">
              <span className="text-xs font-mono tracking-widest text-amber-400 uppercase">
                Chefs & Kitchen Automation
              </span>
              <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight leading-tight">
                Meet The Culinary Visionary <br />
                Behind Your Kitchen
              </h2>
            </div>

            <p className="text-sm text-white/70 font-light leading-relaxed">
              When Orders Are Placed At The Table, Every Second In The Kitchen Counts. SmartQR Generates Clear, Formatted Kitchen Order Tickets (KOT) That Dispatch Straight To Your Chef's WhatsApp Phone Or Tablet. No Lost Paper Slips, No Hand-Written Confusion, And Zero Delayed Appetizers.
            </p>

            <div className="relative rounded-[32px] overflow-hidden h-80 border border-white/10 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80"
                alt="Chef in Kitchen"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.80]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-lg text-white font-bold">1-Click WhatsApp Kitchen Dispatch</h4>
                  <p className="text-xs text-amber-400/90 font-mono">Instant KOT with Table #, Special Notes & Items</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 5: 15 BESPOKE TEMPLATES SHOWCASE
         ========================================================================= */}
      <section id="templates" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-mono tracking-widest text-amber-400 uppercase">
            15 Handcrafted Visual Themes
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
            Designed for Cafes, Fine Dining & Rooftops
          </h2>
          <p className="text-xs sm:text-sm text-white/50 max-w-xl mx-auto font-light">
            Super Admins and Restaurant Owners can preview, edit food items, and toggle themes in real-time.
          </p>

          {/* Tier Filters */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            {(['all', 'free', 'premium', 'premium_plus'] as const).map(tier => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-4 py-1.5 rounded-full uppercase tracking-wider font-semibold transition ${selectedTier === tier
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                  }`}
              >
                {tier === 'all' ? 'All 15 Templates' : tier === 'premium_plus' ? 'Plus Tier' : tier}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((tmpl, idx) => (
            <div
              key={tmpl.id}
              className="p-6 rounded-[32px] bg-[#131715] border border-white/10 hover:border-amber-400/40 transition-all duration-300 shadow-xl group"
            >
              <div className="w-full h-52 rounded-2xl overflow-hidden mb-5 relative">
                <img
                  src={tmpl.thumbnail_url}
                  alt={tmpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85]"
                />
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase text-amber-300">
                  {tmpl.tier === 'premium_plus' ? 'Plus Tier' : tmpl.tier}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif text-white group-hover:text-amber-300 transition-colors">
                    {tmpl.name}
                  </h3>
                  <span className="text-xs text-white/40 font-mono">0{idx + 1}</span>
                </div>
                <p className="text-xs text-white/60 font-light leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
                <span className="capitalize">{tmpl.vibe}</span>
                <span className="text-amber-400 font-mono">Live In Dashboard</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: TRANSPARENT PRICING (INR ₹)
         ========================================================================= */}
      <section id="pricing" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-mono tracking-widest text-amber-400 uppercase">
            Simple, Transparent Pricing (₹ INR)
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-tight">
            Pick The Perfect Plan For Your Restaurant
          </h2>
          <p className="text-xs sm:text-sm text-white/50 max-w-xl mx-auto font-light">
            Keep 100% of your diner revenues. Direct bank settlements via UPI with zero commission cuts.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3 text-xs">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-full transition ${billingCycle === 'monthly' ? 'bg-white/15 text-white font-bold' : 'text-white/50 hover:text-white'}`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-full transition flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-white/50 hover:text-white'}`}
            >
              <span>Yearly (Save 20%)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">

          {/* BASIC PLAN */}
          <div className="p-8 rounded-[36px] bg-[#131715] border border-white/10 flex flex-col justify-between shadow-2xl relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold">Standard Tier</span>
                <span className="text-[10px] font-mono text-white/40 uppercase">Essential</span>
              </div>
              <h3 className="text-2xl font-serif text-white">{basicPlan?.name || 'Basic Plan'}</h3>

              {/* Dual Price Box: Both Yearly & Monthly Shown in Frame */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
                <div className="flex items-baseline justify-between pb-2 border-b border-white/10">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/50 block">Monthly Rate</span>
                    <span className="text-2xl font-serif text-white">₹{basicPlan?.monthly_price || 399}</span>
                    <span className="text-xs text-white/40"> / month</span>
                  </div>
                  <span className="text-[11px] text-white/40 font-mono">Billed monthly</span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-amber-300 block">Yearly Rate</span>
                      <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded">Save 25%</span>
                    </div>
                    <span className="text-2xl font-serif text-amber-300">₹{Math.round((basicPlan?.yearly_price || 3590) / 12)}</span>
                    <span className="text-xs text-white/40"> / month</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">₹{(basicPlan?.yearly_price || 3590).toLocaleString('en-IN')}</span>
                    <span className="text-[9px] text-white/40 block">billed annually</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-white/60 font-light">
                {basicPlan?.description || 'Essential digital QR menu platform for cafes, dhabas, and modern food joints.'}
              </p>

              <ul className="space-y-2.5 pt-4 text-xs text-white/70">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Permanent Restaurant QR Standee</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Up to 100 Menu Items & 15 Categories</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> High-Resolution Food Photo Uploads</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> FSSAI Veg, Non-Veg, Jain & Vegan Badges</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Multi-Language Menu Translations</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Real-Time Item Stock Availability</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setAuthMode('register');
                setIsAuthModalOpen(true);
              }}
              className="mt-8 w-full py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition"
            >
              Start Basic Plan
            </button>
          </div>

          {/* PREMIUM LUXURY PLAN */}
          <div className="p-8 rounded-[36px] bg-[#19221c] border-2 border-amber-400/70 flex flex-col justify-between shadow-2xl relative ring-1 ring-amber-400/30">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-widest shadow-md flex items-center gap-1">
              <Crown className="w-3 h-3" />
              <span>Most Popular &bull; Full Suite</span>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold">Luxury Suite</span>
                <span className="text-[10px] font-mono text-amber-300 uppercase">All-Inclusive</span>
              </div>
              <h3 className="text-2xl font-serif text-white">{premiumPlan?.name || 'Premium Luxury Plan'}</h3>

              {/* Dual Price Box: Both Yearly & Monthly Shown in Frame */}
              <div className="p-4 rounded-2xl bg-black/50 border border-amber-400/30 space-y-2.5">
                <div className="flex items-baseline justify-between pb-2 border-b border-white/10">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white/50 block">Monthly Rate</span>
                    <span className="text-2xl font-serif text-white">₹{premiumPlan?.monthly_price || 999}</span>
                    <span className="text-xs text-white/40"> / month</span>
                  </div>
                  <span className="text-[11px] text-white/40 font-mono">Billed monthly</span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-amber-300 block">Yearly Rate</span>
                      <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded">Save 25%</span>
                    </div>
                    <span className="text-2xl font-serif text-amber-300">₹{Math.round((premiumPlan?.yearly_price || 8990) / 12)}</span>
                    <span className="text-xs text-white/40"> / month</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">₹{(premiumPlan?.yearly_price || 8990).toLocaleString('en-IN')}</span>
                    <span className="text-[9px] text-white/40 block">billed annually</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-white/60 font-light">
                {premiumPlan?.description || 'The complete bespoke suite for high-volume restaurants, luxury dining, and franchise brands.'}
              </p>

              <ul className="space-y-2.5 pt-4 text-xs text-white/70">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 font-bold" /> Access to ALL 15 Luxury & Glassmorphism Templates</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 font-bold text-amber-200" /> Instant QR Scan Opening Intro Animation (Glow & Particles)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400 font-bold text-amber-200" /> Custom QR Studio (Logo / Monogram in Center)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Table-Specific QR Codes & Table Ordering Cart</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Instant UPI Payment QR (GPay, PhonePe, Paytm)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Excel & CSV Bulk Menu Import & Export</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Google 5-Star Review Booster & White-Label</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setAuthMode('register');
                setIsAuthModalOpen(true);
              }}
              className="mt-8 w-full py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-amber-500/25"
            >
              Choose Premium Luxury
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================
          FOOTER
         ========================================================================= */}
      <footer className="relative z-10 border-t border-white/10 py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-white font-serif font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center">
            QR
          </div>
          <span>SMARTQR MENU</span>
        </div>
        <p className="text-xs text-white/40 max-w-md mx-auto font-light leading-relaxed">
          The all-in-one digital menu platform built for restaurants, cafes, dhabas, bistros, and rooftops across India. Contactless QR standees, WhatsApp kitchen dispatch, and direct UPI settlements.
        </p>
        <p className="text-[11px] font-mono text-white/30 pt-4">
          &copy; {new Date().getFullYear()} SmartQR Menu Platform. All rights reserved.
        </p>
      </footer>

      {/* =========================================================================
          AUTH POPUP MODAL (LOGIN / REGISTER)
         ========================================================================= */}
      {isAuthModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsAuthModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#161b18] border border-white/20 rounded-[36px] p-8 text-white space-y-6 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-serif text-white font-bold">
                  {authMode === 'register' ? 'Launch Your Restaurant' : 'Sign In to Dashboard'}
                </h3>
                <p className="text-xs text-white/50">
                  {authMode === 'register' ? 'Set up your contactless QR menu in 2 minutes.' : 'Access your menu editor and QR studio.'}
                </p>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Restaurant Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Royal Punjab Dhaba, Spice Craft Bistro"
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="owner@restaurant.com"
                  className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-white/70">Password *</label>
                  {password && (
                    <button
                      type="button"
                      onClick={() => setPassword('')}
                      className="text-[10px] text-white/40 hover:text-white"
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
                    onChange={e => setPassword(e.target.value)}
                    placeholder={authMode === 'register' ? 'Create a secure password (min. 6 chars)' : 'Enter your password'}
                    autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 pr-10 font-mono placeholder:font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-xl"
              >
                {authMode === 'register' ? 'Create Account & Get Started' : 'Sign In'}
              </button>
            </form>

            <div className="text-center text-xs text-white/50">
              {authMode === 'register' ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-amber-400 hover:underline font-bold"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="text-amber-400 hover:underline font-bold"
                  >
                    Register Free
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCANNED MENU MODAL (Triggered when user clicks "Show menu" in Laptop simulator)
         ========================================================================= */}
      {scannedMenuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setScannedMenuOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#141916] border border-amber-400/40 rounded-[36px] p-6 sm:p-8 text-white space-y-5 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">Digital Table Menu</span>
                <h3 className="text-xl font-serif text-white font-bold">{manualCode || 'Table #4'} &bull; Spice Craft Bistro</h3>
              </div>
              <button
                onClick={() => setScannedMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {[
                { name: 'Smoked Butter Chicken', price: '₹480', desc: 'Charcoal roasted tender chicken in velvety makhani gravy', badge: 'Chef Special', veg: false },
                { name: 'Truffle Mushroom Risotto', price: '₹460', desc: 'Arborio rice, wild porcini, parmesan crisp, white truffle oil', badge: 'Bestseller', veg: true },
                { name: 'Paneer Angara Tikka', price: '₹360', desc: 'Cottage cheese marinated in Kashmiri chili and smoked ghee', badge: 'Popular', veg: true }
              ].map((item, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${item.veg ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span className="text-[9px] font-mono uppercase text-amber-400">{item.badge}</span>
                    </div>
                    <h4 className="font-serif text-sm font-bold text-white">{item.name}</h4>
                    <p className="text-[11px] text-white/50">{item.desc}</p>
                    <span className="text-xs font-mono font-bold text-amber-300">{item.price}</span>
                  </div>
                  <button
                    onClick={() => {
                      confetti({ particleCount: 30, spread: 40 });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                confetti({ particleCount: 80, spread: 70 });
                setScannedMenuOpen(false);
              }}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-xl flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Simulate WhatsApp Kitchen Order (₹1,300)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
