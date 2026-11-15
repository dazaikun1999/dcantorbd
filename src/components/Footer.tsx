import React from 'react';
import { MessageCircle, Instagram, Facebook, Mail, ShieldCheck, MapPin, Lock, RotateCcw } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  onOpenOwnerLogin: () => void;
  isAdmin: boolean;
  onLogoutAdmin: () => void;
  onOpenDecantGuide: () => void;
  onResetCatalog: () => void;
  customLogo?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenOwnerLogin,
  isAdmin,
  onLogoutAdmin,
  onOpenDecantGuide,
  onResetCatalog,
  customLogo,
}) => {
  const { isDark } = useTheme();

  return (
    <footer
      className={`w-full pt-16 pb-12 transition-colors duration-300 ${
        isDark
          ? 'bg-[#0b0a0f] border-t border-[#23202e] text-[#f5ede0]'
          : 'bg-[#F2ECE1] border-t border-[#E5DDD0] text-[#1A1615]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main 4-column Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b ${
            isDark ? 'border-[#211e2b]' : 'border-[#E3DACB]'
          }`}
        >
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              {customLogo ? (
                <div className="flex flex-col gap-1.5">
                  <img
                    src={customLogo}
                    alt="D'Cantor Logo"
                    className="h-10 md:h-12 w-auto max-w-[200px] object-contain"
                  />
                  <span
                    className={`text-[9px] tracking-[0.25em] uppercase font-medium ${
                      isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
                    }`}
                  >
                    DHAKA • BOUTIQUE DECANT PERFUMERY
                  </span>
                </div>
              ) : (
                <>
                  <div
                    className={`w-10 h-10 rounded-lg border flex items-center justify-center shadow-md ${
                      isDark
                        ? 'border-[#c5a059]/60 bg-gradient-to-b from-[#201b2a] to-[#0c0b12]'
                        : 'border-[#A67C2E]/60 bg-gradient-to-b from-[#FFFDF9] to-[#EFE6D6]'
                    }`}
                  >
                    <span
                      className={`font-cinzel text-lg font-bold ${
                        isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
                      }`}
                    >
                      D'C
                    </span>
                  </div>
                  <div>
                    <span
                      className={`font-cinzel text-lg font-bold tracking-[0.16em] block ${
                        isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
                      }`}
                    >
                      D'CANTOR DHAKA
                    </span>
                    <span
                      className={`text-[9px] tracking-[0.25em] uppercase font-medium ${
                        isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
                      }`}
                    >
                      BOUTIQUE DECANT PERFUMERY
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Exact Brand Manifesto from prompt */}
            <p
              className={`text-xs leading-relaxed max-w-md ${
                isDark ? 'text-[#b0a494]' : 'text-[#665E55]'
              }`}
            >
              <strong className={isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'}>
                D'CANTOR DHAKA:
              </strong>{' '}
              Boutique decant perfumery based in Dhaka. Authentic pours from full-size bottles so you can wear, test, and gift luxury for less.
            </p>

            <div
              className={`flex items-center gap-2 text-xs ${
                isDark ? 'text-[#8c8273]' : 'text-[#7D7366]'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`} />
              <span>Dhaka, Bangladesh • Fast 24-48h Delivery</span>
            </div>
          </div>

          {/* Social Connectors & Direct Order (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <span
              className={`text-xs uppercase tracking-[0.2em] font-cinzel font-semibold block ${
                isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
              }`}
            >
              Direct Contact & Socials
            </span>
            <p className={`text-xs ${isDark ? 'text-[#9c9081]' : 'text-[#756C62]'}`}>
              Reach our concierge on WhatsApp or message us on official channels for consultations and orders.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <a
                id="footer-whatsapp-btn"
                href="https://wa.me/8801750050557"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-all group ${
                  isDark
                    ? 'bg-[#14121c] border-[#2d283c] hover:border-[#25D366] hover:bg-[#19241c] text-[#f5ede0]'
                    : 'bg-[#FFFFFF] border-[#E0D7C9] hover:border-[#25D366] hover:bg-[#F2FAF5] text-[#1A1615] shadow-xs'
                }`}
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
                <span className="font-semibold">WhatsApp</span>
              </a>

              <a
                id="footer-instagram-btn"
                href="https://www.instagram.com/dcantor.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-all group ${
                  isDark
                    ? 'bg-[#14121c] border-[#2d283c] hover:border-[#E1306C] hover:bg-[#251821] text-[#f5ede0]'
                    : 'bg-[#FFFFFF] border-[#E0D7C9] hover:border-[#E1306C] hover:bg-[#FAF0F4] text-[#1A1615] shadow-xs'
                }`}
              >
                <Instagram className="w-4 h-4 text-[#E1306C] group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Instagram</span>
              </a>

              <a
                id="footer-facebook-btn"
                href="https://www.facebook.com/profile.php?id=61584611739337"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-all group ${
                  isDark
                    ? 'bg-[#14121c] border-[#2d283c] hover:border-[#1877F2] hover:bg-[#151c27] text-[#f5ede0]'
                    : 'bg-[#FFFFFF] border-[#E0D7C9] hover:border-[#1877F2] hover:bg-[#F0F5FA] text-[#1A1615] shadow-xs'
                }`}
              >
                <Facebook className="w-4 h-4 text-[#1877F2] group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Facebook</span>
              </a>

              <a
                id="footer-email-btn"
                href="mailto:dcantorbd@gmail.com"
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs transition-all group ${
                  isDark
                    ? 'bg-[#14121c] border-[#2d283c] hover:border-[#c5a059] hover:bg-[#201c29] text-[#f5ede0]'
                    : 'bg-[#FFFFFF] border-[#E0D7C9] hover:border-[#A67C2E] hover:bg-[#F9F5EC] text-[#1A1615] shadow-xs'
                }`}
              >
                <Mail className={`w-4 h-4 group-hover:scale-110 transition-transform ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`} />
                <span className="font-semibold">Email</span>
              </a>
            </div>
          </div>

          {/* Decant Quality Standards (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <span
              className={`text-xs uppercase tracking-[0.2em] font-cinzel font-semibold block ${
                isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
              }`}
            >
              The Decant Creed
            </span>
            <ul className={`space-y-2 text-xs ${isDark ? 'text-[#9d9282]' : 'text-[#6E655B]'}`}>
              <li className="flex items-center gap-2">
                <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`} />
                <span>Original juice only, never diluted</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`} />
                <span>Heavy glass atomizer with fine mist</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`} />
                <span>Teflon thread sealed against leaks</span>
              </li>
              <li className="pt-1">
                <button
                  type="button"
                  onClick={onOpenDecantGuide}
                  className={`text-xs hover:underline underline-offset-4 flex items-center gap-1 font-medium ${
                    isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
                  }`}
                >
                  View full Decant Sizing Guide →
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div
          className={`pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
            isDark ? 'text-[#7e7467]' : 'text-[#7D7368]'
          }`}
        >
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} D'CANTOR DHAKA. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className={`hidden sm:inline ${isDark ? 'text-[#a39787]' : 'text-[#8E8376]'}`}>
              Boutique Decant Perfumery
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Owner Login link */}
            {isAdmin ? (
              <div className="flex items-center gap-3">
                <span className={`font-medium ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`}>
                  Logged in as Owner
                </span>
                <button
                  id="footer-admin-logout-btn"
                  type="button"
                  onClick={onLogoutAdmin}
                  className="text-rose-400 hover:text-rose-300 underline"
                >
                  Logout
                </button>
                <button
                  type="button"
                  onClick={onResetCatalog}
                  className={`flex items-center gap-1 text-[11px] ${
                    isDark ? 'text-[#8e8477] hover:text-[#c5a059]' : 'text-[#7D7368] hover:text-[#A67C2E]'
                  }`}
                  title="Reset catalog back to initial 19 fragrances"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restore Defaults</span>
                </button>
              </div>
            ) : (
              <button
                id="footer-owner-login-btn"
                type="button"
                onClick={onOpenOwnerLogin}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isDark ? 'text-[#9e9383] hover:text-[#c5a059]' : 'text-[#7D7368] hover:text-[#A67C2E]'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Owner Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
