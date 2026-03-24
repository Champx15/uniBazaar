// import { useState } from "react";
// import {
//   Modal,
//   FormField,
//   Input,
//   Textarea,
//   PrimaryButton,
//   TagChip,
// } from "./UI.jsx";
// import { useListing } from "../context/ListingContext/ListingContext.js";
// import { useImagePreview } from "../hooks/useImagePreview.js";
// import { ImagePreviewer } from "./ImagePreviewer.jsx";

// const SUGGESTED_TAGS = [
//   "Books",
//   "Notes",
//   "Electronics",
//   "Furniture",
//   "Hostel Items",
//   "Clothing",
//   "Bicycles",
//   "Other"
// ];

// export function SellModal({ open, onClose, setToast }) {
//   const { createListing } = useListing();
//   const [form, setForm] = useState({
//     title: "",
//     price: "",
//     description: "",
//     imageFiles: [],
//     tags: [],
//   });
//   const [tagInput, setTagInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const {
//     previewOpen,
//     previewImages,
//     previewIndex,
//     openPreview,
//     closePreview,
//   } = useImagePreview();

//   const setField = (key) => (e) =>
//     setForm((f) => ({ ...f, [key]: e.target.value }));

//   const addTag = (raw) => {
//     const t = raw.trim();
//     if (t && !form.tags.includes(t) && form.tags.length < 8) {
//       setForm((f) => ({ ...f, tags: [...f.tags, t] }));
//     }
//     setTagInput("");
//   };

//   const removeTag = (t) =>
//     setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));

//   const reset = () => {
//     setForm({
//       title: "",
//       price: "",
//       description: "",
//       imageFiles: [],
//       tags: [],
//     });
//     setTagInput("");
//     setError(null);
//   };

//   const handleSubmit = async () => {
//     if (!form.title.trim()) {
//       setError("Title is required.");
//       return;
//     }
//     if (!form.price || isNaN(Number(form.price))) {
//       setError("Enter a valid price.");
//       return;
//     }
//     if (form.imageFiles.length === 0) {
//       setError("Please add at least one image.");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const result = await createListing(
//         form.title.trim(),
//         form.description.trim(),
//         parseFloat(form.price),
//         form.imageFiles,
//         form.tags,
//       );

//       if (result.success) {
//         reset();
//         // onCreated?.(result.listing);
//         onClose();
//         setToast({ message: "Listing created successfully!", type: "success" });
//       } else {
//         setError(result.error || "Failed to create listing");
//       }
//     } catch (e) {
//       setError(e.message);
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
//     const maxImages = 3;

//     const imageFiles = files
//       .filter((file) => file.type.startsWith("image/"))
//       .slice(0, maxImages - form.imageFiles.length);

//     if (imageFiles.length === 0 && files.length > 0) {
//       setError("Please select valid image files.");
//       return;
//     }

//     setForm((f) => ({
//       ...f,
//       imageFiles: [...f.imageFiles, ...imageFiles],
//     }));

//     e.target.value = "";
//   };

//   const removeImage = (index) => {
//     setForm((f) => ({
//       ...f,
//       imageFiles: f.imageFiles.filter((_, i) => i !== index),
//     }));
//   };

//   return (
//     <>
//       <Modal
//         open={open}
//         onClose={handleClose}
//         title="📦 New Listing"
//         maxWidth={560}
//       >
//         {/* AI Tip */}
//         <div className="flex gap-2.5 bg-blue-50 rounded-xl px-3.5 py-3 mb-5.5">
//           <span className="text-base flex-shrink-0">✦</span>
//           <div className="text-xs text-blue-600 font-medium leading-relaxed">
//             <strong>AI Tip:</strong> Listings with 3+ clear photos and a
//             detailed description sell 60% faster. Include the original MRP to
//             build buyer trust.
//           </div>
//         </div>

//         <FormField
//           label="Title *"
//           error={error?.includes("Title") ? error : undefined}
//         >
//           <Input
//             placeholder="e.g. MacBook Pro 14-inch M3, barely used"
//             value={form.title}
//             onChange={setField("title")}
//           />
//         </FormField>

//         <FormField
//           label="Price (₹) *"
//           error={error?.includes("price") ? error : undefined}
//         >
//           <Input
//             type="number"
//             min="0"
//             placeholder="e.g. 45000"
//             value={form.price}
//             onChange={setField("price")}
//           />
//         </FormField>

//         <FormField label="Description">
//           <Textarea
//             placeholder="Condition, original price, reason for selling, included accessories…"
//             value={form.description}
//             onChange={setField("description")}
//           />
//         </FormField>

//         <FormField
//           label="Pictures *"
//           hint={`Upload up to 3 images (${form.imageFiles.length}/3)`}
//           error={error?.includes("image") ? error : undefined}
//         >
//           <div className="flex flex-col gap-3">
//             <label
//               className={`flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed rounded-xl bg-blue-50 transition-all duration-200 ease-in-out ${
//                 form.imageFiles.length < 3
//                   ? "cursor-pointer opacity-100"
//                   : "cursor-not-allowed opacity-50"
//               }`}
//             >
//               <span className="text-xl">📸</span>
//               <div className="text-left">
//                 <div className="text-sm font-semibold text-blue-600">
//                   {form.imageFiles.length < 3
//                     ? "Click to upload"
//                     : "Maximum 3 images"}
//                 </div>
//                 <div className="text-xs text-gray-500">
//                   PNG, JPG up to 10MB each
//                 </div>
//               </div>
//               <input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 disabled={form.imageFiles.length >= 3}
//                 onChange={handleImageSelect}
//                 className="hidden"
//               />
//             </label>

//             {form.imageFiles.length > 0 && (
//               <div className="flex gap-2 flex-wrap">
//                 {form.imageFiles.map((file, idx) => (
//                   <div
//                     key={idx}
//                     className="relative w-20 h-20 rounded-lg overflow-hidden border bg-gray-100 cursor-pointer transition-transform transition-shadow duration-200 hover:scale-105 hover:shadow-lg"
//                     onClick={() => openPreview(form.imageFiles, idx)}
//                   >
//                     <img
//                       src={URL.createObjectURL(file)}
//                       alt={`Preview ${idx + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         removeImage(idx);
//                       }}
//                       className="absolute top-0.5 right-0.5 w-5.5 h-5.5 rounded-full bg-red-500 text-white border-none text-xs font-bold flex items-center justify-center cursor-pointer"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </FormField>

//         <FormField
//           label="Tags"
//           hint="First tag = category shown in browse filters. Add 'aifair' for the AI Fair Price badge."
//         >
//           <div className="flex gap-2 mb-2">
//             <Input
//               placeholder="Type a tag and press Enter…"
//               value={tagInput}
//               onChange={(e) => setTagInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault();
//                   addTag(tagInput);
//                 }
//               }}
//               className="flex-1"
//             />
//             <button
//               onClick={() => addTag(tagInput)}
//               className="px-4 bg-blue-600 text-white rounded-lg font-bold cursor-pointer shrink-0"
//             >
//               +
//             </button>
//           </div>

//           <div className="flex flex-wrap gap-1.5 mb-2.5">
//             {SUGGESTED_TAGS.filter((t) => !form.tags.includes(t)).map((t) => (
//               <button
//                 key={t}
//                 onClick={() => addTag(t)}
//                 className="px-2.5 py-1 rounded-full border bg-white text-xs text-gray-500 cursor-pointer"
//               >
//                 + {t}
//               </button>
//             ))}
//           </div>

//           {form.tags.length > 0 && (
//             <div className="flex flex-wrap gap-1.5">
//               {form.tags.map((t) => (
//                 <TagChip key={t} label={t} onRemove={() => removeTag(t)} />
//               ))}
//             </div>
//           )}
//         </FormField>

//         {error &&
//           !error.includes("Title") &&
//           !error.includes("price") &&
//           !error.includes("image") && (
//             <div className="text-sm text-red-500 mb-3 px-3.5 py-2.5 bg-red-50 rounded-lg">
//               {error}
//             </div>
//           )}

//         <div className="flex gap-2.5">
//           <button
//             onClick={handleClose}
//             className="flex-1 py-3 bg-gray-100 border-none rounded-xl font-bold text-sm cursor-pointer"
//           >
//             Cancel
//           </button>
//           <PrimaryButton
//             onClick={handleSubmit}
//             loading={loading}
//             className="flex-2"
//           >
//             Post Listing ✦
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

import { useState } from "react";
import {
  Modal,
  FormField,
  Input,
  Textarea,
  PrimaryButton,
  TagChip,
} from "./UI.jsx";
import { useListing } from "../context/ListingContext/ListingContext.js";
import { useImagePreview } from "../hooks/useImagePreview.js";
import { ImagePreviewer } from "./ImagePreviewer.jsx";

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
  tags: { min: 1, max: 8 },
};

export function SellModal({ open, onClose, setToast }) {
  const { createListing } = useListing();
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    imageFiles: [],
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {
    previewOpen,
    previewImages,
    previewIndex,
    openPreview,
    closePreview,
  } = useImagePreview();

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const addTag = (raw) => {
    const t = raw.trim();
    if (t && !form.tags.includes(t) && form.tags.length < VALIDATION_RULES.tags.max) {
      setForm((f) => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  };

  const removeTag = (t) =>
    setForm((f) => ({ ...f, tags: f.tags.filter((x) => x !== t) }));

  const reset = () => {
    setForm({
      title: "",
      price: "",
      description: "",
      imageFiles: [],
      tags: [],
    });
    setTagInput("");
    setError(null);
  };

  // Validation functions
  const validateTitle = (title) => {
    const trimmed = title.trim();
    if (!trimmed) {
      return "Title is required";
    }
    if (trimmed.length < VALIDATION_RULES.title.min) {
      return `Title must be at least ${VALIDATION_RULES.title.min} characters`;
    }
    if (trimmed.length > VALIDATION_RULES.title.max) {
      return `Title must be less than ${VALIDATION_RULES.title.max} characters`;
    }
    return "";
  };

  const validatePrice = (price) => {
    if (!price) {
      return "Price is required";
    }
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
    return "";
  };

  const validateDescription = (description) => {
    if (description.trim().length > VALIDATION_RULES.description.max) {
      return `Description must be less than ${VALIDATION_RULES.description.max} characters`;
    }
    return "";
  };

  const validateImages = (images) => {
    if (images.length < VALIDATION_RULES.images.min) {
      return "Please add at least one image";
    }
    if (images.length > VALIDATION_RULES.images.max) {
      return `Maximum ${VALIDATION_RULES.images.max} images allowed`;
    }
    return "";
  };

  const validateTags = (tags) => {
    if (tags.length < VALIDATION_RULES.tags.min) {
      return "Please add at least one tag";
    }
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

    const imagesError = validateImages(form.imageFiles);
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

  const handleSubmit = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await createListing(
        form.title.trim(),
        form.description.trim(),
        parseFloat(form.price),
        form.imageFiles,
        form.tags,
      );

      if (result.success) {
        reset();
        onClose();
        setToast({ message: "Listing created successfully!", type: "success" });
      } else {
        setError(result.error || "Failed to create listing");
      }
    } catch (e) {
      setError(e.message || "Something went wrong. Please try again.");
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
    const maxImages = VALIDATION_RULES.images.max;

    const imageFiles = files
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, maxImages - form.imageFiles.length);

    if (imageFiles.length === 0 && files.length > 0) {
      setError("Please select valid image files (PNG, JPG, WebP)");
      return;
    }

    setForm((f) => ({
      ...f,
      imageFiles: [...f.imageFiles, ...imageFiles],
    }));

    e.target.value = "";
  };

  const removeImage = (index) => {
    setForm((f) => ({
      ...f,
      imageFiles: f.imageFiles.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title="📦 New Listing"
        maxWidth={560}
      >
        {/* AI Tip */}
        <div className="flex gap-2.5 bg-blue-50 rounded-xl px-3.5 py-3 mb-5.5">
          <span className="text-base flex-shrink-0">✦</span>
          <div className="text-xs text-blue-600 font-medium leading-relaxed">
            <strong>AI Tip:</strong> Listings with 3+ clear photos and a
            detailed description sell 60% faster. Include the original MRP to
            build buyer trust.
          </div>
        </div>

        <FormField
          label="Title *"
          hint={`${form.title.length}/${VALIDATION_RULES.title.max} characters`}
          error={error?.includes("Title") ? error : undefined}
        >
          <Input
            placeholder="e.g. MacBook Pro 14-inch M3, barely used"
            value={form.title}
            onChange={setField("title")}
            maxLength={VALIDATION_RULES.title.max}
          />
        </FormField>

        <FormField
          label="Price (₹) *"
          error={error?.includes("Price") ? error : undefined}
        >
          <Input
            type="number"
            min="1"
            max={VALIDATION_RULES.price.max}
            placeholder="e.g. 45000"
            value={form.price}
            onChange={setField("price")}
          />
        </FormField>

        <FormField
          label="Description"
          hint={`${form.description.length}/${VALIDATION_RULES.description.max} characters`}
          error={error?.includes("Description") ? error : undefined}
        >
          <Textarea
            placeholder="Condition, original price, reason for selling, included accessories…"
            value={form.description}
            onChange={setField("description")}
            maxLength={VALIDATION_RULES.description.max}
          />
        </FormField>

        <FormField
          label="Pictures *"
          hint={`Upload up to ${VALIDATION_RULES.images.max} images (${form.imageFiles.length}/${VALIDATION_RULES.images.max})`}
          error={error?.includes("image") || error?.includes("Picture") ? error : undefined}
        >
          <div className="flex flex-col gap-3">
            <label
              className={`flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed rounded-xl bg-blue-50 transition-all duration-200 ease-in-out ${
                form.imageFiles.length < VALIDATION_RULES.images.max
                  ? "cursor-pointer opacity-100"
                  : "cursor-not-allowed opacity-50"
              }`}
            >
              <span className="text-xl">📸</span>
              <div className="text-left">
                <div className="text-sm font-semibold text-blue-600">
                  {form.imageFiles.length < VALIDATION_RULES.images.max
                    ? "Click to upload"
                    : `Maximum ${VALIDATION_RULES.images.max} images`}
                </div>
                <div className="text-xs text-gray-500">
                  PNG, JPG, WebP up to 10MB each
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={form.imageFiles.length >= VALIDATION_RULES.images.max}
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>

            {form.imageFiles.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {form.imageFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border bg-gray-100 cursor-pointer transition-transform transition-shadow duration-200 hover:scale-105 hover:shadow-lg"
                    onClick={() => openPreview(form.imageFiles, idx)}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(idx);
                      }}
                      className="absolute top-0.5 right-0.5 w-5.5 h-5.5 rounded-full bg-red-500 text-white border-none text-xs font-bold flex items-center justify-center cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FormField>

        <FormField
          label="Tags *"
          hint={`${form.tags.length}/${VALIDATION_RULES.tags.max} tags (First tag = category) & Add condition and department for filtering`}
          error={error?.includes("tag") || error?.includes("Tag") ? error : undefined}
        >
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Type a tag and press Enter…"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
              className="flex-1"
              maxLength="50"
            />
            <button
              onClick={() => addTag(tagInput)}
              disabled={form.tags.length >= VALIDATION_RULES.tags.max}
              className="px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/60 text-white rounded-lg font-bold cursor-pointer shrink-0 transition-colors"
            >
              +
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {SUGGESTED_TAGS.filter((t) => !form.tags.includes(t)).map((t) => (
              <button
                key={t}
                onClick={() => addTag(t)}
                disabled={form.tags.length >= VALIDATION_RULES.tags.max}
                className="px-2.5 py-1 rounded-full border bg-white text-xs text-gray-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                + {t}
              </button>
            ))}
          </div>

          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map((t) => (
                <TagChip key={t} label={t} onRemove={() => removeTag(t)} />
              ))}
            </div>
          )}
        </FormField>

        {error && (
          <div className="text-sm text-red-500 mb-3 px-3.5 py-2.5 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-2.5">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 py-3 bg-gray-100 border-none rounded-xl font-bold text-sm cursor-pointer hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <PrimaryButton
            onClick={handleSubmit}
            loading={loading}
            className="flex-2"
          >
            Post Listing ✦
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
}
