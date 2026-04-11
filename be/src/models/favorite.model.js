import mongoose from "mongoose";

const favMovieSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        require: [true, "userId is required !"]
    },
    tmbdId: {
        type: String,
        require: [true, "movieId is required !"]
    },
    mediaType: {
        type: String,
        enum: ["movie", "tv"],
        required: true,
    },

    title: {
        type: String,
        required: true,
        trim: true,
    },

    posterPath: {
        type: String,
        default: null, // handle missing poster
    },

    overView : {
        type : String , 
        default : ""
    }
} , {
    timestamps : true
}) ; 

favMovieSchema.index({ userId: 1, movieId: 1 }, { unique: true });

const favMovieModel = mongoose.model("favMovies" , favMovieSchema) ; 

export default favMovieModel ; 
