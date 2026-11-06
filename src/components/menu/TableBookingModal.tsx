import React, { useState } from 'react';
import { Restaurant, RestaurantTable, TableBooking } from '@/types';
import { saveStoredBooking } from '@/lib/supabase';
import { 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  User, 
  CheckCircle2, 
  MessageSquare, 
  X, 
  Sparkles, 
  MapPin,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TableBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant;
  tables?: RestaurantTable[];
}

export const TableBookingModal: React.FC<TableBookingModalProps> = ({
  isOpen,
  onClose,
  restaurant,
  tables = []
}) => {
  const [guests, setGuests] = useState<number>(2);
  const [customGuests, setCustomGuests] = useState<string>('');
  
  // Date options: Today, Tomorrow, or custom
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Time slots
  const TIME_SLOTS = [
    '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM'
  ];
  const [selectedTime, setSelectedTime] = useState<string>('08:00 PM');

  // Contact details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [seatingSection, setSeatingSection] = useState('Main Dining');
  const [specialNotes, setSpecialNotes] = useState('');

  // Confirmation state
  const [confirmedBooking, setConfirmedBooking] = useState<TableBooking | null>(null);

  if (!isOpen) return null;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    const finalGuests = customGuests ? Number(customGuests) : guests;

    const newBooking: TableBooking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      restaurant_id: restaurant.id,
      customer_name: customerName,
      customer_phone: customerPhone,
      guest_count: finalGuests,
      booking_date: selectedDate,
      booking_time: selectedTime,
      seating_section: seatingSection,
      special_notes: specialNotes,
      status: 'confirmed',
      created_at: new Date().toISOString()
    };

    saveStoredBooking(newBooking);
    setConfirmedBooking(newBooking);

    // Celebration effect
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleWhatsAppNotify = () => {
    if (!confirmedBooking) return;
    const rawPhone = (restaurant.whatsapp_number || restaurant.phone || '9876543210').replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;

    const text = encodeURIComponent(
      `Hello ${restaurant.name}! 🍽️\n\nI have submitted a Table Reservation:\n` +
      `• Booking ID: #${confirmedBooking.id}\n` +
      `• Name: ${confirmedBooking.customer_name}\n` +
      `• Phone: ${confirmedBooking.customer_phone}\n` +
      `• Guests: ${confirmedBooking.guest_count} Person(s)\n` +
      `• Date: ${confirmedBooking.booking_date}\n` +
      `• Time: ${confirmedBooking.booking_time}\n` +
      `• Section: ${confirmedBooking.seating_section || 'Any'}\n` +
      (confirmedBooking.special_notes ? `• Special Notes: ${confirmedBooking.special_notes}\n` : '') +
      `\nPlease confirm our table. Thank you!`
    );

    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handleClose = () => {
    setConfirmedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div 
        className="w-full max-w-lg bg-slate-950 border border-amber-500/30 rounded-3xl p-6 text-white shadow-2xl relative my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                Contactless Dine-In Reservation
              </span>
              <h2 className="text-lg font-bold text-white leading-tight">
                Reserve a Table &bull; {restaurant.name}
              </h2>
            </div>
          </div>
          <button 
            onClick={handleClose} 
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {confirmedBooking ? (
          /* CONFIRMATION SCREEN */
          <div className="space-y-5 text-center py-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                Table Reserved Successfully
              </span>
              <h3 className="text-xl font-extrabold text-white mt-2">
                Booking ID #{confirmedBooking.id}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                We look forward to hosting you at {restaurant.name}. Your reservation has been recorded.
              </p>
            </div>

            {/* Booking Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Guest Name:</span>
                <span className="font-bold text-white">{confirmedBooking.customer_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Date & Time:</span>
                <span className="font-bold text-amber-300">
                  {confirmedBooking.booking_date} at {confirmedBooking.booking_time}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Party Size:</span>
                <span className="font-bold text-white">{confirmedBooking.guest_count} Person(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Seating Area:</span>
                <span className="font-bold text-white">{confirmedBooking.seating_section}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleWhatsAppNotify}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25"
              >
                <Send className="w-4 h-4" />
                <span>Send Confirmation to Restaurant WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close & Return to Menu
              </button>
            </div>
          </div>
        ) : (
          /* RESERVATION FORM */
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            
            {/* Number of Guests */}
            <div>
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Party Size (Guests) *</span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 4, 6, 8].map(count => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => { setGuests(count); setCustomGuests(''); }}
                    className={`py-2 rounded-xl text-xs font-bold transition ${
                      guests === count && !customGuests
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {count} {count === 1 ? 'Guest' : 'Guests'}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Reservation Date *</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDate(todayStr)}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    selectedDate === todayStr
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(tomorrowStr)}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    selectedDate === tomorrowStr
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  Tomorrow
                </button>
                <input
                  type="date"
                  value={selectedDate}
                  min={todayStr}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-2 py-1.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {/* Time Slot */}
            <div>
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Preferred Seating Time *</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto pr-1">
                {TIME_SLOTS.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition ${
                      selectedTime === slot
                        ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Seating Section Preference */}
            <div>
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Seating Area</span>
              </label>
              <select
                value={seatingSection}
                onChange={(e) => setSeatingSection(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
              >
                <option value="Main Dining">Main Dining Hall</option>
                <option value="Courtyard">Open Courtyard</option>
                <option value="Rooftop Lounge">Rooftop Sky Lounge</option>
                <option value="VIP Lounge">VIP Private Salon</option>
                <option value="Any Available">First Available Table</option>
              </select>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Your Full Name *</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">WhatsApp / Phone *</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-900 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Special Request */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Special Occasion / Notes (Optional)
              </label>
              <input
                type="text"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="e.g. Birthday anniversary, quiet corner table, high chair needed"
                className="w-full px-3.5 py-2 bg-slate-900 text-white text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 placeholder:text-slate-600"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Confirm Reservation for {customGuests || guests} Person(s)</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
