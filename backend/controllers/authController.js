// backend/controllers/authController.js

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User

exports.register = async (req, res) => {

    try {

        const { name, username, email, password, bio } = req.body;

        // Check required fields
        if (!name || !username || !email || !password) {
            return res.status(400).json({
                message: "All required fields must be filled."
            });
        }

        // Check existing email
        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                message: "Email already exists."
            });
        }

        // Check existing username
        const usernameExists = await User.findOne({ username });

        if (usernameExists) {
            return res.status(400).json({
                message: "Username already exists."
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Profile Image
        let profileImage = "default.png";

        if (req.file) {
            profileImage = req.file.filename;
        }

        // Create User
        const user = await User.create({

            name,
            username,
            email,
            password: hashedPassword,
            bio,
            profileImage

        });

        res.status(201).json({

            message: "User registered successfully.",

            user: {

                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profileImage: user.profileImage

            }

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// Login User

exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                message: "Email and Password are required."
            });

        }

        // Find User
        const user = await User.findOne({ email });

        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password."
            });

        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid email or password."
            });

        }

        // Generate JWT
        const token = jwt.sign(

            {
                id: user._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

        res.status(200).json({

            message: "Login successful.",

            token,

            user: {

                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profileImage: user.profileImage

            }

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};