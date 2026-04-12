import express from "express" ; 
import { getUsers , banUser , unbanUser , deleteUser } from "../controllers/admin.controllers.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import userIdParams from "../validators/admin.validators.js";

export const adminRouter = express.Router()  ;

adminRouter.use(authenticate , authorize(["admin"])) ;

adminRouter.get("/users" , getUsers) ; 
adminRouter.patch("/users/:id/ban" , [userIdParams] , validate , banUser) ; 
adminRouter.patch("/users/:id/unban" , [userIdParams] , validate , unbanUser) ; 
adminRouter.delete("/users/:id" , [userIdParams] , validate , deleteUser)