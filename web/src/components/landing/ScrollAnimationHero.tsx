import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { User } from '../../types';

interface ScrollAnimationHeroProps {
  user: User | null;
}

const TOTAL_FRAMES = 300;
const FRAMES_BASE_PATH = '/frames';

const getFrameUrl = (index: number): string => {
  const padded = String(index).padStart(3, '0');
  return `${FRAMES_BASE_PATH}/frame_${padded}.jpg`;
};

export const ScrollAnimationHero: React.FC<ScrollAnimationHeroProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Array<HTMLImageElement | null>>(new Array(TOTAL_FRAMES + 1).fill(null));
  const loadingStatusRef = useRef<Map<number, 'loading' | 'loaded' | 'error'>>(new Map());
  const currentFrameRef = useRef(1);
  const targetFrameRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const loadedCountRef = useRef(0);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isInitialFrameReady, setIsInitialFrameReady] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  // Draw a frame, falling back to the closest loaded frame if requested one is still loading
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Find nearest loaded frame
      let closestDist = Infinity;
      let closestImg: HTMLImageElement | null = null;
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const candidate = imagesRef.current[i];
        if (candidate && candidate.complete && candidate.naturalWidth > 0) {
          const dist = Math.abs(i - frameIndex);
          if (dist < closestDist) {
            closestDist = dist;
            closestImg = candidate;
          }
        }
      }
      if (!closestImg) return;
      img = closestImg;
    }

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    const scale = Math.max(canvasW / imgW, canvasH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const offsetX = (canvasW - drawW) / 2;
    const offsetY = (canvasH - drawH) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }, []);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'medium';
    }
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // Load a single frame
  const loadFrame = useCallback((index: number, onLoaded?: () => void) => {
    if (index < 1 || index > TOTAL_FRAMES) return;
    if (imagesRef.current[index] && imagesRef.current[index]?.complete) {
      onLoaded?.();
      return;
    }
    if (loadingStatusRef.current.get(index) === 'loading') {
      return;
    }

    loadingStatusRef.current.set(index, 'loading');
    const img = new Image();
    img.decoding = 'async';

    img.onload = () => {
      imagesRef.current[index] = img;
      loadingStatusRef.current.set(index, 'loaded');
      loadedCountRef.current += 1;
      setLoadProgress(Math.round((loadedCountRef.current / TOTAL_FRAMES) * 100));
      onLoaded?.();

      // If this newly loaded frame is what we're currently trying to show, draw it!
      if (Math.abs(index - targetFrameRef.current) <= 1) {
        drawFrame(targetFrameRef.current);
      }
    };

    img.onerror = () => {
      loadingStatusRef.current.set(index, 'error');
    };

    img.src = getFrameUrl(index);
  }, [drawFrame]);

  // Preload all frames progressively
  const preloadAllFrames = useCallback(() => {
    // First load keyframes across the sequence (every 5th frame)
    for (let i = 1; i <= TOTAL_FRAMES; i += 5) {
      loadFrame(i);
    }

    // Then fill the rest
    let nextIndex = 2;
    const loadBatch = () => {
      if (nextIndex > TOTAL_FRAMES) return;
      const count = Math.min(10, TOTAL_FRAMES - nextIndex + 1);
      for (let j = 0; j < count; j++) {
        loadFrame(nextIndex + j);
      }
      nextIndex += count;
      setTimeout(loadBatch, 30);
    };

    setTimeout(loadBatch, 50);
  }, [loadFrame]);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerH = container.offsetHeight;
    const viewportH = window.innerHeight;

    const scrolled = -rect.top;
    const scrollable = Math.max(1, containerH - viewportH);
    const progress = Math.min(Math.max(scrolled / scrollable, 0), 1);

    setScrollProgress(progress);

    const targetFrame = Math.min(
      Math.round(progress * (TOTAL_FRAMES - 1)) + 1,
      TOTAL_FRAMES
    );

    targetFrameRef.current = targetFrame;

    // Prioritize loading current and surrounding frames
    loadFrame(targetFrame);
    loadFrame(Math.min(TOTAL_FRAMES, targetFrame + 1));
    loadFrame(Math.max(1, targetFrame - 1));
    loadFrame(Math.min(TOTAL_FRAMES, targetFrame + 2));
    loadFrame(Math.max(1, targetFrame - 2));

    if (targetFrame !== currentFrameRef.current) {
      currentFrameRef.current = targetFrame;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        drawFrame(targetFrame);
      });
    }
  }, [drawFrame, loadFrame]);

  useEffect(() => {
    // Load frame 1 first
    loadFrame(1, () => {
      setIsInitialFrameReady(true);
      handleResize();
      drawFrame(1);
      preloadAllFrames();
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loadFrame, handleResize, handleScroll, preloadAllFrames, drawFrame]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <div 
      ref={containerRef} 
      style={{ height: '350vh', position: 'relative' }} 
      aria-label="Introduction animation"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="cursor-none"
    >
      {/* Small circle cursor following the mouse on hover */}
      {isHovering && (
        <div 
          className="fixed pointer-events-none z-[100] border-2 border-white/90 bg-white/20 rounded-full backdrop-blur-[1px] shadow-sm transition-transform duration-75 ease-out"
          style={{
            left: mousePos.x,
            top: mousePos.y,
            width: '24px',
            height: '24px',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}

      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />

        {!isInitialFrameReady && (
          <div className="absolute inset-0 bg-slate-950 flex items-center justify-center z-10">
            <div className="text-xs text-white/50 tracking-widest uppercase font-mono animate-pulse">
              Loading Sequence...
            </div>
          </div>
        )}

        {isInitialFrameReady && (
          <div
            className="absolute inset-0 flex flex-col justify-between z-10 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.0) 65%, rgba(0,0,0,0.7) 100%)',
            }}
          >
            {/* Top Brand */}
            <div className="px-8 pt-28 lg:px-16" style={{ opacity: Math.max(0, 1 - scrollProgress * 3.5) }}>
              <div className="text-white space-y-2">
                <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-none drop-shadow-md">
                  RAISEIT.
                </h1>
                <p className="text-lg sm:text-xl text-white/90 font-medium tracking-wide drop-shadow">
                  Report. Track. Improve.
                </p>
              </div>
            </div>

            {/* Bottom minimal scroll indicator & progress */}
            <div className="px-8 pb-10 lg:px-16">
              {scrollProgress < 0.05 && (
                <div className="flex items-center gap-2.5 text-white/80 pointer-events-none transition-opacity">
                  <ChevronDown className="w-5 h-5 animate-bounce" />
                  <span className="text-xs font-bold tracking-widest uppercase font-mono">Scroll to explore</span>
                </div>
              )}

              {/* Minimal Preload progress */}
              {loadProgress < 100 && (
                <div className="absolute bottom-3 right-8 text-[11px] text-white/40 tracking-wider font-mono">
                  {loadProgress}% Loaded
                </div>
              )}

              {/* Progress bar line */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20">
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