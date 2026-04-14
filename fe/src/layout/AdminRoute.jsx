import { Navigate } from "react-router";
import Loader from "../features/movie/components/Loader";
import { useAuth } from "../features/auth/hooks/useAuth.hook";

const AdminRoute = ({ children }) => {
  const { user, authReady } = useAuth();

  if (!authReady) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
