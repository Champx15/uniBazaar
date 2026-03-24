import { useState } from 'react';

export const useImagePreview = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(0);

  const openPreview = (images, index = 0) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewImages([]);
    setPreviewIndex(0);
  };

  return {
    previewOpen,
    previewImages,
    previewIndex,
    openPreview,
    closePreview,
  };
};