import { createContext,useContext } from "react";

const UserContext = createContext();

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}

export default UserContext;