import favMovieModel from "../models/favorite.model.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc Adding movie in favorite movie collection
 * @path POST /api/fav
 * @access Private User
 */
const addFavMovie = asyncHandler(async(req , res)=>{
    const {tmdbId, mediaType, title , posterPath , overView} = req.body ; 
    if(!tmdbId){
        return res.status(404).json({
            message : "tmdbId is required !"
        })
    }

    const existing = await favMovieModel.findOne({user : req.user.id , tmdbId : String(tmdbId), mediaType}) ; 
    if(existing){
        return res.status(200).json({
            message : "User Already exisist in the DB !"
        })
    } ; 

    const favMovie = await favMovieModel.create({
        user : req.user.id , 
        tmdbId : String(tmdbId) , 
        mediaType : mediaType === "movie" ? "movie" : "tv", 
        title , 
        posterPath , 
        overView
    })

    return res.status(200).json({
        message : "movie added to favorite" , 
        favMovie
    })
})

/**
 * @desc Fetching all the movies in favorite collection
 * @path GET /api/fav/
 * @access Private User
 */
const getFavMovie = asyncHandler(async(req , res)=>{
    const favMovies = await favMovieModel.find({user : req.user.id}).sort({createdAt : -1}) ; 
    res.status(201).json({
        message: "movies fetched sucessfully" , 
        favMovies
    })
})

/**
 * @desc Fetching fav movie specified by tmdbId
 * @path GET /api/fav/tmdb/:tmdbId
 * @acess Private User
 */
const getFavMovieBytmdbId = asyncHandler(async(req , res)=>{
    const {type = "movie"} = req.query ; 
    const userId = req.user.id ; 
    const tmdbId = req.params.tmdbId ; 
    const fav = await favMovieModel.findOne({
        user:userId , 
        tmdbId : String(tmdbId) ,
        mediaType : type === "tv" ? "tv" : "movie"
    })
    return res.status(200).json({ isFavorite: !!fav });
})

/**
 * @desc Removing all the movies from Favorite collection 
 * @path DELETE /api/fav/:tmdbId
 * @access Private User
 */
const removeFavorite = asyncHandler(async (req, res) => {
    const { type = "movie" } = req.query;
    const deleted = await favMovieModel.findOneAndDelete({
        user: req.user.id,
        tmdbId: String(req.params.tmdbId),
        mediaType: type === "tv" ? "tv" : "movie",
    });
    if (!deleted) {
        return res.status(404).json({ message: "Favorite not found" });
    }
    res.status(200).json({ message: "Removed from favorites" });
});

export {addFavMovie , getFavMovie , getFavMovieBytmdbId , removeFavorite} ; 