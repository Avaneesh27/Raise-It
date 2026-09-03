import React, { useEffect } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface EvidenceSourceBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCamera: () => void;
  onUploadPhoto: () => void;
}

/**
 * Android-style bottom sheet presenting two evidence source options:
 * "Open Camera" and "Upload Photo".
 */
export const EvidenceSourceBottomSheet: React.FC<EvidenceSourceBottomSheetProps> = ({
  isOpen,
  onClose,
  onOpenCamera,
  onUploadPhoto,
}) => {
  // Dismiss on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Add Evidence"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="relative w-full max-w-lg mx-auto bg-white dark:bg-[#131b2e] rounded-t-3xl shadow-2xl border-t border-slate-200 dark:border-slate-700 pb-safe"
        style={{
          animation: 'slideUpSheet 0.28s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </div>

        {/* Title */}
        <div className="flex items-center justify-between px-6 pt-3 pb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Add Evidence Photo
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="px-4 pb-4 space-y-2">
          {/* Option 1: Open Camera */}
          <button
            onClick={() => {
              onClose();
              // Small delay so the sheet dismissal is visible before camera opens
              setTimeout(onOpenCamera, 150);
            }}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1322] hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/60 transition-colors shrink-0">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Open Camera
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Take a new photo of the problem
              </div>
            </div>
            <div className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-emerald-400 transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>

          {/* Option 2: Upload Photo */}
          <button
            onClick={() => {
              onClose();
              setTimeout(onUploadPhoto, 150);
            }}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1322] hover:bg-sky-50 dark:hover:bg-sky-950/30 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all group text-left"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:bg-sky-200 dark:group-hover:bg-sky-900/60 transition-colors shrink-0">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Upload Photo
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Choose from device gallery
              </div>
            </div>
            <div className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-sky-400 transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>

        {/* Cancel */}
        <div className="px-4 pb-6 pt-1">
          <button
            onClick={onClose}
            className="w-full py-3 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Sheet slide-up keyframe */}
      <style>{`
        @keyframes slideUpSheet {
          from { transform: translateY(100%); opacity: 0.8; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
};
