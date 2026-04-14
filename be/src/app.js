import errorHandeler from "./middlewares/errorHandeler.middleware.js"
import cors from 'cors' ; 
import cookieParser from "cookie-parser";
import express from "express";


import authRouter  from "./routes/auth.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { movieRouter } from "./routes/movie.routes.js";
import { favRouter } from "./routes/favorite.routes.js";
import { watchHistoryRouter } from "./routes/watchHistory.routes.js";

function corsOrigins() {
    const raw = process.env.CORS_ORIGINS;
    if (raw) {
        const list = raw.split(",").map((s) => s.trim()).filter(Boolean);
        if (list.length) return list;
    }
    return ["http://localhost:5173", "http://127.0.0.1:5173"];
}

const app = express() ; 
app.use(express.json()) ; 
app.use(cookieParser()) ; 
const allowed = corsOrigins();
app.use(cors({
    origin: allowed.length === 1 ? allowed[0] : allowed,
    credentials : true
}))

app.use("/api/auth" , authRouter) ; 
app.use("/api/admin" , adminRouter) ; 
app.use("/api/movie" , movieRouter) ; 
app.use("/api/fav" , favRouter) ; 
app.use("/api/watchHistory" , watchHistoryRouter) ; 

app.use(errorHandeler) ; 

export default app ; 