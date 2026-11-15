import { useState, useEffect } from 'react';

/**
 * Custom hook to handle smooth, velvety scale-and-fade animations for modals & drawers.
 * Ensures initial mount renders with closed state before transitioning to open state,
 * and delays unmounting until exit animation completes.
 */
export function useModalAnimation(isOpen: boolean, durationMs: number = 300) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let animFrame: number;

    if (isOpen) {
      setShouldRender(true);
      // Wait for next animation frame + small tick so DOM is painted with initial closed state
      animFrame = requestAnimationFrame(() => {
        timer = setTimeout(() => {
          setIsAnimated(true);
        }, 16);
      });
    } else {
      setIsAnimated(false);
      timer = setTimeout(() => {
        setShouldRender(false);
      }, durationMs);
    }

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(timer);
    };
  }, [isOpen, durationMs]);

  // Lock background body scroll with proper cleanup
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return { shouldRender, isAnimated };
}
