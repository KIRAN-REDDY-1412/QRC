import React, { useState } from 'react';
import { usePlan } from '@/context/PlanContext';
import { useRestaurant } from '@/context/RestaurantContext';
import { useAuth } from '@/context/AuthContext';
import { Settings, Lock, Crown, Check, ShieldCheck, Bell } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentSubscription, canAccessFeature, openUpgradeModal } = usePlan();
  const { currentRestaurant } = useRestaurant();
  const { user } = useAuth();

  const [removeBranding, setRemoveBranding] = useState(
    currentSubscription?.plan?.remove_saas_branding || false
  );
  const [notifyOnScan, setNotifyOnScan] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const canRemoveBranding = canAccessFeature('custom_branding');

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
            Platform Preferences
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">Restaurant Account Settings</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure SaaS branding visibility, sound notifications, and restaurant account credentials.
        </p>
      </div>

      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
        {/* Remove SaaS Branding Toggle */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">White-label: Remove "Powered by SmartQR Menu"</h3>
              {!canRemoveBranding && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Premium Feature
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-md leading-relaxed">
              Remove all platform branding from the bottom of your customer-facing QR menu to showcase 100% of your own restaurant identity.
            </p>
          </div>

          <button
            onClick={() => {
              if (!canRemoveBranding) {
                openUpgradeModal('premium');
                return;
              }
              setRemoveBranding(!removeBranding);
            }}
            className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
              removeBranding && canRemoveBranding ? 'bg-emerald-600' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                removeBranding && canRemoveBranding ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Currency Setting */}
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-white">Menu Currency</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Configured for restaurants across India.
            </p>
          </div>
          <span className="font-mono font-bold text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
            ₹ Indian Rupee (INR)
          </span>
        </div>

        {/* User Account Info */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-white">Account Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Owner Email</span>
              <span className="font-semibold text-white mt-0.5 block">{user?.email}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 block">Assigned Role</span>
              <span className="font-semibold text-emerald-400 uppercase mt-0.5 block">{user?.role}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg"
          >
            {isSaved ? <Check className="w-4 h-4" /> : null}
            <span>{isSaved ? 'Preferences Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
