// controllers/authController.js
import User from "../models/User.js";
import { generateToken, getUserDetails } from "../helpers/JwtHelper.js";


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            active:true
        });

        await user.save();

        res.status(201).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token: generateToken(user),
        });
    } catch (err) {
        console.error("Register Error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// @desc Login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        const user = await User.findOne({ email });
        // If no user found
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        if (!user.active) {
            return res.status(403).json({ message: "Your account is Inactive" });
        }
        if (user && (await user.matchPassword(password))) {
            res.json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token: generateToken(user),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


// @desc Get user by ID
export const getUserById = async (req, res) => {
    try {
        const { _id, name,  email} = req.user; 
        res.status(201).json({
            id:_id,
            name:name,
            email:email,
        });
    } catch (err) {
        console.error("Get User By ID Error:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};