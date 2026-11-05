import React, { useState } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { usePlan } from '@/context/PlanContext';
import { Grid, Plus, Trash2, QrCode, Lock, Crown, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TablesManagement: React.FC = () => {
  const { currentRestaurant, tables, addTable, deleteTable } = useRestaurant();
  const { canAccessFeature, openUpgradeModal } = usePlan();
  const navigate = useNavigate();

  const [tableNumber, setTableNumber] = useState('');
  const [sectionName, setSectionName] = useState('Main Hall');
  const [capacity, setCapacity] = useState(4);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!currentRestaurant) return null;

  const canUseTableQR = canAccessFeature('table_qr');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber) return;
    if (!canUseTableQR) {
      openUpgradeModal('premium_plus');
      return;
    }
    addTable(tableNumber, sectionName, capacity);
    setTableNumber('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Grid className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              Seating & Floor Plan
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Table-Specific QR Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Generate dedicated QR codes per table to track orders and know exactly which table diners are seated at.
          </p>
        </div>

        <button
          onClick={() => {
            if (!canUseTableQR) {
              openUpgradeModal('premium_plus');
            } else {
              setIsModalOpen(true);
            }
          }}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Dining Table</span>
        </button>
      </div>

      {!canUseTableQR && (
        <div className="p-6 rounded-3xl bg-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Table QR Codes are a Premium Plus Luxury Feature</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Enable guests to open table-tagged menus (e.g. Table 5, Rooftop VIP 1) so your waitstaff instantly knows their exact table location!
              </p>
            </div>
          </div>
          <button
            onClick={() => openUpgradeModal('premium_plus')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition whitespace-nowrap"
          >
            <Crown className="w-4 h-4" /> Upgrade to Premium Plus
          </button>
        </div>
      )}

      {/* Tables List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map(tbl => (
          <div
            key={tbl.id}
            className="bg-slate-950 p-5 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  {tbl.section_name}
                </span>
                <button
                  onClick={() => deleteTable(tbl.id)}
                  className="text-slate-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-extrabold text-lg text-white">{tbl.table_number}</h3>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Seating capacity: {tbl.capacity} guests</span>
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 truncate max-w-[140px]">
                ?table={encodeURIComponent(tbl.table_number)}
              </span>

              <button
                onClick={() => navigate('/dashboard/qr-code')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>Get Standee</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Table Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-white">Add Dining Table</h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Table Identifier / Number *</label>
                <input
                  type="text"
                  required
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. Table 12, Rooftop VIP 2"
                  className="w-full px-3.5 py-2.5 bg-slate-950 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Dining Section</label>
                  <input
                    type="text"
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                    placeholder="Courtyard, Terrace"
                    className="w-full px-3.5 py-2.5 bg-slate-950 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-950 text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg"
                >
                  Save Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
