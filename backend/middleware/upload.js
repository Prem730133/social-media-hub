// backend/middleware/upload.js

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create upload folders if they don't exist
const profileDir = "uploads/profile-images";
const postDir = "uploads/post-images";

if (!fs.existsSync(profileDir)) {
    fs.mkdirSync(profileDir, { recursive: true });
}

if (!fs.existsSync(postDir)) {
    fs.mkdirSync(postDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        if (file.fieldname === "profileImage") {
            cb(null, profileDir);
        } else if (file.fieldname === "image") {
            cb(null, postDir);
        } else {
            cb(null, "uploads/");
        }

    },

    filename: function (req, file, cb) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

// File Filter
const fileFilter = (req, file, cb) => {

    const allowedTypes = /jpeg|jpg|png|gif|webp/;

    const extName = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {

        return cb(null, true);

    }

    cb(new Error("Only image files are allowed."));

};

// Upload Middleware
const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }

});

module.exports = upload;