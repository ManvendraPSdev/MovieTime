import express from "express" 
import { addFavMovie, getFavMovie, getFavMovieBytmdbId, removeFavorite } from "../controllers/favorite.controllers.js";
import validate from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { addFavorite, tmdbIdParam, typeQuery } from "../validators/favorite.validators.js";

export const favRouter = express.Router() ; 

favRouter.use(authenticate)

favRouter.post("/" , addFavorite , validate , addFavMovie) ; 
favRouter.get("/" , getFavMovie) ; 
favRouter.get("/tmdb/:tmdbId" , [tmdbIdParam] , typeQuery , validate , getFavMovieBytmdbId) ;
favRouter.delete("/:tmdbId" , [tmdbIdParam] , typeQuery , validate , removeFavorite) ; 
