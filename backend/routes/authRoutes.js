// backend/routes/authRoutes.js

const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const upload = require("../middleware/upload");

// ==========================
// Register User
// ==========================

router.post(
    "/register",
    upload.single("profileImage"),
    authController.register
);

// ==========================
// Login User
// ==========================

router.post(
    "/login",
    authController.login
);

module.exports = router;