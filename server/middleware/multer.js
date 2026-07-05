const multer = require("multer");
const path = require("path");

// Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// File Filter
const fileFilter = (req, file, cb) => {

    const allowedTypes = /jpeg|jpg|png/;

    const extName = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    }

    cb(new Error("Only JPG, JPEG and PNG images are allowed"));
};

// Multer Upload
const upload = multer({

    storage,

    // Maximum file size = 2MB
    limits: {
        fileSize: 2 * 1024 * 1024,
    },

    fileFilter,
});

module.exports = upload;