import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useRestaurant } from '@/context/RestaurantContext';
import { usePlan } from '@/context/PlanContext';
import { UpgradeModal } from '@/components/modals/UpgradeModal';
import { 
  LayoutDashboard, 
  Store, 
  UtensilsCrossed, 
  Palette, 
  LayoutTemplate, 
  QrCode, 
  BarChart3, 
  CreditCard, 
  Languages, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink,
  Crown,
  Grid,
  ShieldAlert,
  Sparkles,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { currentRestaurant, restaurants, setCurrentRestaurant } = useRestaurant();
  const { 
    currentSubscription, 
    openUpgradeModal, 
    isUpgradeModalOpen,
    isTrial, 
    trialDaysRemaining, 
    isTrialExpired 
  } = usePlan();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isPremiumPlan = currentSubscription?.plan?.code === 'premium' || currentSubscription?.plan?.code === 'premium_plus';

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Restaurant Profile', path: '/dashboard/profile', icon: Store },
    { name: 'Menu Management', path: '/dashboard/menu', icon: UtensilsCrossed },
    { name: 'Menu Design', path: '/dashboard/design', icon: Palette },
    { name: 'Templates', path: '/dashboard/templates', icon: LayoutTemplate },
    { name: 'QR Code Studio', path: '/dashboard/qr-code', icon: QrCode },
    { name: 'Tables & Table QR', path: '/dashboard/tables', icon: Grid },
    { name: 'Analytics', path: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Languages', path: '/dashboard/languages', icon: Languages },
    { name: 'Subscription & Billing', path: '/dashboard/billing', icon: CreditCard },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      <UpgradeModal />

      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
            QR
          </div>
          <span className="font-bold text-sm tracking-tight text-white">SmartQR Menu</span>
        </div>

        <div className="flex items-center gap-2">
          {currentRestaurant && (
            <a
              href={`/menu/${currentRestaurant.slug}`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-800 text-emerald-400 text-xs font-semibold flex items-center gap-1"
            >
              <span>View Menu</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800/80 p-4 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:static ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isUpgradeModalOpen ? 'hidden md:hidden' : ''}`}
      >
        <div>
          {/* Logo & Platform Brand */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black shadow-lg shadow-emerald-600/20">
                QR
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block leading-none">SmartQR</span>
                <span className="text-[10px] text-emerald-400 font-mono tracking-wider">RESTAURANT SAAS</span>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Restaurant Switcher */}
          {restaurants.length > 0 && currentRestaurant && (
            <div className="mb-4 p-2.5 bg-slate-900 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Active Restaurant
              </span>
              <select
                value={currentRestaurant.id}
                onChange={(e) => {
                  const selected = restaurants.find(r => r.id === e.target.value);
                  if (selected) setCurrentRestaurant(selected);
                }}
                className="w-full bg-slate-800 text-white text-xs font-semibold rounded-lg p-2 border border-slate-700 focus:outline-none focus:border-emerald-500"
              >
                {restaurants.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>

              <div className="mt-2 flex items-center justify-between text-[11px] pt-1">
                <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                  isTrialExpired
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : isTrial
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : isPremiumPlan
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {isTrialExpired 
                    ? 'Trial Ended' 
                    : isTrial 
                    ? `7-Day Trial (${trialDaysRemaining}d)` 
                    : currentSubscription?.plan?.name || 'Basic Plan'}
                </span>
                
                {/* Upgrade Button */}
                {(isTrialExpired || isTrial || !isPremiumPlan) && (
                  <button
                    onClick={() => openUpgradeModal(isTrialExpired ? 'basic' : 'premium')}
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <Crown className="w-3 h-3" /> Upgrade
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/dashboard'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Profile & Footer */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          {/* Only show Super Admin Portal shortcut if the authenticated user is genuinely a Super Admin */}
          {role === 'super_admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="w-full py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Super Admin Portal</span>
            </button>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={user?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                alt=""
                className="w-8 h-8 rounded-full object-cover border border-slate-700"
              />
              <div className="truncate max-w-[120px]">
                <p className="text-xs font-semibold text-white truncate">{user?.full_name || 'Owner'}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-slate-900 p-4 md:p-8 overflow-y-auto">
        {/* Trial Expired Top Notice */}
        {isTrialExpired && (
          <div className="mb-6 p-4 md:p-5 rounded-2xl bg-gradient-to-r from-red-950/90 via-red-900/80 to-slate-950 border border-red-500/50 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm md:text-base text-white">Your 7-Day Free Trial Has Ended!</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-500 text-white tracking-wider">
                    Expired
                  </span>
                </div>
                <p className="text-xs text-red-200/90 mt-0.5 max-w-2xl">
                  Your public QR menu and diner ordering features are currently paused. Subscribe to the Basic Plan (₹399/mo) or Premium Plan (₹999/mo) to reactivate your restaurant immediately.
                </p>
              </div>
            </div>

            <button
              onClick={() => openUpgradeModal('basic')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-xl shadow-amber-500/20 flex items-center justify-center gap-1.5 whitespace-nowrap self-start sm:self-center"
            >
              <Crown className="w-4 h-4" />
              <span>Subscribe & Upgrade</span>
            </button>
          </div>
        )}

        {/* Active 7-Day Free Trial Top Banner */}
        {isTrial && !isTrialExpired && (
          <div className="mb-6 p-3.5 md:p-4 rounded-2xl bg-gradient-to-r from-amber-950/50 via-slate-950 to-slate-900 border border-amber-500/30 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs md:text-sm text-white">
                    7-Day Free Trial Active
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {trialDaysRemaining} Day{trialDaysRemaining === 1 ? '' : 's'} Left
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  You have full trial access. Subscribe anytime to keep your digital menu live and avoid interruptions when the trial ends.
                </p>
              </div>
            </div>

            <button
              onClick={() => openUpgradeModal('premium')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 whitespace-nowrap shadow-md shadow-amber-500/20 self-start sm:self-center"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Upgrade Plan</span>
            </button>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
};
