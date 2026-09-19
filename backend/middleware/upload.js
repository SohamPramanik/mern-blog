const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed"), false);
  }
};

const multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const resourceType = file.mimetype.startsWith("video/") ? "video" : "image";

    cloudinary.uploader
      .upload_stream(
        {
          folder: "memoire/posts",
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) {
            console.error("CLOUDINARY ERROR:", error);
            return reject(error);
          }

          console.log("CLOUDINARY UPLOAD SUCCESS:", result.secure_url);

          resolve(result);
        },
      )
      .end(file.buffer);
  });
};

const upload = {
  single: (fieldName) => {
    const multerMiddleware = multerUpload.single(fieldName);

    return async (req, res, next) => {
      multerMiddleware(req, res, async (err) => {
        if (err) {
          console.error("MULTER ERROR:", err);

          return res.status(400).json({
            message: err.message || "File upload failed.",
          });
        }

        try {
          // No file attached
          if (!req.file) {
            return next();
          }

          console.log("Uploading file to Cloudinary:", {
            name: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size,
          });

          const result = await uploadToCloudinary(req.file);

          req.file.filename = result.secure_url;
          req.file.path = result.secure_url;
          req.file.cloudinaryUrl = result.secure_url;
          req.file.cloudinaryPublicId = result.public_id;
          req.file.cloudinaryResourceType = result.resource_type;

          next();
        } catch (error) {
          console.error("CLOUDINARY UPLOAD ERROR:", error);

          return res.status(500).json({
            message: "Media upload failed.",
            error:
              process.env.NODE_ENV === "production" ? undefined : error.message,
          });
        }
      });
    };
  },
};

module.exports = upload;
