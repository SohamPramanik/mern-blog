import { useState } from "react";
import { Link } from "react-router-dom";

import { Heart, Pencil, Trash2, Calendar, User } from "lucide-react";

import API from "../services/api";

import "./PostCard.css";

function PostCard({ post }) {
  const token = localStorage.getItem("token");

  const [likes, setLikes] = useState(post.likes || []);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const getMediaUrl = (media) => {
    if (!media) return null;

    if (media.startsWith("http://") || media.startsWith("https://")) {
      return media;
    }

    return `http://localhost:5000/uploads/${media}`;
  };

  const mediaUrl = getMediaUrl(post.media);

  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(post.media || "");

  const handleLike = async () => {
    if (!token) {
      alert("Please login to like a post.");
      return;
    }

    if (likeLoading) return;

    try {
      setLikeLoading(true);

      const res = await API.put(
        `/posts/${post._id}/like`,
        {},
        {
          headers: {
            Authorization: token,
          },
        },
      );

      setLikes(res.data.likes);

      // Check whether current user liked the post
      setLiked(!liked);
    } catch (error) {
      console.error("Like error:", error);

      alert(error.response?.data?.message || "Unable to like this post.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this story?",
    );

    if (!confirmDelete) return;

    try {
      console.log("Delete post:", post._id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <article className="post-card">
      {/* MEDIA */}
      {mediaUrl && (
        <div className="post-media-container">
          {isVideo ? (
            <video
              src={mediaUrl}
              className="post-media"
              controls
              preload="metadata"
            >
              Your browser does not support video.
            </video>
          ) : (
            <img
              src={mediaUrl}
              alt={post.title || "Post media"}
              className="post-media"
              onError={(e) => {
                console.error("Media failed to load:", mediaUrl);
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>
      )}

      <div className="post-card-content">
        {/* TITLE */}
        <h2>{post.title}</h2>

        {/* CONTENT */}
        <p className="post-description">{post.content}</p>

        {/* META */}
        <div className="post-meta">
          <div className="post-author">
            <div className="author-avatar">
              <User size={15} />
            </div>

            <span>{post.author?.username || "Anonymous"}</span>
          </div>

          <div className="post-date">
            <Calendar size={14} />

            <span>
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : ""}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="post-actions">
          <button
            className={`like-btn ${liked ? "liked" : ""}`}
            onClick={handleLike}
            disabled={likeLoading}
          >
            <Heart size={17} fill={liked ? "currentColor" : "none"} />

            <span>{likes.length}</span>
          </button>

          <Link to={`/post/${post._id}`} className="read-btn">
            Read more
          </Link>

          {token && (
            <div className="post-owner-actions">
              <Link to={`/edit/${post._id}`} className="icon-btn edit-btn">
                <Pencil size={16} />
              </Link>

              <button className="icon-btn delete-btn" onClick={handleDelete}>
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default PostCard;
