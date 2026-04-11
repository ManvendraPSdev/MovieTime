import mongoose from "mongoose";

const userBannedSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : "users"
    } , 
    reason : {
        type : String , 
        required : true , 
        trim : true , 
    } , 
    bannedAt : {
        type : Data , 
        default : Date.now
    } , 
    bannedBy : {
        type : mongoose.Schema.ObjectId , 
        ref : "users" , 
        required : true
    }
} , {
    timestamps : true
}) ; 

const banModel = mongoose.model("bans" , userBannedSchema) ;  

export default banModel ; 