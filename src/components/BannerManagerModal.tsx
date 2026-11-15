import React, { useState } from 'react';
import { BannerSlide } from '../types';
import { X, Plus, Trash2, ArrowUp, ArrowDown, Upload, Image as ImageIcon, Sparkles, Check, Globe } from 'lucide-react';
import { useModalAnimation } from '../hooks/useModalAnimation';

interface BannerManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: BannerSlide[];
  onSaveSlides: (slides: BannerSlide[]) => void | Promise<void>;
  onOpenLogoSettings?: () => void;
}

export const BannerManagerModal: React.FC<BannerManagerModalProps> = ({
  isOpen,
  onClose,
  slides,
  onSaveSlides,
  onOpenLogoSettings,
}) => {
  const { shouldRender, isAnimated } = useModalAnimation(isOpen, 300);
  const [localSlides, setLocalSlides] = useState<BannerSlide[]>(slides);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Sync when opened
  React.useEffect(() => {
    setLocalSlides(slides);
    setActivePreviewIndex(0);
    setToastMessage('');
  }, [slides, isOpen]);

  if (!shouldRender) return null;

  const handleUpdateField = (id: number, field: keyof BannerSlide, value: string) => {
    setLocalSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleFileUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateField(id, 'imageUrl', reader.result as string);
        setToastMessage('Photo uploaded from device. Click "Publish Banners Live" to save to cloud.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (id: number) => {
    handleUpdateField(id, 'imageUrl', '');
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSlides = [...localSlides];
    const temp = newSlides[index - 1];
    newSlides[index - 1] = newSlides[index];
    newSlides[index] = temp;
    setLocalSlides(newSlides);
    if (activePreviewIndex === index) setActivePreviewIndex(index - 1);
    else if (activePreviewIndex === index - 1) setActivePreviewIndex(index);
  };

  const handleMoveDown = (index: number) => {
    if (index === localSlides.length - 1) return;
    const newSlides = [...localSlides];
    const temp = newSlides[index + 1];
    newSlides[index + 1] = newSlides[index];
    newSlides[index] = temp;
    setLocalSlides(newSlides);
    if (activePreviewIndex === index) setActivePreviewIndex(index + 1);
    else if (activePreviewIndex === index + 1) setActivePreviewIndex(index);
  };

  const handleDeleteSlide = (id: number) => {
    if (localSlides.length <= 1) {
      alert('You must keep at least one active banner slide.');
      return;
    }
    setLocalSlides((prev) => prev.filter((s) => s.id !== id));
    setActivePreviewIndex(0);
  };

  const handleAddNewSlide = () => {
    const newSlide: BannerSlide = {
      id: Date.now(),
      title: 'New Luxury Decant Campaign',
      subtitle: 'Experience rare niche perfumery decanted with laboratory precision.',
      badge: 'SPECIAL RELEASE',
      accentText: "D'CANTOR DHAKA",
      buttonText: 'Explore Collection',
    };
    setLocalSlides((prev) => [...prev, newSlide]);
    setActivePreviewIndex(localSlides.length);
  };

  const handleSaveAndClose = async () => {
    setIsPublishing(true);
    try {
      await onSaveSlides(localSlides);
      setToastMessage('Banners published live to cloud!');
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (error) {
      console.error('Failed to publish banners to cloud:', error);
      setToastMessage('Error publishing banners to cloud. Please check network connection.');
    } finally {
      setIsPublishing(false);
    }
  };

  const previewSlide = localSlides[activePreviewIndex] || localSlides[0];

  return (
    <div
      id="banner-manager-modal-backdrop"
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto transition-opacity duration-300 ease-out ${
        isAnimated ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        id="banner-manager-modal"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl my-auto max-h-[90vh] overflow-y-auto rounded-2xl bg-[#121118] border border-[#c5a059]/30 p-6 shadow-2xl text-[#f5ede0] transition-all duration-300 ease-out transform ${
          isAnimated ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
        }`}
      >
        {/* Close Button */}
        <button
          id="close-banner-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#1c1926] text-[#b3a695] hover:text-[#f5ede0] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-[0.2em] text-[#c5a059] font-cinzel font-semibold">
                Owner Campaign Manager
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-500/30">
                <Globe className="w-3 h-3" />
                Cloud Synced
              </span>
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f5ede0]">
              Hero Slideshow Banners
            </h2>
            <p className="text-xs text-[#a09485]">
              Upload local photos directly from your device, customize marketing copy, and publish live to all visitors.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenLogoSettings && (
              <button
                id="banner-modal-to-logo-btn"
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogoSettings();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[#3e3650] hover:border-[#c5a059] bg-[#1a1626] text-[#ded5c7] hover:text-[#c5a059] font-semibold text-xs transition-all shadow-md"
                title="Open Brand & Logo Settings"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>Brand & Logo</span>
              </button>
            )}
            <button
              id="add-new-slide-btn"
              type="button"
              onClick={handleAddNewSlide}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#c5a059] text-[#08080a] font-semibold text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Slide</span>
            </button>
          </div>
        </div>

        {/* Success / Status Toast Banner */}
        {toastMessage && (
          <div
            id="banner-manager-toast"
            className={`mb-5 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 border shadow-lg transition-all ${
              toastMessage.includes('published') || toastMessage.includes('live') || toastMessage.includes('uploaded')
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
            }`}
          >
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* LIVE 21:9 Widescreen Ratio Preview */}
        {previewSlide && (
          <div className="mb-8 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#c5a059] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Live 21:9 Widescreen Banner Preview (Slide #{activePreviewIndex + 1})
              </span>
              <span className="text-[11px] text-[#8e8374]">
                Aspect Ratio: 21:9 Widescreen Display
              </span>
            </div>

            {(() => {
              const hasImg = Boolean(previewSlide.imageUrl);
              const isFull = hasImg && previewSlide.imageLayout === 'full-bleed';
              const isSide = hasImg && !isFull;

              return (
                <div
                  className={`relative w-full aspect-[21/9] min-h-[220px] rounded-xl overflow-hidden border border-[#c5a059]/40 bg-[#08080a] shadow-xl flex ${
                    isSide
                      ? 'flex-row items-center justify-between p-6 sm:p-8 gap-4'
                      : isFull
                      ? 'flex-col items-start justify-center p-6 sm:p-8'
                      : 'flex-col items-center justify-center text-center p-6 sm:p-8'
                  }`}
                >
                  {/* Background display */}
                  {isFull ? (
                    <div className="absolute inset-0 z-0">
                      <img
                        src={previewSlide.imageUrl}
                        alt={previewSlide.title}
                        className="w-full h-full object-cover scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-[#08080a]/80 to-transparent" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1b1725] via-[#100e16] to-[#08080a] z-0" />
                  )}

                  {/* Decorative radial overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(197,160,89,0.15),transparent_60%)] pointer-events-none z-10" />

                  {/* Foreground content */}
                  <div
                    className={`relative z-20 ${
                      isSide || isFull ? 'max-w-md space-y-2 sm:space-y-3' : 'max-w-lg space-y-2 sm:space-y-3 mx-auto'
                    }`}
                  >
                    <div className={`inline-flex items-center gap-2 ${!isSide && !isFull ? 'justify-center' : ''}`}>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-widest uppercase text-[#c5a059] bg-[#1a1724]/90 border border-[#c5a059]/40">
                        {previewSlide.badge || 'AUTHENTIC DECANTS'}
                      </span>
                    </div>
                    <h3 className="font-cinzel text-lg sm:text-2xl font-bold text-[#f5ede0] leading-tight line-clamp-2">
                      {previewSlide.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#b8ad9e] line-clamp-2 font-light">
                      {previewSlide.subtitle}
                    </p>
                    <div className={`pt-1 flex items-center gap-2 ${!isSide && !isFull ? 'justify-center' : ''}`}>
                      <span className="px-3 py-1.5 rounded-lg bg-[#c5a059] text-[#08080a] font-semibold text-[11px]">
                        Explore The Collection
                      </span>
                    </div>
                  </div>

                  {/* Side Image Preview */}
                  {isSide && (
                    <div className="relative z-20 flex items-center justify-center w-5/12 max-h-[190px] p-1 shrink-0">
                      <img
                        src={previewSlide.imageUrl}
                        alt={previewSlide.title}
                        className="w-full h-full object-contain max-h-[170px] rounded-xl shadow-lg"
                      />
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Slides Editor List */}
        <div className="space-y-4 mb-6">
          <div className="text-xs uppercase tracking-wider text-[#9d9182] font-semibold">
            Manage Slides ({localSlides.length} total)
          </div>

          {localSlides.map((slide, index) => {
            const isPreviewing = index === activePreviewIndex;

            return (
              <div
                key={slide.id}
                onClick={() => setActivePreviewIndex(index)}
                className={`p-4 sm:p-5 rounded-xl border transition-all space-y-3 cursor-pointer ${
                  isPreviewing
                    ? 'bg-[#1a1626] border-[#c5a059]'
                    : 'bg-[#161320] border-[#2b2538] hover:border-[#3e3650]'
                }`}
              >
                {/* Row: Slide Index, Preview badge & Controls */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#241f32] text-[#c5a059] text-xs font-mono font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs text-[#c5a059] font-semibold uppercase tracking-wider font-cinzel">
                      Slide #{index + 1}
                    </span>
                    {isPreviewing && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40 font-medium">
                        Active In Preview
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className="p-1.5 rounded bg-[#201c2d] hover:bg-[#2e293f] text-[#c2b5a5] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move slide up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={index === localSlides.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className="p-1.5 rounded bg-[#201c2d] hover:bg-[#2e293f] text-[#c2b5a5] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move slide down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="p-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 ml-1"
                      title="Delete slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title & Badge inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" onClick={(e) => e.stopPropagation()}>
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#9f9384]">
                      Headline Title
                    </label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => handleUpdateField(slide.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#110f17] border border-[#2b2538] text-xs text-[#f5ede0] focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-wider text-[#9f9384]">
                      Pill Badge
                    </label>
                    <input
                      type="text"
                      value={slide.badge || ''}
                      onChange={(e) => handleUpdateField(slide.id, 'badge', e.target.value)}
                      placeholder="e.g. AUTHENTIC DECANTS"
                      className="w-full px-3 py-2 rounded-lg bg-[#110f17] border border-[#2b2538] text-xs text-[#f5ede0] focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>
                </div>

                {/* Subtitle input */}
                <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                  <label className="text-[11px] uppercase tracking-wider text-[#9f9384]">
                    Sub-headline Description
                  </label>
                  <input
                    type="text"
                    value={slide.subtitle}
                    onChange={(e) => handleUpdateField(slide.id, 'subtitle', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#110f17] border border-[#2b2538] text-xs text-[#f5ede0] focus:outline-none focus:border-[#c5a059]"
                  />
                </div>

                {/* Image File Uploader & URL input */}
                <div className="space-y-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
                  <label className="text-[11px] uppercase tracking-wider text-[#c5a059] font-medium flex items-center justify-between">
                    <span>Banner Background Photo (Local Upload or URL)</span>
                    {slide.imageUrl && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(slide.id)}
                        className="text-rose-400 hover:underline text-[10px] lowercase"
                      >
                        Remove image
                      </button>
                    )}
                  </label>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={slide.imageUrl || ''}
                      onChange={(e) => handleUpdateField(slide.id, 'imageUrl', e.target.value)}
                      placeholder="Paste image link, or upload photo from device below..."
                      className="flex-1 px-3 py-2 rounded-lg bg-[#110f17] border border-[#2b2538] text-xs text-[#f5ede0] placeholder-[#6e6356] focus:outline-none focus:border-[#c5a059]"
                    />

                    {/* Local File Input with FileReader */}
                    <label className="cursor-pointer px-4 py-2 rounded-lg bg-[#221c2e] border border-[#3e3552] hover:border-[#c5a059] text-xs font-semibold text-[#c5a059] flex items-center justify-center gap-1.5 transition-all shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Local Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(slide.id, e)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {slide.imageUrl && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-2 text-[11px] text-[#a99c8a]">
                        <ImageIcon className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>Custom photo attached (click card to preview above)</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="text-[#9f9384] text-[11px] uppercase tracking-wider">
                          Display Style:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateField(slide.id, 'imageLayout', 'side')}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all border ${
                            (slide.imageLayout ?? 'side') === 'side'
                              ? 'bg-[#c5a059] text-[#08080a] border-[#c5a059]'
                              : 'bg-[#181523] text-[#a99c8a] border-[#2b2538] hover:border-[#c5a059]'
                          }`}
                        >
                          Side Image (Clean Product Art)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateField(slide.id, 'imageLayout', 'full-bleed')}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all border ${
                            slide.imageLayout === 'full-bleed'
                              ? 'bg-[#c5a059] text-[#08080a] border-[#c5a059]'
                              : 'bg-[#181523] text-[#a99c8a] border-[#2b2538] hover:border-[#c5a059]'
                          }`}
                        >
                          Full-Bleed Background
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-[#252132] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] text-[#8e8374]">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Changes persist immediately to Cloud Firestore across all devices and visitor browsers.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              disabled={isPublishing}
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#191624] text-[#a99d8d] hover:text-[#f5ede0] text-xs font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              id="save-banners-btn"
              type="button"
              disabled={isPublishing}
              onClick={handleSaveAndClose}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#d8b46d] text-[#08080a] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-98 disabled:opacity-60 transition-all shadow-lg cursor-pointer"
            >
              {isPublishing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-[#08080a] border-t-transparent rounded-full animate-spin" />
                  <span>Publishing to Cloud...</span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5" />
                  <span>Publish Banners Live</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
