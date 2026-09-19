const Post = require("../models/Post");
const Journey = require("../models/Journey");

// =========================================================
// MEDIA HELPER
// =========================================================

const getMediaData = (req, file) => {
  if (!file) {
    return null;
  }

  let type = "image";

  if (file.mimetype.startsWith("video/")) {
    type = "video";
  }

  return {
    url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
    type,
    originalName: file.originalname,
  };
};

// =========================================================
// CREATE MOMENT
// =========================================================

const createPost = async (req, res) => {
  try {
    const { title, content, journeyId, newJourneyName, isStandalone, privacy } =
      req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Moment title is required.",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Moment content is required.",
      });
    }

    let journey = null;

    // =====================================================
    // EXISTING JOURNEY
    // =====================================================

    if (journeyId && journeyId !== "null" && journeyId !== "undefined") {
      journey = await Journey.findOne({
        _id: journeyId,
        owner: req.user,
      });

      if (!journey) {
        return res.status(404).json({
          message: "Journey not found or you do not own this journey.",
        });
      }
    }

    // =====================================================
    // NEW JOURNEY
    // =====================================================

    if (newJourneyName && newJourneyName.trim()) {
      journey = await Journey.create({
        title: newJourneyName.trim(),
        owner: req.user,
      });
    }

    // =====================================================
    // MEDIA
    // =====================================================

    const mediaData = getMediaData(req, req.file);

    // =====================================================
    // CREATE MOMENT
    // =====================================================

    const post = await Post.create({
      author: req.user,

      journey: journey ? journey._id : null,

      title: title.trim(),

      content: content.trim(),

      media: mediaData || {
        url: "",
        type: "",
        originalName: "",
      },

      privacy: privacy || "public",

      isStandalone: !journey,

      ai: {
        tags: [],
        emotions: [],
        themes: [],
      },
    });

    const populatedPost = await Post.findById(post._id)
      .populate("author", "username avatar")
      .populate("journey", "title owner");

    res.status(201).json({
      message: "Moment created successfully.",

      post: populatedPost,
    });
  } catch (error) {
    console.error("CREATE MOMENT ERROR:", error);

    res.status(500).json({
      message: error.message || "Failed to create moment.",
    });
  }
};

// =========================================================
// GET PUBLIC MOMENTS / FEED
// =========================================================

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      privacy: "public",
    })
      .populate("author", "username avatar")
      .populate("journey", "title")
      .sort({
        createdAt: -1,
      })
      .lean();

    const formattedPosts = posts.map((post) => ({
      ...post,

      likesCount: post.likes?.length || 0,

      commentsCount: post.comments?.length || 0,
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error("GET MOMENTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch moments.",
    });
  }
};

// =========================================================
// GET SINGLE MOMENT
// =========================================================

const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username avatar bio")
      .populate("journey", "title description owner")
      .populate("comments.user", "username avatar")
      .lean();

    if (!post) {
      return res.status(404).json({
        message: "Moment not found.",
      });
    }

    // =====================================================
    // PRIVACY
    // =====================================================

    if (post.privacy === "private") {
      if (String(post.author._id) !== String(req.user)) {
        return res.status(403).json({
          message: "This moment is private.",
        });
      }
    }

    /*
      Followers-only logic can be expanded
      when the follow system is implemented.
    */

    if (post.privacy === "followers") {
      if (String(post.author._id) !== String(req.user)) {
        return res.status(403).json({
          message: "This moment is visible to followers only.",
        });
      }
    }

    res.json({
      ...post,

      likesCount: post.likes?.length || 0,

      commentsCount: post.comments?.length || 0,
    });
  } catch (error) {
    console.error("GET SINGLE MOMENT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch moment.",
    });
  }
};

// =========================================================
// GET MY MOMENTS
// =========================================================

const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.user,
    })
      .populate("journey", "title")
      .sort({
        createdAt: -1,
      })
      .lean();

    const formattedPosts = posts.map((post) => ({
      ...post,

      likesCount: post.likes?.length || 0,

      commentsCount: post.comments?.length || 0,
    }));

    res.json(formattedPosts);
  } catch (error) {
    console.error("GET MY MOMENTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch your moments.",
    });
  }
};

// =========================================================
// UPDATE MOMENT
// =========================================================

const updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      author: req.user,
    });

    if (!post) {
      return res.status(404).json({
        message: "Moment not found or unauthorized.",
      });
    }

    if (req.body.title !== undefined) {
      post.title = req.body.title.trim();
    }

    if (req.body.content !== undefined) {
      post.content = req.body.content.trim();
    }

    if (req.body.privacy !== undefined) {
      post.privacy = req.body.privacy;
    }

    if (req.body.journeyId !== undefined) {
      if (
        req.body.journeyId === null ||
        req.body.journeyId === "" ||
        req.body.journeyId === "null"
      ) {
        post.journey = null;
        post.isStandalone = true;
      } else {
        const journey = await Journey.findOne({
          _id: req.body.journeyId,
          owner: req.user,
        });

        if (!journey) {
          return res.status(404).json({
            message: "Journey not found.",
          });
        }

        post.journey = journey._id;

        post.isStandalone = false;
      }
    }

    if (req.file) {
      const mediaData = getMediaData(req, req.file);

      post.media = mediaData;
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "username avatar")
      .populate("journey", "title");

    res.json({
      message: "Moment updated successfully.",

      post: updatedPost,
    });
  } catch (error) {
    console.error("UPDATE MOMENT ERROR:", error);

    res.status(500).json({
      message: "Failed to update moment.",
    });
  }
};

// =========================================================
// DELETE MOMENT
// =========================================================

const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      author: req.user,
    });

    if (!post) {
      return res.status(404).json({
        message: "Moment not found or unauthorized.",
      });
    }

    await post.deleteOne();

    res.json({
      message: "Moment deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE MOMENT ERROR:", error);

    res.status(500).json({
      message: "Failed to delete moment.",
    });
  }
};

// =========================================================
// LIKE / UNLIKE MOMENT
// =========================================================

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Moment not found.",
      });
    }

    const userId = String(req.user);

    const alreadyLiked = post.likes.some((id) => String(id) === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => String(id) !== userId);
    } else {
      post.likes.push(req.user);
    }

    await post.save();

    res.json({
      liked: !alreadyLiked,

      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("LIKE ERROR:", error);

    res.status(500).json({
      message: "Failed to update like.",
    });
  }
};

// =========================================================
// ADD COMMENT
// =========================================================

const addComment = async (req, res) => {
  try {
    const { text, parentComment } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty.",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Moment not found.",
      });
    }

    post.comments.push({
      user: req.user,

      text: text.trim(),

      parentComment: parentComment || null,
    });

    await post.save();

    const updatedPost = await Post.findById(post._id).populate(
      "comments.user",
      "username avatar",
    );

    const newComment = updatedPost.comments[updatedPost.comments.length - 1];

    res.status(201).json({
      message: "Comment added successfully.",

      comment: newComment,
    });
  } catch (error) {
    console.error("COMMENT ERROR:", error);

    res.status(500).json({
      message: "Failed to add comment.",
    });
  }
};

// =========================================================
// GET COMMENTS
// =========================================================

const getComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("comments.user", "username avatar")
      .lean();

    if (!post) {
      return res.status(404).json({
        message: "Moment not found.",
      });
    }

    res.json(post.comments || []);
  } catch (error) {
    console.error("GET COMMENTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch comments.",
    });
  }
};

// =========================================================
// DELETE COMMENT
// =========================================================

const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({
        message: "Moment not found.",
      });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found.",
      });
    }

    if (String(comment.user) !== String(req.user)) {
      return res.status(403).json({
        message: "You can only delete your own comment.",
      });
    }

    comment.deleteOne();

    await post.save();

    res.json({
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE COMMENT ERROR:", error);

    res.status(500).json({
      message: "Failed to delete comment.",
    });
  }
};

module.exports = {
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
};
