import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName : {
        type : String , 
        require : [true , "userName is required"]
    } , 
    email : {
        type : String , 
        require : [true , "email is required"] , 
        unique : [true , "user exists"]
    } , 
    password : {
        type : String , 
        require: [true , "password is required"]
    } , 
    role : {
        type : String , 
        enum : ["user", "admin"] , 
        default : "user"  
    }
} , {
    timestamps : true
})

const userModel = mongoose.model("users" , userSchema) ; 

export default userModel ; 