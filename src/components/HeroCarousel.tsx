import React, { useState, useEffect, useRef } from 'react';
import { BannerSlide } from '../types';
import { ChevronLeft, ChevronRight, MessageCircle, Compass, ShieldCheck, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeroCarouselProps {
  slides: BannerSlide[];
  onOpenDecantGuide?: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides, onOpenDecantGuide }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { isDark } = useTheme();

  const totalSlides = slides.length;

  // Keep index strictly in bounds if slides are added or removed remotely
  useEffect(() => {
    if (currentIndex >= totalSlides && totalSlides > 0) {
      setCurrentIndex(0);
    }
  }, [totalSlides, currentIndex]);

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, totalSlides]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const scrollToCatalog = () => {
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Aesthetic backdrop gradients for dark and light modes
  const darkSlideBgs = [
    'from-[#14121b] via-[#0d0c12] to-[#08080a]',
    'from-[#191522] via-[#0e0c14] to-[#08080a]',
    'from-[#12161b] via-[#0b0e14] to-[#08080a]',
    'from-[#1b1418] via-[#100c11] to-[#08080a]'
  ];

  const lightSlideBgs = [
    'from-[#FFFDF9] via-[#F7F1E6] to-[#ECE2D2]',
    'from-[#FAF5EC] via-[#F3EBDE] to-[#E9DFCF]',
    'from-[#FCF8F0] via-[#F4EDE0] to-[#E6DC source]',
    'from-[#FAF4EA] via-[#F1E9DA] to-[#E5DBCB]'
  ];

  return (
    <section
      id="hero-slideshow"
      aria-label="Editorial Highlights"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Aspect ratio container: aspect-[4/5] min-h-[460px] on mobile, 21:9 on desktop */}
      <div
        className={`relative w-full aspect-[4/5] sm:aspect-[16/10] md:aspect-[21/9] min-h-[460px] md:min-h-[420px] rounded-2xl overflow-hidden border transition-colors ${
          isDark
            ? 'border-[#262232] shadow-[0_20px_60px_rgba(0,0,0,0.8)] bg-[#08080a]'
            : 'border-[#EAE3D5] shadow-[0_12px_40px_rgba(166,124,46,0.08)] bg-[#FFFDF9]'
        }`}
      >
        {/* Subtle decorative mesh overlay & luxury gold vignette */}
        <div
          className={`absolute inset-0 pointer-events-none z-10 ${
            isDark
              ? 'bg-[radial-gradient(circle_at_20%_30%,rgba(197,160,89,0.12),transparent_60%)]'
              : 'bg-[radial-gradient(circle_at_20%_30%,rgba(166,124,46,0.08),transparent_60%)]'
          }`}
        />

        {/* Slides rendering with smooth crossfade */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          const bgGrad = isDark
            ? darkSlideBgs[index % darkSlideBgs.length]
            : lightSlideBgs[index % lightSlideBgs.length];

          const hasImage = Boolean(slide.imageUrl);
          const isFullBleed = hasImage && slide.imageLayout === 'full-bleed';
          const isSideImage = hasImage && !isFullBleed;

          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex flex-col ${
                isSideImage
                  ? 'md:flex-row items-center justify-between gap-6 md:gap-10'
                  : isFullBleed
                  ? 'items-center md:items-start justify-center'
                  : 'items-center justify-center text-center'
              } p-6 sm:p-10 md:p-16 ${
                isActive ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              } bg-gradient-to-br ${bgGrad}`}
            >
              {/* Optional Full-Bleed Custom Uploaded Background Photo */}
              {isFullBleed && (
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${
                      isDark
                        ? 'from-[#08080a] via-[#08080a]/80 to-transparent'
                        : 'from-[#FFFDF9] via-[#FFFDF9]/85 to-transparent'
                    }`}
                  />
                </div>
              )}

              {/* Editorial Copy Column */}
              <div
                className={`relative z-20 ${
                  isSideImage
                    ? 'max-w-xl lg:max-w-2xl flex flex-col justify-center items-center md:items-start text-center md:text-left'
                    : isFullBleed
                    ? 'max-w-xl flex flex-col justify-center items-center md:items-start text-center md:text-left'
                    : 'max-w-3xl flex flex-col justify-center items-center text-center mx-auto'
                } space-y-4 md:space-y-6 w-full`}
              >
                {/* Badge / Slogan */}
                <div
                  className={`inline-flex items-center gap-2 ${
                    isSideImage || isFullBleed ? 'justify-center md:justify-start' : 'justify-center'
                  }`}
                >
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase backdrop-blur-md border ${
                      isDark
                        ? 'text-[#c5a059] bg-[#1a1724]/90 border-[#c5a059]/40'
                        : 'text-[#A67C2E] bg-[#FAF4EA]/95 border-[#A67C2E]/40 shadow-xs'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    {slide.badge || 'AUTHENTIC DECANTS'}
                  </span>
                  <span
                    className={`hidden sm:inline-block text-[10px] uppercase tracking-widest ${
                      isDark ? 'text-[#a89c8d]' : 'text-[#7D7364]'
                    }`}
                  >
                    {slide.accentText || "D'CANTOR DHAKA"}
                  </span>
                </div>

                {/* Primary Heading */}
                <h1
                  className={`font-cinzel text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight md:leading-[1.15] ${
                    isDark ? 'text-[#f5ede0]' : 'text-[#1A1615]'
                  } ${!isSideImage && !isFullBleed ? 'max-w-2xl' : ''}`}
                >
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p
                  className={`text-xs sm:text-base md:text-lg leading-relaxed ${
                    isSideImage || isFullBleed ? 'max-w-xl' : 'max-w-2xl mx-auto'
                  } font-light ${
                    isDark ? 'text-[#b8ad9e]' : 'text-[#665E55]'
                  }`}
                >
                  {slide.subtitle}
                </p>

                {/* Call To Actions: Explore Catalog & Direct WhatsApp */}
                <div
                  className={`pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center ${
                    !isSideImage && !isFullBleed ? 'justify-center' : ''
                  } gap-3 sm:gap-4 w-full sm:w-auto`}
                >
                  <button
                    id={`hero-explore-btn-${index}`}
                    type="button"
                    onClick={scrollToCatalog}
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm tracking-wide shadow-lg active:scale-95 transition-all min-h-[44px] ${
                      isDark
                        ? 'bg-gradient-to-r from-[#c5a059] via-[#d8b46d] to-[#c5a059] text-[#08080a] hover:brightness-110'
                        : 'bg-[#1A1615] text-[#FAF4E8] hover:bg-[#2C2420] border border-[#A67C2E]/40'
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explore The Collection</span>
                  </button>

                  <a
                    id={`hero-whatsapp-btn-${index}`}
                    href="https://wa.me/8801750050557?text=Hello%20D'Cantor,%20I%20would%20like%20to%20inquire%20about%20your%20decant%20fragrances."
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm tracking-wide transition-all active:scale-95 backdrop-blur-md border min-h-[44px] ${
                      isDark
                        ? 'bg-[#14121c]/90 text-[#f5ede0] border-[#363045] hover:border-[#c5a059] hover:bg-[#1f1b2c]'
                        : 'bg-[#FFFFFF]/90 text-[#1A1615] border-[#DED4C4] hover:border-[#A67C2E] hover:bg-[#FAF5EC] shadow-xs'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]/20" />
                    <span>Chat on WhatsApp</span>
                  </a>

                  {onOpenDecantGuide && (
                    <button
                      type="button"
                      onClick={onOpenDecantGuide}
                      className={`hidden lg:inline-flex items-center gap-1.5 text-xs underline underline-offset-4 tracking-wider uppercase ml-2 transition-colors ${
                        isDark
                          ? 'text-[#a99c8a] hover:text-[#c5a059]'
                          : 'text-[#7D7364] hover:text-[#A67C2E]'
                      }`}
                    >
                      <ShieldCheck className={`w-3.5 h-3.5 ${isDark ? 'text-[#c5a059]' : 'text-[#A67C2E]'}`} />
                      Authenticity Guarantee
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Clean User-Uploaded Image (NO dummy graphics or bottles) */}
              {isSideImage && (
                <div className="relative z-20 flex items-center justify-center w-full md:w-5/12 lg:w-1/2 max-h-[260px] sm:max-h-[340px] md:max-h-[420px] p-2 mt-4 md:mt-0 shrink-0">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-contain max-h-[240px] sm:max-h-[320px] md:max-h-[420px] rounded-2xl drop-shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* Manual Left/Right Navigation Arrows */}
        <button
          id="hero-prev-arrow"
          type="button"
          onClick={goToPrev}
          aria-label="Previous slide"
          className={`absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full transition-all backdrop-blur-md active:scale-95 shadow-lg ${
            isDark
              ? 'bg-[#08080a]/70 hover:bg-[#c5a059] text-[#f5ede0] hover:text-[#08080a] border border-[#3b3548] hover:border-[#c5a059]'
              : 'bg-[#FFFFFF]/85 hover:bg-[#A67C2E] text-[#1A1615] hover:text-white border border-[#E0D7C9] hover:border-[#A67C2E]'
          }`}
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          id="hero-next-arrow"
          type="button"
          onClick={goToNext}
          aria-label="Next slide"
          className={`absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full transition-all backdrop-blur-md active:scale-95 shadow-lg ${
            isDark
              ? 'bg-[#08080a]/70 hover:bg-[#c5a059] text-[#f5ede0] hover:text-[#08080a] border border-[#3b3548] hover:border-[#c5a059]'
              : 'bg-[#FFFFFF]/85 hover:bg-[#A67C2E] text-[#1A1615] hover:text-white border border-[#E0D7C9] hover:border-[#A67C2E]'
          }`}
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Slide Indicator Dots */}
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md ${
            isDark
              ? 'bg-[#08080a]/70 border-[#2b2737]'
              : 'bg-[#FFFFFF]/85 border-[#E2DACB] shadow-xs'
          }`}
        >
          {slides.map((_, dotIdx) => (
            <button
              key={dotIdx}
              id={`hero-dot-${dotIdx}`}
              type="button"
              onClick={() => setCurrentIndex(dotIdx)}
              aria-label={`Go to slide ${dotIdx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                dotIdx === currentIndex
                  ? isDark
                    ? 'w-6 bg-[#c5a059]'
                    : 'w-6 bg-[#A67C2E]'
                  : isDark
                  ? 'w-1.5 bg-[#403b4d] hover:bg-[#726a84]'
                  : 'w-1.5 bg-[#D5CBBC] hover:bg-[#A67C2E]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
