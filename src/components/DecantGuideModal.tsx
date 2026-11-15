import React from 'react';
import { X, ShieldCheck, Droplets, Package, Sparkles, Award } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useModalAnimation } from '../hooks/useModalAnimation';

interface DecantGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DecantGuideModal: React.FC<DecantGuideModalProps> = ({ isOpen, onClose }) => {
  const { shouldRender, isAnimated } = useModalAnimation(isOpen, 300);
  const { isDark } = useTheme();

  if (!shouldRender) return null;

  return (
    <div
      id="decant-guide-modal-backdrop"
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto transition-opacity duration-300 ease-out ${
        isAnimated ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        id="decant-guide-modal"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-3xl my-auto max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-300 ease-out transform ${
          isAnimated ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
        } ${
          isDark
            ? 'bg-[#121118] border border-[#c5a059]/30 text-[#f5ede0]'
            : 'bg-[#FFFFFF] border border-[#EAE3D5] text-[#1A1615]'
        }`}
      >
        {/* Close Button */}
        <button
          id="close-guide-modal-btn"
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isDark
              ? 'bg-[#1c1926] text-[#b3a695] hover:text-[#f5ede0] hover:bg-[#282436]'
              : 'bg-[#F2ECE1] text-[#7A7063] hover:text-[#1A1615] hover:bg-[#EAE2D3]'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase border ${
              isDark
                ? 'text-[#c5a059] bg-[#1a1725] border-[#c5a059]/40'
                : 'text-[#A67C2E] bg-[#FAF4EA] border-[#A67C2E]/40'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>The D'Cantor Standard</span>
          </div>
          <h2
            className={`font-cinzel text-2xl sm:text-3xl font-bold ${
              isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
            }`}
          >
            Decant Authenticity & Sizing Guide
          </h2>
          <p className={`text-sm ${isDark ? 'text-[#a89c8d]' : 'text-[#665E55]'}`}>
            Everything you need to know about our medical-precision decanting method and genuine perfume pours in Dhaka.
          </p>
        </div>

        {/* 4 Pillars of Authenticity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div
            className={`p-4 rounded-xl border space-y-2 ${
              isDark
                ? 'bg-[#161320] border-[#2b2538]'
                : 'bg-[#FAF6F0] border-[#E8DFD0]'
            }`}
          >
            <div className={`flex items-center gap-2 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`}>
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-cinzel text-sm font-bold">100% Original Flacons Only</h3>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-[#a49887]' : 'text-[#6A6054]'}`}>
              Every single drop of perfume is decanted straight from verified, authentic retail and niche designer bottles. No clones, zero dilution, and no alcohol fillers.
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-2 ${
              isDark
                ? 'bg-[#161320] border-[#2b2538]'
                : 'bg-[#FAF6F0] border-[#E8DFD0]'
            }`}
          >
            <div className={`flex items-center gap-2 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`}>
              <Droplets className="w-5 h-5" />
              <h3 className="font-cinzel text-sm font-bold">Laboratory Syringe Extraction</h3>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-[#a49887]' : 'text-[#6A6054]'}`}>
              We employ sterile, medical-grade syringes dedicated per fragrance. Zero cross-contamination, ensuring the original olfactory pyramid remains pristine.
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-2 ${
              isDark
                ? 'bg-[#161320] border-[#2b2538]'
                : 'bg-[#FAF6F0] border-[#E8DFD0]'
            }`}
          >
            <div className={`flex items-center gap-2 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`}>
              <Package className="w-5 h-5" />
              <h3 className="font-cinzel text-sm font-bold">Thick Glass & Teflon Seal</h3>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-[#a49887]' : 'text-[#6A6054]'}`}>
              Decanted into thick ultraviolet-resistant glass atomizers with fine-mist gold pumps and Teflon-wrapped threads to prevent leakages and evaporation.
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border space-y-2 ${
              isDark
                ? 'bg-[#161320] border-[#2b2538]'
                : 'bg-[#FAF6F0] border-[#E8DFD0]'
            }`}
          >
            <div className={`flex items-center gap-2 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`}>
              <Sparkles className="w-5 h-5" />
              <h3 className="font-cinzel text-sm font-bold">Dark Vault Climate Storage</h3>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-[#a49887]' : 'text-[#6A6054]'}`}>
              All mother bottles are stored in a temperature-controlled dark vault away from direct sunlight, humidity, and heat to preserve top note brightness.
            </p>
          </div>
        </div>

        {/* Decant Volume Table */}
        <div className="mb-6 space-y-3">
          <h3
            className={`font-cinzel text-base font-bold flex items-center gap-2 ${
              isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
            }`}
          >
            <span>Decant Size Breakdown</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div
              className={`p-3.5 rounded-xl border space-y-1 ${
                isDark ? 'bg-[#171422] border-[#2e283d]' : 'bg-[#FAF6F0] border-[#EAE3D5]'
              }`}
            >
              <span className={`text-lg font-bold font-mono ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`}>
                3ml
              </span>
              <div className={`text-[11px] font-semibold ${isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'}`}>
                ~45-50 Sprays
              </div>
              <div className={`text-[10px] ${isDark ? 'text-[#918677]' : 'text-[#7D7264]'}`}>
                15 to 20 test wears. Perfect for blind-buy discovery before committing.
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border space-y-1 ${
                isDark ? 'bg-[#171422] border-[#2e283d]' : 'bg-[#FAF6F0] border-[#EAE3D5]'
              }`}
            >
              <span className={`text-lg font-bold font-mono ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`}>
                5ml
              </span>
              <div className={`text-[11px] font-semibold ${isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'}`}>
                ~75-80 Sprays
              </div>
              <div className={`text-[10px] ${isDark ? 'text-[#918677]' : 'text-[#7D7264]'}`}>
                Over 1 month of regular wear. Our most popular decant size for rotation.
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border space-y-1 ${
                isDark ? 'bg-[#171422] border-[#2e283d]' : 'bg-[#FAF6F0] border-[#EAE3D5]'
              }`}
            >
              <span className={`text-lg font-bold font-mono ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`}>
                10ml
              </span>
              <div className={`text-[11px] font-semibold ${isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'}`}>
                ~150-160 Sprays
              </div>
              <div className={`text-[10px] ${isDark ? 'text-[#918677]' : 'text-[#7D7264]'}`}>
                2+ months of daily use. Generous volume that fits seamlessly in your suit pocket or travel kit.
              </div>
            </div>

            <div
              className={`p-3.5 rounded-xl border space-y-1 ${
                isDark ? 'bg-[#171422] border-[#2e283d]' : 'bg-[#FAF6F0] border-[#EAE3D5]'
              }`}
            >
              <span className={`text-lg font-bold font-mono ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`}>
                15ml
              </span>
              <div className={`text-[11px] font-semibold ${isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'}`}>
                ~225-240 Sprays
              </div>
              <div className={`text-[10px] ${isDark ? 'text-[#918677]' : 'text-[#7D7264]'}`}>
                Heavy rotation decant. Equivalent to a mini retail travel spray at a fraction of the cost.
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div
          className={`pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDark ? 'border-[#232030]' : 'border-[#EAE3D5]'
          }`}
        >
          <div className={`text-xs ${isDark ? 'text-[#8e8374]' : 'text-[#7D7264]'}`}>
            Have a custom decant request or looking for a specific vintage batch?
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all ${
              isDark ? 'bg-[#c5a059] text-[#08080a]' : 'bg-[#A67C2E] text-white shadow-md'
            }`}
          >
            Got It, Back to Catalog
          </button>
        </div>
      </div>
    </div>
  );
};
