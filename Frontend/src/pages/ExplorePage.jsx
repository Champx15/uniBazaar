import React, { useEffect, useRef, useCallback } from "react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { ListingCard } from "../components/ListingCard.jsx";
import { Spinner, EmptyState, Toast } from "../components/UI.jsx";
import { useAuth } from "../context/AuthContext/AuthContext.js";
import { useListing } from "../context/ListingContext/ListingContext.js";
import { useWishlist } from "../context/WishlistContext/WishlistContext.js";
import { ListingCardSkeleton } from "../components/ListingCardSkeleton.jsx";
import listingService from "../service/listingService.js";
import { Filter, SearchIcon, SlidersHorizontal } from "lucide-react";
import FilterModal from "../components/FilterModal.jsx";
import UserImage from "../icons/user.png";


const getCategoryFromTags = (tags) => {
  if (!tags || tags.length === 0) return "All";
  return tags[0];
};

export default function ExplorePage({ isMobile }) {
  const { user } = useAuth();
  const { listings = [], loading, pagination, refreshListings } = useListing();
  const { addWishlist, removeWishlist, wishlist } = useWishlist();
  const navigate = useNavigate();
  const [filterActive, setFilterActive] = useState(false);

  const tags = [
    "Books",
    "Notes",
    "Electronics",
    "Furniture",
    "Hostel Items",
    "Clothing",
    "Bicycles",
    "Other",
  ];

  // Local state for infinite scroll
  const [search, setSearch] = useState("");
  const [activeCategory, setCategory] = useState("All");
  const [allListings, setAllListings] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [toast, setToast] = useState(null);
  const [greeting, setGreeting] = useState("Good Morning");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterResult, setFilterResult] = useState(null);

  const filterButtonRef = useRef(null);
  const observerTarget = useRef(null);
  const searchTimeout = useRef(null);
  const savedIds = useMemo(
    () => new Set(wishlist.map((l) => l.id)),
    [wishlist],
  );

  // Update greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting("Good Morning");
      } else if (hour < 18) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  // Initialize listings on mount
  useEffect(() => {
    if (!isInitialized) {
      refreshListings({ cursorId: 0, cursorCreatedAt: null });
      setIsInitialized(true);
    }
  }, [ isInitialized, refreshListings]);

  // Update allListings when listings change from context
  useEffect(() => {
    if (listings.length > 0 && !searchResults && !filterResult) {
      setAllListings((prev) => {
        const existingIds = new Set(prev.map((l) => l.id));
        const newListings = listings.filter((l) => !existingIds.has(l.id));
        return [...prev, ...newListings];
      });

      setHasNextPage(pagination?.hasNext ?? false);
    }
  }, [listings, pagination, searchResults, filterResult]);

  // Debounced search function
  const performSearch = useCallback(
    async (query) => {
      if (!query.trim()) {
        // If search is cleared, reset to normal listings
        setSearchResults(null);
        setAllListings([]);
        refreshListings({ cursorId: 0, cursorCreatedAt: null });
        return;
      }

      setIsSearching(true);
      try {
        const results = await listingService.search({ query });
        setSearchResults(results);
        console.log("Search results:", results);
      } catch (error) {
        console.error("Search error:", error);
        setToast({ message: "Search failed. Try again.", type: "error" });
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [refreshListings],
  );

  // Handle search input with debounce
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set new timeout for search (300ms debounce)
    searchTimeout.current = setTimeout(() => {
      performSearch(query);
    }, 300);
  };

  //filter
  const handleFilterApply = async (filters) => {
    setFilterActive(true);
    const results = await listingService.filter({ ...filters });
    setFilterResult(results);
  };

  const handleReset = () => {
    setFilterActive(false);
    setFilterResult(null);
  };

  // Load more listings when scroll reaches bottom
  const loadMore = useCallback(async () => {
    if (
      isLoadingMore ||
      !hasNextPage ||
      !pagination?.cursorId ||
      !pagination?.cursorCreatedAt ||
      searchResults
    ) {
      return;
    }

    setIsLoadingMore(true);
    try {
      await refreshListings({
        cursorId: pagination.cursorId,
        cursorCreatedAt: pagination.cursorCreatedAt,
      });
    } catch (error) {
      console.error("Error loading more listings:", error);
      setToast({ message: "Failed to load more listings", type: "error" });
    } finally {
      setIsLoadingMore(false);
    }
  }, [pagination, isLoadingMore, hasNextPage, refreshListings, searchResults]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isLoadingMore &&
          !loading &&
          !searchResults
        ) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isLoadingMore, loading, loadMore, searchResults]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  // Handle save toggle
  const handleSaveToggle = useCallback(
    
    (listing) => {
      const isSaved = savedIds.has(listing.id);
      
      if(!user) {
        setToast({ message: "Please log in to save listings", type: "info" });
        return;
      }
    

      if (isSaved) {
        removeWishlist(listing.id);
        setToast({ message: "Removed from saved", type: "info" });
      } else {
        addWishlist(listing.id);
        setToast({ message: "Added to saved! ♥", type: "success" });
      }
    },
    [savedIds, user,removeWishlist, addWishlist],
  );

  // Determine which listings to display
  const displayListings =
    filterResult != null
      ? filterResult
      : searchResults !== null
        ? searchResults
        : allListings;

  // Filter by category (only if not searching)
  const filtered = useMemo(() => {
    if (!Array.isArray(displayListings)) return [];

    return displayListings.filter((l) => {
      if (!l || !l.title) return false;

      // Only apply category filter when not searching
      if (searchResults === null) {
        const matchCat =
          activeCategory === "All" ||
          getCategoryFromTags(l.tags) === activeCategory;
        return matchCat;
      }

      return true;
    });
  }, [displayListings, activeCategory, searchResults]);

  // Inner content component
  const innerContent = (
    <>
      {/* Category filters - hide when searching */}
      {!search && (
        <div className="flex gap-2 mb-5 overflow-x-auto pb-0.5 scrollbar-hide  scroll-smooth ">
          <button
            onClick={() => setCategory("All")}
            className={`px-3 py-1 border-none rounded-full shadow-sm shadow-gray-300 text-sm md:text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
              activeCategory === "All"
                ? "bg-blue-700 text-white"
                : "bg-white text-gray border border-border hover:bg-blue-light"
            }`}
          >
            All
          </button>
          {Array.isArray(tags) &&
            tags.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 border-none rounded-full shadow-sm shadow-gray-300 text-sm md:text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                  activeCategory === cat
                    ? "bg-blue-700 text-white"
                    : "bg-white text-gray border border-border hover:bg-blue-light"
                }`}
              >
                {cat}
              </button>
            ))}
        </div>
      )}

      {/* Listings grid */}
      {(loading && allListings.length === 0) || isSearching ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ListingCardSkeleton count={8} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No listings found"
          sub={
            search ? "Try a different search term" : "No items in this category"
          }
        />
      ) : (
        <>
          <div
            className={`grid gap-4 ${
              isMobile
                ? "grid-cols-2"
                : "md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2"
            }`}
          >
            {filtered.map((l) => (
              <ListingCard
                key={l.id}
                listing={l}
                onOffer={() => {}}
                compact={isMobile}
                isSaved={savedIds.has(l.id)}
                onSaveToggle={() => handleSaveToggle(l)}
              />
            ))}
          </div>

          {/* Infinite scroll trigger - only when not searching */}
          {!searchResults && <div ref={observerTarget} className="h-10 mt-8" />}

          {/* Loading indicator for pagination */}
          {isLoadingMore && (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          )}

          {/* End of listings message */}
          {!hasNextPage && allListings.length > 0 && !searchResults && (
            <div className="text-center py-8 text-gray-400">
              <p>You've reached the end! 🎉</p>
            </div>
          )}
        </>
      )}

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </>
  );

  // ── Mobile shell ──────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div>
        {/* Mobile header */}
        <div className="bg-linear-to-br from-[#1a6bff] to-[#0038BB] rounded-b-3xl px-5 pt-5 pb-5">
          <div className="flex justify-between items-center mb-4">
            <div className="text-3xl font-black text-black tracking-tight">
              uni<span className="text-white">Bazaar</span>
              <div className="text-sm text-white mt-0.5 font-medium">
                Find what Hamdard is selling today
              </div>
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="bg-white border-0 rounded-full w-7.5 h-7.5 text-base cursor-pointer hover:bg-white/30 transition flex items-center justify-center"
              aria-label="Profile"
            >
              <img
                src={UserImage}
                alt="Profile"
                className="w-5.5 h-5.5 object-cover"
              />
            </button>
          </div>
          <div className="text-white text-sm mb-1 mt-7">{greeting}</div>
          <div className="text-white text-2xl font-black mb-4">
            {user?.name?.split(" ")[0] ?? "Hamdardian"} 👋
          </div>
          <div className="flex items-center gap-2 bg-white rounded-2xl p-3">
            <span>
              <SearchIcon strokeWidth={1.8} size={25}/>
            </span>
            <input
              value={search}
              enterKeyHint="search"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  performSearch(search);
                  setFilterResult(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  e.target.blur();
                }
              }}
              onChange={handleSearchChange}
              placeholder="Search on campus…"
              className="flex-1 border-0 outline-none text-sm bg-transparent text-dark placeholder-gray-400"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setSearchResults(null);
                  setAllListings([]);
                  refreshListings({ cursorId: 0, cursorCreatedAt: null });
                }}
                className="bg-none border-0 cursor-pointer text-gray-light hover:text-gray transition"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
            <button
              ref={filterButtonRef}
              onClick={() => setIsFilterModalOpen(true)}
              className={`text-lg flex items-center gap-2 font-medium cursor-pointer${filterActive ? " text-blue-700" : ""}`}
            >
              <SlidersHorizontal size={24} strokeWidth={2.1} />
            </button>
            <FilterModal
              isOpen={isFilterModalOpen}
              onClose={() => setIsFilterModalOpen(false)}
              onApply={handleFilterApply}
              triggerRef={filterButtonRef}
              onReset={handleReset}
              //  onApply={handleApplyFilters}
            />
          </div>
        </div>

        <div className="p-3">{innerContent}</div>
      </div>
    );
  }

  // ── Desktop shell ─────────────────────────────────────────────────────────
  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center gap-5 mb-6 p-5 pt-4 pb-0">
        <div className="flex-shrink-0">
          <div className="text-2xl font-black text-dark">
            {greeting}, {user?.name?.split(" ")[0] ?? "Hamdardian"} 👋
          </div>
          <div className="text-sm text-gray-light mt-0.5">
            Find what Hamdard is selling today
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white shadow-md shadow-gray-400  rounded-4xl p-3.5 h-12  flex-1">
          <span>
            <SearchIcon strokeWidth={1.9} />
          </span>
          <input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search textbooks, gadgets, bikes…"
            className="flex-1 border-0 outline-none text-[1rem] bg-transparent text-dark placeholder-gray-400"
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setSearchResults(null);
                setAllListings([]);
                refreshListings({ cursorId: 0, cursorCreatedAt: null });
              }}
              className="bg-none border-0 cursor-pointer text-gray-light hover:text-gray transition"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
          <button
            ref={filterButtonRef}
            onClick={() => setIsFilterModalOpen(true)}
            className={`text-lg flex items-center gap-2 font-medium cursor-pointer${filterActive ? " text-blue-700" : ""}`}
          >
            <SlidersHorizontal size={24} strokeWidth={2.3} />
          </button>
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            onApply={handleFilterApply}
            triggerRef={filterButtonRef}
            onReset={handleReset}
            //  onApply={handleApplyFilters}
          />
        </div>
      </div>

      <div className="p-6 pt-0">{innerContent}</div>
    </div>
  );
}
