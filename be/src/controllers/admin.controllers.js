import banModel from "../models/bannedUser.model.js";
import userModel from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc Get all users
 * @route GET /api/admin/users
 * @acess Private/Admin
 */

const getUsers = asyncHandler(async(req , res)=>{

    // this is pagination technique 
    const {page = 1 , limit = 20} = req.query ; 
    const skip = (Number(page)-1)*Number(limit) ; 
    const users = await userModel.find({})
        .sort({createdAt : -1})
        .skip(skip)
        .limit(Number(limit)) ; 

    const total = await userModel.countDocuments() ; 

    return res.status(200).json({
        users , 
        total , 
        page: Number(page), 
        totalPages: Math.ceil(total / Number(limit))
    })
})

/**
 * @desc ban user 
 * @route PATCH /api/admin/users/:id/ban
 * @access Private/Admin
 */
const banUser = asyncHandler(async (req, res) => {

    const userId = req.params.id;
    const { reason } = req.body;

    if (!reason) {
        return res.status(400).json({
            message: "Ban reason is required"
        });
    }

    if (req.user.id === userId) {
        return res.status(400).json({
            message: "You cannot ban yourself"
        });
    }

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({
            message: "User not found!"
        });
    }

    const alreadyBanned = await banModel.findOne({ userId });
    if (alreadyBanned) {
        return res.status(409).json({
            message: "User already banned"
        });
    }

    await banModel.create({
        userId,
        reason,
        bannedBy: req.user.id
    });

    return res.status(201).json({
        message: "User banned successfully"
    });
});

/**
 * @desc unban user (Admin only)
 * @route PATCH /api/admin/users/:id/unban
 * @access Private/Admin
 */
const unbanUser = asyncHandler(async(req , res)=>{
    const userId = req.params.id ; 
    const user = await userModel.findById(userId) ; 
    if(!user){
        return res.status(404).json({
            message : "user not found !" 
        })
    }

    //check if user is banned 
    const bannedUser = await banModel.findOne({userId}) ; 
    if(!bannedUser){
        return res.status(400).json({
            message : "User is not banned !"
        })
    }
    await banModel.deleteOne({userId}) ; 

    return res.status(200).json({
        message : "User unbanned successfully"
    })
})

/**
 * @desc delete user (Admin only)
 * @route DELETE /api/admin/users/:id
 * @access Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    if (req.user.id === userId) {
        return res.status(400).json({
            message: "You cannot delete yourself"
        });
    }

    const user = await userModel.findByIdAndDelete(userId);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    // clean related data
    await banModel.deleteMany({ userId });

    return res.status(200).json({
        message: "User deleted successfully!"
    });
});

export {getUsers , banUser , unbanUser , deleteUser} ; 