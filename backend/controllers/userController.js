// backend/controllers/userController.js

const User = require("../models/User");
const Post = require("../models/Post");

// Get Logged-in User Profile

exports.getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const totalPosts = await Post.countDocuments({
            user: req.user.id
        });

        res.status(200).json({

            ...user._doc,

            posts: totalPosts

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// Update Profile

exports.updateProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;

        if (req.file) {
            user.profileImage = req.file.filename;
        }

        await user.save();

        res.status(200).json({

            message: "Profile updated successfully",

            user

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// Get User By ID

exports.getUserById = async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        const totalPosts = await Post.countDocuments({
            user: user._id
        });

        res.status(200).json({

            ...user._doc,

            posts: totalPosts

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// Get All Users

exports.getAllUsers = async (req, res) => {

    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json(users);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// Delete User

exports.deleteUser = async (req, res) => {

    try {

        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        await Post.deleteMany({
            user: req.user.id
        });

        await User.findByIdAndDelete(req.user.id);

        res.status(200).json({
            message: "Account deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};