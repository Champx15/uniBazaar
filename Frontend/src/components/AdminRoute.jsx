import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext/AuthContext";

const AdminRoute = () => {
  const { user,loading } = useAuth();
    if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'var(--font-body)'
      }}>
        Loading...
      </div>
    );
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/explore" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;