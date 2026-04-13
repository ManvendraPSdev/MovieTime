import express from "express" ; 
import { addWatchHistory, clearWatchHistory, getWatchHistory } from "../controllers/watchHistory.controllers";
import validate from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/auth.middleware";

export const watchHistoryRouter = express.Router() ; 

watchHistoryRouter.use(authenticate) ;

watchHistoryRouter.post("/" , validate , addWatchHistory) ; 
watchHistoryRouter.get("/" , validate , getWatchHistory) ; 
watchHistoryRouter.delete("/"  , clearWatchHistory) ; 