import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, MessageCircle, ShieldCheck, Plus, Sliders, LogOut, Menu, X, ShoppingBag, Sun, Moon, Facebook, Instagram, KeyRound, ExternalLink } from 'lucide-react';
import { CartItem } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  isAdmin: boolean;
  onLogoutAdmin: () => void;
  onOpenAddModal: () => void;
  onOpenBannerManager: () => void;
  onOpenLogoManager?: () => void;
  onOpenDecantGuide: () => void;
  onOpenOwnerLogin?: () => void;
  discoveryItems: CartItem[];
  onOpenDiscoveryDrawer: () => void;
  totalFragrancesCount: number;
  customLogo?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  isAdmin,
  onLogoutAdmin,
  onOpenAddModal,
  onOpenBannerManager,
  onOpenLogoManager,
  onOpenDecantGuide,
  onOpenOwnerLogin,
  discoveryItems,
  onOpenDiscoveryDrawer,
  totalFragrancesCount,
  customLogo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const totalDecantsCount = discoveryItems.reduce((acc, item) => acc + item.quantity, 0);

  const scrollToCatalog = () => {
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const scrollToCreed = () => {
    const creedEl = document.getElementById('decant-creed');
    if (creedEl) {
      creedEl.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-300 backdrop-blur-xl ${
        isDark
          ? 'bg-[#08080a]/90 border-b border-[#24212e]'
          : 'bg-[#F9F6F0]/92 border-b border-[#EAE3D5] shadow-[0_2px_15px_rgba(0,0,0,0.03)]'
      }`}
    >
      {/* Top Admin Notice Bar if Owner is logged in */}
      {isAdmin && (
        <div
          className={`w-full py-2 px-4 border-b ${
            isDark
              ? 'bg-[#18140b] border-[#c5a059]/40 text-[#f5ede0]'
              : 'bg-[#FAF3E3] border-[#A67C2E]/40 text-[#1A1615]'
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-ping" />
              <span className="font-semibold text-[#c5a059] tracking-wider uppercase font-cinzel">
                Owner Mode: Elham
              </span>
              <span className={`hidden sm:inline ${isDark ? 'text-[#a89d8d]' : 'text-[#7A7063]'}`}>
                ({totalFragrancesCount} catalog items live)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="admin-topbar-add-btn"
                type="button"
                onClick={onOpenAddModal}
                className="flex items-center gap-1 px-3 py-1 rounded bg-[#c5a059] text-[#08080a] font-semibold hover:brightness-110 transition-all text-xs shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Fragrance</span>
              </button>

              <button
                id="admin-topbar-banners-btn"
                type="button"
                onClick={onOpenBannerManager}
                className={`flex items-center gap-1 px-3 py-1 rounded border transition-all text-xs ${
                  isDark
                    ? 'bg-[#1e1a29] text-[#f5ede0] border-[#3e3650] hover:border-[#c5a059]'
                    : 'bg-[#FFFFFF] text-[#1A1615] border-[#D8CEBE] hover:border-[#A67C2E]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-[#c5a059]" />
                <span className="hidden sm:inline">Manage</span> Banners
              </button>

              {onOpenLogoManager && (
                <button
                  id="admin-topbar-logo-btn"
                  type="button"
                  onClick={onOpenLogoManager}
                  className={`flex items-center gap-1 px-3 py-1 rounded border transition-all text-xs ${
                    isDark
                      ? 'bg-[#1e1a29] text-[#f5ede0] border-[#3e3650] hover:border-[#c5a059]'
                      : 'bg-[#FFFFFF] text-[#1A1615] border-[#D8CEBE] hover:border-[#A67C2E]'
                  }`}
                  title="Upload or change official logo"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Brand & Logo</span>
                </button>
              )}

              <button
                id="admin-topbar-logout-btn"
                type="button"
                onClick={onLogoutAdmin}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-transparent hover:bg-rose-950/40 text-rose-400 border border-rose-900/40 transition-all text-xs"
                title="Exit owner admin mode"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
        {/* ZONE 1 (LEFT): D'Cantor official logo aligned comfortably on the left */}
        <div id="navbar-zone-left" className="flex items-center shrink-0">
          <button
            id="header-brand-logo-btn"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group text-left cursor-pointer transition-transform active:scale-[0.98]"
            title="D'Cantor Dhaka - Click to return to top"
          >
            {customLogo ? (
              <img
                src={customLogo}
                alt="D'Cantor Logo"
                className="h-10 md:h-11 w-auto max-w-[190px] sm:max-w-[220px] object-contain transition-transform group-hover:scale-105"
              />
            ) : (
              <>
                {/* Opulent Gold Monogram Crest */}
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg border flex items-center justify-center transition-all ${
                    isDark
                      ? 'border-[#c5a059]/60 bg-gradient-to-b from-[#201b2a] to-[#0c0b12] shadow-[0_0_15px_rgba(197,160,89,0.2)] group-hover:border-[#c5a059]'
                      : 'border-[#A67C2E]/60 bg-gradient-to-b from-[#FFFDF9] to-[#EFE6D6] shadow-[0_2px_10px_rgba(166,124,46,0.15)] group-hover:border-[#A67C2E]'
                  }`}
                >
                  <span
                    className={`font-cinzel text-lg sm:text-xl font-extrabold tracking-tighter ${
                      isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
                    }`}
                  >
                    D'C
                  </span>
                </div>

                <div className="flex flex-col">
                  <span
                    className={`font-cinzel text-base sm:text-lg font-bold tracking-[0.18em] transition-colors leading-tight ${
                      isDark
                        ? 'text-[#f5ede0] group-hover:text-[#c5a059]'
                        : 'text-[#1A1615] group-hover:text-[#A67C2E]'
                    }`}
                  >
                    D'CANTOR
                  </span>
                  <span
                    className={`text-[8.5px] sm:text-[9.5px] tracking-[0.28em] uppercase font-medium ${
                      isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
                    }`}
                  >
                    DHAKA • BOUTIQUE DECANT PERFUMERY
                  </span>
                </div>
              </>
            )}
          </button>
        </div>

        {/* ZONE 2 (EXACT CENTER): Center navigation links placed in optical center */}
        <nav
          id="navbar-zone-center"
          aria-label="Primary navigation"
          className={`hidden md:flex items-center justify-center gap-8 text-xs tracking-[0.2em] font-cinzel font-medium uppercase transition-colors ${
            isDark ? 'text-[#c7bcae]' : 'text-[#665E55]'
          } md:flex-1 md:mx-4 xl:flex-none xl:mx-0 xl:absolute xl:left-1/2 xl:-translate-x-1/2`}
        >
          <button
            id="nav-catalog-link"
            type="button"
            onClick={scrollToCatalog}
            className={`relative py-1 cursor-pointer transition-colors duration-200 group ${
              isDark ? 'hover:text-[#c5a059]' : 'hover:text-[#A67C2E]'
            }`}
          >
            <span>Catalog</span>
            <span
              className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                isDark ? 'bg-[#c5a059]' : 'bg-[#A67C2E]'
              }`}
            />
          </button>

          <button
            id="nav-guide-link"
            type="button"
            onClick={onOpenDecantGuide}
            className={`relative py-1 cursor-pointer transition-colors duration-200 group ${
              isDark ? 'hover:text-[#c5a059]' : 'hover:text-[#A67C2E]'
            }`}
          >
            <span>Decant Guide</span>
            <span
              className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                isDark ? 'bg-[#c5a059]' : 'bg-[#A67C2E]'
              }`}
            />
          </button>

          <button
            id="nav-creed-link"
            type="button"
            onClick={scrollToCreed}
            className={`relative py-1 cursor-pointer transition-colors duration-200 group ${
              isDark ? 'hover:text-[#c5a059]' : 'hover:text-[#A67C2E]'
            }`}
          >
            <span>The Decant Creed</span>
            <span
              className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                isDark ? 'bg-[#c5a059]' : 'bg-[#A67C2E]'
              }`}
            />
          </button>
        </nav>

        {/* ZONE 3 (RIGHT): Unified action cluster aligned cleanly on the right */}
        <div id="navbar-zone-right" className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Theme Switcher Button */}
          <button
            id="theme-switcher-btn"
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to Warm Alabaster light mode' : 'Switch to Noir Velvet dark mode'}
            className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl border transition-all flex items-center justify-center group ${
              isDark
                ? 'bg-[#14121c] border-[#2e2a3c] text-[#f5ede0] hover:text-[#c5a059] hover:border-[#c5a059]'
                : 'bg-[#FFFFFF] border-[#EAE3D5] text-[#1A1615] hover:text-[#A67C2E] hover:border-[#A67C2E] shadow-xs'
            }`}
            title={isDark ? 'Switch to Warm Alabaster Light Mode' : 'Switch to Noir Velvet Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-[#c5a059] transition-transform duration-300 group-hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-[#A67C2E] transition-transform duration-300 group-hover:-rotate-12" />
            )}
          </button>

          {/* Cart trigger with counter badge */}
          <button
            id="nav-cart-btn"
            type="button"
            onClick={onOpenDiscoveryDrawer}
            className={`relative h-9 px-2.5 sm:h-10 sm:px-3.5 rounded-xl border transition-all flex items-center gap-1.5 sm:gap-2 shadow-xs active:scale-95 ${
              isDark
                ? 'bg-[#14121c] border-[#2e2a3c] hover:border-[#c5a059] text-[#f5ede0] hover:text-[#c5a059]'
                : 'bg-[#FFFFFF] border-[#EAE3D5] hover:border-[#A67C2E] text-[#1A1615] hover:text-[#A67C2E]'
            }`}
            title="View Cart"
          >
            <ShoppingBag className={`w-4 h-4 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`} />
            <span className="hidden sm:inline text-xs font-semibold tracking-wide">
              Cart {totalDecantsCount > 0 ? `(${totalDecantsCount})` : ''}
            </span>
            {totalDecantsCount > 0 && (
              <span
                className={`sm:hidden min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  isDark ? 'bg-[#c5a059] text-[#08080a]' : 'bg-[#A67C2E] text-white'
                }`}
              >
                {totalDecantsCount}
              </span>
            )}
          </button>

          {/* Direct WhatsApp Contact Button (hidden on mobile, shown md+) */}
          <a
            id="nav-whatsapp-direct-btn"
            href="https://wa.me/8801750050557?text=Hello%20D'Cantor,%20I%20would%20like%20to%20place%20an%20order%20for%20decant%20fragrances."
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden md:inline-flex items-center gap-2 h-10 px-3.5 rounded-xl border text-xs font-semibold tracking-wide transition-all shadow-xs active:scale-95 ${
              isDark
                ? 'bg-gradient-to-r from-[#17311d] to-[#142819] border-[#25D366]/40 text-[#f5ede0] hover:border-[#25D366]'
                : 'bg-[#FFFFFF] border-[#25D366]/60 text-[#146631] hover:border-[#25D366] hover:bg-[#F2FBF5]'
            }`}
            title="Order via WhatsApp: 01750050557"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]/20" />
            <span>01750050557</span>
          </a>

          {/* Facebook Icon (hidden on mobile, shown md+) */}
          <a
            id="nav-facebook-btn"
            href="https://www.facebook.com/profile.php?id=61584611739337"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Facebook Page"
            title="Visit Facebook Page"
            className={`hidden md:flex w-10 h-10 rounded-full items-center justify-center border transition-all duration-300 hover:scale-105 ${
              isDark
                ? 'border-[#2e2a3c] bg-[#14121c] text-[#d4cbbe] hover:border-[#c5a059] hover:text-[#c5a059]'
                : 'border-[#EAE3D5] bg-[#FFFFFF] text-stone-700 hover:border-[#A67C2E] hover:text-[#A67C2E] shadow-xs'
            }`}
          >
            <Facebook className="w-4 h-4" />
          </a>

          {/* Instagram Icon (hidden on mobile, shown md+) */}
          <a
            id="nav-instagram-btn"
            href="https://www.instagram.com/dcantor.bd/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow on Instagram"
            title="Follow on Instagram"
            className={`hidden md:flex w-10 h-10 rounded-full items-center justify-center border transition-all duration-300 hover:scale-105 ${
              isDark
                ? 'border-[#2e2a3c] bg-[#14121c] text-[#d4cbbe] hover:border-[#c5a059] hover:text-[#c5a059]'
                : 'border-[#EAE3D5] bg-[#FFFFFF] text-stone-700 hover:border-[#A67C2E] hover:text-[#A67C2E] shadow-xs'
            }`}
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* Mobile Luxury Hamburger Toggle */}
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className={`md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center transition-all ${
              isDark
                ? 'bg-[#14121c] border-[#292635] text-[#f5ede0] hover:border-[#c5a059]'
                : 'bg-[#FFFFFF] border-[#EAE3D5] text-[#1A1615] hover:border-[#A67C2E] shadow-xs'
            }`}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer (Portal mounted to document.body, 100% Solid & Opaque with Smooth Slide & Fade Transition) */}
      {mounted &&
        createPortal(
          <div className="fixed inset-0 z-50 md:hidden pointer-events-none">
            {/* 1. Synchronized Backdrop Fade */}
            <div
              id="mobile-drawer-backdrop"
              onClick={() => setMobileMenuOpen(false)}
              className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
                mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            />

            {/* 2. Solid Opaque Drawer (Smooth Right-to-Left Slide Transition) */}
            <div
              id="mobile-nav-drawer"
              className={`fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out ${
                mobileMenuOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
              } ${
                isDark
                  ? 'bg-[#09090b] border-l border-stone-800 text-stone-100'
                  : 'bg-[#F9F6F0] border-l border-[#EAE3D5] text-[#1A1615]'
              }`}
            >
              {/* Top Drawer Header & Links */}
              <div>
                {/* 3. Drawer Header & Prominent Circular Close Button */}
                <div
                  className={`flex items-center justify-between pb-5 border-b ${
                    isDark ? 'border-stone-800' : 'border-[#EAE3D5]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {customLogo ? (
                      <img
                        src={customLogo}
                        alt="D'Cantor Logo"
                        className="h-9 w-auto max-w-[170px] object-contain"
                      />
                    ) : (
                      <>
                        <div
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center ${
                            isDark
                              ? 'border-[#c5a059]/60 bg-[#18181b]'
                              : 'border-[#A67C2E]/60 bg-[#F2ECE1]'
                          }`}
                        >
                          <span
                            className={`font-cinzel text-xs font-extrabold ${
                              isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
                            }`}
                          >
                            D'C
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span
                            className={`font-cinzel text-sm font-bold tracking-widest ${
                              isDark ? 'text-stone-100' : 'text-[#1A1615]'
                            }`}
                          >
                            D'CANTOR
                          </span>
                          <span
                            className={`text-[8px] tracking-[0.25em] uppercase font-medium ${
                              isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
                            }`}
                          >
                            DHAKA • DECANT
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    id="mobile-drawer-close-btn"
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close navigation menu"
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                      isDark
                        ? 'bg-[#18181b] border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800'
                        : 'bg-[#FFFFFF] border-[#E0D7C9] text-[#7A7063] hover:text-[#1A1615] hover:bg-[#F2ECE1] shadow-xs'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 4. Clean Vertical Navigation List */}
                <nav className="pt-6 space-y-2.5">
                  <button
                    id="mobile-drawer-catalog-link"
                    type="button"
                    onClick={scrollToCatalog}
                    className={`w-full text-left py-3 px-4 rounded-xl text-xs font-semibold tracking-[0.2em] uppercase font-cinzel transition-all flex items-center justify-between cursor-pointer ${
                      isDark
                        ? 'text-stone-100 hover:bg-[#18181b] hover:text-[#c5a059]'
                        : 'text-[#1A1615] hover:bg-[#EFE8DC] hover:text-[#A67C2E]'
                    }`}
                  >
                    <span>Catalog</span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-medium ${
                        isDark ? 'bg-[#18181b] text-[#c5a059] border border-stone-800' : 'bg-[#EAE3D5] text-[#A67C2E]'
                      }`}
                    >
                      {totalFragrancesCount} bottles
                    </span>
                  </button>

                  <button
                    id="mobile-drawer-guide-link"
                    type="button"
                    onClick={() => {
                      onOpenDecantGuide();
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-3 px-4 rounded-xl text-xs font-semibold tracking-[0.2em] uppercase font-cinzel transition-all flex items-center gap-3 cursor-pointer ${
                      isDark
                        ? 'text-stone-100 hover:bg-[#18181b] hover:text-[#c5a059]'
                        : 'text-[#1A1615] hover:bg-[#EFE8DC] hover:text-[#A67C2E]'
                    }`}
                  >
                    <ShieldCheck className={`w-4 h-4 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`} />
                    <span>Decant Guide & Authenticity</span>
                  </button>

                  <button
                    id="mobile-drawer-creed-link"
                    type="button"
                    onClick={scrollToCreed}
                    className={`w-full text-left py-3 px-4 rounded-xl text-xs font-semibold tracking-[0.2em] uppercase font-cinzel transition-all flex items-center gap-3 cursor-pointer ${
                      isDark
                        ? 'text-stone-100 hover:bg-[#18181b] hover:text-[#c5a059]'
                        : 'text-[#1A1615] hover:bg-[#EFE8DC] hover:text-[#A67C2E]'
                    }`}
                  >
                    <Sparkles className={`w-4 h-4 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`} />
                    <span>The Decant Creed</span>
                  </button>
                </nav>

                {/* Contact & Social Buttons */}
                <div
                  className={`pt-6 mt-4 border-t space-y-2.5 ${
                    isDark ? 'border-stone-800' : 'border-[#EAE3D5]'
                  }`}
                >
                  <span
                    className={`text-[10px] uppercase tracking-[0.25em] font-medium block px-1 ${
                      isDark ? 'text-stone-400' : 'text-[#7D7366]'
                    }`}
                  >
                    Concierge & Socials
                  </span>

                  {/* WhatsApp */}
                  <a
                    id="mobile-drawer-whatsapp-btn"
                    href="https://wa.me/8801750050557?text=Hello%20D'Cantor,%20I%20would%20like%20to%20place%20an%20order%20for%20decant%20fragrances."
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all border shadow-xs ${
                      isDark
                        ? 'bg-[#112415] border-[#25D366]/40 text-stone-100 hover:border-[#25D366]'
                        : 'bg-[#F2FBF5] border-[#25D366]/60 text-[#146631] hover:border-[#25D366]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]/20" />
                      <span>WhatsApp: 01750050557</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>

                  {/* Facebook */}
                  <a
                    id="mobile-drawer-facebook-btn"
                    href="https://www.facebook.com/profile.php?id=61584611739337"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                      isDark
                        ? 'bg-[#18181b] border-stone-800 text-stone-100 hover:border-[#c5a059]'
                        : 'bg-[#FFFFFF] border-[#E0D7C9] text-[#1A1615] hover:border-[#A67C2E]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Facebook className="w-4 h-4 text-[#1877F2]" />
                      <span>Facebook Page</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>

                  {/* Instagram */}
                  <a
                    id="mobile-drawer-instagram-btn"
                    href="https://www.instagram.com/dcantor.bd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all ${
                      isDark
                        ? 'bg-[#18181b] border-stone-800 text-stone-100 hover:border-[#c5a059]'
                        : 'bg-[#FFFFFF] border-[#E0D7C9] text-[#1A1615] hover:border-[#A67C2E]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Instagram className="w-4 h-4 text-[#E1306C]" />
                      <span>Instagram @dcantor.bd</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                </div>
              </div>

              {/* 5. Bottom Section: Owner Login Link */}
              <div
                className={`pt-5 mt-auto border-t ${
                  isDark ? 'border-stone-800' : 'border-[#EAE3D5]'
                }`}
              >
                {isAdmin ? (
                  <button
                    id="mobile-drawer-exit-admin-btn"
                    type="button"
                    onClick={() => {
                      onLogoutAdmin();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-3 px-3 rounded-xl border border-rose-900/40 text-rose-400 hover:bg-rose-950/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Exit Owner Admin Mode</span>
                  </button>
                ) : (
                  <button
                    id="mobile-drawer-owner-login-btn"
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onOpenOwnerLogin) onOpenOwnerLogin();
                    }}
                    className={`w-full py-3 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isDark
                        ? 'border-stone-800 bg-[#18181b] text-stone-300 hover:text-[#c5a059] hover:border-[#c5a059]'
                        : 'border-[#E0D7C9] bg-[#FFFFFF] text-[#7A7063] hover:text-[#A67C2E] hover:border-[#A67C2E] shadow-xs'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Owner Login</span>
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};
