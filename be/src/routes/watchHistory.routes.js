import express from "express" ; 
import { addWatchHistory, clearWatchHistory, getWatchHistory } from "../controllers/watchHistory.controllers.js" ;
import validate from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { addWatchHistoryValidator, getWatchHistoryValidator } from "../validators/watchHistory.validators.js";

export const watchHistoryRouter = express.Router() ; 

watchHistoryRouter.use(authenticate) ;

watchHistoryRouter.post("/" , addWatchHistoryValidator , validate , addWatchHistory) ; 
watchHistoryRouter.get("/" , getWatchHistoryValidator , validate , getWatchHistory) ; 
watchHistoryRouter.delete("/"  , clearWatchHistory) ; 