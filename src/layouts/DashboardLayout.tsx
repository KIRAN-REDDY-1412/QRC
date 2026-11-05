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
  ShieldAlert
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, role, logout, switchRole } = useAuth();
  const { currentRestaurant, restaurants, setCurrentRestaurant } = useRestaurant();
  const { currentSubscription, openUpgradeModal } = usePlan();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isFreePlan = currentSubscription?.plan?.code === 'free';
  const isPremiumPlus = currentSubscription?.plan?.code === 'premium_plus';

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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/80 p-4 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:static ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
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
                  isPremiumPlus
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : isFreePlan
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {currentSubscription?.plan?.name || 'Free Plan'}
                </span>
                {isFreePlan && (
                  <button
                    onClick={() => openUpgradeModal('premium')}
                    className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
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

        {/* User Profile & Demo Switcher Footer */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          {/* Super Admin Shortcut if role is super_admin or quick switcher for pair programming demo */}
          <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-slate-400 font-mono">ROLE SWITCHER:</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase">{role}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  switchRole('restaurant_owner');
                  navigate('/dashboard');
                }}
                className={`py-1 text-[10px] font-bold rounded ${role === 'restaurant_owner' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                Owner
              </button>
              <button
                onClick={() => {
                  switchRole('super_admin');
                  navigate('/admin');
                }}
                className={`py-1 text-[10px] font-bold rounded ${role === 'super_admin' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'}`}
              >
                Super Admin
              </button>
            </div>
          </div>

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
        <Outlet />
      </main>
    </div>
  );
};
