// backend/routes/postRoutes.js

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost
} = require("../controllers/postController");

// ==========================
// Get All Posts
// ==========================
router.get("/", getPosts);

// ==========================
// Get Single Post
// ==========================
router.get("/:id", auth, getPostById);

// ==========================
// Create New Post
// ==========================
router.post(
    "/",
    auth,
    upload.single("image"),
    createPost
);

// ==========================
// Update Post
// ==========================
router.put(
    "/:id",
    auth,
    upload.single("image"),
    updatePost
);

// ==========================
// Delete Post
// ==========================
router.delete(
    "/:id",
    auth,
    deletePost
);

// ==========================
// Like / Unlike Post
// ==========================
router.post(
    "/like/:id",
    auth,
    likePost
);

module.exports = router;