import { Link } from "react-router-dom";
import { Heart, Pencil, Trash2, Calendar, User } from "lucide-react";

import "./PostCard.css";

function PostCard({ post }) {
  const token = localStorage.getItem("token");

  // Get backend URL automatically from API URL
  const getMediaUrl = (media) => {
    if (!media) return null;

    // If already a complete URL
    if (media.startsWith("http://") || media.startsWith("https://")) {
      return media;
    }

    // Example:
    // VITE_API_URL = https://your-backend.onrender.com/api
    // backendUrl = https://your-backend.onrender.com
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      console.error("VITE_API_URL is missing!");
      return null;
    }

    const backendUrl = apiUrl.replace(/\/api\/?$/, "");

    return `${backendUrl}/uploads/${media}`;
  };

  const mediaUrl = getMediaUrl(post.media);

  const isVideo =
    post.mediaType === "video" ||
    /\.(mp4|webm|ogg|mov)$/i.test(post.media || "");

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
            <video className="post-media" controls preload="metadata">
              <source src={mediaUrl} />
              Your browser does not support video.
            </video>
          ) : (
            <img
              src={mediaUrl}
              alt={post.title || "Post media"}
              className="post-media"
              onError={() => {
                console.error("Media failed to load:", mediaUrl);
                console.error("Post media value:", post.media);
              }}
            />
          )}
        </div>
      )}

      <div className="post-card-content">
        <h2>{post.title}</h2>

        <p className="post-description">{post.content}</p>

        <div className="post-meta">
          <div className="post-author">
            <div className="author-avatar">
              <User size={15} />
            </div>

            <span>
              {post.author?.username || post.author?.name || "Anonymous"}
            </span>
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

        <div className="post-actions">
          <button className="like-btn">
            <Heart size={17} />
            <span>{post.likes?.length || 0}</span>
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
