import { useState, useEffect, useRef } from "react";
import { timeAgo } from "./UI";
import { Pencil, Trash2, MoreVertical, RotateCcw, CheckCircle } from "lucide-react";

function MyListingRow({ listing, onEdit, onDelete, onToggle }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  
  const cover = listing.imageUrls?.[0] ?? null;
  const isActive = listing?.status === "ACTIVE";

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 flex gap-4 p-3 items-center ">
      {/* Image Section */}
      <div className="w-17.5 h-17.5 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
        {cover ? (
          <img src={cover} alt={listing.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl">📦</span>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-bold text-gray-900 truncate">{listing.title}</div>
        <div className="text-[15px] font-extrabold text-blue-600 mt-1">
          ₹{Number(listing.price).toLocaleString("en-IN")}
        </div>

        <div className="flex gap-1.5 mt-2 flex-wrap items-center">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
            isActive ? "bg-green-100 text-green-600" : "bg-red-50 text-red-600"
          }`}>
            {isActive ? "● Active" : "● Sold"}
          </span>
          <span className="text-[10px] text-gray-400">{timeAgo(listing.createdAt)}</span>
        </div>
      </div>

      {/* Action Menu Section */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
        >
          <MoreVertical size={20} />
        </button>

        {showMenu && (
          <div className="absolute right-3 top-5 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-xl z-50 py-1 overflow-hidden">
            <button
              onClick={() => { onEdit(listing); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Pencil size={14} /> Edit Listing
            </button>

            <button
              onClick={() => { onToggle(listing); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              {isActive ? <CheckCircle size={14} className="text-green-500" /> : <RotateCcw size={14} className="text-blue-500" />}
              {isActive ? "Mark Sold" : "Relist Item"}
            </button>


            <button
              onClick={() => { onDelete(listing.id); setShowMenu(false); }}
              className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyListingRow;