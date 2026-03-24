export function ListingCardSkeleton({ compact = false, count = 6 }) {
  const imgHeight = compact ? "h-32" : "h-[190px]";
  const radius = compact ? "rounded-xl" : "rounded-2xl";
  const padding = compact ? "px-2.5 pt-2.5 pb-3" : "px-3.5 pt-3.5 pb-3";

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="cursor-pointer animate-pulse">
          <div
            className={`bg-white ${radius} overflow-hidden border border-gray-200`}
          >
            {/* Image Skeleton */}
            <div className={`relative ${imgHeight} bg-gray-200`}>

              {/* Fake like button */}
              <div className="absolute top-2.5 right-2.5 w-8 h-8 bg-gray-300 rounded-full" />

              {/* Fake dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              </div>
            </div>

            {/* Body Skeleton */}
            <div className={padding}>
              {/* Price */}
              <div
                className={`${
                  compact ? "h-5 w-24" : "h-6 w-32"
                } bg-gray-300 rounded mb-3`}
              />

              {/* Title lines */}
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />

              {/* Time */}
              <div
                className={`${
                  compact ? "h-3 w-20" : "h-4 w-28"
                } bg-gray-200 rounded`}
              />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}