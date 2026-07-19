// backend/routes/commentRoutes.js

const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const {
    addComment,
    getComments,
    updateComment,
    deleteComment
} = require("../controllers/commentController");

// ==========================
// Add Comment
// POST /api/comments/:postId
// ==========================
router.post(
    "/:postId",
    auth,
    addComment
);

// ==========================
// Get Comments of a Post
// GET /api/comments/:postId
// ==========================
router.get(
    "/:postId",
    auth,
    getComments
);

// ==========================
// Update Comment
// PUT /api/comments/:id
// ==========================
router.put(
    "/:id",
    auth,
    updateComment
);

// ==========================
// Delete Comment
// DELETE /api/comments/:id
// ==========================
router.delete(
    "/:id",
    auth,
    deleteComment
);

module.exports = router;