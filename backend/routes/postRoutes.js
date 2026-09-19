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
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/postController");

// =========================================================
// MOMENTS
// =========================================================

// Create Moment
router.post("/", authMiddleware, upload.single("media"), createPost);

// Get public feed
router.get("/", getPosts);

// Get my moments
router.get("/myposts", authMiddleware, getMyPosts);

// Get single moment
router.get("/:id", authMiddleware, getSinglePost);

// Update moment
router.put("/:id", authMiddleware, upload.single("media"), updatePost);

// Delete moment
router.delete("/:id", authMiddleware, deletePost);

// =========================================================
// LIKES
// =========================================================

router.put("/:id/like", authMiddleware, likePost);

// =========================================================
// COMMENTS
// =========================================================

router.get("/:id/comments", getComments);

router.post("/:id/comments", authMiddleware, addComment);

router.delete("/:postId/comments/:commentId", authMiddleware, deleteComment);

module.exports = router;
