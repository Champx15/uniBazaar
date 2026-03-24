import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import { Route, Routes, Navigate, BrowserRouter } from "react-router";
import { useAuth } from "./context/AuthContext/AuthContext";
import AuthContextProvider from "./context/AuthContext/AuthContextProvider";
import { ProfilePage, SavedPage } from "./pages/index";
import "./utils/global.css";
import ListingContextProvider from "./context/ListingContext/ListingContextProvider";
import WishlistContextProvider from "./context/WishlistContext/WishlistContextProvider";
import UserContextProvider from "./context/UserContext/UserContextProvider";
import MessagePage from "./pages/MessagePage";
import { Toast } from "./components/UI";
import ExplorePage from "./pages/ExplorePage";
import ProductDetail from "./components/ProductDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import Banned from "./pages/Banned";
import { PublicListingCard } from "./components/PublicListingCard";

function AppShell() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [toast, setToast] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <>
<Routes>
        <Route
          path="/login"
          element={user ? (user?.role === "ADMIN" ? <Navigate to="/admin" replace /> : <Navigate to="/explore" replace />) : <Login />}
        />
        <Route path="/signup" element={user ? <Navigate to="/explore" replace /> : <Signup />} />
        <Route path="/forgot-pass" element={<ForgotPassword />} />

        <Route element={<Layout setToast={setToast} />}>

          <Route path="/" element={<Navigate to="/explore" replace />} />
          <Route path="explore" element={<ExplorePage isMobile={isMobile} />} />
          <Route path="listings/:id" element={<ProductDetail setToast={setToast} />} />

          <Route element={<ProtectedRoute />}>
            <Route path="messages" element={<MessagePage isMobile={isMobile} />} />
            <Route path="saved" element={<SavedPage isMobile={isMobile} />} />
            <Route path="profile" element={<ProfilePage isMobile={isMobile} />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        
        <Route path="/banned" element={<Banned />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <>
      <AuthContextProvider>
        <UserContextProvider>
          <WishlistContextProvider>
            <ListingContextProvider>
              <BrowserRouter>
                <AppShell></AppShell>
              </BrowserRouter>
            </ListingContextProvider>
          </WishlistContextProvider>
        </UserContextProvider>
      </AuthContextProvider>
    </>
  );
}

export default App;
