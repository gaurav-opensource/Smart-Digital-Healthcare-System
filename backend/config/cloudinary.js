const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");


// Cloudinary configuration 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Setting up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: process.env.CLOUDINARY_FOLDER || "Healthcare",
      resource_type: "auto",
      allowed_formats: ["jpg", "png", "jpeg", "pdf"],
    },
});


const upload = multer({ storage });

module.exports = { upload, cloudinary };
