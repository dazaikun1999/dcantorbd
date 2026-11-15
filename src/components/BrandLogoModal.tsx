import React, { useState, useEffect } from 'react';
import { X, Upload, Link as LinkIcon, Check, Trash2, Sparkles, Image as ImageIcon, ShieldCheck, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useModalAnimation } from '../hooks/useModalAnimation';

interface BrandLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogo: string;
  onSaveLogo: (logoUrl: string) => void | Promise<void>;
  currentFavicon?: string;
  onSaveFavicon?: (faviconUrl: string) => void | Promise<void>;
}

export const BrandLogoModal: React.FC<BrandLogoModalProps> = ({
  isOpen,
  onClose,
  currentLogo,
  onSaveLogo,
  currentFavicon,
  onSaveFavicon,
}) => {
  const { shouldRender, isAnimated } = useModalAnimation(isOpen, 300);
  const { isDark } = useTheme();
  const [logoInput, setLogoInput] = useState<string>(currentLogo);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isSavingLogo, setIsSavingLogo] = useState<boolean>(false);
  const [isSavingFavicon, setIsSavingFavicon] = useState<boolean>(false);

  const DEFAULT_FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='15' fill='%23121118' stroke='%23C5A059' stroke-width='1.5'/%3E%3Crect x='13' y='5' width='6' height='4' rx='1' fill='%23FFFFFF'/%3E%3Crect x='14.5' y='9' width='3' height='2' fill='%23C5A059'/%3E%3Crect x='9' y='11' width='14' height='14' rx='3' fill='%23FFFFFF'/%3E%3Crect x='11' y='14' width='10' height='8' rx='1' fill='%23121118'/%3E%3Ccircle cx='16' cy='18' r='1.5' fill='%23C5A059'/%3E%3C/svg%3E?v=3";

  const [faviconInput, setFaviconInput] = useState<string>(currentFavicon || '');
  const [faviconFileName, setFaviconFileName] = useState<string>('');

  useEffect(() => {
    setLogoInput(currentLogo);
    setFaviconInput(currentFavicon || '');
    setFileName('');
    setFileSize('');
    setFaviconFileName('');
    setToastMessage('');
  }, [currentLogo, currentFavicon, isOpen]);

  if (!shouldRender) return null;

  const handleFile = (file: File) => {
    if (!file.type.match(/^image\/(png|jpeg|jpg|svg\+xml|webp)$/i)) {
      setToastMessage('Please select a valid image file (PNG, JPG, SVG, or WEBP).');
      return;
    }

    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + ' KB');

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setLogoInput(result);
        setToastMessage('Logo loaded from device. Click "Save & Update Logo" to apply.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFaviconFile = (file: File) => {
    if (!file.type.match(/^image\/(png|jpeg|jpg|svg\+xml|webp|x-icon|vnd\.microsoft\.icon)$/i) && !file.name.endsWith('.ico')) {
      setToastMessage('Please select a valid icon file (PNG, SVG, ICO, WEBP, or JPG).');
      return;
    }

    setFaviconFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setFaviconInput(result);
        setToastMessage('Favicon loaded from device. Click "Save & Apply Favicon" to sync across all browsers.');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFaviconInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFaviconFile(file);
    }
  };

  const handleSaveFavicon = async () => {
    if (onSaveFavicon) {
      try {
        setIsSavingFavicon(true);
        await onSaveFavicon(faviconInput);
        setToastMessage('Favicon saved and synchronized to Cloud Firestore across all devices!');
      } catch (err) {
        console.error(err);
        setToastMessage('Failed to sync favicon to cloud. Please try again.');
      } finally {
        setIsSavingFavicon(false);
      }
    }
  };

  const handleResetFavicon = async () => {
    setFaviconInput('');
    setFaviconFileName('');
    if (onSaveFavicon) {
      try {
        setIsSavingFavicon(true);
        await onSaveFavicon('');
        setToastMessage('Favicon reset to default bottle crest in Cloud Firestore!');
      } catch (err) {
        console.error(err);
        setToastMessage('Failed to reset favicon. Please try again.');
      } finally {
        setIsSavingFavicon(false);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      setIsSavingLogo(true);
      await onSaveLogo(logoInput);
      setToastMessage('Official logo saved & synchronized to Cloud Firestore across all browsers!');
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to sync logo to cloud. Please try again.');
    } finally {
      setIsSavingLogo(false);
    }
  };

  const handleRemove = async () => {
    setLogoInput('');
    setFileName('');
    setFileSize('');
    try {
      setIsSavingLogo(true);
      await onSaveLogo('');
      setToastMessage('Custom logo removed from Cloud Firestore. Default monogram crest restored.');
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to reset logo in cloud. Please try again.');
    } finally {
      setIsSavingLogo(false);
    }
  };

  return (
    <div
      id="brand-logo-modal-backdrop"
      onClick={onClose}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto transition-opacity duration-300 ease-out ${
        isAnimated ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        id="brand-logo-modal"
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl my-auto max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-300 ease-out transform ${
          isAnimated ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
        } ${
          isDark
            ? 'bg-[#121118] border border-[#c5a059]/30 text-[#f5ede0]'
            : 'bg-[#FFFFFF] border border-[#EAE3D5] text-[#1A1615]'
        }`}
      >
        {/* Close Button */}
        <button
          id="close-brand-logo-modal-btn"
          type="button"
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isDark
              ? 'bg-[#1c1926] text-[#b3a695] hover:text-[#f5ede0]'
              : 'bg-[#F2ECE1] text-[#7A7063] hover:text-[#1A1615]'
          }`}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-[#c5a059]" />
            <span
              className={`text-xs uppercase tracking-[0.2em] font-cinzel font-semibold ${
                isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
              }`}
            >
              Brand & Logo Settings
            </span>
          </div>
          <h2
            className={`font-cinzel text-xl sm:text-2xl font-bold ${
              isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
            }`}
          >
            Official Boutique Logo & Favicon
          </h2>
          <p className={`text-xs mt-1 ${isDark ? 'text-[#a09485]' : 'text-[#7D7264]'}`}>
            Upload the official D'Cantor Dhaka logo and browser tab favicon. All changes are saved to Cloud Firestore and sync live across all browsers, smartphones, and devices.
          </p>
        </div>

        {/* Success / Alert Toast */}
        {toastMessage && (
          <div
            className={`mb-5 p-3 rounded-xl text-xs font-medium flex items-center gap-2 border animate-fade-in ${
              toastMessage.includes('saved') || toastMessage.includes('loaded')
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                : isDark
                ? 'bg-[#1a1725] text-[#c5a059] border-[#383149]'
                : 'bg-[#FAF4EA] text-[#A67C2E] border-[#E8DFD0]'
            }`}
          >
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Source Switcher: Local Upload vs URL */}
        <div
          className={`flex items-center p-1 rounded-xl border mb-5 ${
            isDark ? 'bg-[#181523] border-[#2f293e]' : 'bg-[#F9F5EC] border-[#E5DACB]'
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'upload'
                ? isDark
                  ? 'bg-[#c5a059] text-[#08080a] shadow-xs'
                  : 'bg-[#A67C2E] text-white shadow-xs'
                : isDark
                ? 'text-[#a69a8b] hover:text-[#f5ede0]'
                : 'text-[#7D7264] hover:text-[#1A1615]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Local Device Upload</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'url'
                ? isDark
                  ? 'bg-[#c5a059] text-[#08080a] shadow-xs'
                  : 'bg-[#A67C2E] text-white shadow-xs'
                : isDark
                ? 'text-[#a69a8b] hover:text-[#f5ede0]'
                : 'text-[#7D7264] hover:text-[#1A1615]'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Direct Image URL</span>
          </button>
        </div>

        {/* Tab 1: Local Upload Input */}
        {activeTab === 'upload' && (
          <div className="space-y-3 mb-6">
            <label
              htmlFor="logo-file-input"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-[#c5a059] bg-[#c5a059]/10'
                  : isDark
                  ? 'border-[#383149] hover:border-[#c5a059] bg-[#171422]'
                  : 'border-[#D9CFC0] hover:border-[#A67C2E] bg-[#FAF6F0]'
              }`}
            >
              <input
                id="logo-file-input"
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  isDark
                    ? 'bg-[#221d2f] text-[#c5a059] border border-[#3c344e]'
                    : 'bg-[#F2ECE1] text-[#A67C2E] border border-[#DDD4C5]'
                }`}
              >
                <Upload className="w-6 h-6" />
              </div>
              <p
                className={`font-semibold text-sm mb-1 ${
                  isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
                }`}
              >
                Click to browse or drag & drop official logo
              </p>
              <p className={`text-xs ${isDark ? 'text-[#9e9282]' : 'text-[#7D7264]'}`}>
                Supports PNG, SVG, WEBP, or JPG (Transparent background recommended)
              </p>
              {fileName && (
                <div className="mt-3 px-3 py-1 rounded-md bg-[#c5a059]/20 text-[#c5a059] text-xs font-mono font-semibold">
                  Selected: {fileName} ({fileSize})
                </div>
              )}
            </label>
          </div>
        )}

        {/* Tab 2: URL Input Fallback */}
        {activeTab === 'url' && (
          <div className="space-y-2 mb-6">
            <label
              htmlFor="logo-url-input"
              className={`block text-xs font-semibold uppercase tracking-wider ${
                isDark ? 'text-[#ded5c7]' : 'text-[#5E554B]'
              }`}
            >
              Paste Public Image URL
            </label>
            <div className="relative">
              <input
                id="logo-url-input"
                type="url"
                value={logoInput}
                onChange={(e) => setLogoInput(e.target.value)}
                placeholder="https://example.com/dcantor-official-logo.png"
                className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-hidden transition-all ${
                  isDark
                    ? 'bg-[#171422] border-[#362f48] text-[#f5ede0] focus:border-[#c5a059]'
                    : 'bg-[#FAF6F0] border-[#E0D7C8] text-[#1A1615] focus:border-[#A67C2E]'
                }`}
              />
              {logoInput && (
                <button
                  type="button"
                  onClick={() => setLogoInput('')}
                  className="absolute right-3 top-3 text-xs text-stone-400 hover:text-stone-200"
                >
                  Clear
                </button>
              )}
            </div>
            <p className={`text-[11px] ${isDark ? 'text-[#8e8272]' : 'text-[#8C8173]'}`}>
              Direct link to hosted logo file. Changes appear in the live preview below immediately.
            </p>
          </div>
        )}

        {/* Dual Live Preview: Dark & Light Themes */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span
              className={`text-xs uppercase tracking-wider font-semibold font-cinzel ${
                isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'
              }`}
            >
              Live Dual-Theme Preview
            </span>
            <span className={`text-[11px] ${isDark ? 'text-[#8e8272]' : 'text-[#8C8173]'}`}>
              Header Scale (h-10 to h-12)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Dark Mode Canvas Preview */}
            <div className="rounded-xl border border-[#2d283c] bg-[#08080a] p-4 flex flex-col items-center justify-center min-h-[120px] text-center relative overflow-hidden">
              <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider text-[#c5a059] font-mono">
                Dark Mode
              </span>
              {logoInput ? (
                <img
                  src={logoInput}
                  alt="Logo Dark Preview"
                  className="h-10 md:h-12 w-auto max-w-[200px] object-contain transition-all"
                  onError={(e) => {
                    // fallback if broken
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex items-center gap-2.5 opacity-60">
                  <div className="w-9 h-9 rounded-lg border border-[#c5a059]/40 bg-[#15121c] flex items-center justify-center font-cinzel text-sm font-bold text-[#c5a059]">
                    D'C
                  </div>
                  <div className="text-left">
                    <span className="font-cinzel text-xs font-bold text-[#f5ede0] block">D'CANTOR</span>
                    <span className="text-[8px] tracking-wider text-[#c5a059]">DEFAULT SERIF CREST</span>
                  </div>
                </div>
              )}
            </div>

            {/* Light Mode Canvas Preview */}
            <div className="rounded-xl border border-[#E0D7C9] bg-[#F9F6F0] p-4 flex flex-col items-center justify-center min-h-[120px] text-center relative overflow-hidden">
              <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider text-[#A67C2E] font-mono">
                Light Mode
              </span>
              {logoInput ? (
                <img
                  src={logoInput}
                  alt="Logo Light Preview"
                  className="h-10 md:h-12 w-auto max-w-[200px] object-contain transition-all"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex items-center gap-2.5 opacity-70">
                  <div className="w-9 h-9 rounded-lg border border-[#A67C2E]/40 bg-[#FFFDF9] flex items-center justify-center font-cinzel text-sm font-bold text-[#A67C2E]">
                    D'C
                  </div>
                  <div className="text-left">
                    <span className="font-cinzel text-xs font-bold text-[#1A1615] block">D'CANTOR</span>
                    <span className="text-[8px] tracking-wider text-[#A67C2E]">DEFAULT SERIF CREST</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dedicated Favicon Uploader Section */}
        <div
          id="favicon-uploader-section"
          className={`p-5 rounded-2xl border mb-6 transition-colors ${
            isDark ? 'bg-[#161320] border-[#2c263c]' : 'bg-[#FAF6F0] border-[#E8DFD0]'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <Globe className={`w-4 h-4 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`} />
              <h3
                className={`font-cinzel text-sm sm:text-base font-bold ${
                  isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
                }`}
              >
                Browser Tab Favicon
              </h3>
            </div>
            {faviconInput && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-medium">
                Custom Favicon Set
              </span>
            )}
          </div>

          <p className={`text-xs mb-4 ${isDark ? 'text-[#a09485]' : 'text-[#7D7264]'}`}>
            Upload Browser Tab Favicon (PNG, SVG, or ICO format recommended)
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            {/* Live Icon Preview: 32x32px box in a browser tab simulation */}
            <div className="sm:col-span-5 flex flex-col gap-1.5">
              <span
                className={`text-[11px] font-semibold uppercase tracking-wider ${
                  isDark ? 'text-[#ded5c7]' : 'text-[#5E554B]'
                }`}
              >
                Live Tab Preview (32×32px)
              </span>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-3 ${
                  isDark ? 'bg-[#0b0a10] border-[#2d283c]' : 'bg-[#FFFFFF] border-[#E0D7C9]'
                }`}
              >
                {/* Small square box (32x32px) */}
                <div
                  id="favicon-32px-preview-box"
                  className={`w-[32px] h-[32px] shrink-0 rounded-md border flex items-center justify-center p-0.5 overflow-hidden transition-all shadow-xs ${
                    isDark ? 'bg-[#15121e] border-[#c5a059]/40' : 'bg-[#FAF6F0] border-[#A67C2E]/40'
                  }`}
                  title="32x32px Favicon Preview"
                >
                  <img
                    src={faviconInput || DEFAULT_FAVICON}
                    alt="Browser Tab Favicon Preview"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-semibold truncate block ${
                        isDark ? 'text-[#e5dcce]' : 'text-[#2C2723]'
                      }`}
                    >
                      D'CANTOR DHAKA
                    </span>
                    <span className={`text-[10px] ${isDark ? 'text-[#8a7f70]' : 'text-[#968b7d]'}`}>✕</span>
                  </div>
                  <span className="text-[10px] text-[#c5a059] block font-mono">
                    browser tab preview
                  </span>
                </div>
              </div>
            </div>

            {/* File Input & Action Area */}
            <div className="sm:col-span-7 flex flex-col gap-2.5">
              <div>
                <label
                  htmlFor="favicon-file-input"
                  className={`w-full py-2.5 px-3 rounded-xl border border-dashed flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    isDark
                      ? 'border-[#3c344e] hover:border-[#c5a059] bg-[#1a1726] text-[#ded5c7]'
                      : 'border-[#D9CFC0] hover:border-[#A67C2E] bg-[#FFFFFF] text-[#5E554B]'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="text-xs font-semibold">Choose Favicon File</span>
                  <input
                    id="favicon-file-input"
                    type="file"
                    accept="image/png, image/svg+xml, image/x-icon, image/jpeg, image/webp"
                    onChange={handleFaviconInputChange}
                    className="hidden"
                  />
                </label>
                {faviconFileName && (
                  <p className="text-[11px] font-mono mt-1 text-[#c5a059] truncate">
                    Selected: {faviconFileName}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="save-favicon-btn"
                  type="button"
                  disabled={isSavingFavicon}
                  onClick={handleSaveFavicon}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
                    isDark
                      ? 'bg-[#c5a059] text-[#08080a] hover:bg-[#d8b46d]'
                      : 'bg-[#A67C2E] text-white hover:bg-[#8e6822]'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${isSavingFavicon ? 'animate-spin' : ''}`} />
                  <span>{isSavingFavicon ? 'Syncing to Cloud...' : 'Save & Apply Favicon'}</span>
                </button>

                {faviconInput && (
                  <button
                    id="reset-favicon-btn"
                    type="button"
                    disabled={isSavingFavicon}
                    onClick={handleResetFavicon}
                    title="Reset to default favicon"
                    className={`p-2 rounded-xl border text-xs text-rose-400 hover:text-rose-300 transition-colors disabled:opacity-50 ${
                      isDark ? 'border-[#382f48] bg-[#1a1626]' : 'border-[#DDD3C2] bg-[#FFFFFF]'
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div
          className={`pt-4 border-t flex flex-wrap items-center justify-between gap-3 ${
            isDark ? 'border-[#292437]' : 'border-[#EAE3D5]'
          }`}
        >
          <div>
            {currentLogo && (
              <button
                id="remove-brand-logo-btn"
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset to Default Monogram</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                isDark
                  ? 'bg-[#181523] border-[#372f48] text-[#ded5c7] hover:bg-[#201c2e]'
                  : 'bg-[#FAF6F0] border-[#DDD3C2] text-[#5E554B] hover:bg-[#F2ECE1]'
              }`}
            >
              Cancel
            </button>

            <button
              id="save-brand-logo-btn"
              type="button"
              disabled={isSavingLogo}
              onClick={handleSave}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${
                isDark
                  ? 'bg-gradient-to-r from-[#c5a059] to-[#d8b46d] text-[#08080a] hover:brightness-110'
                  : 'bg-[#A67C2E] text-white hover:bg-[#8e6822]'
              }`}
            >
              <Check className={`w-4 h-4 ${isSavingLogo ? 'animate-spin' : ''}`} />
              <span>{isSavingLogo ? 'Syncing to Cloud...' : 'Save & Update Logo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
