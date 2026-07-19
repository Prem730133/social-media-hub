// backend/controllers/commentController.js

const Comment = require("../models/Comment");
const Post = require("../models/Post");

// =========================
// Add Comment
// =========================

exports.addComment = async (req, res) => {

    try {

        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({
                message: "Comment is required"
            });
        }

        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const newComment = await Comment.create({

            post: post._id,

            user: req.user.id,

            comment

        });

        post.comments.push(newComment._id);

        await post.save();

        const result = await Comment.findById(newComment._id)
            .populate("user", "name username profileImage");

        res.status(201).json({

            message: "Comment added successfully",

            comment: result

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// =========================
// Get Comments
// =========================

exports.getComments = async (req, res) => {

    try {

        const comments = await Comment.find({

            post: req.params.postId

        })

        .populate("user", "name username profileImage")

        .sort({

            createdAt: -1

        });

        res.status(200).json(comments);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// =========================
// Update Comment
// =========================

exports.updateComment = async (req, res) => {

    try {

        const comment = await Comment.findById(req.params.id);

        if (!comment) {

            return res.status(404).json({

                message: "Comment not found"

            });

        }

        if (comment.user.toString() !== req.user.id) {

            return res.status(403).json({

                message: "Unauthorized"

            });

        }

        comment.comment = req.body.comment || comment.comment;

        await comment.save();

        res.status(200).json({

            message: "Comment updated successfully",

            comment

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};

// =========================
// Delete Comment
// =========================

exports.deleteComment = async (req, res) => {

    try {

        const comment = await Comment.findById(req.params.id);

        if (!comment) {

            return res.status(404).json({

                message: "Comment not found"

            });

        }

        if (comment.user.toString() !== req.user.id) {

            return res.status(403).json({

                message: "Unauthorized"

            });

        }

        await Post.findByIdAndUpdate(

            comment.post,

            {

                $pull: {

                    comments: comment._id

                }

            }

        );

        await Comment.findByIdAndDelete(comment._id);

        res.status(200).json({

            message: "Comment deleted successfully"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server Error"

        });

    }

};