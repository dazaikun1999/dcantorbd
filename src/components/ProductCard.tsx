import React, { useState } from 'react';
import { Perfume, DecantSize } from '../types';
import { BottleVisual } from './BottleVisual';
import { MessageCircle, Check, Edit3, Power, Eye, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ProductCardProps {
  perfume: Perfume;
  isAdmin: boolean;
  onEdit: (perfume: Perfume) => void;
  onToggleStock: (id: number) => void;
  onViewDetails: (perfume: Perfume, initialSize?: DecantSize) => void;
  onAddToDiscoverySet?: (perfume: Perfume, size: DecantSize, price: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  perfume,
  isAdmin,
  onEdit,
  onToggleStock,
  onViewDetails,
  onAddToDiscoverySet,
}) => {
  const { isDark } = useTheme();

  // Available sizes for this specific perfume (e.g. only sizes with defined price)
  const availableSizes = (['3ml', '5ml', '10ml', '15ml'] as DecantSize[]).filter(
    (size) => perfume.prices[size] !== undefined
  );

  // Default to first available size (usually 3ml or 5ml)
  const [selectedSize, setSelectedSize] = useState<DecantSize>(
    availableSizes[0] || '5ml'
  );

  const [addedAnimation, setAddedAnimation] = useState(false);

  // Active price based on selected size
  const activePrice = perfume.prices[selectedSize] ?? 0;

  // WhatsApp order link without price details:
  // "Hello D'Cantor, I would like to order: [Perfume Name] ([Selected Size]). Please confirm availability and delivery details!"
  const generateWhatsAppUrl = () => {
    const message = `Hello D'Cantor, I would like to order: ${perfume.name} (${selectedSize}). Please confirm availability and delivery details!`;
    return `https://wa.me/8801750050557?text=${encodeURIComponent(message)}`;
  };

  const handleSizeClick = (e: React.MouseEvent, size: DecantSize) => {
    e.stopPropagation();
    setSelectedSize(size);
  };

  const handleOrderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!perfume.inStock) return;
    window.open(generateWhatsAppUrl(), '_blank', 'noopener,noreferrer');
  };

  const handleAddDiscoveryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!perfume.inStock || !onAddToDiscoverySet) return;
    onAddToDiscoverySet(perfume, selectedSize, activePrice);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  return (
    <div
      id={`fragrance-card-${perfume.id}`}
      onClick={() => onViewDetails(perfume, selectedSize)}
      className={`group relative flex flex-col justify-between rounded-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden ${
        isDark
          ? 'bg-[#121118] border border-[#23202e] hover:border-[#c5a059]/60 hover:shadow-[0_16px_36px_rgba(197,160,89,0.18)]'
          : 'bg-[#FFFFFF] border border-[#EAE3D5] hover:border-[#A67C2E]/60 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(166,124,46,0.14)]'
      }`}
    >
      {/* Admin Quick Toolbar */}
      {isAdmin && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute top-2 left-2 right-2 z-30 flex items-center justify-between px-2.5 py-1.5 rounded-lg backdrop-blur-md text-xs shadow-lg ${
            isDark
              ? 'bg-[#08080a]/95 border border-[#c5a059]/40 text-[#f5ede0]'
              : 'bg-[#FFFFFF]/95 border border-[#A67C2E]/40 text-[#1A1615]'
          }`}
        >
          <button
            id={`admin-stock-toggle-${perfume.id}`}
            type="button"
            onClick={() => onToggleStock(perfume.id)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded font-medium transition-colors ${
              perfume.inStock
                ? 'text-emerald-500 bg-emerald-950/40 hover:bg-emerald-900/60'
                : 'text-amber-500 bg-amber-950/40 hover:bg-amber-900/60'
            }`}
            title="Toggle stock availability"
          >
            <Power className="w-3 h-3" />
            <span>{perfume.inStock ? 'In Stock' : 'Out of Stock'}</span>
          </button>

          <button
            id={`admin-edit-btn-${perfume.id}`}
            type="button"
            onClick={() => onEdit(perfume)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
              isDark
                ? 'text-[#c5a059] hover:text-[#f5ede0] bg-[#1a1724]'
                : 'text-[#A67C2E] hover:text-[#1A1615] bg-[#F5EFE4]'
            }`}
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit</span>
          </button>
        </div>
      )}

      {/* Top Media & Badge Container */}
      <div
        className={`relative w-full pt-4 pb-2 overflow-hidden transition-colors ${
          isDark
            ? 'bg-gradient-to-b from-[#191722]/80 via-[#121118] to-[#121118]'
            : 'bg-gradient-to-b from-[#F7F2EA] via-[#FFFFFF] to-[#FFFFFF]'
        }`}
      >
        {/* Out of Stock Ribbon / Badge */}
        {!perfume.inStock ? (
          <div className="absolute top-3 right-3 z-20">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase shadow-md ${
                isDark
                  ? 'bg-[#231b0b] text-[#c5a059] border border-[#c5a059]/60'
                  : 'bg-[#FDF4E3] text-[#A67C2E] border border-[#A67C2E]/60'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? 'bg-[#c5a059]' : 'bg-[#A67C2E]'}`} />
              Restocking Soon
            </span>
          </div>
        ) : (
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] backdrop-blur-sm ${
                isDark
                  ? 'text-[#c5a059] bg-[#08080a]/80 border border-[#c5a059]/30'
                  : 'text-[#A67C2E] bg-[#FFFFFF]/90 border border-[#A67C2E]/30 shadow-xs'
              }`}
            >
              <Eye className="w-3 h-3" />
              Quick View
            </span>
          </div>
        )}

        {/* Bottle Visual with 3D Hover & Zoom */}
        <BottleVisual perfume={perfume} size="md" />
      </div>

      {/* Card Content Details - Generous padding and breathing room */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4">
        {/* Brand, Title & Scent Category */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`text-xs uppercase tracking-[0.18em] font-medium truncate ${
                isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
              }`}
            >
              {perfume.brand}
            </span>
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full whitespace-nowrap ${
                isDark
                  ? 'bg-[#1b1824] text-[#d6c7b2] border border-[#2b2738]'
                  : 'bg-[#F4EFE6] text-[#554D43] border border-[#E2DACB]'
              }`}
            >
              {perfume.category}
            </span>
          </div>

          <h3
            className={`font-cinzel text-base sm:text-lg font-bold leading-snug transition-colors line-clamp-2 min-h-[44px] flex items-center ${
              isDark
                ? 'text-[#f5ede0] group-hover:text-[#c5a059]'
                : 'text-[#1A1615] group-hover:text-[#A67C2E]'
            }`}
          >
            {perfume.name}
          </h3>

          <p
            className={`text-xs line-clamp-2 leading-relaxed min-h-[36px] ${
              isDark ? 'text-[#a99e90]' : 'text-[#665E55]'
            }`}
          >
            <span className={`font-medium ${isDark ? 'text-[#c5a059]/80' : 'text-[#A67C2E]'}`}>
              Notes:{' '}
            </span>
            {perfume.notes}
          </p>
        </div>

        {/* Dynamic Size Selector Pills (ONLY available sizes rendered) */}
        <div className={`pt-2 border-t ${isDark ? 'border-[#201d2a]' : 'border-[#EAE3D5]'}`}>
          <div className="flex items-center justify-between mb-1.5">
            <span
              className={`text-[10px] uppercase tracking-wider ${
                isDark ? 'text-[#9d9284]' : 'text-[#7D7366]'
              }`}
            >
              Select Decant Size:
            </span>
            <span
              className={`text-[10px] font-mono ${
                isDark ? 'text-[#c5a059]/90' : 'text-[#A67C2E]'
              }`}
            >
              {selectedSize === '3ml'
                ? '~45 sprays'
                : selectedSize === '5ml'
                ? '~75 sprays'
                : selectedSize === '10ml'
                ? '~150 sprays'
                : '~225 sprays'}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {availableSizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  id={`size-btn-${perfume.id}-${size}`}
                  type="button"
                  onClick={(e) => handleSizeClick(e, size)}
                  className={`min-h-[40px] flex items-center justify-center py-1.5 px-1 rounded-lg text-xs tracking-wider transition-all text-center ${
                    isSelected
                      ? isDark
                        ? 'bg-[#c5a059] text-[#08080a] shadow-[0_0_12px_rgba(197,160,89,0.4)] font-bold'
                        : 'bg-[#A67C2E] text-white shadow-[0_0_10px_rgba(166,124,46,0.35)] font-bold'
                      : isDark
                      ? 'bg-[#181622] text-[#d6c7b2] border border-[#2c2838] hover:border-[#c5a059]/50 hover:text-white'
                      : 'bg-[#F0EAE1] text-[#1A1615] border border-[#E0D6C5] hover:border-[#A67C2E] hover:text-[#A67C2E]'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price & Primary Action Section */}
        <div className="pt-2 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <span
              className={`text-[11px] uppercase tracking-wider ${
                isDark ? 'text-[#8e8578]' : 'text-[#7C7366]'
              }`}
            >
              {selectedSize} Decant Pour
            </span>
            <div className="flex items-baseline gap-1">
              <span className={`text-xs ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`}>৳</span>
              <span
                className={`text-xl font-bold font-mono tracking-tight ${
                  isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
                }`}
              >
                {activePrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons: WhatsApp Direct Order + Add to Multi-Decant Discovery Box */}
          <div className="flex items-center gap-2">
            <button
              id={`order-whatsapp-btn-${perfume.id}`}
              type="button"
              disabled={!perfume.inStock}
              onClick={handleOrderClick}
              className={`flex-1 min-h-[44px] flex items-center justify-center gap-1.5 py-3 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-md ${
                !perfume.inStock
                  ? isDark
                    ? 'bg-[#1e1c24] text-[#696155] cursor-not-allowed border border-[#2a2732]'
                    : 'bg-[#EAE4D8] text-[#8C8273] cursor-not-allowed border border-[#DCD3C4]'
                  : isDark
                  ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b46d] text-[#08080a] hover:brightness-110 active:scale-[0.98]'
                  : 'bg-[#1A1615] text-[#FAF4E8] hover:bg-[#2C2420] border border-[#A67C2E]/40 active:scale-[0.98]'
              }`}
              title={perfume.inStock ? 'Order direct on WhatsApp' : 'Currently restocking'}
            >
              <MessageCircle
                className={`w-4 h-4 shrink-0 fill-current ${
                  perfume.inStock && !isDark ? 'text-[#A67C2E]' : ''
                }`}
              />
              <span className="truncate">
                {perfume.inStock ? 'Order on WhatsApp' : 'Restocking Soon'}
              </span>
            </button>

            {/* Optional cart quick add */}
            {perfume.inStock && onAddToDiscoverySet && (
              <button
                id={`add-cart-btn-${perfume.id}`}
                type="button"
                onClick={handleAddDiscoveryClick}
                className={`min-h-[44px] min-w-[44px] flex items-center justify-center p-2.5 rounded-lg border transition-all shrink-0 ${
                  addedAnimation
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400'
                    : isDark
                    ? 'bg-[#191724] border-[#2d283c] text-[#c5a059] hover:bg-[#232032] hover:border-[#c5a059]'
                    : 'bg-[#FAF6F0] border-[#E0D7C8] text-[#A67C2E] hover:bg-[#F2ECE1] hover:border-[#A67C2E]'
                }`}
                title="Add to Cart"
                aria-label="Add to Cart"
              >
                {addedAnimation ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
