// backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load Environment Variables
dotenv.config();

// Database Connection
const connectDB = require("./config/db");
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Images
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const followRoutes = require("./routes/followRoutes");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/follow", followRoutes);

// Home Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "🚀 Social Media Platform API is Running Successfully!"
    });
});

// 404 Route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found"
    });
});

// Global Error Handler
app.use((err, req, res, next) => {

    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });

});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log("======================================");
    console.log("🚀 Social Media Server Started");
    console.log(`🌐 URL : http://localhost:${PORT}`);
    console.log("📦 MongoDB Connected");
    console.log("======================================");

});