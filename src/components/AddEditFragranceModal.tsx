import React, { useState, useEffect } from 'react';
import { Perfume, DecantSize } from '../types';
import { X, Plus, Trash2, Upload, Sparkles, AlertCircle, Check } from 'lucide-react';
import { useModalAnimation } from '../hooks/useModalAnimation';

interface AddEditFragranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (perfume: Perfume) => void;
  onDelete?: (id: number) => void;
  perfumeToEdit?: Perfume | null;
}

export const AddEditFragranceModal: React.FC<AddEditFragranceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  perfumeToEdit,
}) => {
  const { shouldRender, isAnimated } = useModalAnimation(isOpen, 300);
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Sweet & Fruity');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [concentration, setConcentration] = useState('Eau De Parfum');
  const [description, setDescription] = useState('');
  const [inStock, setInStock] = useState(true);

  // Size and Price builder states
  const [enabledSizes, setEnabledSizes] = useState<Record<DecantSize, boolean>>({
    '3ml': true,
    '5ml': true,
    '10ml': true,
    '15ml': true,
  });

  const [prices, setPrices] = useState<Record<DecantSize, number>>({
    '3ml': 250,
    '5ml': 380,
    '10ml': 650,
    '15ml': 950,
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (perfumeToEdit) {
      setName(perfumeToEdit.name);
      setBrand(perfumeToEdit.brand);
      setCategory(perfumeToEdit.category);
      setNotes(perfumeToEdit.notes);
      setImageUrl(perfumeToEdit.image || '');
      setConcentration(perfumeToEdit.concentration || 'Eau De Parfum');
      setDescription(perfumeToEdit.description || '');
      setInStock(perfumeToEdit.inStock);

      const newEnabled: Record<DecantSize, boolean> = {
        '3ml': perfumeToEdit.prices['3ml'] !== undefined,
        '5ml': perfumeToEdit.prices['5ml'] !== undefined,
        '10ml': perfumeToEdit.prices['10ml'] !== undefined,
        '15ml': perfumeToEdit.prices['15ml'] !== undefined,
      };
      setEnabledSizes(newEnabled);

      setPrices({
        '3ml': perfumeToEdit.prices['3ml'] ?? 250,
        '5ml': perfumeToEdit.prices['5ml'] ?? 380,
        '10ml': perfumeToEdit.prices['10ml'] ?? 650,
        '15ml': perfumeToEdit.prices['15ml'] ?? 950,
      });
    } else {
      // Reset for new perfume
      setName('');
      setBrand('');
      setCategory('Fresh & Aquatic');
      setNotes('');
      setImageUrl('');
      setConcentration('Eau De Parfum');
      setDescription('');
      setInStock(true);
      setEnabledSizes({ '3ml': true, '5ml': true, '10ml': true, '15ml': true });
      setPrices({ '3ml': 250, '5ml': 380, '10ml': 650, '15ml': 950 });
    }
    setError('');
  }, [perfumeToEdit, isOpen]);

  if (!shouldRender) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSizeToggle = (size: DecantSize) => {
    setEnabledSizes((prev) => ({
      ...prev,
      [size]: !prev[size],
    }));
  };

  const handlePriceChange = (size: DecantSize, value: string) => {
    const num = parseInt(value, 10);
    setPrices((prev) => ({
      ...prev,
      [size]: isNaN(num) ? 0 : num,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please provide a fragrance title.');
      return;
    }
    if (!brand.trim()) {
      setError('Please provide the fragrance brand/house.');
      return;
    }

    // Build prices object containing ONLY the enabled sizes
    const finalPrices: Partial<Record<DecantSize, number>> = {};
    (['3ml', '5ml', '10ml', '15ml'] as DecantSize[]).forEach((size) => {
      if (enabledSizes[size]) {
        finalPrices[size] = prices[size] || 0;
      }
    });

    if (Object.keys(finalPrices).length === 0) {
      setError('Please enable at least one decant size and price.');
      return;
    }

    const newPerfume: Perfume = {
      id: perfumeToEdit ? perfumeToEdit.id : Date.now(),
      name: name.trim(),
      brand: brand.trim(),
      category: category.trim(),
      notes: notes.trim() || 'Signature olfactory blend',
      inStock,
      prices: finalPrices,
      image: imageUrl.trim() || undefined,
      concentration,
      description: description.trim() || `Authentic ${concentration} decanted directly into glass atomizers.`,
    };

    onSave(newPerfume);
    onClose();
  };

  const handleDelete = () => {
    if (!perfumeToEdit || !onDelete) return;
    if (window.confirm(`Are you sure you want to remove "${perfumeToEdit.name}" from the catalog?`)) {
      onDelete(perfumeToEdit.id);
      onClose();
    }
  };

  return (
    <div
      id="add-edit-fragrance-modal-backdrop"
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto transition-opacity duration-300 ease-out ${
        isAnimated ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        id="add-edit-fragrance-modal"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl my-auto max-h-[90vh] overflow-y-auto rounded-2xl bg-[#121118] border border-[#c5a059]/30 p-6 shadow-2xl text-[#f5ede0] transition-all duration-300 ease-out transform ${
          isAnimated ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
        }`}
      >
        {/* Close Button */}
        <button
          id="close-add-edit-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#1c1926] text-[#b3a695] hover:text-[#f5ede0] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 space-y-1">
          <span className="text-xs uppercase tracking-[0.2em] text-[#c5a059] font-cinzel font-semibold">
            {perfumeToEdit ? 'Modify Existing Fragrance' : 'Catalog Inventory Manager'}
          </span>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f5ede0]">
            {perfumeToEdit ? `Edit: ${perfumeToEdit.name}` : '+ Add New Fragrance to Catalog'}
          </h2>
          <p className="text-xs text-[#a09485]">
            Configure bottle details, notes, stock status, and exact BDT size pricing.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/50 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Name and Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">
                Fragrance Title *
              </label>
              <input
                id="form-perfume-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Afnan 9 PM Rebel"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181523] border border-[#2e283d] text-sm text-[#f5ede0] placeholder-[#6e6356] focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">
                Fragrance House / Brand *
              </label>
              <input
                id="form-perfume-brand"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Afnan, Rasasi, Armaf, D&G"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181523] border border-[#2e283d] text-sm text-[#f5ede0] placeholder-[#6e6356] focus:outline-none focus:border-[#c5a059]"
              />
            </div>
          </div>

          {/* Row 2: Category and Concentration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">
                Scent Category
              </label>
              <select
                id="form-perfume-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181523] border border-[#2e283d] text-sm text-[#f5ede0] focus:outline-none focus:border-[#c5a059]"
              >
                <option value="Fresh & Aquatic">Fresh & Aquatic</option>
                <option value="Sweet & Fruity">Sweet & Fruity</option>
                <option value="Warm Spicy & Amber">Warm Spicy & Amber</option>
                <option value="Smoky & Woody">Smoky & Woody</option>
                <option value="Smoky Citrus">Smoky Citrus</option>
                <option value="Aromatic Fougere">Aromatic Fougere</option>
                <option value="Tropical Gourmand">Tropical Gourmand</option>
                <option value="Spicy Leather">Spicy Leather</option>
                <option value="Crisp Clean">Crisp Clean</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">
                Concentration
              </label>
              <select
                id="form-perfume-concentration"
                value={concentration}
                onChange={(e) => setConcentration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181523] border border-[#2e283d] text-sm text-[#f5ede0] focus:outline-none focus:border-[#c5a059]"
              >
                <option value="Eau De Parfum">Eau De Parfum (EDP)</option>
                <option value="Extrait De Parfum">Extrait De Parfum</option>
                <option value="Pure Parfum">Pure Parfum</option>
                <option value="Eau De Toilette">Eau De Toilette (EDT)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Scent Accords / Notes */}
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">
              Scent Accords / Key Notes *
            </label>
            <input
              id="form-perfume-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Apple, Cinnamon, Wild Lavender, Vanilla"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181523] border border-[#2e283d] text-sm text-[#f5ede0] placeholder-[#6e6356] focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          {/* Size & Price Builder Section */}
          <div className="p-4 rounded-xl bg-[#171422] border border-[#2c263b] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-[#c5a059] font-semibold">
                Size & Price Builder (BDT ৳)
              </label>
              <span className="text-[11px] text-[#938879]">
                Enable checkboxes for sizes offered
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['3ml', '5ml', '10ml', '15ml'] as DecantSize[]).map((size) => (
                <div
                  key={size}
                  className={`p-3 rounded-lg border transition-all ${
                    enabledSizes[size]
                      ? 'bg-[#1e1a2b] border-[#c5a059]/50'
                      : 'bg-[#14121c] border-[#252130] opacity-60'
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={enabledSizes[size]}
                      onChange={() => handleSizeToggle(size)}
                      className="rounded accent-[#c5a059] w-4 h-4 cursor-pointer"
                    />
                    <span className="font-bold text-xs text-[#f5ede0]">{size} Decant</span>
                  </label>

                  <div className="flex items-center gap-1 bg-[#121019] rounded-md px-2 py-1 border border-[#2d273a]">
                    <span className="text-xs text-[#c5a059]">৳</span>
                    <input
                      type="number"
                      disabled={!enabledSizes[size]}
                      value={prices[size] || ''}
                      onChange={(e) => handlePriceChange(size, e.target.value)}
                      placeholder="0"
                      min="1"
                      className="w-full bg-transparent text-xs font-mono text-[#f5ede0] focus:outline-none disabled:text-[#5d554a]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image URL & File Upload */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-[#c5a059] font-medium">
              Bottle Image (Optional URL or Local Upload)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="form-perfume-image"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/bottle-photo.jpg (leave blank for bespoke 3D flacon art)"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#181523] border border-[#2e283d] text-xs text-[#f5ede0] placeholder-[#6e6356] focus:outline-none focus:border-[#c5a059]"
              />

              <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#1f1b2c] border border-[#3a334d] hover:border-[#c5a059] text-xs font-medium text-[#c5a059] flex items-center justify-center gap-1.5 transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Stock Status Switch */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#171422] border border-[#2c263b]">
            <div>
              <div className="text-xs font-semibold text-[#f5ede0]">Vault Stock Availability</div>
              <div className="text-[11px] text-[#938879]">
                Toggle whether customers can order this fragrance right now
              </div>
            </div>

            <button
              type="button"
              onClick={() => setInStock(!inStock)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                inStock
                  ? 'bg-emerald-950 border border-emerald-500 text-emerald-400'
                  : 'bg-amber-950 border border-amber-600 text-amber-400'
              }`}
            >
              {inStock ? '✓ Available In Stock' : '⚠ Restocking Soon'}
            </button>
          </div>

          {/* Actions: Save & Optional Delete */}
          <div className="pt-4 border-t border-[#252132] flex items-center justify-between gap-3">
            {perfumeToEdit && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#191624] text-[#a99d8d] hover:text-[#f5ede0] text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                id="save-fragrance-modal-btn"
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#d8b46d] text-[#08080a] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all shadow-lg"
              >
                {perfumeToEdit ? 'Save Updates' : 'Save to Catalog'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
