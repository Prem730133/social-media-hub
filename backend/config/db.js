// backend/config/db.js

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI;

        if (process.env.USE_MEMORY_DB === "true") {
            console.log("ℹ️ Starting MongoDB Memory Server...");
            const { MongoMemoryServer } = require("mongodb-memory-server");
            const mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            console.log(`ℹ️ MongoDB Memory Server started at: ${uri}`);
        }

        const conn = await mongoose.connect(uri);

        console.log("✅ MongoDB Connected");
        console.log(`Host: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);

        // Seed database with mock data
        const seedDB = require("./seed");
        await seedDB();

    } catch (error) {
        console.error("❌ MongoDB Connection Failed");
        console.error(error.message);

        // If local connection refused, fallback to MongoMemoryServer in development mode
        if (process.env.NODE_ENV === "development" && process.env.USE_MEMORY_DB !== "true") {
            console.log("ℹ️ Local MongoDB connection failed. Attempting MongoDB Memory Server fallback...");
            process.env.USE_MEMORY_DB = "true";
            return connectDB();
        }

        process.exit(1);
    }
};

module.exports = connectDB;