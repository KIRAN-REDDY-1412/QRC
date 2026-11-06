import React, { useState, useEffect } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import { usePlan } from '@/context/PlanContext';
import { TableBooking } from '@/types';
import { getStoredBookings, updateBookingStatus } from '@/lib/supabase';
import { 
  Grid, 
  Plus, 
  Trash2, 
  QrCode, 
  Lock, 
  Crown, 
  Users, 
  Calendar, 
  Clock, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Send,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TablesManagement: React.FC = () => {
  const { currentRestaurant, tables, addTable, deleteTable } = useRestaurant();
  const { canAccessFeature, openUpgradeModal } = usePlan();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'tables' | 'bookings'>('tables');

  // New Table Form States
  const [tableNumber, setTableNumber] = useState('');
  const [sectionName, setSectionName] = useState('Main Hall');
  const [capacity, setCapacity] = useState(4);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Bookings list state
  const [bookings, setBookings] = useState<TableBooking[]>([]);

  useEffect(() => {
    if (currentRestaurant) {
      setBookings(getStoredBookings(currentRestaurant.id));
    }
  }, [currentRestaurant?.id]);

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

  const handleStatusChange = (bookingId: string, status: TableBooking['status']) => {
    updateBookingStatus(bookingId, status);
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  };

  const openWhatsAppGuest = (booking: TableBooking) => {
    const phone = booking.customer_phone.replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('91') ? phone : `91${phone}`;
    const text = encodeURIComponent(
      `Hello ${booking.customer_name}! Greetings from ${currentRestaurant.name}. 🍽️\n` +
      `Regarding your Table Reservation (#${booking.id}) for ${booking.guest_count} guest(s) on ${booking.booking_date} at ${booking.booking_time}:\n` +
      `Your table in the ${booking.seating_section || 'dining area'} is all set! We look forward to hosting you.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Grid className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              Seating & Reservations
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">Tables & Menu Bookings</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage table-specific QR codes and live diner reservations submitted through your contactless digital menu.
          </p>
        </div>

        {activeTab === 'tables' && (
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
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('tables')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'tables'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Floor Plan & Tables ({tables.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'bookings'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Menu Table Reservations ({bookings.length})</span>
          {pendingCount > 0 && (
            <span className="px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[10px] font-black animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: TABLES FLOOR PLAN */}
      {activeTab === 'tables' && (
        <div className="space-y-6">
          {!canUseTableQR && (
            <div className="p-6 rounded-3xl bg-slate-950 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Table QR Codes are a Premium Feature</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Enable guests to open table-tagged menus (e.g. Table 5, Rooftop VIP 1) so your waitstaff instantly knows their exact table location!
                  </p>
                </div>
              </div>
              <button
                onClick={() => openUpgradeModal('premium')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg transition whitespace-nowrap"
              >
                <Crown className="w-4 h-4" /> Upgrade Plan
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
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Get QR</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: TABLE RESERVATIONS FROM MENU */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            {bookings.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Table Reservations Yet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  When diners tap "Book Table" on your digital QR menu, their reservation requests will appear here instantly.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80">
                {bookings.map(booking => (
                  <div 
                    key={booking.id}
                    className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition hover:bg-slate-900/40"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400">#{booking.id}</span>
                        <h4 className="text-base font-bold text-white">{booking.customer_name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          booking.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : booking.status === 'seated'
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                            : booking.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-mono text-white">{booking.customer_phone}</span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <span className="font-bold text-white">{booking.guest_count} Person(s)</span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-bold text-white">{booking.booking_date}</span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-bold text-amber-300">{booking.booking_time}</span>
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          Area: {booking.seating_section || 'Main Dining'}
                        </span>
                      </div>

                      {booking.special_notes && (
                        <p className="text-xs text-slate-400 bg-slate-900/80 p-2 rounded-xl border border-slate-800/80 max-w-xl">
                          <span className="font-bold text-slate-300">Guest Note:</span> {booking.special_notes}
                        </p>
                      )}
                    </div>

                    {/* Quick Booking Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => openWhatsAppGuest(booking)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition"
                        title="Chat on WhatsApp"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>

                      {booking.status !== 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm</span>
                        </button>
                      )}

                      {booking.status !== 'seated' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'seated')}
                          className="px-3 py-1.5 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 text-teal-300 border border-teal-500/40 text-xs font-bold transition"
                        >
                          Mark Seated
                        </button>
                      )}

                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-800 text-xs font-semibold transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl">
            <h3 className="font-bold text-lg text-white mb-4">Add New Dining Table</h3>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Table Name / Number *</label>
                <input
                  type="text"
                  required
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g. Table 1, Courtyard VIP 2"
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
