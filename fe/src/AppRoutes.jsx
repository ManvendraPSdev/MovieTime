import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router";
import AppLayout from "./layout/AppLayout";
import AdminRoute from "./layout/AdminRoute";
import ProtectedRoute from "./layout/ProtectedRoute";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import HomePage from "./features/movie/pages/HomePage";
import BrowsePage from "./features/movie/pages/BrowsePage";
import MovieDetailPage from "./features/movie/pages/MovieDetailPage";
import PersonDetailPage from "./features/movie/pages/PersonDetailPage";
import UserDetailPage from "./features/movie/pages/UserDetailPage";
import WatchHistoryPage from "./features/watchHistory/pages/WatchHistoryPage";
import SearchPage from "./features/search/pages/SearchPage";
import FavPage from "./features/favorite/pages/fav.pages.jsx";
import AdminPage from "./features/admin/pages/admin.pages.jsx";

function LegacyMoviesRedirect() {
  const { id } = useParams();
  return <Navigate to={`/movie/${id}`} replace />;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/tv/:id" element={<MovieDetailPage />} />
          <Route path="/person/:id" element={<PersonDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<UserDetailPage />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watch-history"
            element={
              <ProtectedRoute>
                <WatchHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchHistory"
            element={<Navigate to="/watch-history" replace />}
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route path="/movies/:id" element={<LegacyMoviesRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
