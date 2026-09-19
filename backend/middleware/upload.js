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
    cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
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

    console.log("=================================");
    console.log("CLOUDINARY UPLOAD START");
    console.log("File:", file.originalname);
    console.log("MIME:", file.mimetype);
    console.log("Size:", file.size);
    console.log("Resource:", resourceType);
    console.log("Cloud name configured:", !!process.env.CLOUDINARY_CLOUD_NAME);
    console.log("API key configured:", !!process.env.CLOUDINARY_API_KEY);
    console.log("API secret configured:", !!process.env.CLOUDINARY_API_SECRET);
    console.log("=================================");

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "memoire/posts",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          console.error("=================================");
          console.error("CLOUDINARY ACTUAL ERROR:");
          console.error(error);
          console.error("=================================");

          return reject(error);
        }

        console.log("CLOUDINARY UPLOAD SUCCESS");
        console.log("URL:", result.secure_url);

        resolve(result);
      },
    );

    stream.end(file.buffer);
  });
};

const upload = {
  single: (fieldName) => {
    const multerMiddleware = multerUpload.single(fieldName);

    return async (req, res, next) => {
      multerMiddleware(req, res, async (err) => {
        if (err) {
          console.error("=================================");
          console.error("MULTER ERROR:");
          console.error(err);
          console.error("=================================");

          return res.status(400).json({
            message: err.message || "File upload failed.",
          });
        }

        try {
          if (!req.file) {
            console.log("No media file attached.");
            return next();
          }

          const result = await uploadToCloudinary(req.file);

          req.file.filename = result.secure_url;
          req.file.path = result.secure_url;
          req.file.cloudinaryUrl = result.secure_url;
          req.file.cloudinaryPublicId = result.public_id;
          req.file.cloudinaryResourceType = result.resource_type;

          next();
        } catch (error) {
          console.error("=================================");
          console.error("CLOUDINARY UPLOAD ERROR:");
          console.error(error);
          console.error("=================================");

          return res.status(500).json({
            message: "Media upload failed.",
          });
        }
      });
    };
  },
};

module.exports = upload;
