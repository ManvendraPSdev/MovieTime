import jwt from "jsonwebtoken"
import blackListModel from "../models/blackList.model.js";

async function authUser(req , res , next){

    const token = req.cookies.token ; 

    if(!token){
        return res.status(401).json({
            message : "Unauthorised acess !"
        })
    }

    const isTokenBlacklisted = await blackListModel.findOne({token}) ; 

    if(isTokenBlacklisted){
        return res.status(401).json({
            message : "Unauthorised acess !"
        })
    }

    let decoded = null ; 

    try {

        decoded = jwt.verify(token , process.env.JWT_SECRET) ; 
        req.user = decoded ; 
        next()  ;
        
    } catch (error) {
        console.log(error.message) ; 
        return res.status(401).json({
            message : "Invalid token"
        })
    }
}

export default authUser ; 