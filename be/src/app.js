import errorHandeler from "./middlewares/errorHandeler.middleware.js"

import cookieParser from "cookie-parser";
import express from "express";

import authRouter  from "./routes/auth.routes.js";
import { adminRouter } from "./routes/admin.routes.js";
import { movieRouter } from "./routes/movie.routes.js";
import { favRouter } from "./routes/favorite.routes.js";
import { watchHistoryRouter } from "./routes/watchHistory.routes.js";

const app = express() ; 
app.use(express.json()) ; 
app.use(cookieParser()) ; 

app.use("/api/auth" , authRouter) ; 
app.use("/api/admin" , adminRouter) ; 
app.use("/api/movie" , movieRouter) ; 
app.use("/api/fav" , favRouter) ; 
app.use("/api/watchHistory" , watchHistoryRouter) ; 

app.use(errorHandeler) ; 

export default app ; 