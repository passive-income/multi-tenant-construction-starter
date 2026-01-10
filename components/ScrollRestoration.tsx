'use client';

import { useEffect } from 'react';

/**
 * ScrollRestoration component to handle proper scroll behavior during navigation
 * Prevents scroll jumps during page refresh and streaming content loading
 */
export function ScrollRestoration() {
  useEffect(() => {
    // Disable automatic scroll restoration by the browser
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Restore scroll position after hydration is complete
    const handleLoad = () => {
      // Let React finish hydration before restoring
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const scrollY = sessionStorage.getItem('scrollPosition');
          if (scrollY) {
            window.scrollTo(0, parseInt(scrollY, 10));
            sessionStorage.removeItem('scrollPosition');
          }
        });
      });
    };

    // Save scroll position before unload
    const handleBeforeUnload = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null;
}
