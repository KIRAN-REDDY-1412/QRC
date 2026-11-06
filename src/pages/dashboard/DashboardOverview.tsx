import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '@/context/RestaurantContext';
import { usePlan } from '@/context/PlanContext';
import { getScanCount } from '@/lib/supabase';
import { 
  UtensilsCrossed, 
  FolderTree, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  CreditCard, 
  Clock, 
  ExternalLink, 
  Plus, 
  Palette, 
  Crown,
  Sparkles,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const { currentRestaurant, categories, items } = useRestaurant();
  const { 
    currentSubscription, 
    openUpgradeModal, 
    isTrial, 
    trialDaysRemaining, 
    isTrialExpired 
  } = usePlan();
  const navigate = useNavigate();

  if (!currentRestaurant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-slate-950 rounded-3xl border border-slate-800">
        <UtensilsCrossed className="w-12 h-12 text-slate-600 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No Restaurant Found</h2>
        <p className="text-xs text-slate-400 max-w-md mb-6">
          You don't have an active restaurant profile yet. Set up your restaurant details to start adding menu items, generating QR codes, and receiving WhatsApp orders.
        </p>
        <button
          onClick={() => navigate('/dashboard/profile')}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition"
        >
          Create Restaurant Profile
        </button>
      </div>
    );
  }

  const totalItems = items.length;
  const totalCategories = categories.length;
  const availableItems = items.filter(i => i.is_available).length;
  const unavailableItems = items.filter(i => !i.is_available).length;
  const qrScans = getScanCount(currentRestaurant.id);

  const plan = currentSubscription?.plan;
  const isFree = plan?.code === 'free';
  const isPremiumPlus = plan?.code === 'premium_plus';

  const expiryDate = currentSubscription?.current_period_end 
    ? new Date(currentSubscription.current_period_end).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : 'Never (Free Forever)';

  const cards = [
    {
      title: 'Total Menu Items',
      value: totalItems,
      icon: UtensilsCrossed,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      change: `${availableItems} active right now`
    },
    {
      title: 'Menu Categories',
      value: totalCategories,
      icon: FolderTree,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      change: 'Structured dining sections'
    },
    {
      title: 'Total QR Scans',
      value: qrScans.toLocaleString('en-IN'),
      icon: QrCode,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      change: '+18% scans this week'
    },
    {
      title: 'Available / Out of Stock',
      value: `${availableItems} / ${unavailableItems}`,
      icon: CheckCircle2,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10 border-teal-500/20',
      change: unavailableItems > 0 ? `${unavailableItems} items sold out` : '100% available'
    },
    {
      title: isTrialExpired ? 'Trial Status' : isTrial ? '7-Day Free Trial' : 'Current Plan',
      value: isTrialExpired 
        ? 'Trial Ended' 
        : isTrial 
        ? `${trialDaysRemaining} Days Left` 
        : (plan?.name || 'Basic Plan'),
      icon: isTrialExpired ? AlertCircle : (isTrial || isPremiumPlus ? Crown : CreditCard),
      color: isTrialExpired ? 'text-red-400' : isTrial ? 'text-amber-300' : (isPremiumPlus ? 'text-amber-300' : 'text-emerald-400'),
      bg: isTrialExpired ? 'bg-red-500/15 border-red-500/30' : isTrial ? 'bg-amber-500/15 border-amber-500/30' : (isPremiumPlus ? 'bg-amber-500/15 border-amber-500/30' : 'bg-emerald-500/10 border-emerald-500/20'),
      change: isTrialExpired ? 'Upgrade to Reactivate' : isTrial ? `Trial Ends: ${expiryDate}` : `Renews: ${expiryDate}`
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          {currentRestaurant.logo_url && (
            <img 
              src={currentRestaurant.logo_url} 
              alt="" 
              className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shadow-md"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">{currentRestaurant.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live & Serving
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Permanent QR Menu URL:{' '}
              <span className="font-mono text-emerald-400">/menu/{currentRestaurant.slug}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/menu/${currentRestaurant.slug}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1.5"
          >
            <span>Preview Diner Menu</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          {isFree && (
            <button
              onClick={() => openUpgradeModal('premium')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Upgrade Plan</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${card.bg} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{card.title}</span>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="mt-3">
                <div className="text-2xl font-black text-white">{card.value}</div>
                <div className="text-[11px] text-slate-400 mt-1">{card.change}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Quick Restaurant Actions</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => navigate('/dashboard/menu')}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition flex flex-col items-center text-center group"
          >
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition mb-2">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200">Add Food Item</span>
          </button>

          <button
            onClick={() => navigate('/dashboard/menu')}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition flex flex-col items-center text-center group"
          >
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition mb-2">
              <FolderTree className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200">Add Category</span>
          </button>

          <button
            onClick={() => navigate('/dashboard/templates')}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition flex flex-col items-center text-center group"
          >
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition mb-2">
              <Palette className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200">Change Template</span>
          </button>

          <button
            onClick={() => navigate('/dashboard/qr-code')}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition flex flex-col items-center text-center group"
          >
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition mb-2">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200">Download QR</span>
          </button>

          <button
            onClick={() => window.open(`/menu/${currentRestaurant.slug}`, '_blank')}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition flex flex-col items-center text-center group"
          >
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition mb-2">
              <ExternalLink className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200">Live Preview</span>
          </button>

          <button
            onClick={() => openUpgradeModal(isFree ? 'premium' : 'premium_plus')}
            className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition flex flex-col items-center text-center group"
          >
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition mb-2">
              <Crown className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200">Upgrade Tier</span>
          </button>
        </div>
      </div>

      {/* Recent Menu Items Activity & Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
              <span>Menu Item Highlights</span>
            </h3>
            <button
              onClick={() => navigate('/dashboard/menu')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Manage all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {items.slice(0, 4).map(item => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {item.image_url ? (
                    <img src={item.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500">
                      <UtensilsCrossed className="w-4 h-4" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.name}</h4>
                    <span className="text-[11px] font-mono text-emerald-400">₹{item.price}</span>
                  </div>
                </div>

                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.is_available ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {item.is_available ? 'Available' : 'Sold Out'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan & QR Standee Status */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>Permanent Restaurant QR Code</span>
              </h3>
              <button
                onClick={() => navigate('/dashboard/qr-code')}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                Print Studio <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your restaurant's QR code points to your permanent digital menu URL. Even if you edit dishes, update prices, or change design templates, the physical printed QR code never needs to be reprinted!
            </p>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Diner Destination</span>
              <span className="font-mono text-xs text-emerald-400 font-bold truncate block max-w-[220px]">
                https://smartqr.in/menu/{currentRestaurant.slug}
              </span>
            </div>
            <button
              onClick={() => navigate('/dashboard/qr-code')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
            >
              Get Standee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
