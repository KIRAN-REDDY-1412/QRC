import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  ShieldCheck, 
  Store, 
  CreditCard, 
  LayoutTemplate, 
  Receipt, 
  ArrowLeft, 
  LogOut, 
  Menu, 
  X,
  BarChart2
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Strict Super Admin Access Gate
  if (!user || user.role !== 'super_admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const adminNav = [
    { name: 'Platform Overview', path: '/admin', icon: BarChart2 },
    { name: 'All Restaurants', path: '/admin/restaurants', icon: Store },
    { name: 'Subscription Plans & Pricing', path: '/admin/pricing', icon: CreditCard },
    { name: 'Template Entitlements', path: '/admin/templates', icon: LayoutTemplate },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
            SA
          </div>
          <span className="font-bold text-sm text-white">SmartQR Super Admin</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:static ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Header */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
                SA
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block leading-none">Super Admin</span>
                <span className="text-[10px] text-amber-400 font-mono tracking-wider">PLATFORM PORTAL</span>
              </div>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5">
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
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

        {/* Return to Dashboard and User Info */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <button
            onClick={() => {
              navigate('/dashboard');
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-bold transition flex items-center justify-center gap-2 border border-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Restaurant Dashboard</span>
          </button>

          <div className="flex items-center justify-between pt-1">
            <div className="truncate max-w-[130px]">
              <p className="text-xs font-bold text-white truncate">Super Admin</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Logout"
              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 min-w-0 bg-slate-900 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
