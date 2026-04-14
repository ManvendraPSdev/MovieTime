import React from "react";
import { AuthProvider } from "./features/auth/auth.context";
import { MovieContextProvider } from "./features/movie/movie.context";
import { WatchHistoryContextProvider } from "./features/watchHistory/watchHistory.context";
import { FavContextProvider } from "./features/favorite/fav.context";
import { AdminContextProvider } from "./features/admin/admin.context";
import { ThemeProvider } from "./layout/ThemeContext";
import { ToastProvider } from "./layout/ToastContext";
import { AppRoutes } from "./AppRoutes";

const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <MovieContextProvider>
            <WatchHistoryContextProvider>
              <FavContextProvider>
                <AdminContextProvider>
                  <AppRoutes />
                </AdminContextProvider>
              </FavContextProvider>
            </WatchHistoryContextProvider>
          </MovieContextProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
