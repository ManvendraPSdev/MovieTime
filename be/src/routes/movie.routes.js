import express from "express" ; 
import { createMovie, deleteMovie, getMovieById, getMovieByTmdbId, getMovies, updateMovie } from "../controllers/movie.controllers.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createMovieValidator, getOrDeleteById, tmdbIdParam, updateMovieValidator } from "../validators/movie.validators.js";

export const movieRouter = express.Router() ; 

movieRouter.get("/" , getMovies) ; 
movieRouter.get("/:id" , getOrDeleteById , validate , getMovieById) ;
movieRouter.get("/tmdb/:id" , [tmdbIdParam] , validate , getMovieByTmdbId) 

movieRouter.post("/" , authenticate, authorize(["admin"]) , createMovieValidator , validate , createMovie) ; 
movieRouter.put("/:id" , authenticate , authorize(["admin"]) , updateMovieValidator , validate , updateMovie) ; 
movieRouter.delete("/:id" , authenticate , authorize(["admin"]) , getOrDeleteById , validate , deleteMovie) ; 
