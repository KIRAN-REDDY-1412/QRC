import React, { useState } from 'react';
import { usePlan } from '@/context/PlanContext';
import { useRestaurant } from '@/context/RestaurantContext';
import { PlanCode } from '@/types';
import { 
  CreditCard, 
  Crown, 
  Check, 
  AlertTriangle, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  ArrowUpRight, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const SubscriptionBilling: React.FC = () => {
  const { 
    currentSubscription, 
    plans, 
    payments, 
    openUpgradeModal, 
    scheduleDowngrade, 
    cancelSubscription,
    isTrial,
    trialDaysRemaining,
    isTrialExpired,
    simulateExpireTrial,
    resetTrial
  } = usePlan();

  const { currentRestaurant } = useRestaurant();
  const [showDowngradeNotice, setShowDowngradeNotice] = useState(false);
  const [selectedDowngradeTier, setSelectedDowngradeTier] = useState<PlanCode>('free');

  if (!currentRestaurant) return null;

  const activePlan = currentSubscription?.plan || plans[0];
  const isBasic = activePlan.code === 'basic' || activePlan.code === 'free';
  const isPremium = activePlan.code === 'premium' || activePlan.code === 'premium_plus';
  const displayPlans = plans.filter(p => p.code === 'basic' || p.code === 'premium');

  const startDateFormatted = currentSubscription?.current_period_start
    ? new Date(currentSubscription.current_period_start).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : 'Free Forever';

  const endDateFormatted = currentSubscription?.current_period_end
    ? new Date(currentSubscription.current_period_end).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : 'Never Expires';

  const handleTriggerDowngrade = (tier: PlanCode) => {
    setSelectedDowngradeTier(tier);
    setShowDowngradeNotice(true);
  };

  const confirmDowngrade = () => {
    scheduleDowngrade(selectedDowngradeTier);
    setShowDowngradeNotice(false);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              Billing & Entitlements
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Subscription & Plan Management</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">
            All prices are in Indian Rupees (₹). Graceful downgrades ensure your menus, dishes, and permanent QR codes are never deleted.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isBasic ? (
            <button
              onClick={() => openUpgradeModal('premium')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade to Premium Luxury</span>
            </button>
          ) : (
            <span className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
              <Crown className="w-4 h-4" /> Premium Luxury Active
            </span>
          )}
        </div>
      </div>

      {/* Current Subscription Card */}
      <div className="bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold ${
              isPremium 
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              <Crown className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  {isTrialExpired ? '7-Day Free Trial (Expired)' : isTrial ? '7-Day Free Trial' : activePlan.name}
                </h2>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isTrialExpired
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : isTrial
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : currentSubscription?.status === 'active' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {isTrialExpired 
                    ? 'Trial Expired' 
                    : isTrial 
                    ? `Trial: ${trialDaysRemaining}d Left`
                    : currentSubscription?.status === 'downgrade_scheduled' ? 'Downgrade Scheduled' : 'Active'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isTrialExpired 
                  ? 'Your 7-day free trial has expired. Subscribe to reactivate your restaurant.' 
                  : isTrial 
                  ? 'Full access enabled during your trial period. Upgrade anytime.' 
                  : activePlan.description}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block font-medium">Billed Rate</span>
            <div className="flex items-baseline gap-1 mt-0.5 sm:justify-end">
              <span className="text-2xl font-black text-white">
                ₹{(currentSubscription?.billing_cycle === 'yearly' ? activePlan.yearly_price : activePlan.monthly_price).toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400">/{currentSubscription?.billing_cycle || 'month'}</span>
            </div>
          </div>
        </div>

        {/* Subscription Timeline & Expiry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Billing Cycle</span>
            <span className="text-sm font-bold text-white capitalize">{currentSubscription?.billing_cycle || 'Monthly'}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Started On</span>
            <span className="text-sm font-bold text-white">{startDateFormatted}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Renews / Expiry</span>
            <span className="text-sm font-bold text-emerald-400">{endDateFormatted}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1">Auto-Renewal</span>
            <span className="text-sm font-bold text-white">
              {currentSubscription?.auto_renew ? 'Enabled (UPI / Cards)' : 'Turned Off'}
            </span>
          </div>
        </div>

        {/* Trial Expired Alert */}
        {isTrialExpired && (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950 via-red-900/60 to-slate-950 border border-red-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
              <div>
                <p className="font-extrabold text-white text-sm">Your 7-Day Free Trial Has Ended</p>
                <p className="mt-1 text-red-200/80">
                  Your restaurant menu is temporarily locked for diners. Subscribe to either the Basic Plan (₹399/mo) or Premium Plan (₹999/mo) to reactivate your digital menu immediately.
                </p>
              </div>
            </div>
            <button
              onClick={() => openUpgradeModal('basic')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black uppercase tracking-wider text-xs whitespace-nowrap shadow-lg shadow-amber-500/20"
            >
              Upgrade & Subscribe
            </button>
          </div>
        )}

        {/* Developer & Owner Trial Testing Sandbox Toolbar */}
        <div className="p-3 bg-slate-900/60 rounded-xl border border-dashed border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>🛠️ Trial Simulator (Testing Controls):</span>
          <div className="flex items-center gap-2">
            <button
              onClick={simulateExpireTrial}
              className="px-2.5 py-1 rounded bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 font-bold text-[10px] transition"
              title="Instantly sets trial to expired to test the paywall"
            >
              Simulate Expired Trial
            </button>
            <button
              onClick={resetTrial}
              className="px-2.5 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 font-bold text-[10px] transition"
              title="Resets back to a fresh 7-day trial"
            >
              Reset to 7-Day Trial
            </button>
          </div>
        </div>

        {/* Downgrade Action notice if scheduled */}
        {currentSubscription?.status === 'downgrade_scheduled' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-amber-200 text-xs">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-400" />
            <div>
              <p className="font-bold">Downgrade Scheduled at End of Period</p>
              <p className="mt-0.5 text-amber-300/80">
                You will retain full access to all your current features and luxury templates until {endDateFormatted}. On that date, your plan will transition gracefully without deleting any of your dishes or restaurant QR codes.
              </p>
            </div>
          </div>
        )}

        {/* Downgrade or Cancel Actions */}
        {isPremium && (
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Need to switch tiers? Switch to Basic Plan or manage renewal.
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTriggerDowngrade('basic')}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 transition"
              >
                Downgrade to Basic Plan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BOTH PLANS IN ONE FRAME (MONTHLY & YEARLY) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Available Subscription Plans (Both Plans In One Frame)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare Basic and Premium Luxury tiers. Both monthly and yearly rates visible side-by-side.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {displayPlans.map(plan => {
            const isPlanPremium = plan.code === 'premium';
            const isCurrent = activePlan.code === plan.code;
            const monthlyEquiv = Math.round(plan.yearly_price / 12);

            return (
              <div 
                key={plan.id}
                className={`p-6 rounded-3xl border flex flex-col justify-between relative ${
                  isPlanPremium 
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-amber-500/70 shadow-xl' 
                    : 'bg-slate-950 border-slate-800 shadow-lg'
                }`}
              >
                {isPlanPremium && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-full shadow-md flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    <span>Best Value &bull; All 15 Templates</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Current Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-4">{plan.description}</p>

                  {/* Dual Price Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800/80">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Monthly Billing</span>
                        <span className="text-lg font-black text-white">₹{plan.monthly_price}</span>
                        <span className="text-[10px] text-slate-400"> / month</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Flexible 30 days</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-amber-400 block text-[10px] uppercase font-bold">Yearly Billing</span>
                          <span className="text-[9px] bg-amber-400 text-slate-950 font-extrabold px-1 rounded">Save 25%</span>
                        </div>
                        <span className="text-lg font-black text-amber-300">₹{monthlyEquiv}</span>
                        <span className="text-[10px] text-slate-400"> / mo</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-white text-xs block">₹{plan.yearly_price.toLocaleString('en-IN')}</span>
                        <span className="text-[9px] text-slate-500 block">billed annually</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {plan.features.slice(0, 6).map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${isPlanPremium ? 'text-amber-400' : 'text-emerald-400'}`} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-slate-900 text-slate-400 text-xs font-bold border border-slate-800 text-center cursor-default"
                    >
                      Active Tier
                    </button>
                  ) : (
                    <button
                      onClick={() => openUpgradeModal(plan.code)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        isPlanPremium
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Switch to {plan.name}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Downgrade Modal Confirmation */}
      {showDowngradeNotice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-lg text-white">Graceful Downgrade Policy</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              We never delete your hard work! When you downgrade to the <strong className="text-white capitalize">{selectedDowngradeTier} plan</strong>:
            </p>

            <ul className="text-xs text-slate-400 space-y-2 pl-4 list-disc">
              <li>Your current paid tier remains active until <strong className="text-white">{endDateFormatted}</strong>.</li>
              <li>All menu categories, food items, prices, and food photos are safely preserved.</li>
              <li>Your permanent restaurant QR code URL remains 100% functional.</li>
              <li>If you currently have a locked template selected, your diner menu will fall back to an eligible free template without breaking.</li>
            </ul>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setShowDowngradeNotice(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Keep Current Plan
              </button>
              <button
                onClick={confirmDowngrade}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold"
              >
                Confirm Scheduled Downgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment and Invoice Audit History */}
      <div className="bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Payment & Invoice History</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">Audited via Razorpay</span>
        </div>

        {payments.length === 0 ? (
          <p className="text-xs text-slate-500 py-4">No payment records found yet.</p>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {payments.map(pay => (
              <div key={pay.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">₹{pay.amount.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold uppercase">
                      {pay.status}
                    </span>
                    <span className="text-xs text-slate-400 capitalize">({pay.billing_cycle})</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Invoice: {pay.invoice_number} • Txn: {pay.gateway_payment_id || 'RZP_DIRECT'}
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400">
                    {new Date(pay.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="block text-[11px] text-emerald-400 font-semibold">Verified</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
