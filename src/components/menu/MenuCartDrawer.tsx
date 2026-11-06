import React, { useState } from 'react';
import { MenuItem, CartItem, Restaurant } from '@/types';
import { saveStoredOrder } from '@/lib/supabase';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  Send, 
  CreditCard, 
  Bell, 
  Utensils, 
  Sparkles, 
  Check, 
  MessageSquare,
  Smartphone
} from 'lucide-react';

interface MenuCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant;
  tableNumber: string;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onOpenUpiPayment: () => void;
}

export const MenuCartDrawer: React.FC<MenuCartDrawerProps> = ({
  isOpen,
  onClose,
  restaurant,
  tableNumber,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenUpiPayment
}) => {
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [isSent, setIsSent] = useState<boolean>(false);

  const subtotal = cartItems.reduce((acc, ci) => acc + (ci.item.price * ci.quantity), 0);
  const gst = subtotal * 0.05; // 5% GST for dining in India
  const grandTotal = subtotal + gst;

  // Format WhatsApp Order Message
  const handleSendWhatsAppOrder = () => {
    const rawPhone = (restaurant.whatsapp_number || restaurant.phone || '919820012345').replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;

    const lines = [
      `🍽️ *NEW FOOD ORDER - ${restaurant.name.toUpperCase()}*`,
      `🏷️ *Order Type:* ${orderType === 'dine_in' ? `Dine-In (${tableNumber || 'Table 1'})` : 'Takeaway / Parcel'}`,
      customerName ? `👤 *Customer Name:* ${customerName}` : null,
      customerPhone ? `📞 *Customer Phone:* ${customerPhone}` : null,
      `---------------------------------`,
      `🛒 *ITEMS ORDERED:*`,
      ...cartItems.map(ci => `• ${ci.quantity}x ${ci.item.name} - ₹${ci.item.price * ci.quantity}`),
      `---------------------------------`,
      `💵 *Item Subtotal:* ₹${subtotal.toFixed(2)}`,
      `🏛️ *GST (5%):* ₹${gst.toFixed(2)}`,
      `💰 *Total Amount Payable:* ₹${grandTotal.toFixed(2)}`,
      orderNotes ? `\n📝 *Kitchen Special Instructions:* ${orderNotes}` : null,
      `\n✅ Please confirm my food order and estimated preparation time. Thank you!`
    ].filter(Boolean);

    const message = lines.join('\n');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    // Save order in local storage
    saveStoredOrder({
      id: `ord-${Date.now()}`,
      restaurant_id: restaurant.id,
      table_number: orderType === 'dine_in' ? (tableNumber || 'Table 1') : 'Takeaway',
      customer_name: customerName,
      customer_phone: customerPhone,
      items: cartItems,
      subtotal,
      tax: gst,
      total_amount: grandTotal,
      status: 'new',
      payment_status: 'pending',
      created_at: new Date().toISOString()
    });

    setIsSent(true);
    setTimeout(() => {
      window.open(waUrl, '_blank');
      onClearCart();
      setIsSent(false);
      onClose();
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="relative bg-slate-950 border border-slate-800 rounded-t-[32px] sm:rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Your Table Order</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {tableNumber || 'Table 1'}
                </span>
              </div>
              <p className="text-xs text-slate-400">{restaurant.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-[11px] text-slate-400 hover:text-rose-400 transition font-semibold px-2 py-1"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 no-scrollbar bg-slate-950">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Utensils className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="font-bold text-white text-sm">Your order is empty</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Tap "+ Add" on any dish in the menu to build your table's order.
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Browse Menu Dishes
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {cartItems.map(({ item, quantity }) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-white truncate">{item.name}</h4>
                      <span className="text-xs font-bold text-amber-400 block mt-0.5">
                        ₹{item.price * quantity}
                        <span className="text-[10px] text-slate-500 font-normal ml-1">
                          (₹{item.price} each)
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Quantity Buttons */}
                  <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-xl">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition"
                    >
                      {quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-400" /> : <Minus className="w-3 h-3" />}
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-white">{quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center transition"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Order Options & Customer Details */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                {/* Dine-In vs Takeaway */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('dine_in')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      orderType === 'dine_in'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Dine-In ({tableNumber || 'Table 1'})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      orderType === 'takeaway'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Takeaway / Parcel</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-500 font-mono"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Special instructions (e.g. less spicy, extra chutney)..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions & Bill Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/95 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({cartItems.reduce((acc, ci) => acc + ci.quantity, 0)} items)</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (5%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-white text-sm pt-1 border-t border-slate-800">
                <span>Total Amount Payable</span>
                <span className="text-emerald-400 text-base">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              {/* WhatsApp Order Dispatch Button */}
              <button
                onClick={handleSendWhatsAppOrder}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20ba5a] hover:to-[#0f7a6c] text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 active:scale-95"
              >
                {isSent ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>Opening WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>Order via WhatsApp</span>
                  </>
                )}
              </button>

              {/* Request Bill & UPI Button */}
              <button
                onClick={() => {
                  onClose();
                  onOpenUpiPayment();
                }}
                className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs transition flex items-center justify-center gap-2 border border-amber-500/30 whitespace-nowrap"
              >
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>Pay via UPI</span>
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-400">
              📲 Dispatches your complete order directly to {restaurant.name}'s official WhatsApp for instant kitchen confirmation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};