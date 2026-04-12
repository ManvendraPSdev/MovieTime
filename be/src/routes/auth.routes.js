import express from "express" ; 
import authControllers from "../controllers/auth.controllers.js";
import {register , login} from "../validators/auth.validators.js" ; 
import {authenticate} from "../middlewares/auth.middleware.js"
import validate from "../middlewares/validate.middleware.js" ;

const authRouter = express.Router() ; 

authRouter.post("/register" , register , validate , authControllers.register) ; 
authRouter.post("/login" , login , validate , authControllers.login) ; 
authRouter.post("/logout" , authControllers.logout) ; 
authRouter.get("/getMe" , authenticate , authControllers.getMe) ; 

export default authRouter ; 