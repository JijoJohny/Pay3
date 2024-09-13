const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const { generateTokenAndSetCookie } = require('../lib/utils/generateToken.js');
const res = require('express/lib/response.js');

const signup = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        generateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg,
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg,
        });
    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
const logout = async(req,res) =>{
    console.log("logout start");
    try {
        res.cookie("jwt", "",{maxAge:0});
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log("Error in Logout controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
const getMe = async(req,res) =>{
    try {
        const user =await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getMe controller",error.message);
        res.status(500).json({ error:"Internal server error"});
    }
}

module.exports = {
    signup,
    login,
    logout,
    getMe
};
