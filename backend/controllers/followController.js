// backend/controllers/followController.js

const User = require("../models/User");
const Follow = require("../models/Follow");

// =========================
// Follow User
// =========================

exports.followUser = async (req, res) => {

    try {

        const followerId = req.user.id;
        const followingId = req.params.id;

        if (followerId === followingId) {
            return res.status(400).json({
                message: "You cannot follow yourself."
            });
        }

        const user = await User.findById(followingId);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const exists = await Follow.findOne({
            follower: followerId,
            following: followingId
        });

        if (exists) {
            return res.status(400).json({
                message: "Already following this user."
            });
        }

        await Follow.create({
            follower: followerId,
            following: followingId
        });

        await User.findByIdAndUpdate(followerId, {
            $addToSet: {
                following: followingId
            }
        });

        await User.findByIdAndUpdate(followingId, {
            $addToSet: {
                followers: followerId
            }
        });

        res.status(200).json({
            message: "User followed successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// =========================
// Unfollow User
// =========================

exports.unfollowUser = async (req, res) => {

    try {

        const followerId = req.user.id;
        const followingId = req.params.id;

        await Follow.findOneAndDelete({
            follower: followerId,
            following: followingId
        });

        await User.findByIdAndUpdate(followerId, {
            $pull: {
                following: followingId
            }
        });

        await User.findByIdAndUpdate(followingId, {
            $pull: {
                followers: followerId
            }
        });

        res.status(200).json({
            message: "User unfollowed successfully."
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// =========================
// Get Followers
// =========================

exports.getFollowers = async (req, res) => {

    try {

        const followers = await Follow.find({
            following: req.params.id
        }).populate(
            "follower",
            "name username profileImage bio"
        );

        res.status(200).json(followers);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};

// =========================
// Get Following
// =========================

exports.getFollowing = async (req, res) => {

    try {

        const following = await Follow.find({
            follower: req.params.id
        }).populate(
            "following",
            "name username profileImage bio"
        );

        res.status(200).json(following);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};