import express from "express";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import blackListModel from "../models/blackList.model.js";

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

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        return res.status(201).json({
            message: "User created successfully!",
            user: {
                userName: user.userName,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Registration failed"
        });
    }
}

// LOGIN
async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
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

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                userName: user.userName,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Login failed"
        });
    }
}

// LOGOUT
async function logout(req, res) {
    try {
        const token = req.cookies.token;

        if (token) {
            await blackListModel.create({ token });
        }

        res.clearCookie("token");

        return res.status(200).json({
            message: "User logged out successfully!"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Logout failed"
        });
    }
}

// GET ME
async function getMe(req, res) {

    const user = await userModel.findById(req.user.id)

    console.log(user) ; 

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.userName,
            email: user.email
        }
    })

}

export default { register, login, logout, getMe };