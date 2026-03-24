import { createContext,useContext } from 'react';

const ListingContext = createContext(null);

export function useListing() {
  const ctx = useContext(ListingContext);
  if (!ctx) throw new Error("useListing must be used inside <ListingProvider>");
  return ctx;
}

export default ListingContext;