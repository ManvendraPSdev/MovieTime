import watchHistoryModel from "../models/movieHistory.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const addWatchHistory = asyncHandler(async(req , res)=>{
    const {tmdbId , type , title , poster , overview} = req.body ; 
    if(!tmdbId || !title){
        return res.status(400).json({
            message : "tmdbId and title is required !!"
        })
    } 
    const userId = req.user.id ; 

    const entry = await watchHistoryModel.create({
        user : userId , 
        tmdbId : String(tmdbId) , 
        type : type === "tv" ? "tv" : "movie" , 
        title , 
        poster , 
        overview , 
        watchedAt : new Date()
    })

    return res.status(200).json({
        message : "Added to watch history" , 
        entry
    })

})

const getWatchHistory = asyncHandler(async(req , res)=>{
    const {limit = 50} = req.query  

    const history = await watchHistoryModel.find({
        user : req.user.id
    }).sort({watchedAt : -1}).limit(Number(limit)) ; 

    return res.status(200).json({
        message : "watchedHistory fetch sucessfully" , 
        history
    })
})

const clearWatchHistory = asyncHandler(async(req , res)=>{
    await watchHistoryModel.deleteMany({user : req.user.id}) ; 
    return res.status(200).json({message : "history cleared sucessfully"}) ; 
})

export {addWatchHistory , getWatchHistory , clearWatchHistory} ; 