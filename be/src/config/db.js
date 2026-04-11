import mongoose from "mongoose";

const connectToDB = async ()=>{
    await mongoose.connect(process.env.MONGO_URI) ; 
    console.log("connect to db") ; 
}
export default connectToDB ; 