const fs = require("fs");
const path = require("path");
const Post = require("../models/Post");

/* CREATE POST */

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const media = req.file ? req.file.filename : null;

    const post = new Post({
      title,
      content,
      media,
      author: req.user, // ← use req.user (since middleware already sets id)
    });

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.error("CREATE POST ERROR:", error);

    res.status(500).json({ message: error.message });
  }
};
/* GET ALL POSTS */

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET SINGLE POST */

exports.getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username")
      .populate("comments.user", "username");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE POST */

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // only owner can update
    if (post.author.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    /* REMOVE EXISTING MEDIA */

    if (req.body.removeMedia === "true") {
      if (post.media) {
        const filePath = path.join(__dirname, "../uploads", post.media);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        post.media = null;
      }
    }

    /* REPLACE MEDIA */

    if (req.file) {
      if (post.media) {
        const oldPath = path.join(__dirname, "../uploads", post.media);

        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      post.media = req.file.filename;
    }

    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error.message });
  }
};

/* DELETE POST */

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (post.media) {
      const filePath = path.join(__dirname, "../uploads", post.media);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await post.deleteOne();

    res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("DELETE POST ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/* GET POSTS OF LOGGED IN USER */

exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* LIKE / UNLIKE POST */

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (!post.likes) {
      post.likes = [];
    }

    const userId = req.user;

    const index = post.likes.findIndex((like) => like.toString() === userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();

    res.json(post);
  } catch (err) {
    console.error("LIKE POST ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};
