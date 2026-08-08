import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Target landing page & animation assets to pre-fetch and pre-decode off the main thread
const CRITICAL_IMAGES = [
  '/acm_logo.png',
  '/hero_secction_bg.png',
  '/images/hero_secction_bg.png',
  '/guest/John Paul Antony.png',
  '/guest/Rohith Amula.png',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
];

const CRITICAL_FONTS = [
  '16px "Plus Jakarta Sans"',
  '16px "Space Grotesk"',
  '16px "Syne"',
  '16px "Outfit"',
  '16px "Instrument Serif"',
  '16px "Inter"',
];

let isPreloadPipelineStarted = false;

/**
 * Pre-decodes images asynchronously off the main thread using browser Image Decoding API.
 * This primes GPU textures before the user scrolls or views the section.
 */
async function preloadAndDecodeImages(): Promise<void> {
  const promises = CRITICAL_IMAGES.map((url) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      // Use standard fetch priority hint for modern browsers
      (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = 'high';
      
      img.onload = async () => {
        if ('decode' in img) {
          try {
            await img.decode();
          } catch {
            // Ignore decode failures on unsupported SVG/corrupted images
          }
        }
        resolve();
      };
      
      img.onerror = () => resolve();
      img.src = url;

      // Add link preload header hint dynamically
      if (typeof document !== 'undefined') {
        const existing = document.querySelector(`link[href="${url}"]`);
        if (!existing) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = url;
          document.head.appendChild(link);
        }
      }
    });
  });

  await Promise.all(promises);
}

/**
 * Pre-loads all core typography fonts to avoid FOUT / layout reflow during scroll triggers.
 */
async function preloadFonts(): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) return;

  const fontPromises = CRITICAL_FONTS.map(async (fontSpec) => {
    try {
      await document.fonts.load(fontSpec);
    } catch {
      // Ignore font loading errors gracefully
    }
  });

  await Promise.all(fontPromises);
}

/**
 * Configures GSAP ScrollTrigger for mobile 60–120 FPS high-performance scroll triggers
 * and runs an early silent refresh pass during idle slices.
 */
function prewarmGSAPScrollTriggers(): void {
  // Mobile & high refresh rate display optimization for GSAP ScrollTrigger
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
  });

  // Schedule a silent refresh during browser idle window
  const requestIdle =
    typeof window !== 'undefined' && 'requestIdleCallback' in window
      ? (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback
      : (cb: () => void) => setTimeout(cb, 100);

  requestIdle(() => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  });
}

/**
 * Main entry point: Starts the asynchronous preloading pipeline when the preloader starts.
 */
export function startAsyncPreloadPipeline(): void {
  if (isPreloadPipelineStarted) return;
  isPreloadPipelineStarted = true;

  // Run asset loading & decoding concurrently off the main thread
  const executePipeline = async () => {
    try {
      await Promise.all([
        preloadAndDecodeImages(),
        preloadFonts(),
      ]);

      // Pre-warm GSAP animations & ScrollTrigger boundaries
      prewarmGSAPScrollTriggers();
    } catch (err) {
      console.warn('[Preload Engine] Warning during async asset pipeline:', err);
    }
  };

  // Schedule non-blocking execution using requestIdleCallback / microtask
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
      executePipeline();
    });
  } else {
    setTimeout(executePipeline, 50);
  }
}
