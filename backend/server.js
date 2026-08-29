const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.send("Blog API Running");
});

// Error handler
app.use((error, req, res, next) => {
  console.error("SERVER ERROR:", error);

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      message: error.message,
    });
  }

  res.status(500).json({
    message: error.message || "Something went wrong",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
