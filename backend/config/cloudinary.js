const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary configuration loaded:");
console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME ? "YES" : "NO");
console.log("API key:", process.env.CLOUDINARY_API_KEY ? "YES" : "NO");
console.log("API secret:", process.env.CLOUDINARY_API_SECRET ? "YES" : "NO");

module.exports = cloudinary;
