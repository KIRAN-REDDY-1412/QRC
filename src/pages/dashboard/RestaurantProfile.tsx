import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { Store, Save, Check, Upload, Image as ImageIcon, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export const RestaurantProfile: React.FC = () => {
  const { currentRestaurant, updateRestaurantProfile, uploadImage } = useRestaurant();

  if (!currentRestaurant) return null;

  const [name, setName] = useState(currentRestaurant.name);
  const [tagline, setTagline] = useState(currentRestaurant.tagline || '');
  const [description, setDescription] = useState(currentRestaurant.description || '');
  const [phone, setPhone] = useState(currentRestaurant.phone || '');
  const [email, setEmail] = useState(currentRestaurant.email || '');
  const [fssai, setFssai] = useState(currentRestaurant.fssai_license || '');
  const [address, setAddress] = useState(currentRestaurant.address || '');
  const [city, setCity] = useState(currentRestaurant.city || '');
  const [state, setState] = useState(currentRestaurant.state || '');
  const [pincode, setPincode] = useState(currentRestaurant.pincode || '');
  const [openingTime, setOpeningTime] = useState(currentRestaurant.opening_time || '11:00 AM');
  const [closingTime, setClosingTime] = useState(currentRestaurant.closing_time || '11:00 PM');
  const [isPureVeg, setIsPureVeg] = useState(currentRestaurant.is_pure_veg || false);
  const [logoUrl, setLogoUrl] = useState(currentRestaurant.logo_url || '');
  const [bannerUrl, setBannerUrl] = useState(currentRestaurant.banner_url || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantProfile({
      name,
      tagline,
      description,
      phone,
      email,
      fssai_license: fssai,
      address,
      city,
      state,
      pincode,
      opening_time: openingTime,
      closing_time: closingTime,
      is_pure_veg: isPureVeg,
      logo_url: logoUrl,
      banner_url: bannerUrl
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    setLogoUrl(url);
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    setBannerUrl(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Restaurant Profile</h1>
        <p className="text-xs text-slate-400 mt-1">
          Update restaurant contact info, Indian FSSAI license, operating hours, and brand logos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Brand Details */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Brand Identity</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Restaurant Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Tagline / Concept</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Royal Awadhi & Mughlai Cuisine"
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">About / Story</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-900 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Logo and Banner Upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Restaurant Logo</label>
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <img src={logoUrl} alt="" className="w-16 h-16 rounded-2xl object-cover border border-slate-700" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500">
                    <Store className="w-6 h-6" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Hero Banner Image</label>
              <div className="flex items-center gap-3">
                {bannerUrl ? (
                  <img src={bannerUrl} alt="" className="w-20 h-16 rounded-2xl object-cover border border-slate-700" />
                ) : (
                  <div className="w-20 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Operations in India */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Indian Regulatory & Operations</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                FSSAI Food License Number
              </label>
              <input
                type="text"
                value={fssai}
                onChange={(e) => setFssai(e.target.value)}
                placeholder="14-digit FSSAI No. (e.g. 11521008000451)"
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPureVeg}
                  onChange={(e) => setIsPureVeg(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 accent-emerald-500"
                />
                <span className="text-xs font-bold text-emerald-400">100% Pure Vegetarian Restaurant (FSSAI)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Opening Time</label>
              <input
                type="text"
                value={openingTime}
                onChange={(e) => setOpeningTime(e.target.value)}
                placeholder="11:00 AM"
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Closing Time</label>
              <input
                type="text"
                value={closingTime}
                onChange={(e) => setClosingTime(e.target.value)}
                placeholder="11:30 PM"
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Location & Contact */}
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Contact & Address</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Official Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98200 12345"
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Official Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@restaurant.in"
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Shop No. 4, Ground Floor, Heritage Enclave"
              className="w-full px-3.5 py-2.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Maharashtra"
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="400001"
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? 'Profile Updated!' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
