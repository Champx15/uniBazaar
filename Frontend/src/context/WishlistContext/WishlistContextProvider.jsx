import { useState, useEffect } from "react";
import wishlistService from "../../service/wishlistService";
import { useAuth } from "../AuthContext/AuthContext";
import WishlistContext from "./WishlistContext";

export const WishlistContextProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAllWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getWishlists();
      setWishlist(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllWishlist();
    } else {
      setWishlist([]);
      setLoading(false);
    }
  }, [user]);

  // addWishlist now takes just the listingId
  const addWishlist = async (listingId) => {
    // Normalize the ID to string for consistency
    const id = String(listingId);

    // 1️⃣ Optimistic update - create a minimal listing object
    setWishlist((prev) => {
      // Prevent duplicates
      if (prev.some((l) => String(l.id) === id)) return prev;
      // Add a minimal object with just the id
      return [...prev, { id: listingId }];
    });

    try {
      await wishlistService.addWishlist({ listingId: id });
      // Refresh to get the full listing data from backend
      await fetchAllWishlist();
      return { success: true };
    } catch (error) {
      // 2️⃣ Rollback if API fails
      setWishlist((prev) => prev.filter((l) => String(l.id) !== id));
      console.error("Failed to add to wishlist:", error);
      return { success: false, error: error.message };
    }
  };

  const removeWishlist = async (listingId) => {
    const id = String(listingId); // normalize

    let removedItem;

    // Optimistically remove from UI
    setWishlist((prev) => {
      removedItem = prev.find((l) => String(l.id) === id);
      return prev.filter((l) => String(l.id) !== id);
    });

    try {
      await wishlistService.removeWishlist({ listingId: id });
      return { success: true };
    } catch (error) {
      // Rollback if API fails
      if (removedItem) {
        setWishlist((prev) => [...prev, removedItem]);
      }
      console.error("Failed to remove from wishlist:", error);
      return { success: false, error: error.message };
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addWishlist,
        removeWishlist,
        refreshWishlist: fetchAllWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContextProvider;