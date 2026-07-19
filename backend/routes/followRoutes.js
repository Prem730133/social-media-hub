// backend/routes/followRoutes.js

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
} = require("../controllers/followController");

// ==========================
// Follow User
// POST /api/follow/:id
// ==========================
router.post(
    "/:id",
    auth,
    followUser
);

// ==========================
// Unfollow User
// DELETE /api/follow/:id
// ==========================
router.delete(
    "/:id",
    auth,
    unfollowUser
);

// ==========================
// Get Followers
// GET /api/follow/followers/:id
// ==========================
router.get(
    "/followers/:id",
    auth,
    getFollowers
);

// ==========================
// Get Following
// GET /api/follow/following/:id
// ==========================
router.get(
    "/following/:id",
    auth,
    getFollowing
);

module.exports = router;