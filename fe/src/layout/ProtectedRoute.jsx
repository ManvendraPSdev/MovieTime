import { Navigate, useLocation } from "react-router";
import Loader from "../features/movie/components/Loader";
import { useAuth } from "../features/auth/hooks/useAuth.hook";

const ProtectedRoute = ({ children }) => {
  const { user, authReady } = useAuth();
  const location = useLocation();

  if (!authReady) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
