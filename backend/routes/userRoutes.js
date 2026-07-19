// backend/routes/userRoutes.js

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
    getProfile,
    updateProfile,
    getUserById,
    getAllUsers,
    deleteUser
} = require("../controllers/userController");

// ==========================
// Get Logged-in User Profile
// ==========================
router.get(
    "/profile",
    auth,
    getProfile
);

// ==========================
// Update Profile
// ==========================
router.put(
    "/profile",
    auth,
    upload.single("profileImage"),
    updateProfile
);

// ==========================
// Get All Users
// ==========================
router.get(
    "/",
    auth,
    getAllUsers
);

// ==========================
// Get User By ID
// ==========================
router.get(
    "/:id",
    auth,
    getUserById
);

// ==========================
// Delete User Account
// ==========================
router.delete(
    "/",
    auth,
    deleteUser
);

module.exports = router;