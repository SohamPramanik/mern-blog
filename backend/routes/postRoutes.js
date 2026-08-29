const express = require("express");
const router = express.Router();

const {
  createPost,
  getPosts,
  getSinglePost,
  updatePost,
  deletePost,
  getMyPosts,
  likePost,
} = require("../controllers/postController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("/", getPosts);

router.get("/myposts", authMiddleware, getMyPosts);

router.post("/", authMiddleware, upload.single("media"), createPost);

router.put("/:id/like", authMiddleware, likePost);

router.get("/:id", getSinglePost);

router.put("/:id", authMiddleware, upload.single("media"), updatePost);

router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
