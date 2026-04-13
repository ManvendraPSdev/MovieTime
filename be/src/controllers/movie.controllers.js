import { movieModel } from "../models/movie.model.js";
import asyncHandler from "../utils/asyncHandler.js";


function normalizeGenres(movie){
    const doc = movie && movie.toObject ? movie.toObject() : {...movie} ; 
    if((!doc.genres || doc.genres.length === 0) && doc.genre){
        doc.genre = [doc.genre] ; 
    }
    return doc
}


/**
 * @desc Get all the movies (admin added custom movies) category , q (search title/description) , page , limit 
 * @path GET /api/movie/
 * @access Public
 */
const getMovies = asyncHandler(async (req , res)=>{
    const {category , q , page=1 , limit=20} = req.query ; 
    const query = {} ; 
    if(category) query.category = category ; 
    //searching and filtering 
    if(q && String(q).trim()){
        const search = String(q).trim ; 
        query.$or = [
            {title : {$regex : search , $options : "i"}} , 
            {description : {$regex : search , $options : "i"}}
        ]
    }

    const limitNum = Math.min(Number(limit) || 20 , 100) ; 
    const skip = (Number(page)-1)*limitNum  ;

    const [rawMovies , total] = await Promise.all([
        movieModel.find(query).sort({createdAt : -1}).skip(skip).limit(limitNum).lean() , 
        movieModel.countDocuments(query)
    ])

    const movies = rawMovies.map(normalizeGenres) ; 
    return res.status(200).json({movies , total , page: Number(page), totalPages: Math.ceil(total / limitNum) })

})

/**
 * @desc Get single movie by Id 
 * @path GET /api/movie/:id
 * @access Public
 */
const getMovieById = asyncHandler(async (req ,res)=>{
    const movieId = req.params.id ; 
    const movie = await movieModel.findById(movieId) ; 
    if(!movie){
        return res.status(404).json({message : "movie not found !!"})
    }
    return res.status(200).json(normalizeGenres(movie)) ; 
})

/**
 * @desc Get movie by TMDB ID (for frontend to merge with TMDB data)
 * @route GET /api/movies/tmdb/:tmdbId
 * @access Public
 */
const getMovieByTmdbId = asyncHandler(async (req, res)=>{
    const movie = await movieModel.findOne({ tmdbId: String(req.params.tmdbId) });
    if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json(normalizeGenres(movie));
});

/**
 * @desc Create movie (Admin only)
 * @path POST /api/movie/
 * @access Private Admin
 */
const createMovie = asyncHandler(async(req , res)=>{
    const {title,poster,description,tmdbId,releaseDate,trailer,genre,genres,banner,runtime,category} = req.body   ; 

    if(!title || !category){
        return res.status(400).json({message : "title and category are required !"})
    }

    const trimmedTmdbId = tmdbId != null ? String(tmdbId).trim() : "" ; 
    const finalTmdbId = trimmedTmdbId || `custom-${Date.now()}-${Math.random().toString(36).slice(2,9)}` ; 
    const genresArr = Array.isArray(genres) ? genres.filter((g)=> g!= null && String(g).trim()) : [] ; 
    const singleGenere = genre != null ? String(genre).trim() : "" ; 
    const finalGeneres = genresArr.length > 0 ? genresArr : (singleGenere ? [singleGenere] : []) ; 
    const runtimeNum = runtime != null && runtime !== "" ? Number(runtime) : null ; 
    
    const movie = await movieModel.create({
        title , 
        poster : poster || "" ,
        description : description || "" , 
        tmdbId : finalTmdbId , 
        releaseDate : releaseDate || "", 
        trailer : trailer || "" , 
        genre : finalGeneres[0] || "" , 
        genres : finalGeneres , 
        banner : banner || "" ,
        runtime : Number.isFinite(runtime) ? runtimeNum : "" , 
        category : category
    }) ; 

    return res.status(200).json({
        message : "movie created sucessfully" , 
        movie : normalizeGenres(movie) 
    })
})

/**
 * @desc Update movie (Admin only)
 * @path PUT /api/movie/:id
 * @access Private Admin
 */
const updateMovie = asyncHandler(async (req , res)=>{
    const {title , poster , description , tmdbId , releaseDate , trailer , genre , genres , banner , runtime , category} = req.body ; 

    const singleGenere = genre != null ? String(genre).trim : undefined ; 
    const genresArr = Array.isArray(genres) ? filter((g)=> g!=null && String(g).trim()) : undefined ; 
    const finalGeneres = genresArr !== undefined ? (genresArr.length > 0 ? genresArr : (singleGenere ? [singleGenere] : [])) : undefined ; 

    const runtimeNum = runtime != null && runtime !== "" ? Number(runtime) : null ; 

    const update = {} ; 

    if(title !== undefined) update.title = title ; 
    if(poster !== undefined) update.poster = poster || "" ; 
    if(description !== undefined) update.description = description || "" ; 
    if(tmdbId !== undefined) update.tmdbId = tmdbId ;
    if(releaseDate !== undefined) update.releaseDate = releaseDate || ""; 
    if(trailer !== undefined) update.trailer = trailer || "" ;
    if(banner !== undefined) update.banner = banner || "" ; 
    if(category !== undefined) update.category = category
    if(finalGeneres != undefined) 
        update.genres = finalGeneres ;
        update.genre = finalGeneres[0] || "" ; 
    if(runtime != undefined) update.runtime = Number.isFinite(runtimeNum) ? runtimeNum : null ; 

    const movieId = req.params.id ; 

    const movie = await movieModel.findByIdAndUpdate(movieId , update ,{ new :true , runValidators : true} )
    if(!movie){
        return res.status(404).json({
            message : "Movie not found !"
        })
    }
    return res.status(200).json({
        message : "movie updated sucessfully" , 
        movie : normalizeGenres(movie)
    })
})

/**
 * @desc Delete movie (Admin only)
 * @path DELETE /api/movie/:id
 * @access Private Admin 
 */
const deleteMovie = asyncHandler(async (req , res)=>{
    const movieId = req.params.id ; 
    const movie = await movieModel.findByIdAndDelete(movieId) ; 
    if(!movie){
        return res.status(404).json({
            message : "movie not found"
        })
    }
    return res.status(200).json({
        message : "movie deleted sucessfully !"
    })
})

export {getMovies , getMovieById , getMovieByTmdbId , createMovie , updateMovie , deleteMovie} ; 