import { useState, useMemo, useEffect } from "react";
import { Modal, FormField, Input, Textarea, PrimaryButton, TagChip } from "./UI.jsx";
import { useImagePreview } from "./ImagePreviewer.jsx";
import { ImagePreviewer } from "./ImagePreviewer.jsx";
import { useListing } from "../context/ListingContext/ListingContext.js";

const SUGGESTED_TAGS = [
  "Books",
  "Notes",
  "Electronics",
  "Furniture",
  "Hostel Items",
  "Clothing",
  "Bicycles",
  "Like New",
  "Needs repair",
  "Fair Condition",  
  "CS",
  "Medical",
  "Business",
  "Engineering",
  "Other"
];

const VALIDATION_RULES = {
  title: { min: 5, max: 100 },
  description: { max: 1000 },
  price: { min: 1, max: 999999 },
  images: { min: 1, max: 3 },
  tags: { max: 8 },
};

export function EditListingModal({ open, onClose, listing, onUpdated }) {
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    originalImageUrls: [],
    imageFiles: [],
    imageUrlsToKeep: [],
    tags: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { previewOpen, previewImages, previewIndex, openPreview, closePreview } = useImagePreview();
  const { updateListing } = useListing();

  useEffect(() => {
    if (open && listing) {
      setForm({
        title: listing.title ?? "",
        price: String(listing.price ?? ""),
        description: listing.description ?? "",
        originalImageUrls: listing.imageUrls ?? [],
        imageFiles: [],
        imageUrlsToKeep: listing.imageUrls ?? [],
        tags: listing.tags ?? [],
      });
      setTagInput("");
      setError(null);
    }
  }, [open, listing]);

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const addTag = (raw) => {
    const t = raw.trim();
    if (t && !form.tags.includes(t) && form.tags.length < VALIDATION_RULES.tags.max) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  };

  const removeTag = (t) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));

  const hasChanges = useMemo(() => {
    if (!listing) return false;
    return (
      form.title.trim() !== (listing.title ?? "") ||
      parseFloat(form.price) !== parseFloat(listing.price ?? 0) ||
      form.description.trim() !== (listing.description ?? "") ||
      JSON.stringify(form.tags) !== JSON.stringify(listing.tags ?? []) ||
      form.imageFiles.length > 0 ||
      JSON.stringify(form.imageUrlsToKeep) !== JSON.stringify(listing.imageUrls ?? [])
    );
  }, [form, listing]);

  // Validation functions
  const validateTitle = (title) => {
    const trimmed = title.trim();
    if (trimmed && trimmed.length < VALIDATION_RULES.title.min) {
      return `Title must be at least ${VALIDATION_RULES.title.min} characters`;
    }
    if (trimmed.length > VALIDATION_RULES.title.max) {
      return `Title must be less than ${VALIDATION_RULES.title.max} characters`;
    }
    return "";
  };

  const validatePrice = (price) => {
    if (price && price.trim() !== "") {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum)) {
        return "Enter a valid price";
      }
      if (priceNum < VALIDATION_RULES.price.min) {
        return `Price must be at least ₹${VALIDATION_RULES.price.min}`;
      }
      if (priceNum > VALIDATION_RULES.price.max) {
        return `Price must be less than ₹${VALIDATION_RULES.price.max}`;
      }
    }
    return "";
  };

  const validateDescription = (description) => {
    if (description.trim().length > VALIDATION_RULES.description.max) {
      return `Description must be less than ${VALIDATION_RULES.description.max} characters`;
    }
    return "";
  };

  const validateImages = (urlsToKeep, files) => {
    const totalImages = urlsToKeep.length + files.length;
    if (totalImages < VALIDATION_RULES.images.min) {
      return "Please keep or add at least one image";
    }
    if (totalImages > VALIDATION_RULES.images.max) {
      return `Maximum ${VALIDATION_RULES.images.max} images allowed`;
    }
    return "";
  };

  const validateTags = (tags) => {
    if (tags.length > VALIDATION_RULES.tags.max) {
      return `Maximum ${VALIDATION_RULES.tags.max} tags allowed`;
    }
    return "";
  };

  const validateForm = () => {
    const titleError = validateTitle(form.title);
    if (titleError) {
      setError(titleError);
      return false;
    }

    const priceError = validatePrice(form.price);
    if (priceError) {
      setError(priceError);
      return false;
    }

    const descriptionError = validateDescription(form.description);
    if (descriptionError) {
      setError(descriptionError);
      return false;
    }

    const imagesError = validateImages(form.imageUrlsToKeep, form.imageFiles);
    if (imagesError) {
      setError(imagesError);
      return false;
    }

    const tagsError = validateTags(form.tags);
    if (tagsError) {
      setError(tagsError);
      return false;
    }

    return true;
  };

  const buildPayload = () => {
    const payload = {};
    if (form.title.trim() !== (listing?.title ?? "")) payload.title = form.title.trim();
    if (parseFloat(form.price) !== parseFloat(listing?.price ?? 0)) payload.price = parseFloat(form.price);
    if (form.description.trim() !== (listing?.description ?? "")) payload.description = form.description.trim();
    if (JSON.stringify(form.tags) !== JSON.stringify(listing?.tags ?? [])) payload.tags = form.tags;
    
    // Add new images to payload - service will handle Cloudinary upload
    if (form.imageFiles.length > 0) {
      payload.images = form.imageFiles;
    }
    
    // Add existing image URLs to payload
    if (JSON.stringify(form.imageUrlsToKeep) !== JSON.stringify(listing?.imageUrls ?? [])) {
      payload.imageUrls = form.imageUrlsToKeep;
    }
    
    return payload;
  };

  const reset = () => {
    if (listing) {
      setForm({
        title: listing.title ?? "",
        price: String(listing.price ?? ""),
        description: listing.description ?? "",
        originalImageUrls: listing.imageUrls ?? [],
        imageFiles: [],
        imageUrlsToKeep: listing.imageUrls ?? [],
        tags: listing.tags ?? [],
      });
    }
    setTagInput("");
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    if (!hasChanges) {
      setError("No changes made.");
      return;
    }

    setLoading(true);

    try {
      const payload = buildPayload();

      if (Object.keys(payload).length === 0) {
        setError("No changes made.");
        setLoading(false);
        return;
      }

      // ✅ Pass payload with images (files) and imageUrls to context
      // The context will handle Cloudinary upload through the service
      const result = await updateListing(listing.id, payload);

      if (!result.success) {
        setError(result.error || "Failed to update listing");
        return;
      }

      reset();
      onUpdated?.(result.listing);
      onClose();
    } catch (e) {
      setError(e.message || "Failed to update listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    const currentImageCount = form.imageUrlsToKeep.length + form.imageFiles.length;
    const allowedNewImages = VALIDATION_RULES.images.max - currentImageCount;

    const imageFiles = files
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, Math.max(0, allowedNewImages));

    if (imageFiles.length === 0 && files.length > 0) {
      setError(`Please select valid images or you've reached the ${VALIDATION_RULES.images.max}-image limit.`);
      return;
    }

    setForm((f) => ({ ...f, imageFiles: [...f.imageFiles, ...imageFiles] }));
    e.target.value = "";
  };

  const removeImageFile = (index) =>
    setForm((f) => ({ ...f, imageFiles: f.imageFiles.filter((_, i) => i !== index) }));

  const removeImageUrl = (url) =>
    setForm((f) => ({ ...f, imageUrlsToKeep: f.imageUrlsToKeep.filter((u) => u !== url) }));

  const totalImages = form.imageUrlsToKeep.length + form.imageFiles.length;

  return (
    <>
      <Modal open={open} onClose={handleClose} title="✏️ Edit Listing" maxWidth={560}>
        
        {/* Info */}
        <div className="flex gap-3 bg-blue-50 rounded-xl px-4 py-3 mb-6">
          <span className="text-base shrink-0">ℹ️</span>
          <div className="text-xs text-blue-600 font-medium leading-relaxed">
            Only changed fields will be saved. Your available status is not affected.
          </div>
        </div>

        <FormField 
          label="Title" 
          hint={`${form.title.length}/${VALIDATION_RULES.title.max} characters`}
          error={error?.includes("Title") ? error : undefined}
        >
          <Input 
            value={form.title} 
            onChange={setField("title")}
            maxLength={VALIDATION_RULES.title.max}
            placeholder="e.g. MacBook Pro 14-inch M3, barely used"
          />
        </FormField>

        <FormField 
          label="Price (₹)" 
          error={error?.includes("price") || error?.includes("Price") ? error : undefined}
        >
          <Input 
            type="number" 
            min={VALIDATION_RULES.price.min}
            max={VALIDATION_RULES.price.max}
            value={form.price} 
            onChange={setField("price")}
            placeholder="e.g. 45000"
          />
        </FormField>

        <FormField 
          label="Description"
          hint={`${form.description.length}/${VALIDATION_RULES.description.max} characters`}
          error={error?.includes("Description") ? error : undefined}
        >
          <Textarea 
            value={form.description} 
            onChange={setField("description")}
            maxLength={VALIDATION_RULES.description.max}
            placeholder="Condition, original price, reason for selling, included accessories…"
          />
        </FormField>

        <FormField
          label="Pictures"
          hint={`Current: ${form.imageUrlsToKeep.length}, New: ${form.imageFiles.length}, Total: ${totalImages}/${VALIDATION_RULES.images.max}`}
          error={error?.includes("image") ? error : undefined}
        >
          <div className="flex flex-col gap-3">
            
            {totalImages < VALIDATION_RULES.images.max && (
              <label className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-blue-50 cursor-pointer hover:scale-[1.02] transition">
                <span className="text-xl">📸</span>
                <div>
                  <div className="text-sm font-semibold text-blue-600">Click to add images</div>
                  <div className="text-xs text-gray-500">PNG, JPG, WebP up to 10MB</div>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleImageSelect} 
                  className="hidden"
                  disabled={totalImages >= VALIDATION_RULES.images.max}
                />
              </label>
            )}

            <div className="flex gap-2 flex-wrap">
              {form.imageUrlsToKeep.map((url, idx) => (
                <div
                  key={idx}
                  onClick={() => openPreview(form.imageUrlsToKeep, idx)}
                  className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer hover:scale-105 transition"
                  title="Existing image"
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeImageUrl(url); }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {form.imageFiles.map((file, idx) => (
                <div
                  key={idx}
                  onClick={() => openPreview(form.imageFiles, idx)}
                  className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-500 bg-gray-100 cursor-pointer hover:scale-105 transition"
                  title="New image"
                >
                  <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); removeImageFile(idx); }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </FormField>

        <FormField 
          label="Tags" 
          hint={`${form.tags.length}/${VALIDATION_RULES.tags.max} tags (First tag = category) & Add condition and department for filtering`}
          error={error?.includes("tag") || error?.includes("Tag") ? error : undefined}
        >
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }}
              className="flex-1"
              maxLength="50"
              placeholder="Type a tag and press Enter…"
            />
            <button
              onClick={() => addTag(tagInput)}
              disabled={form.tags.length >= VALIDATION_RULES.tags.max}
              className="px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 text-white rounded-lg font-bold cursor-pointer transition-colors"
            >
              +
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTED_TAGS.filter((t) => !form.tags.includes(t)).map((t) => (
              <button
                key={t}
                onClick={() => addTag(t)}
                disabled={form.tags.length >= VALIDATION_RULES.tags.max}
                className="px-3 py-1 text-xs border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                + {t}
              </button>
            ))}
          </div>

          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map((t) => (
                <TagChip key={t} label={t} onRemove={() => removeTag(t)} />
              ))}
            </div>
          )}
        </FormField>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-3 border border-red-200">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <PrimaryButton
            onClick={handleSubmit}
            loading={loading}
            disabled={!hasChanges}
            className={`flex-[2] ${!hasChanges ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Save Changes ✓
          </PrimaryButton>
        </div>
      </Modal>

      <ImagePreviewer
        open={previewOpen}
        images={previewImages}
        initialIndex={previewIndex}
        onClose={closePreview}
      />
    </>
  );
};

// import { useState, useMemo, useEffect } from "react";
// import { Modal, FormField, Input, Textarea, PrimaryButton, TagChip } from "./UI.jsx";
// import { useImagePreview } from "./ImagePreviewer.jsx";
// import { ImagePreviewer } from "./ImagePreviewer.jsx";
// import { useListing } from "../context/ListingContext/ListingContext.js";

// const SUGGESTED_TAGS = [
//     "Books",
//   "Notes",
//   "Electronics",
//   "Furniture",
//   "Hostel Items",
//   "Clothing",
//   "Bicycles",
//   "Other"
// ];

// const VALIDATION_RULES = {
//   title: { min: 5, max: 100 },
//   description: { max: 1000 },
//   price: { min: 1, max: 999999 },
//   images: { min: 1, max: 3 },
//   tags: { max: 8 },
// };

// export function EditListingModal({ open, onClose, listing, onUpdated }) {
//   const [form, setForm] = useState({
//     title: "",
//     price: "",
//     description: "",
//     originalImageUrls: [],
//     imageFiles: [],
//     imageUrlsToKeep: [],
//     tags: [],
//   });

//   const [tagInput, setTagInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const { previewOpen, previewImages, previewIndex, openPreview, closePreview } = useImagePreview();
// const { updateListing } = useListing();
//   useEffect(() => {
//     if (open && listing) {
//       setForm({
//         title: listing.title ?? "",
//         price: String(listing.price ?? ""),
//         description: listing.description ?? "",
//         originalImageUrls: listing.imageUrls ?? [],
//         imageFiles: [],
//         imageUrlsToKeep: listing.imageUrls ?? [],
//         tags: listing.tags ?? [],
//       });
//       setTagInput("");
//       setError(null);
//     }
//   }, [open, listing]);

//   const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

//   const addTag = (raw) => {
//     const t = raw.trim();
//     if (t && !form.tags.includes(t) && form.tags.length < VALIDATION_RULES.tags.max) {
//       setForm((f) => ({ ...f, tags: [...f.tags, t] }));
//     }
//     setTagInput("");
//   };

//   const removeTag = (t) =>
//     setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));

//   const hasChanges = useMemo(() => {
//     if (!listing) return false;
//     return (
//       form.title.trim() !== (listing.title ?? "") ||
//       parseFloat(form.price) !== parseFloat(listing.price ?? 0) ||
//       form.description.trim() !== (listing.description ?? "") ||
//       JSON.stringify(form.tags) !== JSON.stringify(listing.tags ?? []) ||
//       form.imageFiles.length > 0 ||
//       JSON.stringify(form.imageUrlsToKeep) !== JSON.stringify(listing.imageUrls ?? [])
//     );
//   }, [form, listing]);

//   // Validation functions
//   const validateTitle = (title) => {
//     const trimmed = title.trim();
//     if (trimmed && trimmed.length < VALIDATION_RULES.title.min) {
//       return `Title must be at least ${VALIDATION_RULES.title.min} characters`;
//     }
//     if (trimmed.length > VALIDATION_RULES.title.max) {
//       return `Title must be less than ${VALIDATION_RULES.title.max} characters`;
//     }
//     return "";
//   };

//   const validatePrice = (price) => {
//     if (price && price.trim() !== "") {
//       const priceNum = parseFloat(price);
//       if (isNaN(priceNum)) {
//         return "Enter a valid price";
//       }
//       if (priceNum < VALIDATION_RULES.price.min) {
//         return `Price must be at least ₹${VALIDATION_RULES.price.min}`;
//       }
//       if (priceNum > VALIDATION_RULES.price.max) {
//         return `Price must be less than ₹${VALIDATION_RULES.price.max}`;
//       }
//     }
//     return "";
//   };

//   const validateDescription = (description) => {
//     if (description.trim().length > VALIDATION_RULES.description.max) {
//       return `Description must be less than ${VALIDATION_RULES.description.max} characters`;
//     }
//     return "";
//   };

//   const validateImages = (urlsToKeep, files) => {
//     const totalImages = urlsToKeep.length + files.length;
//     if (totalImages < VALIDATION_RULES.images.min) {
//       return "Please keep or add at least one image";
//     }
//     if (totalImages > VALIDATION_RULES.images.max) {
//       return `Maximum ${VALIDATION_RULES.images.max} images allowed`;
//     }
//     return "";
//   };

//   const validateTags = (tags) => {
//     if (tags.length > VALIDATION_RULES.tags.max) {
//       return `Maximum ${VALIDATION_RULES.tags.max} tags allowed`;
//     }
//     return "";
//   };

//   const validateForm = () => {
//     const titleError = validateTitle(form.title);
//     if (titleError) {
//       setError(titleError);
//       return false;
//     }

//     const priceError = validatePrice(form.price);
//     if (priceError) {
//       setError(priceError);
//       return false;
//     }

//     const descriptionError = validateDescription(form.description);
//     if (descriptionError) {
//       setError(descriptionError);
//       return false;
//     }

//     const imagesError = validateImages(form.imageUrlsToKeep, form.imageFiles);
//     if (imagesError) {
//       setError(imagesError);
//       return false;
//     }

//     const tagsError = validateTags(form.tags);
//     if (tagsError) {
//       setError(tagsError);
//       return false;
//     }

//     return true;
//   };

//   const buildPayload = () => {
//     const payload = {};
//     if (form.title.trim() !== (listing?.title ?? "")) payload.title = form.title.trim();
//     if (parseFloat(form.price) !== parseFloat(listing?.price ?? 0)) payload.price = parseFloat(form.price);
//     if (form.description.trim() !== (listing?.description ?? "")) payload.description = form.description.trim();
//     if (JSON.stringify(form.tags) !== JSON.stringify(listing?.tags ?? [])) payload.tags = form.tags;
//     return payload;
//   };

//   const reset = () => {
//     if (listing) {
//       setForm({
//         title: listing.title ?? "",
//         price: String(listing.price ?? ""),
//         description: listing.description ?? "",
//         originalImageUrls: listing.imageUrls ?? [],
//         imageFiles: [],
//         imageUrlsToKeep: listing.imageUrls ?? [],
//         tags: listing.tags ?? [],
//       });
//     }
//     setTagInput("");
//     setError(null);
//   };

//   const handleSubmit = async () => {
//     setError(null);

//     if (!validateForm()) {
//       return;
//     }

//     if (!hasChanges) {
//       setError("No changes made.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload = buildPayload();
//       let finalImageUrls = [...form.imageUrlsToKeep];

//       if (form.imageFiles.length > 0) {
//         const newImageUrls = await uploadImagesToCloudinary(form.imageFiles);
//         finalImageUrls = [...finalImageUrls, ...newImageUrls];
//       }

//       if (
//         form.imageFiles.length > 0 ||
//         JSON.stringify(form.imageUrlsToKeep) !== JSON.stringify(listing?.imageUrls ?? [])
//       ) {
//         payload.imageUrls = finalImageUrls;
//       }

//       if (Object.keys(payload).length === 0) {
//         setError("No changes made.");
//         return;
//       }

//       const updated = await updateListing(listing.id, payload);
//       reset();
//       onUpdated?.(updated.listing);
//       onClose();
//     } catch (e) {
//       setError(e.message || "Failed to update listing. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClose = () => {
//     reset();
//     onClose();
//   };

//   const handleImageSelect = (e) => {
//     const files = Array.from(e.target.files || []);
//     const currentImageCount = form.imageUrlsToKeep.length + form.imageFiles.length;
//     const allowedNewImages = VALIDATION_RULES.images.max - currentImageCount;

//     const imageFiles = files
//       .filter((file) => file.type.startsWith("image/"))
//       .slice(0, Math.max(0, allowedNewImages));

//     if (imageFiles.length === 0 && files.length > 0) {
//       setError(`Please select valid images or you've reached the ${VALIDATION_RULES.images.max}-image limit.`);
//       return;
//     }

//     setForm((f) => ({ ...f, imageFiles: [...f.imageFiles, ...imageFiles] }));
//     e.target.value = "";
//   };

//   const removeImageFile = (index) =>
//     setForm((f) => ({ ...f, imageFiles: f.imageFiles.filter((_, i) => i !== index) }));

//   const removeImageUrl = (url) =>
//     setForm((f) => ({ ...f, imageUrlsToKeep: f.imageUrlsToKeep.filter((u) => u !== url) }));

//   const totalImages = form.imageUrlsToKeep.length + form.imageFiles.length;

//   return (
//     <>
//       <Modal open={open} onClose={handleClose} title="✏️ Edit Listing" maxWidth={560}>
        
//         {/* Info */}
//         <div className="flex gap-3 bg-blue-50 rounded-xl px-4 py-3 mb-6">
//           <span className="text-base shrink-0">ℹ️</span>
//           <div className="text-xs text-blue-600 font-medium leading-relaxed">
//             Only changed fields will be saved. Your available status is not affected.
//           </div>
//         </div>

//         <FormField 
//           label="Title" 
//           hint={`${form.title.length}/${VALIDATION_RULES.title.max} characters`}
//           error={error?.includes("Title") ? error : undefined}
//         >
//           <Input 
//             value={form.title} 
//             onChange={setField("title")}
//             maxLength={VALIDATION_RULES.title.max}
//             placeholder="e.g. MacBook Pro 14-inch M3, barely used"
//           />
//         </FormField>

//         <FormField 
//           label="Price (₹)" 
//           error={error?.includes("price") || error?.includes("Price") ? error : undefined}
//         >
//           <Input 
//             type="number" 
//             min={VALIDATION_RULES.price.min}
//             max={VALIDATION_RULES.price.max}
//             value={form.price} 
//             onChange={setField("price")}
//             placeholder="e.g. 45000"
//           />
//         </FormField>

//         <FormField 
//           label="Description"
//           hint={`${form.description.length}/${VALIDATION_RULES.description.max} characters`}
//           error={error?.includes("Description") ? error : undefined}
//         >
//           <Textarea 
//             value={form.description} 
//             onChange={setField("description")}
//             maxLength={VALIDATION_RULES.description.max}
//             placeholder="Condition, original price, reason for selling, included accessories…"
//           />
//         </FormField>

//         <FormField
//           label="Pictures"
//           hint={`Current: ${form.imageUrlsToKeep.length}, New: ${form.imageFiles.length}, Total: ${totalImages}/${VALIDATION_RULES.images.max}`}
//           error={error?.includes("image") ? error : undefined}
//         >
//           <div className="flex flex-col gap-3">
            
//             {totalImages < VALIDATION_RULES.images.max && (
//               <label className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-200 rounded-xl bg-blue-50 cursor-pointer hover:scale-[1.02] transition">
//                 <span className="text-xl">📸</span>
//                 <div>
//                   <div className="text-sm font-semibold text-blue-600">Click to add images</div>
//                   <div className="text-xs text-gray-500">PNG, JPG, WebP up to 10MB</div>
//                 </div>
//                 <input 
//                   type="file" 
//                   accept="image/*" 
//                   multiple 
//                   onChange={handleImageSelect} 
//                   className="hidden"
//                   disabled={totalImages >= VALIDATION_RULES.images.max}
//                 />
//               </label>
//             )}

//             <div className="flex gap-2 flex-wrap">
//               {form.imageUrlsToKeep.map((url, idx) => (
//                 <div
//                   key={idx}
//                   onClick={() => openPreview(form.imageUrlsToKeep, idx)}
//                   className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer hover:scale-105 transition"
//                   title="Existing image"
//                 >
//                   <img src={url} alt="" className="w-full h-full object-cover" />
//                   <button
//                     onClick={(e) => { e.stopPropagation(); removeImageUrl(url); }}
//                     className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center hover:bg-red-600 transition"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               ))}

//               {form.imageFiles.map((file, idx) => (
//                 <div
//                   key={idx}
//                   onClick={() => openPreview(form.imageFiles, idx)}
//                   className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-blue-500 bg-gray-100 cursor-pointer hover:scale-105 transition"
//                   title="New image"
//                 >
//                   <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
//                   <button
//                     onClick={(e) => { e.stopPropagation(); removeImageFile(idx); }}
//                     className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center hover:bg-red-600 transition"
//                   >
//                     ✕
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </FormField>

//         <FormField 
//           label="Tags" 
//           hint={`${form.tags.length}/${VALIDATION_RULES.tags.max} tags (First tag = category)`}
//           error={error?.includes("tag") || error?.includes("Tag") ? error : undefined}
//         >
//           <div className="flex gap-2 mb-2">
//             <Input
//               value={tagInput}
//               onChange={(e) => setTagInput(e.target.value)}
//               onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }}
//               className="flex-1"
//               maxLength="50"
//               placeholder="Type a tag and press Enter…"
//             />
//             <button
//               onClick={() => addTag(tagInput)}
//               disabled={form.tags.length >= VALIDATION_RULES.tags.max}
//               className="px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 text-white rounded-lg font-bold cursor-pointer transition-colors"
//             >
//               +
//             </button>
//           </div>

//           <div className="flex flex-wrap gap-2 mb-3">
//             {SUGGESTED_TAGS.filter((t) => !form.tags.includes(t)).map((t) => (
//               <button
//                 key={t}
//                 onClick={() => addTag(t)}
//                 disabled={form.tags.length >= VALIDATION_RULES.tags.max}
//                 className="px-3 py-1 text-xs border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
//               >
//                 + {t}
//               </button>
//             ))}
//           </div>

//           {form.tags.length > 0 && (
//             <div className="flex flex-wrap gap-2">
//               {form.tags.map((t) => (
//                 <TagChip key={t} label={t} onRemove={() => removeTag(t)} />
//               ))}
//             </div>
//           )}
//         </FormField>

//         {error && (
//           <div className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg mb-3 border border-red-200">
//             {error}
//           </div>
//         )}

//         <div className="flex gap-3">
//           <button
//             onClick={handleClose}
//             disabled={loading}
//             className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
//           >
//             Cancel
//           </button>

//           <PrimaryButton
//             onClick={handleSubmit}
//             loading={loading}
//             disabled={!hasChanges}
//             className={`flex-[2] ${!hasChanges ? "opacity-50 cursor-not-allowed" : ""}`}
//           >
//             Save Changes ✓
//           </PrimaryButton>
//         </div>
//       </Modal>

//       <ImagePreviewer
//         open={previewOpen}
//         images={previewImages}
//         initialIndex={previewIndex}
//         onClose={closePreview}
//       />
//     </>
//   );
// }