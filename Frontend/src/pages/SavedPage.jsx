import { useEffect, useState } from "react";
import SavedComponent from "../components/SavedComponent.jsx";
import MobileHeader from "../components/MobileHeader.jsx";
import { useWishlist } from "../context/WishlistContext/WishlistContext.js";

export default function SavedPage({ isMobile }) {
  const {        wishlist,
    removeWishlist,
        refreshWishlist } = useWishlist();
        
  const handleSaveToggle = (id) => {
    removeWishlist(id);
  };

  const savedListings = wishlist;

  // ── Mobile shell ──────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto">
          {/* Mobile header */}
          <MobileHeader title="♡ Saved " />

          {/* Content */}
          <div className="px-4 pt-4">
            <SavedComponent savedListings={savedListings} handleSaveToggle={handleSaveToggle} compact={true} className="grid grid-cols-2 gap-3" />
          </div>
        </div>

      
      </div>
    );
  }

  // ── Desktop shell ─────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen">

      {/* Main */}
      <main className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="flex items-center mb-6">
          <div>
            <div className="text-2xl font-extrabold text-gray-900">♡ Saved Items</div>
            <div className="text-sm text-gray-400 mt-1">All your favorites in one place</div>
          </div>
        </div>

        <SavedComponent savedListings={savedListings} handleSaveToggle={handleSaveToggle} compact={isMobile} className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]"/>
      </main>
    </div>
  );
}