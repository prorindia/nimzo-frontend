import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // ⏳ jab tak auth restore ho raha hai
  if (loading) return null; // ya loader

  // ❌ user logged out
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: location }}
      />
    );
  }

  // ✅ user logged in
  return <Outlet />;
};

export default ProtectedRoute;
