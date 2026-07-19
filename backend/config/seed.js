// backend/config/seed.js

const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Follow = require("../models/Follow");
const bcrypt = require("bcryptjs");

const seedDB = async () => {
    try {
        // Only seed if database is empty
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log("ℹ️ Database already has data. Skipping seed.");
            return;
        }

        console.log("🌱 Seeding database...");

        // Hash password
        const hashedPassword = await bcrypt.hash("password123", 10);

        // 1. Create Users
        const users = [
            {
                name: "Rahul Sharma",
                username: "rahul",
                email: "rahul@example.com",
                password: hashedPassword,
                bio: "Enjoying life's adventures. ✈️",
                profileImage: "1721456789123-profile.jpg"
            },
            {
                name: "Priya Singh",
                username: "priya",
                email: "priya@example.com",
                password: hashedPassword,
                bio: "Nature enthusiast & photographer 📸",
                profileImage: "1721456790456-user.png"
            },
            {
                name: "Jane Doe",
                username: "janedoe",
                email: "jane@example.com",
                password: hashedPassword,
                bio: "Software developer building modern web apps. 💻",
                profileImage: "1721456801234-avatar.webp"
            },
            {
                name: "Arjun Patel",
                username: "arjun",
                email: "arjun@example.com",
                password: hashedPassword,
                bio: "Foodie. Pizza is life. 🍕",
                profileImage: "default.png"
            }
        ];

        const createdUsers = await User.create(users);
        const [rahul, priya, jane, arjun] = createdUsers;

        console.log(`✅ Created ${createdUsers.length} seed users.`);

        // 2. Set up follows
        const follows = [
            { follower: rahul._id, following: priya._id },
            { follower: rahul._id, following: jane._id },
            { follower: priya._id, following: rahul._id },
            { follower: priya._id, following: jane._id },
            { follower: jane._id, following: rahul._id },
            { follower: jane._id, following: priya._id },
            { follower: jane._id, following: arjun._id },
            { follower: arjun._id, following: jane._id }
        ];

        await Follow.create(follows);

        // Update User models with follower/following arrays
        await User.findByIdAndUpdate(rahul._id, { $addToSet: { following: [priya._id, jane._id], followers: [priya._id, jane._id] } });
        await User.findByIdAndUpdate(priya._id, { $addToSet: { following: [rahul._id, jane._id], followers: [rahul._id, jane._id] } });
        await User.findByIdAndUpdate(jane._id, { $addToSet: { following: [rahul._id, priya._id, arjun._id], followers: [rahul._id, priya._id, arjun._id] } });
        await User.findByIdAndUpdate(arjun._id, { $addToSet: { following: [jane._id], followers: [jane._id] } });

        console.log("✅ Set up seed follower relationships.");

        // 3. Create Posts
        const posts = [
            {
                user: rahul._id,
                caption: "Enjoying a wonderful vacation with friends! 🌴🌅",
                image: "1721456901234-post1.jpg",
                likes: [priya._id, jane._id]
            },
            {
                user: priya._id,
                caption: "Nature always gives peace and happiness. 🌿💚",
                image: "1721456915678-post2.png",
                likes: [rahul._id, jane._id, arjun._id]
            },
            {
                user: jane._id,
                caption: "Learning Full Stack Development! Express, Node and Mongo in action. 💻🚀",
                image: "1721456929012-photo.webp",
                likes: [rahul._id, priya._id]
            },
            {
                user: arjun._id,
                caption: "Delicious weekend lunch! Best pizza in town. 🍕🍕",
                image: "1721456934567-image.jpg",
                likes: [jane._id]
            }
        ];

        const createdPosts = await Post.create(posts);
        const [post1, post2, post3, post4] = createdPosts;

        console.log(`✅ Created ${createdPosts.length} seed posts.`);

        // 4. Create Comments
        const comments = [
            {
                post: post1._id,
                user: priya._id,
                comment: "Amazing picture! ❤️ Have a safe trip!"
            },
            {
                post: post1._id,
                user: jane._id,
                comment: "Looks beautiful! Where is this?"
            },
            {
                post: post2._id,
                user: rahul._id,
                comment: "Beautiful place! I need to visit this."
            },
            {
                post: post3._id,
                user: arjun._id,
                comment: "Great work! Let's code together!"
            },
            {
                post: post4._id,
                user: jane._id,
                comment: "Yum! That looks mouth-watering!"
            }
        ];

        const createdComments = await Comment.create(comments);

        // Add comments references to Post models
        await Post.findByIdAndUpdate(post1._id, { $push: { comments: { $each: [createdComments[0]._id, createdComments[1]._id] } } });
        await Post.findByIdAndUpdate(post2._id, { $push: { comments: createdComments[2]._id } });
        await Post.findByIdAndUpdate(post3._id, { $push: { comments: createdComments[3]._id } });
        await Post.findByIdAndUpdate(post4._id, { $push: { comments: createdComments[4]._id } });

        console.log("✅ Seed comments successfully added.");
        console.log("🌱 Database seeding completed successfully!");

    } catch (error) {
        console.error("❌ Database seeding failed:", error);
    }
};

module.exports = seedDB;
