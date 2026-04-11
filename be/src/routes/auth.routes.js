import express from "express" ; 
import authControllers from "../controllers/auth.controllers.js";

const authRouter = express.Router() ; 

authRouter.post("/register" , authControllers.register) ; 
authRouter.post("/login" , authControllers.login) ; 
authRouter.post("/logout" , authControllers.logout) ; 
authRouter.get("/getMe" , authControllers.getMe) ; 

export default authRouter ; 