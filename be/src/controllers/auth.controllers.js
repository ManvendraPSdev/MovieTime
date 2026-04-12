import express from "express";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import blackListModel from "../models/blackList.model.js";
import banModel from "../models/bannedUser.model.js";

// REGISTER
async function register(req, res) {
    try {
        const { userName, email, password } = req.body;

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ email }, { userName }]
        });

        if (isUserAlreadyExists) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            userName,
            email,
            password: hash
        });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const cookieOptions = {
            httpOnly : true , 
            secure : process.env.NODE_ENV === "production" ,
            sameSite : process.env.NODE_ENV==="production" ? "none" : "lax" ,
            maxAge : 7 * 24 * 60 * 60 * 1000,
        }

        res.cookie("token", token, cookieOptions);

        return res.status(201).json({
            message: "User created successfully!",
            user ,
            token
        });

    } catch (error) {
        return res.status(500).json({
            message: "Registration failed"
        });
    }
}

// LOGIN
async function login(req, res) {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            });
        }

        const isUserBanned = await banModel.findOne({email}) ; 

        if(isUserBanned){
            return res.status(403).json({
                message : "Accound is banned"
            })
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id, email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const cookieOptions = {
            httpOnly : true , 
            secure : process.env.NODE_ENV === "production" , 
            sameSite : process.env.NODE_ENV === "production" ? "none" : "lax" ,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }

        res.cookie("token", token, cookieOptions);

        const userWithoutPassword = await userModel.findById(user._id) ; 


        return res.status(200).json({
            message: "User logged in successfully",
            user : userWithoutPassword , 
            token
        });
}

// LOGOUT
async function logout(req, res) {
        const token = req.cookies.token;

        if (token) {
            await blackListModel.create({ token });
        }

        const clearOptions = {httpOnly : true}

        if(process.env.NODE_ENV==="production"){
            clearOptions.secure = true , 
            clearOptions.sameSite = "none"
        }

        res.clearCookie("token" , clearOptions);

        return res.status(200).json({
            message: "User logged out successfully!"
        });
}

// GET ME
async function getMe(req, res) {

    const user = await userModel.findById(req.user.id)

    console.log(user) ; 
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({
        message: "User details fetched successfully",
        user
    })

}

export default { register, login, logout, getMe };