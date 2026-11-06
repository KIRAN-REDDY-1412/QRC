import React, { useState } from 'react';
import { usePlan } from '@/context/PlanContext';
import { useRestaurant } from '@/context/RestaurantContext';
import { useAuth } from '@/context/AuthContext';
import { 
  Settings, 
  Lock, 
  Crown, 
  Check, 
  ShieldCheck, 
  Bell, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle,
  XCircle
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentSubscription, canAccessFeature, openUpgradeModal } = usePlan();
  const { currentRestaurant } = useRestaurant();
  const { user, changePassword } = useAuth();

  const [removeBranding, setRemoveBranding] = useState(
    currentSubscription?.plan?.remove_saas_branding || false
  );
  const [notifyOnScan, setNotifyOnScan] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const canRemoveBranding = canAccessFeature('custom_branding');

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!newPassword || newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(newPassword);
      setPasswordSuccess('Password successfully updated! Your new password is now active.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 5000);
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to update password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
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
          Configure SaaS branding visibility, menu currency, and restaurant owner security credentials.
        </p>
      </div>

      {/* Main Settings Card */}
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

      {/* Owner Security & Password Management Card */}
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-extrabold text-white">Owner Security & Password</h2>
          </div>
          <p className="text-xs text-slate-400">
            Change your account password to protect access to your restaurant dashboard and financial configurations.
          </p>
        </div>

        {passwordSuccess && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300">Current Password</label>
              {currentPassword && (
                <button
                  type="button"
                  onClick={() => setCurrentPassword('')}
                  className="text-[10px] text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                autoComplete="current-password"
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400 pr-10 font-mono placeholder:font-sans placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                title={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300">New Password *</label>
              {newPassword && (
                <button
                  type="button"
                  onClick={() => setNewPassword('')}
                  className="text-[10px] text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create new password (min. 6 characters)"
                autoComplete="new-password"
                required
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400 pr-10 font-mono placeholder:font-sans placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                title={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-300">Confirm New Password *</label>
              {confirmPassword && (
                <button
                  type="button"
                  onClick={() => setConfirmPassword('')}
                  className="text-[10px] text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password to verify"
                autoComplete="new-password"
                required
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-amber-400 pr-10 font-mono placeholder:font-sans placeholder:text-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                title={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isChangingPassword || !newPassword || !confirmPassword}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isChangingPassword ? 'Saving Password...' : 'Update Password'}</span>
            </button>

            {(currentPassword || newPassword || confirmPassword) && (
              <button
                type="button"
                onClick={() => {
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setPasswordError(null);
                }}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold rounded-xl border border-slate-800 transition"
              >
                Reset Fields
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
