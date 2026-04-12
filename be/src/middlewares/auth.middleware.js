import jwt from "jsonwebtoken"
import blackListModel from "../models/blackList.model.js";
import asyncHandler from "../utils/asyncHandler.js";

async function authenticate(req , res , next){

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

const authorize = (roles) => {
    return asyncHandler(async (req, res, next) => {
        const isAdmin = req.user && req.user.isAdmin === true;
        if (roles.includes("admin") && !isAdmin) {
            return res.status(403).json({ message: "Forbidden: admin access required" });
        }
        next();
    });
};

export {authenticate , authorize} ; 