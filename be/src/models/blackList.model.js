import mongoose from "mongoose"  ;

const blackListSchema = new mongoose.Schema({
    token : {
        type : String ,
        require : [true , "token is required"] 
    }
} , {
    timestamps : true 
}) ; 

const blackListModel = mongoose.model("blackListTokens" , blackListSchema) ; 

export default blackListModel ; 