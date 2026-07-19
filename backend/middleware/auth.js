// backend/middleware/auth.js

const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {

    try {

        // Get Authorization Header
        const authHeader = req.header("Authorization");

        if (!authHeader) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        // Extract Token
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        if (!token) {
            return res.status(401).json({
                message: "Invalid token."
            });
        }

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Store User ID
        req.user = {
            id: decoded.id
        };

        next();

    } catch (error) {

        console.error(error);

        return res.status(401).json({
            message: "Unauthorized. Token is invalid or expired."
        });

    }

};

module.exports = auth;