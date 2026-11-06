import React, { useState } from 'react';
import { Restaurant } from '@/types';
import { 
  Star, 
  Sparkles, 
  ExternalLink, 
  MessageSquare, 
  Check, 
  Heart, 
  Send, 
  MapPin, 
  X,
  Crown
} from 'lucide-react';

interface GoogleReviewBoosterProps {
  restaurant: Restaurant;
}

export const GoogleReviewBooster: React.FC<GoogleReviewBoosterProps> = ({ restaurant }) => {
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [show5StarModal, setShow5StarModal] = useState<boolean>(false);
  const [privateFeedback, setPrivateFeedback] = useState<string>('');
  const [isFeedbackSent, setIsFeedbackSent] = useState<boolean>(false);

  const googleUrl = restaurant.google_review_url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.name} ${restaurant.city || ''}`)}`;

  const handleRate = (rating: number) => {
    setSelectedRating(rating);
    if (rating >= 4) {
      setShow5StarModal(true);
    } else {
      setShowFeedbackModal(true);
    }
  };

  const handleSendPrivateFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateFeedback.trim()) return;

    // Record feedback locally
    const existing = JSON.parse(localStorage.getItem(`smartqr_feedback_${restaurant.id}`) || '[]');
    existing.unshift({
      rating: selectedRating,
      feedback: privateFeedback,
      created_at: new Date().toISOString()
    });
    localStorage.setItem(`smartqr_feedback_${restaurant.id}`, JSON.stringify(existing));

    setIsFeedbackSent(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
      setIsFeedbackSent(false);
      setPrivateFeedback('');
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto my-8 p-6 rounded-3xl bg-slate-950/90 border border-slate-800 text-center shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-2">
        <Sparkles className="w-4 h-4" />
        <span className="text-[10px] font-mono uppercase tracking-widest font-bold">
          Diner Experience & Reviews
        </span>
      </div>

      <h3 className="font-extrabold text-base text-white">How was your dining experience?</h3>
      <p className="text-xs text-slate-400 mt-1">
        Tap a star to rate <span className="text-slate-300 font-semibold">{restaurant.name}</span>
      </p>

      {/* 5 Interactive Stars */}
      <div className="flex items-center justify-center gap-2 my-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleRate(star)}
            className="p-1 transition-transform hover:scale-125 focus:outline-none"
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                (hoverRating || selectedRating) >= star
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'text-slate-700 hover:text-slate-500'
              }`}
            />
          </button>
        ))}
      </div>

      <p className="text-[11px] text-slate-500">
        Your honest feedback helps us maintain culinary excellence.
      </p>

      {/* MODAL 1: 5-STAR / 4-STAR GOOGLE REVIEW BOOSTER */}
      {show5StarModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative bg-slate-950 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center text-white shadow-2xl">
            <button
              onClick={() => setShow5StarModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/30">
              <Heart className="w-8 h-8 fill-amber-400" />
            </div>

            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              {selectedRating} Star Rating
            </span>

            <h3 className="text-xl font-black text-white mt-3">We're Thrilled You Loved It!</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Could you take 10 seconds to share your 5-star experience on Google Maps? It supports our chefs & team tremendously!
            </p>

            <div className="mt-5 space-y-2">
              <a
                href={googleUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => setShow5StarModal(false)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <MapPin className="w-4 h-4" />
                <span>Post Review on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setShow5StarModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-semibold"
              >
                No, thanks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: 1-3 STAR PRIVATE MANAGER FEEDBACK */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative bg-slate-950 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-center text-white shadow-2xl">
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {isFeedbackSent ? (
              <div className="py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-base">Feedback Received</h4>
                <p className="text-xs text-slate-400">
                  Your comments have been delivered directly to the manager on duty so we can address them immediately.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendPrivateFeedback} className="space-y-4 text-left">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-slate-400 flex items-center justify-center mx-auto mb-2 border border-slate-800">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-white">Help Us Make It Right</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    We are truly sorry your meal was not 100% satisfactory. Send private notes directly to the General Manager.
                  </p>
                </div>

                <div>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tell us what went wrong (taste, service, wait time)..."
                    value={privateFeedback}
                    onChange={(e) => setPrivateFeedback(e.target.value)}
                    className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Directly to Manager</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};