const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

const {
  createPost,
  getPosts,
  getSinglePost,
  updatePost,
  deletePost,
  getMyPosts,
  likePost,
} = require("../controllers/postController");

router.post("/", authMiddleware, upload.single("media"), createPost);

router.get("/", getPosts);

router.get("/myposts", authMiddleware, getMyPosts);

router.get("/:id", getSinglePost);

router.put("/:id", authMiddleware, upload.single("media"), updatePost);

router.delete("/:id", authMiddleware, deletePost);

router.put("/:id/like", authMiddleware, likePost);

module.exports = router;
