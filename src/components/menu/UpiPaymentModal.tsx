import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Smartphone, 
  Check, 
  Copy, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  ExternalLink,
  CreditCard
} from 'lucide-react';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  upiId?: string;
  totalAmount: number;
  tableNumber: string;
  orderId?: string;
  onPaymentSuccess?: () => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  restaurantName,
  upiId = 'saffrondarbar@okaxis',
  totalAmount,
  tableNumber,
  orderId = `ORD-${Date.now().toString().slice(-4)}`,
  onPaymentSuccess
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);

  // Construct UPI Deep Link
  const effectiveUpiId = upiId || 'saffrondarbar@okaxis';
  const upiUri = `upi://pay?pa=${encodeURIComponent(effectiveUpiId)}&pn=${encodeURIComponent(restaurantName)}&am=${totalAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Table ${tableNumber} Bill ${orderId}`)}`;

  useEffect(() => {
    if (isOpen) {
      generateUpiQr();
      setIsPaid(false);
      setIsVerifying(false);
    }
  }, [isOpen, upiUri]);

  const generateUpiQr = async () => {
    try {
      const url = await QRCode.toDataURL(upiUri, {
        width: 600,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error('Error generating UPI QR code:', err);
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(effectiveUpiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleConfirmPaid = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsPaid(true);
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative bg-slate-950 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {isPaid ? (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Payment Received
              </span>
              <h3 className="text-xl font-extrabold text-white mt-2">Bill Settled Successfully!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Thank you for dining at <strong className="text-white">{restaurantName}</strong>. A receipt has been registered for Table {tableNumber}.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
            >
              Back to Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Instant Tabletop UPI Payment</span>
              </div>
              <h3 className="text-lg font-black text-white">{restaurantName}</h3>
              <p className="text-xs text-slate-400">Table: {tableNumber} • Bill Total</p>
              <div className="text-3xl font-black text-emerald-400 mt-1">
                ₹{totalAmount.toFixed(2)}
              </div>
            </div>

            {/* Dynamic UPI QR Code Display */}
            <div className="p-4 rounded-3xl bg-white shadow-xl flex flex-col items-center">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="UPI QR Code" className="w-48 h-48 object-contain" />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mt-1 flex items-center gap-1">
                Scan with any UPI App (GPay / PhonePe / Paytm)
              </span>
            </div>

            {/* Mobile Deep Link Buttons */}
            <div className="space-y-2">
              <a
                href={upiUri}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Smartphone className="w-4 h-4" />
                <span>Pay via UPI App on this Phone</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">UPI ID</span>
                  <span className="font-mono text-slate-200 text-xs">{effectiveUpiId}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Copy UPI ID"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Confirm Paid Action */}
            <button
              onClick={handleConfirmPaid}
              disabled={isVerifying}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4 text-emerald-400" />
              )}
              <span>{isVerifying ? 'Verifying with Kitchen...' : 'I Have Completed Payment'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};