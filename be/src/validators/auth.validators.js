import { body } from "express-validator";

const register = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("userName is required")
        .isLength({min : 2 , max : 100})
        .withMessage("userName must be between 2 and 100 characters") , 
    
    body("email")
        .trim()
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("please provide the valid email")
        .normalizeEmail(),

    body("password")
        .trim()
        .isEmpty()
        .withMessage("password is required")
        .isLength({min:6})
        .withMessage("password must be of atleast 6 characters")
]

const login = [
    body("email")
        .trim()
        .notEmpty() 
        .withMessage("email is required")
        .isEmail()
        .withMessage("Please provide the valid email")
        .normalizeEmail(),
    
    body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required")
]

export {register , login} ; 