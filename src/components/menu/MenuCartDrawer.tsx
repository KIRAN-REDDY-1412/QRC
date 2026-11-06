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
  const [orderNotes, setOrderNotes] = useState<string>('');
  const [isSent, setIsSent] = useState<boolean>(false);

  const subtotal = cartItems.reduce((acc, ci) => acc + (ci.item.price * ci.quantity), 0);
  const gst = subtotal * 0.05; // 5% GST for dining in India
  const grandTotal = subtotal + gst;

  // Format WhatsApp Order Message
  const handleSendWhatsAppOrder = () => {
    const rawPhone = restaurant.whatsapp_number || restaurant.phone || '919820012345';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

    const lines = [
      `🍽️ *NEW DINE-IN ORDER*`,
      `📍 *${restaurant.name}*`,
      `🏷️ *Table:* ${tableNumber || 'Main Dining'}`,
      customerName ? `👤 *Guest:* ${customerName}` : null,
      `---------------------------------`,
      ...cartItems.map(ci => `• ${ci.quantity}x ${ci.item.name} - ₹${ci.item.price * ci.quantity}`),
      `---------------------------------`,
      `💵 *Subtotal:* ₹${subtotal.toFixed(2)}`,
      `🏛️ *GST (5%):* ₹${gst.toFixed(2)}`,
      `💰 *Grand Total:* ₹${grandTotal.toFixed(2)}`,
      orderNotes ? `\n📝 *Kitchen Note:* ${orderNotes}` : null,
      `\n⏱️ Sent via SmartQR Digital Menu`
    ].filter(Boolean);

    const message = lines.join('\n');
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    // Save order in local storage
    saveStoredOrder({
      id: `ord-${Date.now()}`,
      restaurant_id: restaurant.id,
      table_number: tableNumber || 'Main Dining',
      customer_name: customerName,
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
    }, 800);
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

              {/* Special Instructions */}
              <div className="pt-2">
                <input
                  type="text"
                  placeholder="Special instructions (e.g. less spicy, no onion)..."
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
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (5%)</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-white text-sm pt-1 border-t border-slate-800">
                <span>Grand Total</span>
                <span className="text-emerald-400 text-base">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              {/* WhatsApp Order Dispatch Button */}
              <button
                onClick={handleSendWhatsAppOrder}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                {isSent ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isSent ? 'Opening WhatsApp...' : 'Send Order to Kitchen'}</span>
              </button>

              {/* Request Bill & UPI Button */}
              <button
                onClick={() => {
                  onClose();
                  onOpenUpiPayment();
                }}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs transition flex items-center justify-center gap-2 border border-amber-500/30"
              >
                <CreditCard className="w-4 h-4 text-amber-400" />
                <span>Pay via UPI</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};