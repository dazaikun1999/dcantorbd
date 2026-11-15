import React, { useState, useEffect } from 'react';
import { Perfume, BannerSlide, CartItem, DecantSize } from './types';
import { initialPerfumes, initialBannerSlides } from './data/initialData';
import { Navbar } from './components/Navbar';
import { HeroCarousel } from './components/HeroCarousel';
import { CatalogSection } from './components/CatalogSection';
import { ProductModal } from './components/ProductModal';
import { DiscoveryBoxDrawer } from './components/DiscoveryBoxDrawer';
import { DecantGuideModal } from './components/DecantGuideModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AddEditFragranceModal } from './components/AddEditFragranceModal';
import { BannerManagerModal } from './components/BannerManagerModal';
import { BrandLogoModal } from './components/BrandLogoModal';
import { Footer } from './components/Footer';
import { MessageCircle, Plus, Check, Globe } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import {
  getBrandingSettings,
  saveBrandingSettings,
  subscribeBrandingSettings,
  getHeroBanners,
  saveHeroBanners,
  subscribeHeroBanners,
  applyDynamicFavicon,
  DEFAULT_FAVICON,
} from './lib/firebase';

export default function App() {
  const { isDark } = useTheme();

  // Load persisted catalog state or fall back to 19 initial perfumes
  const [perfumes, setPerfumes] = useState<Perfume[]>(() => {
    try {
      const saved = localStorage.getItem('dcantor_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved catalog', e);
    }
    return initialPerfumes;
  });

  // Load persisted hero slides or fall back to initial 4 slides
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>(() => {
    try {
      const saved = localStorage.getItem('dcantor_slides');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load saved slides', e);
    }
    return initialBannerSlides;
  });

  // Admin session state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dcantor_admin') === 'true';
    } catch {
      return false;
    }
  });

  // Cart items state
  const [discoveryItems, setDiscoveryItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dcantor_cart') || localStorage.getItem('dcantor_discovery');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Modals state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [perfumeToEdit, setPerfumeToEdit] = useState<Perfume | null>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isDiscoveryDrawerOpen, setIsDiscoveryDrawerOpen] = useState(false);
  const [selectedPerfumeForDetail, setSelectedPerfumeForDetail] = useState<Perfume | null>(null);
  const [selectedInitialSize, setSelectedInitialSize] = useState<DecantSize | undefined>(undefined);

  // Official custom logo state (fallback to local cache for instant paint)
  const [customLogo, setCustomLogo] = useState<string>(() => {
    try {
      return localStorage.getItem('dcantor_logo') || '';
    } catch {
      return '';
    }
  });

  // Official custom favicon state (fallback to local cache for instant paint)
  const [customFavicon, setCustomFavicon] = useState<string>(() => {
    try {
      return localStorage.getItem('dcantor_custom_favicon') || '';
    } catch {
      return '';
    }
  });

  // Global cloud toast feedback
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  useEffect(() => {
    if (!globalToast) return;
    const timer = setTimeout(() => {
      setGlobalToast(null);
    }, 3800);
    return () => clearTimeout(timer);
  }, [globalToast]);

  // Apply custom favicon on load and state changes across all browser environments
  useEffect(() => {
    applyDynamicFavicon(customFavicon || DEFAULT_FAVICON);
  }, [customFavicon]);

  // Sync with Firestore site_settings/hero_banners globally on app mount
  useEffect(() => {
    let isMounted = true;

    // 1. Initial cloud fetch from Firestore: site_settings/hero_banners
    getHeroBanners()
      .then((cloudSlides) => {
        if (!isMounted || !cloudSlides || cloudSlides.length === 0) return;
        setBannerSlides(cloudSlides);
        try {
          localStorage.setItem('dcantor_slides', JSON.stringify(cloudSlides));
        } catch {
          // ignore
        }
      })
      .catch((err) => {
        console.warn('Firestore initial hero banners fetch error, continuing with cached/default slides:', err);
      });

    // 2. Real-time Firestore subscription: sync across all open browsers & devices live without reload
    const unsubscribe = subscribeHeroBanners((cloudSlides) => {
      if (!isMounted || !cloudSlides || cloudSlides.length === 0) return;
      setBannerSlides(cloudSlides);
      try {
        localStorage.setItem('dcantor_slides', JSON.stringify(cloudSlides));
      } catch {
        // ignore
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Sync with Firestore site_settings/branding globally on app mount
  useEffect(() => {
    let isMounted = true;

    // 1. Initial cloud fetch from Firestore: site_settings/branding
    getBrandingSettings()
      .then((cloudBranding) => {
        if (!isMounted || !cloudBranding) return;

        if (typeof cloudBranding.logo === 'string') {
          setCustomLogo(cloudBranding.logo);
          try {
            if (cloudBranding.logo) {
              localStorage.setItem('dcantor_logo', cloudBranding.logo);
            } else {
              localStorage.removeItem('dcantor_logo');
            }
          } catch {
            // ignore localStorage quota error
          }
        }

        if (typeof cloudBranding.favicon === 'string') {
          setCustomFavicon(cloudBranding.favicon);
          applyDynamicFavicon(cloudBranding.favicon);
          try {
            if (cloudBranding.favicon) {
              localStorage.setItem('dcantor_custom_favicon', cloudBranding.favicon);
            } else {
              localStorage.removeItem('dcantor_custom_favicon');
            }
          } catch {
            // ignore localStorage quota error
          }
        }
      })
      .catch((err) => {
        console.warn('Firestore initial branding fetch error, continuing with cached branding:', err);
      });

    // 2. Real-time Firestore subscription: sync across all open browsers & devices live
    const unsubscribe = subscribeBrandingSettings((cloudBranding) => {
      if (!isMounted || !cloudBranding) return;

      if (typeof cloudBranding.logo === 'string') {
        setCustomLogo(cloudBranding.logo);
        try {
          if (cloudBranding.logo) {
            localStorage.setItem('dcantor_logo', cloudBranding.logo);
          } else {
            localStorage.removeItem('dcantor_logo');
          }
        } catch {
          // ignore
        }
      }

      if (typeof cloudBranding.favicon === 'string') {
        setCustomFavicon(cloudBranding.favicon);
        applyDynamicFavicon(cloudBranding.favicon);
        try {
          if (cloudBranding.favicon) {
            localStorage.setItem('dcantor_custom_favicon', cloudBranding.favicon);
          } else {
            localStorage.removeItem('dcantor_custom_favicon');
          }
        } catch {
          // ignore
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Save favicon to Firestore & local cache
  const handleSaveFavicon = async (newFaviconUrl: string) => {
    setCustomFavicon(newFaviconUrl);
    applyDynamicFavicon(newFaviconUrl || DEFAULT_FAVICON);

    // Fallback local storage
    try {
      if (newFaviconUrl) {
        localStorage.setItem('dcantor_custom_favicon', newFaviconUrl);
      } else {
        localStorage.removeItem('dcantor_custom_favicon');
      }
    } catch (e) {
      console.warn('Failed to cache favicon in localStorage', e);
    }

    // Persist directly in Cloud Firestore site_settings/branding
    try {
      await saveBrandingSettings({ favicon: newFaviconUrl });
    } catch (e) {
      console.error('Failed to persist favicon to Firestore site_settings/branding', e);
      throw e;
    }
  };

  // Save logo to Firestore & local cache
  const handleSaveLogo = async (newLogoUrl: string) => {
    setCustomLogo(newLogoUrl);

    // Fallback local storage
    try {
      if (newLogoUrl) {
        localStorage.setItem('dcantor_logo', newLogoUrl);
      } else {
        localStorage.removeItem('dcantor_logo');
      }
    } catch (e) {
      console.warn('Failed to cache logo in localStorage', e);
    }

    // Persist directly in Cloud Firestore site_settings/branding
    try {
      await saveBrandingSettings({ logo: newLogoUrl });
    } catch (e) {
      console.error('Failed to persist logo to Firestore site_settings/branding', e);
      throw e;
    }
  };

  // Initial page load luxurious fade-in state
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 40);
    return () => clearTimeout(timer);
  }, []);

  // Sync catalog to local storage
  useEffect(() => {
    try {
      localStorage.setItem('dcantor_catalog', JSON.stringify(perfumes));
    } catch (e) {
      console.error('Failed to persist catalog', e);
    }
  }, [perfumes]);

  // Sync banner slides to local storage
  useEffect(() => {
    try {
      localStorage.setItem('dcantor_slides', JSON.stringify(bannerSlides));
    } catch (e) {
      console.error('Failed to persist slides', e);
    }
  }, [bannerSlides]);

  // Sync admin state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('dcantor_admin', isAdmin ? 'true' : 'false');
    } catch (e) {
      console.error('Failed to persist admin state', e);
    }
  }, [isAdmin]);

  // Sync cart items to local storage
  useEffect(() => {
    try {
      localStorage.setItem('dcantor_cart', JSON.stringify(discoveryItems));
      localStorage.setItem('dcantor_discovery', JSON.stringify(discoveryItems));
    } catch (e) {
      console.error('Failed to persist cart items', e);
    }
  }, [discoveryItems]);

  // Handler functions
  const handleOpenAddModal = () => {
    setPerfumeToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (perfume: Perfume) => {
    setPerfumeToEdit(perfume);
    setIsAddEditModalOpen(true);
  };

  const handleToggleStock = (id: number) => {
    setPerfumes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    );
  };

  const handleSavePerfume = (savedPerfume: Perfume) => {
    setPerfumes((prev) => {
      const exists = prev.some((p) => p.id === savedPerfume.id);
      if (exists) {
        return prev.map((p) => (p.id === savedPerfume.id ? savedPerfume : p));
      }
      return [savedPerfume, ...prev];
    });
  };

  const handleDeletePerfume = (id: number) => {
    setPerfumes((prev) => prev.filter((p) => p.id !== id));
    if (selectedPerfumeForDetail?.id === id) {
      setSelectedPerfumeForDetail(null);
    }
  };

  const handleSaveSlides = async (newSlides: BannerSlide[]) => {
    setBannerSlides(newSlides);

    // Fallback local storage
    try {
      localStorage.setItem('dcantor_slides', JSON.stringify(newSlides));
    } catch (e) {
      console.warn('Failed to cache slides in localStorage', e);
    }

    // Persist directly in Cloud Firestore site_settings/hero_banners
    try {
      await saveHeroBanners(newSlides);
      setGlobalToast('Banners published live to cloud!');
    } catch (e) {
      console.error('Failed to persist hero banners to Firestore site_settings/hero_banners', e);
      throw e;
    }
  };

  const handleResetCatalog = async () => {
    if (
      window.confirm(
        'Reset catalog back to original 19 fragrances and default banners?'
      )
    ) {
      setPerfumes(initialPerfumes);
      setBannerSlides(initialBannerSlides);
      localStorage.removeItem('dcantor_catalog');
      localStorage.removeItem('dcantor_slides');

      try {
        await saveHeroBanners(initialBannerSlides);
        setGlobalToast('Banners reset to default in cloud!');
      } catch (e) {
        console.warn('Could not reset cloud banners:', e);
      }
    }
  };

  // Discovery Box Cart Operations
  const handleAddToDiscoverySet = (
    perfume: Perfume,
    selectedSize: DecantSize,
    price: number
  ) => {
    setDiscoveryItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.perfume.id === perfume.id && item.selectedSize === selectedSize
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [...prev, { perfume, selectedSize, price, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveDiscoveryItem(index);
      return;
    }
    setDiscoveryItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveDiscoveryItem = (index: number) => {
    setDiscoveryItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearDiscoveryBox = () => {
    setDiscoveryItems([]);
  };

  const handleViewDetails = (perfume: Perfume, initialSize?: DecantSize) => {
    setSelectedPerfumeForDetail(perfume);
    setSelectedInitialSize(initialSize);
  };

  // Lock body scroll when any modal or drawer is active
  const isAnyModalOpen =
    isLoginModalOpen ||
    isAddEditModalOpen ||
    isBannerModalOpen ||
    isLogoModalOpen ||
    isGuideModalOpen ||
    isDiscoveryDrawerOpen ||
    Boolean(selectedPerfumeForDetail);

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAnyModalOpen]);

  return (
    <div
      className={`min-h-screen flex flex-col selection:bg-[#c5a059]/30 transition-colors duration-300 ${
        isDark
          ? 'bg-[#08080a] text-[#f5ede0] selection:text-white'
          : 'bg-[#F9F6F0] text-[#1A1615] selection:text-[#1A1615]'
      } transition-opacity duration-1000 ease-out ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Top Navigation with Integrated Theme Switcher */}
      <Navbar
        isAdmin={isAdmin}
        onLogoutAdmin={() => setIsAdmin(false)}
        onOpenAddModal={handleOpenAddModal}
        onOpenBannerManager={() => setIsBannerModalOpen(true)}
        onOpenLogoManager={() => setIsLogoModalOpen(true)}
        onOpenDecantGuide={() => setIsGuideModalOpen(true)}
        onOpenOwnerLogin={() => setIsLoginModalOpen(true)}
        discoveryItems={discoveryItems}
        onOpenDiscoveryDrawer={() => setIsDiscoveryDrawerOpen(true)}
        totalFragrancesCount={perfumes.length}
        customLogo={customLogo}
      />

      {/* Hero Slideshow Banner (21:9 ratio on desktop, 16:9 on mobile) */}
      <main className="flex-1">
        <HeroCarousel
          slides={bannerSlides}
          onOpenDecantGuide={() => setIsGuideModalOpen(true)}
        />

        {/* Quality Banner Accent Bar - The Decant Creed */}
        <section
          id="decant-creed"
          className={`w-full border-y py-4 transition-colors ${
            isDark
              ? 'border-[#23202e] bg-[#0d0c13]'
              : 'border-[#EAE3D5] bg-[#FAF5EB]'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className={`flex items-center gap-2 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#c5a059]' : 'bg-[#A67C2E]'}`} />
              <span className="font-semibold tracking-wider uppercase font-cinzel">
                Authentic Pours
              </span>
              <span className={isDark ? 'text-[#8c8273]' : 'text-[#665E55]'}>
                • 100% Original Flacons Only
              </span>
            </div>

            <div className={`flex items-center gap-2 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#c5a059]' : 'bg-[#A67C2E]'}`} />
              <span className="font-semibold tracking-wider uppercase font-cinzel">
                Sterile Extraction
              </span>
              <span className={isDark ? 'text-[#8c8273]' : 'text-[#665E55]'}>
                • Syringes Dedicated Per Juice
              </span>
            </div>

            <div className={`flex items-center gap-2 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#c5a059]' : 'bg-[#A67C2E]'}`} />
              <span className="font-semibold tracking-wider uppercase font-cinzel">
                Teflon Thread Sealed
              </span>
              <span className={isDark ? 'text-[#8c8273]' : 'text-[#665E55]'}>
                • Zero Leaks, Heavy Glass Vials
              </span>
            </div>

            <div className={`flex items-center gap-2 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-[#c5a059]' : 'bg-[#A67C2E]'}`} />
              <span className="font-semibold tracking-wider uppercase font-cinzel">
                Dhaka Express
              </span>
              <span className={isDark ? 'text-[#8c8273]' : 'text-[#665E55]'}>
                • 24-48h Delivery
              </span>
            </div>
          </div>
        </section>

        {/* Product Catalog Grid with Search & Filters */}
        <CatalogSection
          perfumes={perfumes}
          isAdmin={isAdmin}
          onEditPerfume={handleOpenEditModal}
          onToggleStock={handleToggleStock}
          onViewDetails={handleViewDetails}
          onAddToDiscoverySet={handleAddToDiscoverySet}
        />
      </main>

      {/* Editorial Footer */}
      <Footer
        onOpenOwnerLogin={() => setIsLoginModalOpen(true)}
        isAdmin={isAdmin}
        onLogoutAdmin={() => setIsAdmin(false)}
        onOpenDecantGuide={() => setIsGuideModalOpen(true)}
        onResetCatalog={handleResetCatalog}
        customLogo={customLogo}
      />

      {/* Floating Action Button for Admin: Add New Fragrance */}
      {isAdmin && (
        <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2">
          <button
            id="floating-admin-add-btn"
            type="button"
            onClick={handleOpenAddModal}
            className={`flex items-center gap-2 px-4 py-3 rounded-full font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all ${
              isDark
                ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b46d] text-[#08080a] shadow-[0_10px_25px_rgba(197,160,89,0.4)] hover:brightness-110'
                : 'bg-[#1A1615] text-[#FAF4E8] border border-[#A67C2E]/50 shadow-md hover:bg-[#2C2420]'
            }`}
            title="Add a new fragrance to catalog"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Fragrance</span>
          </button>
        </div>
      )}

      {/* Floating Circular WhatsApp Action Button (FAB) */}
      <div className="fixed bottom-6 right-5 sm:right-6 z-40 flex items-center group">
        {/* Tooltip on hover */}
        <div className="absolute right-16 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 hidden sm:block whitespace-nowrap">
          <div
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xl flex items-center gap-1.5 ${
              isDark
                ? 'bg-[#121118] text-[#f5ede0] border border-[#25D366]/40'
                : 'bg-[#FFFFFF] text-[#1A1615] border border-[#25D366]/60 shadow-[0_4px_15px_rgba(0,0,0,0.1)]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>Chat on WhatsApp</span>
          </div>
        </div>

        {/* Circular Action Button */}
        <a
          id="floating-whatsapp-fab"
          href="https://wa.me/8801750050557?text=Hello%20D'Cantor,%20I%20would%20like%20to%20inquire%20about%20your%20decant%20fragrance%20catalog."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
          className="relative w-14 h-14 rounded-full flex items-center justify-center bg-[#25D366] text-white shadow-[0_0_25px_rgba(37,211,102,0.4)] hover:shadow-[0_0_35px_rgba(37,211,102,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {/* Gentle, slow ambient pulse ring */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none" />

          {/* Centered WhatsApp / MessageCircle icon */}
          <MessageCircle className="w-7 h-7 text-white fill-white relative z-10 transition-transform duration-300 group-hover:rotate-6" />
        </a>
      </div>

      {/* Modals & Drawers */}
      <ProductModal
        perfume={selectedPerfumeForDetail}
        initialSize={selectedInitialSize}
        onClose={() => {
          setSelectedPerfumeForDetail(null);
          setSelectedInitialSize(undefined);
        }}
        onAddToDiscoverySet={handleAddToDiscoverySet}
      />

      <DiscoveryBoxDrawer
        isOpen={isDiscoveryDrawerOpen}
        onClose={() => setIsDiscoveryDrawerOpen(false)}
        items={discoveryItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveDiscoveryItem}
        onClearAll={handleClearDiscoveryBox}
      />

      <DecantGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsAdmin(true)}
      />

      <AddEditFragranceModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setPerfumeToEdit(null);
        }}
        onSave={handleSavePerfume}
        onDelete={handleDeletePerfume}
        perfumeToEdit={perfumeToEdit}
      />

      <BannerManagerModal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
        slides={bannerSlides}
        onSaveSlides={handleSaveSlides}
        onOpenLogoSettings={() => setIsLogoModalOpen(true)}
      />

      <BrandLogoModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        currentLogo={customLogo}
        onSaveLogo={handleSaveLogo}
        currentFavicon={customFavicon}
        onSaveFavicon={handleSaveFavicon}
      />

      {/* Global Cloud Toast Notification */}
      {globalToast && (
        <div
          id="global-cloud-toast"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#121118]/95 border border-[#c5a059]/40 text-[#f5ede0] shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex flex-col pr-2">
            <span className="text-[10px] uppercase font-cinzel tracking-widest text-[#c5a059] font-bold">
              Cloud Synchronized
            </span>
            <span className="text-xs text-[#e8dfcf] font-medium">{globalToast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
