const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    journey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Journey",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    content: {
      type: String,
      required: true,
    },

    media: {
      url: {
        type: String,
        default: "",
      },

      type: {
        type: String,
        enum: ["image", "video", ""],
        default: "",
      },

      originalName: {
        type: String,
        default: "",
      },
    },

    privacy: {
      type: String,
      enum: ["public", "followers", "private"],
      default: "public",
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    comments: [commentSchema],

    isStandalone: {
      type: Boolean,
      default: false,
    },

    ai: {
      tags: {
        type: [String],
        default: [],
      },

      emotions: {
        type: [String],
        default: [],
      },

      themes: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Post", postSchema);
