import { Spinner, EmptyState } from "./UI.jsx";
import MyListingRow from "./MyListingRow.jsx";

export default function MyListingsSection({
  listings,
  loading,
  onEdit,
  onDelete,
  onToggle,
  isMobile,
}) {
  return (
    <div
      className={`bg-white md:bg-gray rounded-2xl p-5  border border-gray-200  overflow-auto
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        [&::-webkit-scrollbar-thumb]:rounded-lg
        [&::-webkit-scrollbar-thumb]:hover:bg-gray-700
        [&::-webkit-scrollbar-track]:bg-gray-200
        [&::-webkit-scrollbar-track]:rounded-lg
        scrollbar-thin
        scrollbar-thumb-gray-500
        scrollbar-track-gray-200
        ${isMobile ? "h-100" : "h-146"}`}
    >
      <div className="text-lg font-extrabold text-gray-900 mb-4">
        My Listings
      </div>

      {loading ? (
        <Spinner />
      ) : listings.length === 0 ? (
<div className="h-100 flex flex-col items-center justify-center text-center">
  
  {/* The Illustration */}
  <div className="mb-6 opacity-40">
    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className="text-gray-400">
      {/* (Simple isometric open box SVG path here) */}
      <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 7V17L12 22M21 7V17L12 22" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 12V22" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  </div>
  
  <h3 className="text-gray-900 font-semibold">No listings yet</h3>
  <p className="text-gray-500 text-sm mt-1 max-w-xs">
    Your campus bazaar is waiting for your stuff. List your first item and connect with other students!
  </p>

  
</div>
      ) : (
        <div className="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-2">
          {listings.map((l) => (
            <MyListingRow
              key={l.id}
              listing={l}
              onEdit={() => onEdit(l)}
              onDelete={() => onDelete(l.id)}
              onToggle={() => onToggle(l)}
            />
          ))}
        </div>
      )}
    </div>
  );
}