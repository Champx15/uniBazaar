import React, { useState } from "react";
import { Avatar, TagChip, timeAgo } from "./UI.jsx";
import { useNavigate } from "react-router";
import { useWishlist } from "../context/WishlistContext/WishlistContext";
import { useAuth } from "../context/AuthContext/AuthContext.js";

export const ListingCard = React.memo(({ listing, onOffer, compact = false, onSaveToggle = null }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const navigate = useNavigate();
  const { wishlist, addWishlist, removeWishlist } = useWishlist();
  const isSaved = wishlist.some((w) => w.id === listing.id);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const { user } = useAuth();

  const {
    title,
    price,
    imageUrls = [],
    tags = [],
    createdAt,
    status,
  } = listing;

  const cover = imageUrls[imgIdx] ?? null;
  const isAiFair = tags.some(
    (t) => t.toLowerCase() === "aifair" || t.toLowerCase() === "ai-fair",
  );
  const isSold = status === "BLOCKED" || status==="SOLD" || status==="DELETED";

  const imgHeight = compact ? "h-32" : "h-[190px]";

  // Handle save/unsave with proper state management
  const handleSaveToggle = async (e) => {
    // if (!user) {

    e.stopPropagation();
    
    setIsLoadingSave(true);
    try {
      if (isSaved) {
        await removeWishlist(listing.id);
      } else {
        await addWishlist(listing.id);
      }
    } catch (error) {
      console.error("Failed to toggle wishlist:", error);
    } finally {
      setIsLoadingSave(false);
    }

    // Call the parent callback if provided
    onSaveToggle?.(listing.id);
  };

  return (
    <div
      onClick={() => navigate(`/listings/${listing.id}`)}
      className="cursor-pointer"
    >
      <div
        className={`card-lift bg-white rounded-${compact ? "xl" : "2xl"} overflow-hidden border shadow-sm shadow-gray-300 border-gray-200 ${isSold ? "opacity-60" : "opacity-100"}`}
      >
        {/* ── Image ── */}
        <div className={`relative ${imgHeight} overflow-hidden bg-gray-100`}>
          {cover ? (
            <img
            loading="lazy"
              src={cover}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              📦
            </div>
          )}

          {/* Dot nav */}
          {imageUrls.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {imageUrls.map((_, i) => (
                <div
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setImgIdx(i);
                  }}
                  className={`w-1.5 h-1.5 rounded-full cursor-pointer ${
                    i === imgIdx ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Badges */}
          {isAiFair && !isSold && (
            <div className="absolute top-2.5 left-2.5">
              <div className="bg-blue-600 text-white text-[9px] font-bold px-2.5 py-1 rounded-full">
                AI FAIR PRICE
              </div>
            </div>
          )}

          {isSold && (
            <div className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-md">
              {status}
            </div>
          )}

          {/* Like button - Fixed to update properly */}
          <button
            onClick={handleSaveToggle}
            disabled={isLoadingSave}
            className={`absolute top-2.5 right-2.5 cursor-pointer w-8 h-8 rounded-full border-none flex items-center justify-center text-base transition-all duration-150 active:scale-90 ${
              isSaved 
                ? "bg-red-400 text-white scale-100" 
                : "bg-white/90 text-gray-500 hover:bg-white"
            } ${isLoadingSave ? "opacity-50" : ""}`}
            title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isSaved ? "♥" : "♡"}
          </button>
        </div>

        {/* ── Body ── */}
        <div className={compact ? "px-2.5 pt-2.5 pb-3" : "px-3.5 pt-3.5 pb-3"}>
          {/* Price */}
          <div
            className={`${compact ? "text-[0.9rem]" : "text-[1rem]"} font-semibold truncate text-gray-900`}
          >
            {/* ₹{Number(price).toLocaleString("en-IN")} */}
             {title}
          </div>

          {/* Title */}
          <div
            className={`${compact ? "text-[0.9rem]" : "text-[18px]"} font-medium text-gray-700 mt-1 mb-1.5 `}
          >
            ₹{Number(price).toLocaleString("en-IN")}
            {/* {title} */}
          </div>

          {/* Time */}
          <div
            className={`${compact ? "text-[11px] mb-1.2" : "text-[13px] mb-"} text-gray-500`}
          >
            🕐 {timeAgo(createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}
)