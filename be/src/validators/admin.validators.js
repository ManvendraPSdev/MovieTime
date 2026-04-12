import {param} from "express-validator" ; 

const userIdParams = param("id")
    .isMongoId()
    .withMessage("Invalid user id")

export default userIdParams