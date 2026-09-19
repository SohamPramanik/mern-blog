const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const journeyRoutes = require("./routes/journeyRoutes");

const app = express();

/* =========================================================
   CORS
   ========================================================= */

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "https://mern-blog-delta-olive.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/* =========================================================
   MIDDLEWARE
   ========================================================= */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

/* =========================================================
   STATIC MEDIA
   ========================================================= */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =========================================================
   DATABASE
   ========================================================= */

connectDB();

/* =========================================================
   ROUTES
   ========================================================= */

app.use("/api/auth", authRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/journeys", journeyRoutes);

/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get("/", (req, res) => {
  res.json({
    message: "Memoire API Running",
    status: "success",
  });
});

/* =========================================================
   ERROR HANDLER
   ========================================================= */

app.use((error, req, res, next) => {
  console.error("SERVER ERROR:", error);

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message: error.message,
    });
  }

  res.status(500).json({
    message: error.message || "Something went wrong.",
  });
});

/* =========================================================
   SERVER
   ========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Memoire server running on port ${PORT}`);
});
