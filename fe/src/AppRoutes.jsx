import { BrowserRouter , Route , Routes } from "react-router";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import HomePage from "./features/movie/pages/HomePage";
import BrowsePage from "./features/movie/pages/BrowsePage";
import MovieDetailPage from "./features/movie/pages/MovieDetailPage";
import UserDetailPage from "./features/movie/pages/UserDetailPage";
import WatchHistoryPage from "./features/watchHistory/pages/WatchHistoryPage";
import SearchPage from "./features/search/pages/SearchPage";

export function AppRoutes(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/movies/:id" element={<MovieDetailPage/>} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/user" element={<UserDetailPage />} />
            {/* <Route path="/watch-history" element={<WatchHistoryPage />} /> */}
            <Route path="/watchHistory" element={<WatchHistoryPage />} />
            <Route path="/register" element={<Register/>} />
            <Route path="/login" element={<Login/>} />
        </Routes>
        </BrowserRouter>
    )
}