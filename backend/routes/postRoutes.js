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

/* CREATE POST */
router.post("/", authMiddleware, upload.single("media"), createPost);

/* GET ALL POSTS */
router.get("/", getPosts);

/* USER POSTS */
router.get("/myposts", authMiddleware, getMyPosts);

/* LIKE */
router.put("/like/:id", authMiddleware, likePost);

/* SINGLE POST */
router.get("/:id", getSinglePost);

/* UPDATE POST */
router.put("/:id", authMiddleware, upload.single("media"), updatePost);

/* DELETE POST */
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
