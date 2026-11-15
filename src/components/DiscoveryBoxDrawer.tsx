import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, MessageCircle, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useModalAnimation } from '../hooks/useModalAnimation';

interface DiscoveryBoxDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearAll: () => void;
}

export const DiscoveryBoxDrawer: React.FC<DiscoveryBoxDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearAll,
}) => {
  const { shouldRender, isAnimated } = useModalAnimation(isOpen, 300);
  const { isDark } = useTheme();

  if (!shouldRender) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDecantsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const generateMultiItemWhatsAppUrl = () => {
    let message = "Hello D'Cantor, I would like to order this decant selection:\n";
    items.forEach((item, idx) => {
      message += `${idx + 1}. ${item.perfume.name} (${item.selectedSize}) x${item.quantity}\n`;
    });
    message += "\nPlease confirm availability and delivery details!";

    return `https://wa.me/8801750050557?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Backdrop overlay */}
      <div
        id="cart-modal-backdrop"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isAnimated ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Cart Drawer Panel */}
      <div
        id="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[480px] max-w-full h-full shadow-2xl flex flex-col justify-between overflow-hidden transform transition-transform duration-300 ease-in-out ${
          isAnimated ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        } ${
          isDark
            ? 'bg-[#121118] border-l border-[#c5a059]/30 text-[#f5ede0]'
            : 'bg-[#FFFFFF] border-l border-[#EAE3D5] text-[#1A1615]'
        }`}
      >
        {/* Drawer Header */}
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${isDark ? 'border-[#252132]' : 'border-[#EAE3D5]'}`}>
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg border ${
                isDark
                  ? 'bg-[#1a1725] border-[#39324a] text-[#c5a059]'
                  : 'bg-[#FAF4EA] border-[#E5DACB] text-[#A67C2E]'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2
                className={`font-cinzel text-lg font-bold ${
                  isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
                }`}
              >
                Your Cart
              </h2>
              <p className={`text-xs ${isDark ? 'text-[#9c9182]' : 'text-[#7A7063]'}`}>
                {totalDecantsCount} {totalDecantsCount === 1 ? 'decant pour' : 'decant pours'} selected
              </p>
            </div>
          </div>

          <button
            id="close-cart-drawer-btn"
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'bg-[#191624] text-[#a49887] hover:text-[#f5ede0]'
                : 'bg-[#F2ECE1] text-[#7A7063] hover:text-[#1A1615]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div
                className={`w-16 h-16 rounded-full border flex items-center justify-center ${
                  isDark
                    ? 'bg-[#181523] border-[#2e293c] text-[#c5a059]'
                    : 'bg-[#FAF4EA] border-[#E8DFD0] text-[#A67C2E]'
                }`}
              >
                <ShoppingBag className="w-8 h-8 opacity-60" />
              </div>
              <h3
                className={`font-cinzel text-base font-bold ${
                  isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
                }`}
              >
                Your Cart is Empty
              </h3>
              <p className={`text-xs max-w-xs leading-relaxed ${isDark ? 'text-[#9d9282]' : 'text-[#6E6458]'}`}>
                Add 3ml, 5ml, 10ml, or 15ml decants from our collection to bundle your order together via WhatsApp!
              </p>
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-xl font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all ${
                  isDark
                    ? 'bg-[#c5a059] text-[#08080a]'
                    : 'bg-[#A67C2E] text-white shadow-md'
                }`}
              >
                Browse Fragrances
              </button>
            </div>
          ) : (
            <>
              <div className={`flex items-center justify-between text-xs pb-1 ${isDark ? 'text-[#8e8476]' : 'text-[#7D7264]'}`}>
                <span>Selected Fragrances</span>
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-rose-500 hover:text-rose-600 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              {items.map((item, idx) => (
                <div
                  key={`${item.perfume.id}-${item.selectedSize}`}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 shadow-sm transition-colors ${
                    isDark
                      ? 'bg-[#171422] border-[#2b263b]'
                      : 'bg-[#FAF6F0] border-[#E8DFD0]'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-[10px] uppercase tracking-wider font-medium truncate ${
                        isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
                      }`}
                    >
                      {item.perfume.brand}
                    </div>
                    <div
                      className={`font-cinzel text-sm font-bold truncate ${
                        isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
                      }`}
                    >
                      {item.perfume.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          isDark
                            ? 'bg-[#241f32] text-[#c5a059] border-[#372f4a]'
                            : 'bg-[#F0EAE1] text-[#A67C2E] border-[#DFD6C7]'
                        }`}
                      >
                        {item.selectedSize}
                      </span>
                      <span
                        className={`text-xs font-mono ${
                          isDark ? 'text-[#ded5c7]' : 'text-[#5E554B]'
                        }`}
                      >
                        ৳{item.price.toLocaleString()} each
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Delete */}
                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`flex items-center gap-1 rounded-lg p-0.5 border ${
                        isDark
                          ? 'bg-[#1f1a2c] border-[#352e47]'
                          : 'bg-[#FFFFFF] border-[#DDD3C3]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(idx, item.quantity - 1)}
                        className={`p-1 rounded ${
                          isDark ? 'text-[#a69989] hover:text-white' : 'text-[#7D7264] hover:text-[#1A1615]'
                        }`}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span
                        className={`w-6 text-center text-xs font-mono font-bold ${
                          isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
                        }`}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(idx, item.quantity + 1)}
                        className={`p-1 rounded ${
                          isDark ? 'text-[#a69989] hover:text-white' : 'text-[#7D7264] hover:text-[#1A1615]'
                        }`}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(idx)}
                      className={`p-1 transition-colors ${
                        isDark ? 'text-[#84786a] hover:text-rose-400' : 'text-[#9E9385] hover:text-rose-600'
                      }`}
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Drawer Footer / Sticky Checkout */}
        {items.length > 0 && (
          <div
            className={`p-4 sm:p-5 border-t space-y-3 sm:space-y-4 sticky bottom-0 z-20 shadow-[0_-8px_20px_rgba(0,0,0,0.12)] ${
              isDark
                ? 'border-[#252132] bg-[#0d0c13]'
                : 'border-[#EAE3D5] bg-[#FAF5EB]'
            }`}
          >
            <div className="space-y-1.5">
              <div className={`flex items-baseline justify-between text-xs ${isDark ? 'text-[#9d9181]' : 'text-[#7D7264]'}`}>
                <span>Total Decants</span>
                <span className="font-mono">{totalDecantsCount} units</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span
                  className={`font-cinzel text-sm font-bold ${
                    isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
                  }`}
                >
                  Estimated Order Total
                </span>
                <span
                  className={`text-2xl font-bold font-mono ${
                    isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
                  }`}
                >
                  ৳{totalAmount.toLocaleString()}
                </span>
              </div>
              <p className={`text-[11px] ${isDark ? 'text-[#796f63]' : 'text-[#8E8375]'}`}>
                *Exact delivery charge calculated upon Dhaka or Nationwide address confirmation on WhatsApp.
              </p>
            </div>

            <a
              id="cart-whatsapp-order-btn"
              href={generateMultiItemWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide shadow-lg hover:brightness-110 active:scale-98 transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b46d] text-[#08080a]'
                  : 'bg-[#1A1615] text-[#FAF4E8] hover:bg-[#2A2320] border border-[#A67C2E]/50'
              }`}
            >
              <MessageCircle className={`w-4 h-4 fill-current ${!isDark ? 'text-[#25D366]' : ''}`} />
              <span>Send Full Order to WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
