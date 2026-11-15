import React, { useState, useEffect } from 'react';
import { Perfume, DecantSize } from '../types';
import { BottleVisual } from './BottleVisual';
import { X, MessageCircle, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useModalAnimation } from '../hooks/useModalAnimation';

interface ProductModalProps {
  perfume: Perfume | null;
  initialSize?: DecantSize;
  onClose: () => void;
  onAddToDiscoverySet?: (perfume: Perfume, size: DecantSize, price: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  perfume,
  initialSize,
  onClose,
  onAddToDiscoverySet,
}) => {
  const { isDark } = useTheme();

  const isPresent = Boolean(perfume);
  const { shouldRender, isAnimated } = useModalAnimation(isPresent, 300);
  const [activePerfume, setActivePerfume] = useState<Perfume | null>(perfume);

  useEffect(() => {
    if (perfume) {
      setActivePerfume(perfume);
    }
  }, [perfume]);

  const targetPerfume = activePerfume || perfume;

  const availableSizes = (['3ml', '5ml', '10ml', '15ml'] as DecantSize[]).filter(
    (size) => targetPerfume?.prices[size] !== undefined
  );

  const [selectedSize, setSelectedSize] = useState<DecantSize>(
    initialSize && targetPerfume?.prices[initialSize] !== undefined
      ? initialSize
      : availableSizes[0] || '5ml'
  );

  useEffect(() => {
    if (targetPerfume) {
      const sizes = (['3ml', '5ml', '10ml', '15ml'] as DecantSize[]).filter(
        (s) => targetPerfume.prices[s] !== undefined
      );
      if (initialSize && targetPerfume.prices[initialSize] !== undefined) {
        setSelectedSize(initialSize);
      } else if (sizes.length > 0 && (!selectedSize || targetPerfume.prices[selectedSize] === undefined)) {
        setSelectedSize(sizes[0]);
      }
    }
  }, [targetPerfume, initialSize]);

  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!shouldRender || !targetPerfume) return null;

  const activePrice = targetPerfume.prices[selectedSize] ?? 0;

  const generateWhatsAppUrl = () => {
    const message = `Hello D'Cantor, I would like to order: ${targetPerfume.name} (${selectedSize}). Please confirm availability and delivery details!`;
    return `https://wa.me/8801750050557?text=${encodeURIComponent(message)}`;
  };

  const handleAddDiscovery = () => {
    if (!targetPerfume.inStock || !onAddToDiscoverySet) return;
    onAddToDiscoverySet(targetPerfume, selectedSize, activePrice);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  // Estimate sprays
  const spraysEstimate: Record<DecantSize, string> = {
    '3ml': '~45-50 fine mist sprays (15-20 days of testing)',
    '5ml': '~75-80 sprays (approx 1 full month of regular wear)',
    '10ml': '~150-160 sprays (2+ months of daily signature wear)',
    '15ml': '~225-240 sprays (ideal travel flacon size)'
  };

  return (
    <div
      id="product-detail-modal-backdrop"
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto transition-opacity duration-300 ease-out ${
        isAnimated ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        id="product-detail-modal"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl p-5 sm:p-8 shadow-2xl transition-all duration-300 ease-out transform ${
          isAnimated ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
        } ${
          isDark
            ? 'bg-[#121118] border-t sm:border border-[#c5a059]/30 text-[#f5ede0]'
            : 'bg-[#FFFFFF] border-t sm:border border-[#EAE3D5] text-[#1A1615]'
        }`}
      >
        {/* Mobile Pull Handle Indicator */}
        <div className="sm:hidden flex justify-center pb-2 -mt-1">
          <div
            className={`w-12 h-1.5 rounded-full ${
              isDark ? 'bg-[#c5a059]/40' : 'bg-[#A67C2E]/30'
            }`}
          />
        </div>

        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-20 ${
            isDark
              ? 'bg-[#1c1926] text-[#b3a695] hover:text-[#f5ede0] hover:bg-[#282436]'
              : 'bg-[#F2ECE1] text-[#786D61] hover:text-[#1A1615] hover:bg-[#EAE2D3]'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: Visual Flacon Art */}
          <div
            className={`md:col-span-5 flex flex-col items-center justify-center rounded-xl p-6 border ${
              isDark
                ? 'bg-gradient-to-b from-[#1b1725] to-[#0c0a10] border-[#2b263a]'
                : 'bg-gradient-to-b from-[#FAF4EA] to-[#F2EADA] border-[#E8DFC0]'
            }`}
          >
            <BottleVisual perfume={targetPerfume} size="lg" />

            {/* In-Stock Status Badge */}
            <div className="mt-4">
              {targetPerfume.inStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock in Dhaka Vault
                </span>
              ) : (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    isDark
                      ? 'text-[#c5a059] bg-[#221c0e] border border-[#c5a059]/60'
                      : 'text-[#A67C2E] bg-[#FAF1DF] border border-[#A67C2E]/60'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#c5a059]' : 'bg-[#A67C2E]'}`} />
                  Restocking Soon
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Information & Order Action */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <span
                className={`text-xs uppercase tracking-[0.2em] font-medium ${
                  isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
                }`}
              >
                {targetPerfume.brand}
              </span>
              <h2
                className={`font-cinzel text-2xl sm:text-3xl font-bold leading-tight ${
                  isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
                }`}
              >
                {targetPerfume.name}
              </h2>
              <div
                className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs ${
                  isDark
                    ? 'bg-[#1f1b2c] border border-[#342e47] text-[#ded1c0]'
                    : 'bg-[#F2ECE1] border border-[#E0D7C9] text-[#554C42]'
                }`}
              >
                {targetPerfume.category}
              </div>
            </div>

            <p className={`text-sm leading-relaxed ${isDark ? 'text-[#b8ad9e]' : 'text-[#665E55]'}`}>
              {targetPerfume.description || "Authentic luxury decant from D'Cantor Dhaka. Laboratory extracted directly from original manufacturer flacons into premium glass atomizers with Teflon sealed threads."}
            </p>

            {/* Scent Accord Notes */}
            <div
              className={`p-3.5 rounded-xl border space-y-1.5 ${
                isDark
                  ? 'bg-[#171522] border-[#2d283c]'
                  : 'bg-[#FAF6F0] border-[#E8DFD0]'
              }`}
            >
              <div
                className={`flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase ${
                  isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Olfactory Notes</span>
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-[#ded5c7]' : 'text-[#4A4238]'}`}>
                {targetPerfume.notes}
              </p>
            </div>

            {/* Dynamic Decant Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  className={`text-xs uppercase tracking-wider font-medium ${
                    isDark ? 'text-[#9d9284]' : 'text-[#7D7366]'
                  }`}
                >
                  Select Decant Size
                </label>
                <span
                  className={`text-xs font-mono ${
                    isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
                  }`}
                >
                  {spraysEstimate[selectedSize]}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {availableSizes.map((size) => {
                  const isSelected = selectedSize === size;
                  const price = targetPerfume.prices[size];
                  return (
                    <button
                      key={size}
                      id={`modal-size-${size}`}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-h-[42px] flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all ${
                        isSelected
                          ? isDark
                            ? 'bg-[#c5a059] text-[#08080a] shadow-[0_0_15px_rgba(197,160,89,0.4)] font-bold'
                            : 'bg-[#A67C2E] text-white shadow-[0_0_10px_rgba(166,124,46,0.3)] font-bold'
                          : isDark
                          ? 'bg-[#181622] text-[#d6c7b2] border border-[#2c2838] hover:border-[#c5a059]/50'
                          : 'bg-[#F2ECE1] text-[#1A1615] border border-[#DFD6C7] hover:border-[#A67C2E]'
                      }`}
                    >
                      <div className="text-xs font-semibold">{size}</div>
                      <div className="text-[11px] font-mono opacity-85">৳{price}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className={`flex items-baseline justify-between pt-2 border-t ${isDark ? 'border-[#232030]' : 'border-[#EAE3D5]'}`}>
              <span className={`text-xs ${isDark ? 'text-[#9d9284]' : 'text-[#7D7366]'}`}>
                Decant Price ({selectedSize})
              </span>
              <div
                className={`text-2xl font-bold font-mono ${
                  isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
                }`}
              >
                ৳{activePrice.toLocaleString()}
              </div>
            </div>

            {/* Order Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <a
                id="modal-order-whatsapp-btn"
                href={targetPerfume.inStock ? generateWhatsAppUrl() : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 min-h-[44px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold tracking-wide shadow-lg transition-all ${
                  !targetPerfume.inStock
                    ? isDark
                      ? 'bg-[#1f1d26] text-[#696155] cursor-not-allowed border border-[#2a2732]'
                      : 'bg-[#ECE5D8] text-[#8E8475] cursor-not-allowed border border-[#DCD3C4]'
                    : isDark
                    ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b46d] text-[#08080a] hover:brightness-110 active:scale-98'
                    : 'bg-[#1A1615] text-[#FAF4E8] hover:bg-[#2C2420] border border-[#A67C2E]/40 active:scale-98'
                }`}
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{targetPerfume.inStock ? 'Order on WhatsApp' : 'Currently Restocking'}</span>
              </a>

              {targetPerfume.inStock && onAddToDiscoverySet && (
                <button
                  id="modal-add-cart-btn"
                  type="button"
                  onClick={handleAddDiscovery}
                  className={`min-h-[44px] px-4 py-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    addedAnimation
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400'
                      : isDark
                      ? 'bg-[#1a1725] text-[#c5a059] border-[#383149] hover:border-[#c5a059] hover:bg-[#231f32]'
                      : 'bg-[#FAF6F0] text-[#A67C2E] border-[#E0D7C9] hover:border-[#A67C2E] hover:bg-[#F2ECE1]'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-500">Added to Cart</span>
                    </>
                  ) : (
                    <span>+ Add to Cart</span>
                  )}
                </button>
              )}
            </div>

            {/* Purity Guarantee note */}
            <div className={`flex items-center gap-2 text-[11px] pt-2 ${isDark ? 'text-[#8e8477]' : 'text-[#7A7063]'}`}>
              <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`} />
              <span>Lab-sterile syringe extraction. 100% genuine juice guaranteed.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
