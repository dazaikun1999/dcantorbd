import React, { useState } from 'react';
import { X, Lock, Key, AlertCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useModalAnimation } from '../hooks/useModalAnimation';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { shouldRender, isAnimated } = useModalAnimation(isOpen, 300);
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const { isDark } = useTheme();

  if (!shouldRender) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Updated passkey: "Cantor#Vault2026!"
    if (passkey.trim() === 'Cantor#Vault2026!') {
      setError('');
      setPasskey('');
      onSuccess();
      onClose();
    } else {
      setError('Incorrect passkey. Please verify administrative credentials.');
    }
  };

  return (
    <div
      id="admin-login-modal-backdrop"
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto transition-opacity duration-300 ease-out ${
        isAnimated ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        id="admin-login-modal"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md my-auto max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl transition-all duration-300 ease-out transform ${
          isAnimated ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
        } ${
          isDark
            ? 'bg-[#121118] border border-[#c5a059]/30 text-[#f5ede0]'
            : 'bg-[#FFFFFF] border border-[#EAE3D5] text-[#1A1615]'
        }`}
      >
        {/* Close button */}
        <button
          id="close-login-modal-btn"
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isDark
              ? 'bg-[#1c1926] text-[#b3a695] hover:text-[#f5ede0]'
              : 'bg-[#F2ECE1] text-[#786D61] hover:text-[#1A1615]'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Crest */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div
            className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-md ${
              isDark
                ? 'bg-[#1b1727] border-[#c5a059]/50 text-[#c5a059]'
                : 'bg-[#FAF4EA] border-[#A67C2E]/50 text-[#A67C2E]'
            }`}
          >
            <Lock className="w-6 h-6" />
          </div>

          <h2
            className={`font-cinzel text-xl sm:text-2xl font-bold ${
              isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
            }`}
          >
            Owner Portal Access
          </h2>
          <p className={`text-xs max-w-xs ${isDark ? 'text-[#a09485]' : 'text-[#6A6054]'}`}>
            Enter the administrative passkey to manage catalog pricing, stock status, and hero campaign banners.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="admin-passkey-input"
              className={`text-xs uppercase tracking-wider font-semibold ${
                isDark ? 'text-[#9c9081]' : 'text-[#7A7063]'
              }`}
            >
              Administrative Passkey
            </label>
            <div className="relative">
              <Key className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-[#847869]' : 'text-[#8E8375]'}`} />
              <input
                id="admin-passkey-input"
                type="password"
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter passkey..."
                autoFocus
                className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none ${
                  isDark
                    ? 'bg-[#171422] border-[#2e283d] text-[#f5ede0] placeholder-[#6b6256] focus:border-[#c5a059]'
                    : 'bg-[#FAF6F0] border-[#DFD6C7] text-[#1A1615] placeholder-[#8E8375] focus:border-[#A67C2E]'
                }`}
              />
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            id="admin-login-submit-btn"
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
              isDark
                ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b46d] text-[#08080a] hover:brightness-110'
                : 'bg-[#1A1615] text-[#FAF4E8] hover:bg-[#2C2420] border border-[#A67C2E]/40'
            }`}
          >
            Authenticate & Open Vault
          </button>
        </form>
      </div>
    </div>
  );
};
