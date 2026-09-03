import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { User } from '../../types';

interface ScrollAnimationHeroProps {
  user: User | null;
}

const TOTAL_FRAMES = 149;
const PRELOAD_BATCH = 15; // How many frames to preload per idle tick
const FRAMES_BASE_PATH = '/frames';

/** Zero-padded frame filename: frame_001.webp */
const getFrameUrl = (index: number): string => {
  const padded = String(index).padStart(3, '0');
  return `${FRAMES_BASE_PATH}/frame_${padded}.webp`;
};

/**
 * Cinematic scroll-driven frame animation hero.
 * 149 frames at 2560×1440 rendered on a canvas, scrubbed by scroll progress.
 * The section is 300vh tall — the canvas is sticky and stays pinned
 * while the frame sequence plays, then the page scrolls normally.
 */
export const ScrollAnimationHero: React.FC<ScrollAnimationHeroProps> = ({ user }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Array<HTMLImageElement | null>>(new Array(TOTAL_FRAMES + 1).fill(null));
  const currentFrameRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const loadedCountRef = useRef(0);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isInitialFrameReady, setIsInitialFrameReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // -------------------------------------------------------
  // Draw frame to canvas
  // -------------------------------------------------------
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[frameIndex];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    // Cover: scale to fill canvas, centered
    const scale = Math.max(canvasW / imgW, canvasH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const offsetX = (canvasW - drawW) / 2;
    const offsetY = (canvasH - drawH) / 2;

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }, []);

  // -------------------------------------------------------
  // Canvas resize handler
  // -------------------------------------------------------
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // -------------------------------------------------------
  // Load a single frame
  // -------------------------------------------------------
  const loadFrame = useCallback((index: number, onLoaded?: () => void) => {
    if (imagesRef.current[index]) {
      onLoaded?.();
      return;
    }
    const img = new Image();
    img.decoding = 'async';

    img.onload = () => {
      imagesRef.current[index] = img;
      loadedCountRef.current += 1;
      setLoadProgress(Math.round((loadedCountRef.current / TOTAL_FRAMES) * 100));
      onLoaded?.();
    };

    img.onerror = () => {
      // PNG fallback if WebP not supported
      const pngUrl = getFrameUrl(index).replace('.webp', '.png');
      const fallback = new Image();
      fallback.onload = () => {
        imagesRef.current[index] = fallback;
        loadedCountRef.current += 1;
        onLoaded?.();
      };
      fallback.src = pngUrl;
    };

    img.src = getFrameUrl(index);
  }, []);

  // -------------------------------------------------------
  // Progressive background preloading
  // -------------------------------------------------------
  const preloadRemaining = useCallback(() => {
    let frameIndex = 2;

    const loadNext = () => {
      if (frameIndex > TOTAL_FRAMES) return;

      const batch = Math.min(PRELOAD_BATCH, TOTAL_FRAMES - frameIndex + 1);
      let loaded = 0;

      for (let i = 0; i < batch; i++) {
        const idx = frameIndex + i;
        loadFrame(idx, () => {
          loaded++;
          if (loaded === batch) {
            frameIndex += batch;
            // Yield to main thread before next batch
            if (typeof requestIdleCallback !== 'undefined') {
              requestIdleCallback(loadNext, { timeout: 300 });
            } else {
              setTimeout(loadNext, 50);
            }
          }
        });
      }
    };

    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(loadNext, { timeout: 500 });
    } else {
      setTimeout(loadNext, 100);
    }
  }, [loadFrame]);

  // -------------------------------------------------------
  // Scroll handler → frame update
  // -------------------------------------------------------
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerH = container.offsetHeight;
    const viewportH = window.innerHeight;

    // Progress: 0 when section top is at viewport top, 1 when section bottom leaves viewport
    // We want animation to fill the sticky 100vh, within 300vh scroll track
    const scrolled = -rect.top;
    const scrollable = containerH - viewportH;
    const progress = Math.min(Math.max(scrolled / scrollable, 0), 1);

    setScrollProgress(progress);

    const targetFrame = Math.min(
      Math.round(progress * (TOTAL_FRAMES - 1)) + 1,
      TOTAL_FRAMES
    );

    if (targetFrame !== currentFrameRef.current) {
      currentFrameRef.current = targetFrame;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        drawFrame(targetFrame);
      });
    }
  }, [drawFrame]);

  // -------------------------------------------------------
  // Bootstrap
  // -------------------------------------------------------
  useEffect(() => {
    // Load frame 1 immediately
    loadFrame(1, () => {
      setIsInitialFrameReady(true);
      handleResize();
      drawFrame(1);
      // Start progressive preloading in the background
      preloadRemaining();
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loadFrame, handleResize, handleScroll, preloadRemaining, drawFrame]);

  const getReportPath = () => {
    if (!user) return '/signup';
    if (user.role === 'CITIZEN') return '/citizen';
    return '/';
  };

  return (
    /* 300vh scroll track — the canvas stays sticky inside */
    <div ref={containerRef} style={{ height: '300vh', position: 'relative' }} aria-label="Introduction animation">
      {/* Sticky viewport-fill canvas container */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover',
          }}
        />

        {/* Loading veil — shown until first frame is ready */}
        {!isInitialFrameReady && (
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-10">
            <div className="space-y-3 text-center">
              <div className="w-8 h-1 rounded-full bg-emerald-500 mx-auto animate-pulse" />
              <p className="text-xs text-slate-400 tracking-widest uppercase">Loading</p>
            </div>
          </div>
        )}

        {/* Hero Overlay — persistent while animation plays */}
        {isInitialFrameReady && (
          <div
            className="absolute inset-0 flex flex-col justify-between z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.5) 100%)',
            }}
          >
            {/* Top: Brand */}
            <div className="px-6 pt-24 sm:pt-28 lg:px-16">
              <div
                className="text-white"
                style={{ opacity: Math.max(0, 1 - scrollProgress * 3) }}
              >
                <div className="text-xs font-bold tracking-[0.25em] uppercase text-emerald-400 mb-2">
                  Municipal Civic Platform
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none">
                  RAISEIT
                </h1>
                <p className="mt-3 text-lg sm:text-xl font-medium text-white/80">
                  Report. Track. Improve.
                </p>
              </div>
            </div>

            {/* Bottom: CTA + Scroll indicator */}
            <div className="px-6 pb-10 sm:pb-12 lg:px-16">
              {/* CTAs — fade out as scroll progresses */}
              <div
                className="flex flex-col sm:flex-row gap-3 pointer-events-auto mb-6"
                style={{ opacity: Math.max(0, 1 - scrollProgress * 4) }}
              >
                <Link
                  to={getReportPath()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-900/40 transition"
                >
                  Report an Issue
                </Link>
                <a
                  href="#how-it-works"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition"
                >
                  See How It Works
                </a>
              </div>

              {/* Preload progress — shown until all frames loaded */}
              {loadProgress < 100 && (
                <div className="mb-4 max-w-xs">
                  <div className="flex justify-between text-[10px] text-white/40 mb-1">
                    <span>Loading animation</span>
                    <span>{loadProgress}%</span>
                  </div>
                  <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${loadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Scroll indicator */}
              {scrollProgress < 0.05 && (
                <div className="flex items-center gap-2 text-white/50 animate-bounce pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                  <span className="text-xs font-medium tracking-wider uppercase">Scroll to explore</span>
                </div>
              )}

              {/* Frame progress bar at very bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
                <div
                  className="h-full bg-emerald-500 transition-none"
                  style={{ width: `${scrollProgress * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
