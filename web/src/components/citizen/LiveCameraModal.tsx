import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Camera,
  RotateCcw,
  X,
  Aperture,
  SwitchCamera,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface LiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called with the captured image File and optional data URL preview */
  onCapture: (file: File, preview: string) => void;
}

/**
 * Real live camera modal using navigator.mediaDevices.getUserMedia.
 * Provides a genuine viewfinder, shutter button, front/back camera switching,
 * and a retake/confirm flow before handing back the image.
 */
export const LiveCameraModal: React.FC<LiveCameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<'requesting' | 'active' | 'captured' | 'error'>('requesting');
  const [errorMsg, setErrorMsg] = useState('');
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasFrontCamera, setHasFrontCamera] = useState(false);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    stopStream();
    setStatus('requesting');
    setErrorMsg('');

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Detect if a front camera is available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === 'videoinput');
      setHasFrontCamera(videoDevices.length > 1);

      setStatus('active');
    } catch (err: any) {
      stopStream();
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg(
          'Camera access was denied. To file a civic report, please allow camera access in your browser settings and try again.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMsg('No camera device was found on this device. Please use "Upload Photo" instead.');
      } else {
        setErrorMsg(`Unable to start camera: ${err.message || 'Unknown error'}. Try "Upload Photo" instead.`);
      }
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCapturedPreview(null);
      startCamera(facingMode);
    } else {
      stopStream();
      setStatus('requesting');
      setCapturedPreview(null);
    }

    return () => {
      stopStream();
    };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Dismiss on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopStream();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleFlipCamera = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    startCamera(next);
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedPreview(dataUrl);
    setStatus('captured');
    stopStream();
  };

  const handleRetake = () => {
    setCapturedPreview(null);
    startCamera(facingMode);
  };

  const handleConfirm = () => {
    if (!capturedPreview || !canvasRef.current) return;
    canvasRef.current.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], `raiseit_capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file, capturedPreview);
        stopStream();
        onClose();
      },
      'image/jpeg',
      0.92
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col" role="dialog" aria-modal="true" aria-label="Camera">
      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-safe pt-4 pb-3 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-10">
        <button
          onClick={() => { stopStream(); onClose(); }}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition"
          aria-label="Close camera"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-white text-sm font-semibold tracking-wide opacity-80">
          {status === 'captured' ? 'Review Photo' : 'Take a Photo'}
        </div>
        {hasFrontCamera && status === 'active' ? (
          <button
            onClick={handleFlipCamera}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition"
            aria-label="Switch camera"
          >
            <SwitchCamera className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-10 h-10" aria-hidden="true" />
        )}
      </div>

      {/* Status: Requesting permission */}
      {status === 'requesting' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-white">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
            <Camera className="w-7 h-7 text-white" />
          </div>
          <p className="text-base font-medium">Starting camera...</p>
          <p className="text-sm text-white/60 text-center px-8">
            Your browser may ask for camera permission. Please click "Allow".
          </p>
        </div>
      )}

      {/* Status: Error */}
      {status === 'error' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 text-white px-8">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-rose-400" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-base font-bold">Camera Unavailable</p>
            <p className="text-sm text-white/70 leading-relaxed">{errorMsg}</p>
          </div>
          <button
            onClick={() => startCamera(facingMode)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <button
            onClick={() => { stopStream(); onClose(); }}
            className="text-white/50 hover:text-white text-sm transition"
          >
            Use Upload Instead
          </button>
        </div>
      )}

      {/* Live Viewfinder */}
      {(status === 'active' || status === 'captured') && (
        <div className="flex-1 relative overflow-hidden">
          {/* Live video feed */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${status === 'captured' ? 'hidden' : 'block'}`}
            playsInline
            muted
            autoPlay
          />

          {/* Captured preview */}
          {status === 'captured' && capturedPreview && (
            <img
              src={capturedPreview}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          )}

          {/* Viewfinder grid overlay (subtle) */}
          {status === 'active' && (
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '33.33% 33.33%',
            }} />
          )}
        </div>
      )}

      {/* Bottom Controls */}
      {status === 'active' && (
        <div className="absolute bottom-0 left-0 right-0 pb-safe pb-8 pt-6 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-16">
          {/* Placeholder left */}
          <div className="w-12 h-12" />
          {/* Shutter */}
          <button
            onClick={handleCapture}
            className="w-18 h-18 rounded-full bg-white border-4 border-white/30 flex items-center justify-center shadow-lg hover:scale-95 active:scale-90 transition-transform"
            style={{ width: 72, height: 72 }}
            aria-label="Take photo"
          >
            <div className="w-14 h-14 rounded-full bg-white" />
          </button>
          {/* Placeholder right */}
          <div className="w-12 h-12" />
        </div>
      )}

      {status === 'captured' && (
        <div className="absolute bottom-0 left-0 right-0 pb-safe pb-8 pt-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-center gap-6 px-8">
            <button
              onClick={handleRetake}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-sm font-semibold transition border border-white/20"
            >
              <RotateCcw className="w-4 h-4" />
              Retake
            </button>
            <button
              onClick={handleConfirm}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition shadow-lg shadow-emerald-900/40"
            >
              <Aperture className="w-4 h-4" />
              Use Photo
            </button>
          </div>
          <p className="text-center text-white/50 text-xs mt-3">
            Photo looks good? Tap "Use Photo" to continue.
          </p>
        </div>
      )}
    </div>
  );
};
