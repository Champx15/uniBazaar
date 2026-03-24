import { createContext,useContext } from "react";

const WishlistContext = createContext();

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}

export default WishlistContext;