import React, { useState } from "react";

export function ImagePreviewer({ open, images, initialIndex, onClose }) {
  if (!open || !images || images.length === 0) return null;

  const [currentIndex, setCurrentIndex] = useState(initialIndex ?? 0);

  const current = images[currentIndex];
  const isFile = current instanceof File;
  const src = isFile ? URL.createObjectURL(current) : current;

  const goNext = () =>
    setCurrentIndex((i) => (i + 1) % images.length);

  const goPrev = () =>
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <img
          src={src}
          alt={`Preview ${currentIndex + 1}`}
          className="max-w-full max-h-[75vh] rounded-xl shadow-[0_20px_80px_rgba(0,0,0,0.4)] object-contain"
        />

        {/* Controls */}
        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-xl shadow-lg">
          {/* Previous */}
          <button
            onClick={goPrev}
            className="w-10 h-10 rounded-full border border-gray-200 bg-gray-100 text-lg flex items-center justify-center"
          >
            ←
          </button>

          {/* Counter */}
          <div className="text-sm font-semibold text-gray-900 min-w-[50px] text-center">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Next */}
          <button
            onClick={goNext}
            className="w-10 h-10 rounded-full border border-gray-200 bg-gray-100 text-lg flex items-center justify-center"
          >
            →
          </button>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200 mx-2" />

          {/* Close */}
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-bold text-gray-900"
          >
            Close (Esc)
          </button>
        </div>
      </div>

      {/* Keyboard shortcuts */}
      {typeof window !== "undefined" && (
        <script>{`
        (function() {
          if (window.__imagePreviewer) {
            document.addEventListener('keydown', (e) => {
              if (e.key === 'Escape') window.__imagePreviewer.close();
              if (e.key === 'ArrowLeft') window.__imagePreviewer.prev();
              if (e.key === 'ArrowRight') window.__imagePreviewer.next();
            });
          }
        })();
        `}</script>
      )}
    </div>
  );
}


// Hook (unchanged)

export function useImagePreview() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);

  const openPreview = (images, index = 0) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  const closePreview = () => setPreviewOpen(false);

  return {
    previewOpen,
    previewImages,
    previewIndex,
    openPreview,
    closePreview,
  };
}