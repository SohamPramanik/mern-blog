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

// Upload Multer buffer to Cloudinary
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const resourceType = file.mimetype.startsWith("video/") ? "video" : "image";

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "memoire/posts",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    stream.end(file.buffer);
  });
};

// Keep the same upload.single("media") structure
// so existing routes can continue using it.
const upload = {
  single: (fieldName) => {
    const multerMiddleware = multerUpload.single(fieldName);

    return async (req, res, next) => {
      multerMiddleware(req, res, async (err) => {
        if (err) {
          return next(err);
        }

        try {
          if (!req.file) {
            return next();
          }

          const result = await uploadToCloudinary(req.file);

          // Keep these properties so the existing controller
          // can continue using req.file.filename / req.file.path.
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
          });
        }
      });
    };
  },
};

module.exports = upload;
