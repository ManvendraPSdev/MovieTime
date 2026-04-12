import {validationResult} from "express-validator" ; 

/**
 * Middleware that uses express-validator validationResult(req) to collect errors 
 * from the validation chain and respond with 400 if any failed 
 */

const validate = (req , res , next)=>{

    const result = validationResult(req) ; 

    if(result.isEmpty()){
        return next() ; 
    }

    const extracted = result.array().map((err)=>({
        field : err.path || err.param , 
        message : err.message
    }))

    return res.status(400).json({
        message : "validation failed" , 
        error : extracted
    })
}

export default validate ; 