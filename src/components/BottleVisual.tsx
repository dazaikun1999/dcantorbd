import React from 'react';
import { Perfume } from '../types';

interface BottleVisualProps {
  perfume: Perfume;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BottleVisual: React.FC<BottleVisualProps> = ({
  perfume,
  className = '',
  size = 'md',
}) => {
  // If user provided a valid image URL
  if (perfume.image && perfume.image.trim() !== '') {
    return (
      <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
        <img
          src={perfume.image}
          alt={perfume.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121118] via-transparent to-transparent opacity-60" />
      </div>
    );
  }

  // Determine elegant color palette based on scent category & notes
  const getJuiceGradient = () => {
    const cat = perfume.category.toLowerCase();
    const notes = perfume.notes.toLowerCase();

    if (cat.includes('aquatic') || cat.includes('blue') || cat.includes('oceanic')) {
      return {
        liquidGrad: 'from-cyan-900/60 via-blue-950/70 to-slate-950/90',
        glow: 'rgba(56, 189, 248, 0.25)',
        capColor: '#d4af37',
        acc: '#38bdf8',
        tintName: 'Azure Vault'
      };
    }
    if (cat.includes('sweet') || cat.includes('fruity') || cat.includes('gourmand')) {
      return {
        liquidGrad: 'from-amber-700/60 via-orange-950/70 to-neutral-950/90',
        glow: 'rgba(245, 158, 11, 0.25)',
        capColor: '#c5a059',
        acc: '#fbbf24',
        tintName: 'Golden Nectar'
      };
    }
    if (cat.includes('spicy') || cat.includes('leather') || cat.includes('vanilla')) {
      return {
        liquidGrad: 'from-rose-950/70 via-amber-950/80 to-stone-950/90',
        glow: 'rgba(217, 119, 6, 0.25)',
        capColor: '#e5c158',
        acc: '#d97706',
        tintName: 'Sultry Amber'
      };
    }
    if (cat.includes('green') || cat.includes('fougere')) {
      return {
        liquidGrad: 'from-emerald-950/60 via-teal-950/70 to-zinc-950/90',
        glow: 'rgba(16, 185, 129, 0.25)',
        capColor: '#c5a059',
        acc: '#34d399',
        tintName: 'Verdant Mist'
      };
    }
    if (cat.includes('smoky') || cat.includes('birch') || cat.includes('woody')) {
      return {
        liquidGrad: 'from-neutral-800/70 via-stone-900/80 to-[#08080a]',
        glow: 'rgba(197, 160, 89, 0.2)',
        capColor: '#c5a059',
        acc: '#c5a059',
        tintName: 'Noir Smoke'
      };
    }

    // Default luxury amber gold
    return {
      liquidGrad: 'from-amber-900/50 via-[#1a151b] to-[#0d0c11]',
      glow: 'rgba(197, 160, 89, 0.25)',
      capColor: '#c5a059',
      acc: '#c5a059',
      tintName: 'Pure Decant'
    };
  };

  const palette = getJuiceGradient();
  const heightScale = size === 'lg' ? 'h-64' : size === 'sm' ? 'h-36' : 'h-48';

  return (
    <div className={`relative w-full ${heightScale} flex items-center justify-center p-4 select-none overflow-hidden ${className}`}>
      {/* Ambient subtle glow */}
      <div
        className="absolute w-28 h-28 rounded-full blur-2xl opacity-40 transition-opacity duration-500 group-hover:opacity-80"
        style={{ backgroundColor: palette.glow }}
      />

      {/* Styled Luxury Glass Atomizer Bottle Graphic */}
      <div className="relative z-10 flex flex-col items-center transition-transform duration-500 group-hover:scale-105">
        {/* Sprayer Pump / Cap */}
        <div className="flex flex-col items-center">
          {/* Metal Atomizer Nozzle Tip */}
          <div className="w-2.5 h-3 bg-gradient-to-r from-[#8a6e30] via-[#ffd97a] to-[#8a6e30] rounded-t-sm shadow-inner" />
          {/* Gold Brushed Heavy Cap */}
          <div className="w-7 h-8 bg-gradient-to-r from-[#947631] via-[#e5c158] to-[#785f26] rounded-t-md shadow-lg border border-[#ffd97a]/40 relative overflow-hidden">
            <div className="absolute inset-x-0 top-1 h-[1px] bg-white/40" />
            <div className="absolute left-1.5 inset-y-0 w-[2px] bg-white/25" />
          </div>
          {/* Atomizer Collar Ring */}
          <div className="w-9 h-2 bg-gradient-to-r from-[#6e5621] via-[#ffd97a] to-[#6e5621] shadow-md border-b border-[#3b2d10]" />
        </div>

        {/* Flacon Glass Body */}
        <div className="relative w-20 h-28 rounded-b-lg rounded-t-sm border border-[#c5a059]/35 bg-gradient-to-b from-[#1c1822]/90 via-[#100e16]/95 to-[#09080c] shadow-[0_10px_25px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col items-center justify-between p-1.5 backdrop-blur-sm">
          {/* Beveled glass highlight reflections */}
          <div className="absolute left-1 inset-y-1 w-1 bg-gradient-to-b from-white/30 via-white/10 to-transparent rounded-full pointer-events-none" />
          <div className="absolute right-1 inset-y-1 w-[2px] bg-white/10 rounded-full pointer-events-none" />

          {/* Internal Perfume Juice with meniscus curve */}
          <div className={`absolute inset-x-1.5 bottom-1.5 top-5 rounded-b-md bg-gradient-to-b ${palette.liquidGrad} overflow-hidden border-t border-[#c5a059]/20`}>
            {/* Liquid glimmer */}
            <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-transparent opacity-60" />
            {/* Dip Tube (Laboratory Pipette) */}
            <div className="absolute left-1/2 -translate-x-1/2 inset-y-0 w-[1.5px] bg-white/30 shadow-[0_0_2px_rgba(255,255,255,0.4)]" />
          </div>

          {/* Luxury Label Badge */}
          <div className="relative z-10 mt-3 w-16 px-1 py-1.5 bg-[#0a090e]/90 border border-[#c5a059]/60 rounded-sm shadow-md flex flex-col items-center text-center">
            <span className="text-[7px] tracking-[0.2em] uppercase text-[#c5a059] font-cinzel font-semibold leading-tight">
              D'CANTOR
            </span>
            <span className="text-[6px] text-[#f5ede0]/90 font-medium truncate max-w-full tracking-wide">
              {perfume.brand.split(' ')[0]}
            </span>
            <div className="w-5 h-[0.5px] bg-[#c5a059]/50 my-0.5" />
            <span className="text-[5px] text-[#c5a059]/80 uppercase tracking-wider">
              {perfume.concentration ? perfume.concentration.replace('De Parfum', 'EDP').replace('De Toilette', 'EDT') : 'DECANTS'}
            </span>
          </div>

          {/* Bottom Volume Indicator badge */}
          <div className="relative z-10 text-[6px] tracking-widest text-[#c5a059]/75 font-mono mb-0.5">
            DECANT VAULT
          </div>
        </div>

        {/* Surface Mirror Shadow / Reflection */}
        <div className="w-16 h-2 bg-gradient-to-r from-transparent via-[#c5a059]/20 to-transparent rounded-full blur-[2px] mt-1" />
      </div>
    </div>
  );
};
