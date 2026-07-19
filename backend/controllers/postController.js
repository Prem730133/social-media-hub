// backend/controllers/postController.js

const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

// ==========================
// Create Post
// ==========================

exports.createPost = async (req, res) => {

    try {

        const { caption } = req.body;

        const image = req.file ? req.file.filename : "";

        const post = await Post.create({

            user: req.user.id,
            caption,
            image

        });

        res.status(201).json({

            message: "Post created successfully",

            post

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ==========================
// Get All Posts
// ==========================

exports.getPosts = async (req, res) => {

    try {

        const posts = await Post.find()

            .populate("user", "name username profileImage")

            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "name profileImage"
                }
            })

            .sort({
                createdAt: -1
            });

        res.status(200).json(posts);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ==========================
// Get Single Post
// ==========================

exports.getPostById = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id)

            .populate("user", "name username profileImage")

            .populate({
                path: "comments",
                populate: {
                    path: "user",
                    select: "name profileImage"
                }
            });

        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });

        }

        res.json(post);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ==========================
// Update Post
// ==========================

exports.updatePost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });

        }

        if (post.user.toString() !== req.user.id) {

            return res.status(403).json({
                message: "Unauthorized"
            });

        }

        post.caption = req.body.caption || post.caption;

        if (req.file) {

            post.image = req.file.filename;

        }

        await post.save();

        res.json({

            message: "Post updated successfully",

            post

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ==========================
// Delete Post
// ==========================

exports.deletePost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });

        }

        if (post.user.toString() !== req.user.id) {

            return res.status(403).json({
                message: "Unauthorized"
            });

        }

        await Comment.deleteMany({
            post: post._id
        });

        await Post.findByIdAndDelete(post._id);

        res.json({
            message: "Post deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// ==========================
// Like / Unlike Post
// ==========================

exports.likePost = async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        if (!post) {

            return res.status(404).json({
                message: "Post not found"
            });

        }

        const alreadyLiked = post.likes.includes(req.user.id);

        if (alreadyLiked) {

            post.likes = post.likes.filter(
                id => id.toString() !== req.user.id
            );

            await post.save();

            return res.json({
                message: "Post unliked"
            });

        }

        post.likes.push(req.user.id);

        await post.save();

        res.json({
            message: "Post liked"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};