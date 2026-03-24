import React from "react";
import { useNavigate } from "react-router";
import { timeAgo } from "./UI.jsx";

export const PublicListingCard = () => {
  const navigate = useNavigate();
  // const { title, price, imageUrls = [], createdAt, status } = listingf;

  const cover = null;
  const isSold = status === "SOLD" || status === "BLOCKED";

  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm transition-all hover:shadow-md cursor-pointer"
      onClick={() => navigate("/login")} // Force login on click
    >
      {/* ── Image Section ── */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {cover ? (
          <img
            src={cover}
            alt="cgfcg"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
        )}
        
        {/* Price Badge - visible even to guests */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
          <span className="text-blue-600 font-bold text-sm">₹{Number(100).toLocaleString("en-IN")}</span>
        </div>

        {/* The "Locked" Icon overlay */}
        <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-md p-2 rounded-full text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
      </div>

      {/* ── Body Section with "Blur Tease" ── */}
      <div className="p-4 relative">
        <h3 className="font-semibold text-gray-900 truncate mb-1">asdf</h3>
        <div className="text-xs text-gray-500 flex items-center gap-1">
           {/* 🕐 {timeAgo(createdAt)} */}
        </div>

        {/* The "Reveal" Overlay on Hover */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                Login to view details
            </button>
        </div>
      </div>
    </div>
  );
};