import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { usePlan } from '@/context/PlanContext';
import { Languages, Check, Plus, Globe, Lock, Crown } from 'lucide-react';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  isActive: boolean;
}

export const LanguagesManager: React.FC = () => {
  const { currentRestaurant, items, categories } = useRestaurant();
  const { canAccessFeature, openUpgradeModal } = usePlan();

  const [availableLanguages, setAvailableLanguages] = useState<LanguageOption[]>([
    { code: 'en', name: 'English', nativeName: 'English', isActive: true },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', isActive: true },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', isActive: false },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', isActive: false },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', isActive: false },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', isActive: false }
  ]);

  const [savedNotice, setSavedNotice] = useState(false);

  if (!currentRestaurant) return null;

  const canUseMultiLanguage = canAccessFeature('multi_language');

  const toggleLanguage = (code: string) => {
    if (!canUseMultiLanguage) {
      openUpgradeModal('premium');
      return;
    }
    setAvailableLanguages(prev =>
      prev.map(l => l.code === code ? { ...l, isActive: !l.isActive } : l)
    );
  };

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Languages className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              Multi-Language Localization
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Menu Languages & Regional Translations</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Empower local diners to browse your menu in Hindi, Marathi, Gujarati, or regional Indian languages.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          {savedNotice ? <Check className="w-4 h-4" /> : <Languages className="w-4 h-4" />}
          <span>{savedNotice ? 'Translations Saved!' : 'Save Languages'}</span>
        </button>
      </div>

      {!canUseMultiLanguage && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Multi-Language Menu is a Premium Feature</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Indian diners love viewing descriptions in their mother tongue. Upgrade to Premium to enable regional language selection on your QR menu!
              </p>
            </div>
          </div>
          <button
            onClick={() => openUpgradeModal('premium')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition whitespace-nowrap"
          >
            <Crown className="w-4 h-4" /> Upgrade to Premium
          </button>
        </div>
      )}

      {/* Languages List */}
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Supported Indian Languages</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {availableLanguages.map(lang => (
            <div
              key={lang.code}
              onClick={() => toggleLanguage(lang.code)}
              className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                lang.isActive
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <span className="font-bold text-sm block">{lang.name}</span>
                <span className="text-xs text-slate-400 font-serif">{lang.nativeName}</span>
              </div>
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                lang.isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
              }`}>
                {lang.isActive ? <Check className="w-3.5 h-3.5" /> : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Translation Editor Note */}
      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-white">
          <Globe className="w-4 h-4 text-emerald-400" />
          <h3 className="font-bold text-sm">Culinary Precision Note</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Traditional Indian culinary names (like "Dal Makhani", "Galouti Kebab", "Zafrani Shahi Tukda") carry unique regional identities. SmartQR Menu preserves these authentic spellings across scripts and lets restaurant owners fine-tune every translation description manually.
        </p>
      </div>
    </div>
  );
};
