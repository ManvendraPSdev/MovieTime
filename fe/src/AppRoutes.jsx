import { BrowserRouter , Route , Routes } from "react-router";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";

export function AppRoutes(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/register" element={<Register/>} />
            <Route path="/login" element={<Login/>} />
        </Routes>
        </BrowserRouter>
    )
}