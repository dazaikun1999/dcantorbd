import React, { useState, useMemo } from 'react';
import { Perfume, DecantSize } from '../types';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, Sparkles, X, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CatalogSectionProps {
  perfumes: Perfume[];
  isAdmin: boolean;
  onEditPerfume: (perfume: Perfume) => void;
  onToggleStock: (id: number) => void;
  onViewDetails: (perfume: Perfume, initialSize?: DecantSize) => void;
  onAddToDiscoverySet?: (perfume: Perfume, size: DecantSize, price: number) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  perfumes,
  isAdmin,
  onEditPerfume,
  onToggleStock,
  onViewDetails,
  onAddToDiscoverySet,
}) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');

  // Unique list of fragrance houses
  const uniqueBrands = useMemo(() => {
    const brands = Array.from(new Set(perfumes.map((p) => p.brand)));
    return ['All', ...brands];
  }, [perfumes]);

  // Predefined luxury fragrance vibe tags
  const filterPills = [
    'All',
    'Fresh & Aquatic',
    'Sweet & Fruity',
    'Warm Spicy & Amber',
    'Smoky & Woody',
    'Under ৳250',
    'In Stock Only',
  ];

  // Filtering & Sorting Logic
  const filteredPerfumes = useMemo(() => {
    return perfumes.filter((perfume) => {
      // 1. Text Search Query matching name, brand, or olfactory notes
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = perfume.name.toLowerCase().includes(q);
        const matchesBrand = perfume.brand.toLowerCase().includes(q);
        const matchesNotes = perfume.notes.toLowerCase().includes(q);
        const matchesCategory = perfume.category.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesNotes && !matchesCategory) {
          return false;
        }
      }

      // 2. Brand filter
      if (selectedBrand !== 'All' && perfume.brand !== selectedBrand) {
        return false;
      }

      // 3. Quick Tag Pills
      if (activeFilter === 'In Stock Only') {
        return perfume.inStock;
      }

      if (activeFilter === 'Under ৳250') {
        const prices = Object.values(perfume.prices).filter((v): v is number => v !== undefined);
        const minPrice = Math.min(...prices);
        return minPrice <= 250;
      }

      if (activeFilter === 'Fresh & Aquatic') {
        const cat = perfume.category.toLowerCase();
        const notes = perfume.notes.toLowerCase();
        return (
          cat.includes('aquatic') ||
          cat.includes('fresh') ||
          cat.includes('oceanic') ||
          cat.includes('blue') ||
          cat.includes('clean') ||
          notes.includes('sea salt') ||
          notes.includes('marine') ||
          notes.includes('bergamot')
        );
      }

      if (activeFilter === 'Sweet & Fruity') {
        const cat = perfume.category.toLowerCase();
        const notes = perfume.notes.toLowerCase();
        return (
          cat.includes('sweet') ||
          cat.includes('fruit') ||
          cat.includes('gourmand') ||
          notes.includes('apple') ||
          notes.includes('vanilla') ||
          notes.includes('pineapple') ||
          notes.includes('coconut')
        );
      }

      if (activeFilter === 'Warm Spicy & Amber') {
        const cat = perfume.category.toLowerCase();
        const notes = perfume.notes.toLowerCase();
        return (
          cat.includes('amber') ||
          cat.includes('spicy') ||
          notes.includes('cinnamon') ||
          notes.includes('amber') ||
          notes.includes('tobacco') ||
          notes.includes('cardamom') ||
          notes.includes('saffron')
        );
      }

      if (activeFilter === 'Smoky & Woody') {
        const cat = perfume.category.toLowerCase();
        const notes = perfume.notes.toLowerCase();
        return (
          cat.includes('woody') ||
          cat.includes('smoky') ||
          cat.includes('leather') ||
          notes.includes('birch') ||
          notes.includes('cedar') ||
          notes.includes('sandalwood') ||
          notes.includes('leather') ||
          notes.includes('oud')
        );
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        const minA = Math.min(...Object.values(a.prices).filter((v): v is number => v !== undefined));
        const minB = Math.min(...Object.values(b.prices).filter((v): v is number => v !== undefined));
        return minA - minB;
      }
      if (sortBy === 'price-desc') {
        const maxA = Math.max(...Object.values(a.prices).filter((v): v is number => v !== undefined));
        const maxB = Math.max(...Object.values(b.prices).filter((v): v is number => v !== undefined));
        return maxB - maxA;
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [perfumes, searchQuery, activeFilter, selectedBrand, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setActiveFilter('All');
    setSelectedBrand('All');
    setSortBy('featured');
  };

  return (
    <section id="catalog" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 mb-2">
            <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#c5a059]' : 'bg-[#A67C2E]'}`} />
            <span
              className={`text-xs uppercase tracking-[0.25em] font-cinzel font-semibold ${
                isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
              }`}
            >
              The Decant Reserve
            </span>
          </div>
          <h2
            className={`font-cinzel text-2xl sm:text-3xl md:text-4xl font-bold ${
              isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
            }`}
          >
            Curated Fragrance Catalog
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-[#a5998b]' : 'text-[#665E55]'}`}>
            Genuine juice extracted with laboratory precision into medical-grade glass atomizers.
          </p>
        </div>

        {/* Live Counter */}
        <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-[#8e8477]' : 'text-[#7A7063]'}`}>
          <span>Showing</span>
          <span
            className={`px-2 py-0.5 rounded font-mono font-bold border ${
              isDark
                ? 'bg-[#161320] border-[#2e293c] text-[#c5a059]'
                : 'bg-[#FFFFFF] border-[#E0D7C9] text-[#A67C2E] shadow-xs'
            }`}
          >
            {filteredPerfumes.length}
          </span>
          <span>of {perfumes.length} Fragrances</span>
        </div>
      </div>

      {/* Control Bar: Real-Time Search Bar & Filter Options */}
      <div
        className={`space-y-4 mb-8 p-4 sm:p-5 rounded-2xl border transition-colors ${
          isDark
            ? 'bg-[#0f0e15] border-[#242030] shadow-xl'
            : 'bg-[#FFFFFF] border-[#EAE3D5] shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
        }`}
      >
        {/* Search Bar Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-[#8a7f72]' : 'text-[#8E8376]'}`} />
            <input
              id="catalog-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fragrance, house (Rasasi, Armaf, Afnan, D&G), or notes (Vanilla, Pineapple)..."
              className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 ${
                isDark
                  ? 'bg-[#171520] border-[#2d283c] text-[#f5ede0] placeholder-[#796f64] focus:border-[#c5a059] focus:ring-[#c5a059]/50'
                  : 'bg-[#FAF6F0] border-[#E2DACB] text-[#1A1615] placeholder-[#8E8376] focus:border-[#A67C2E] focus:ring-[#A67C2E]/50'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  isDark ? 'text-[#8a7f72] hover:text-[#f5ede0]' : 'text-[#8E8376] hover:text-[#1A1615]'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Brand Selector */}
          <div className="sm:w-48">
            <select
              id="catalog-brand-filter"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className={`w-full py-3 px-3 rounded-xl border text-xs font-medium focus:outline-none cursor-pointer ${
                isDark
                  ? 'bg-[#171520] border-[#2d283c] text-[#f5ede0] focus:border-[#c5a059]'
                  : 'bg-[#FAF6F0] border-[#E2DACB] text-[#1A1615] focus:border-[#A67C2E]'
              }`}
            >
              <option value="All">All Fragrance Houses</option>
              {uniqueBrands.filter((b) => b !== 'All').map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="sm:w-48">
            <select
              id="catalog-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`w-full py-3 px-3 rounded-xl border text-xs font-medium focus:outline-none cursor-pointer ${
                isDark
                  ? 'bg-[#171520] border-[#2d283c] text-[#f5ede0] focus:border-[#c5a059]'
                  : 'bg-[#FAF6F0] border-[#E2DACB] text-[#1A1615] focus:border-[#A67C2E]'
              }`}
            >
              <option value="featured">Featured Reserve</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Scent Filter Pills: Horizontally scrollable with touch swiping on mobile */}
        <div className="flex items-center gap-2 pt-1 overflow-x-auto flex-nowrap pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <span
            className={`text-[11px] uppercase tracking-wider mr-1 hidden sm:inline shrink-0 ${
              isDark ? 'text-[#7e7468]' : 'text-[#7D7364]'
            }`}
          >
            Vibe:
          </span>
          {filterPills.map((pill) => {
            const isSelected = activeFilter === pill;
            return (
              <button
                key={pill}
                id={`filter-pill-${pill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                type="button"
                onClick={() => setActiveFilter(pill)}
                className={`px-3.5 py-1.5 rounded-full text-xs tracking-wide transition-all shrink-0 whitespace-nowrap ${
                  isSelected
                    ? isDark
                      ? 'bg-[#c5a059] text-[#08080a] shadow-[0_0_12px_rgba(197,160,89,0.35)] font-bold'
                      : 'bg-[#A67C2E] text-white shadow-[0_0_10px_rgba(166,124,46,0.3)] font-bold'
                    : isDark
                    ? 'bg-[#181524] text-[#cfc2b1] border border-[#2b273b] hover:border-[#c5a059]/60 hover:text-white font-medium'
                    : 'bg-[#FAF6F0] text-[#554D43] border border-[#E2DACB] hover:border-[#A67C2E] hover:text-[#1A1615] font-medium'
                }`}
              >
                {pill}
              </button>
            );
          })}

          {/* Reset Filters if any active */}
          {(searchQuery || activeFilter !== 'All' || selectedBrand !== 'All' || sortBy !== 'featured') && (
            <button
              id="catalog-reset-filters-btn"
              type="button"
              onClick={resetFilters}
              className={`text-xs hover:underline ml-auto flex items-center gap-1 font-medium cursor-pointer shrink-0 whitespace-nowrap pl-2 ${
                isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Product Grid: Responsive Grid (grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4) */}
      {filteredPerfumes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-7 xl:gap-8">
          {filteredPerfumes.map((perfume) => (
            <ProductCard
              key={perfume.id}
              perfume={perfume}
              isAdmin={isAdmin}
              onEdit={onEditPerfume}
              onToggleStock={onToggleStock}
              onViewDetails={onViewDetails}
              onAddToDiscoverySet={onAddToDiscoverySet}
            />
          ))}
        </div>
      ) : (
        <div
          className={`w-full py-20 px-6 rounded-2xl border text-center flex flex-col items-center justify-center space-y-4 ${
            isDark ? 'bg-[#110f17] border-[#262232]' : 'bg-[#FFFFFF] border-[#EAE3D5] shadow-xs'
          }`}
        >
          <div
            className={`w-14 h-14 rounded-full border flex items-center justify-center ${
              isDark
                ? 'bg-[#1e1a29] border-[#3d3650] text-[#c5a059]'
                : 'bg-[#FAF4EA] border-[#E2DACB] text-[#A67C2E]'
            }`}
          >
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3
            className={`font-cinzel text-xl font-bold ${
              isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
            }`}
          >
            No Fragrances Match Your Search
          </h3>
          <p className={`text-sm max-w-md ${isDark ? 'text-[#9e9282]' : 'text-[#665E55]'}`}>
            We couldn't find any decants matching "{searchQuery || activeFilter}". Try searching by a general note like "Citrus", "Amber", or clear active filters.
          </p>
          <button
            id="empty-reset-btn"
            type="button"
            onClick={resetFilters}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase hover:brightness-110 transition-all ${
              isDark ? 'bg-[#c5a059] text-[#08080a]' : 'bg-[#A67C2E] text-white shadow-md'
            }`}
          >
            Show All {perfumes.length} Fragrances
          </button>
        </div>
      )}
    </section>
  );
};
