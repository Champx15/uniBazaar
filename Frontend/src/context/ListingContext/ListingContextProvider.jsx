import { useState, useEffect } from 'react';
import listingService from '../../service/listingService';
import { useAuth } from '../AuthContext/AuthContext';
import ListingContext from './ListingContext';

export const ListingContextProvider = ({ children }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    cursorId: 0,
    cursorCreatedAt: null,
    hasNext: false
  });
  const { user } = useAuth();
  const [userListings, setUserListings] = useState([]);

  // Fetch listings with cursor pagination
  // If isAppending is true, we append to existing listings (for infinite scroll)
  // If false, we replace listings (for initial load)
  const fetchAllListings = async ({ cursorId, cursorCreatedAt }, isAppending = false) => {
    try {
      if (!isAppending) {
        setLoading(true);
      }
      
      const data = await listingService.getAllListings({ cursorId, cursorCreatedAt });
      
      // Backend returns CursorResponse with { content, nextCursorId, nextCursorCreatedAt, hasNext }
      let listingsArray = data.content || [];
      
      // If content contains { listing, wishlisted }, extract just the listing
      if (listingsArray.length > 0 && listingsArray[0].listing) {
        listingsArray = listingsArray.map(item => item.listing);
      }
      
      // For initial load, replace listings
      // For pagination, append to existing listings
      if (isAppending) {
        setListings(prev => {
          // Avoid duplicates
          const existingIds = new Set(prev.map(l => l.id));
          const newListings = listingsArray.filter(l => !existingIds.has(l.id));
          return [...prev, ...newListings];
        });
      } else {
        setListings(listingsArray);
      }
      
      // Update pagination for next load
      setPagination({
        cursorId: data.nextCursorId || 0,
        cursorCreatedAt: data.nextCursorCreatedAt || null,
        hasNext: data.hasNext || false
      });
      
      console.log("Fetched listings:", listingsArray, "Total:", listings.length + listingsArray.length);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      if (!isAppending) {
        setListings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Refetch listings when user logs in/out
  useEffect(() => {
    if (user) {
      fetchAllListings({ cursorId: 0, cursorCreatedAt: null }, false);
    } else {
      setListings([]);
      setPagination({
        cursorId: 0,
        cursorCreatedAt: null,
        hasNext: false
      });
    }
  }, [user]);

  const createListing = async (title, description, price, images, tags) => {
    try {
      const newListing = await listingService.createListing({ title, description, price, images, tags });
      await fetchAllListings({ cursorId: 0, cursorCreatedAt: null }, false);
      await getUserListings();
      return { success: true, listing: newListing };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateListing = async (id, payload) => {
    const previousUserListings = [...userListings];
 
    try {
      const updatedListing = await listingService.updateListing({
        id,
        title: payload.title,
        description: payload.description,
        price: payload.price,
        images: payload.images || [],
        imageUrls: payload.imageUrls,
        tags: payload.tags
      });
 
      // Update locally instead of refetching
      setUserListings(prev =>
        prev.map(l =>
          l.id === id ? updatedListing : l
        )
      );
 
      return { success: true, listing: updatedListing };
    } catch (error) {
      setUserListings(previousUserListings);
      return { success: false, error: error.message };
    }
  };

  const deleteListing = async (id) => {
    const previousUserListings = [...userListings];

    // Optimistically remove from UI
    setUserListings(prev =>
      prev.filter(l => l.id !== id)
    );

    try {
      await listingService.removeListing({ id });
      return { success: true };
    } catch (error) {
      // Rollback if API fails
      setUserListings(previousUserListings);
      return { success: false, error: error.message };
    }
  };

  const getListing = async (id) => {
    try {
      const data = await listingService.getListingById({ id });
      return data;
    } catch (error) {
      console.error('Failed to fetch listing:', error);
      return null;
    }
  };

  const getUserListings = async () => {
    try {
      const userListings = await listingService.getUserListings();
      setUserListings(userListings);
    } catch (error) {
      console.error('Failed to fetch user listings:', error);
      return null;
    }
  };

  const updateListingAvailability = async (id, status) => {
    const previousUserListings = [...userListings];

    // Optimistic update
    setUserListings(prev =>
      prev.map(l =>
        l.id === id ? { ...l, status: status } : l
      )
    );

    try {
      await listingService.updateAvailability({ id, status });
      return { success: true };
    } catch (error) {
      // Rollback if backend fails
      setUserListings(previousUserListings);
      return { success: false, error: error.message };
    }
  };

  return (
    <ListingContext.Provider value={{ 
      listings, 
      userListings,
      loading,
      pagination,
      createListing,
      updateListing,
      deleteListing,
      getListing,
      getUserListings,
      updateListingAvailability,
      // For infinite scroll: pass isAppending=true
      refreshListings: (params) => fetchAllListings(params, false),
      refreshUserListings: getUserListings,
      // Append more listings (for infinite scroll)
      loadMoreListings: (params) => fetchAllListings(params, true)
    }}>
      {children}
    </ListingContext.Provider>
  );
};

export default ListingContextProvider;