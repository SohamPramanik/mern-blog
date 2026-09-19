import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Heart, User } from "lucide-react";

import API from "../services/api";
import "./PostDetails.css";

function PostDetails() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  /* =========================================================
     BACKEND URL
     ========================================================= */

  const getBackendUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      return "";
    }

    return apiUrl.replace(/\/api\/?$/, "");
  };

  /* =========================================================
     FETCH SINGLE MOMENT
     ========================================================= */

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await API.get(`/posts/${id}`);

        setPost(res.data);
      } catch (error) {
        console.error("Failed to fetch moment:", error);

        setErrorMsg(
          error?.response?.data?.message || "Unable to load this moment.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  /* =========================================================
     MEDIA URL
     ========================================================= */

  const getMediaUrl = (media) => {
    if (!media) {
      return null;
    }

    const backendUrl = getBackendUrl();

    /* -------------------------------------------------------
       CLOUDINARY / NEW MEDIA OBJECT
       ------------------------------------------------------- */

    if (typeof media === "object") {
      const mediaUrl = media.url;

      if (!mediaUrl) {
        return null;
      }

      if (mediaUrl.startsWith("http://") || mediaUrl.startsWith("https://")) {
        return mediaUrl;
      }

      if (!backendUrl) {
        return mediaUrl;
      }

      return `${backendUrl}${mediaUrl.startsWith("/") ? "" : "/"}${mediaUrl}`;
    }

    /* -------------------------------------------------------
       OLD STRING MEDIA FORMAT
       ------------------------------------------------------- */

    if (typeof media === "string") {
      /* Already a complete URL */

      if (media.startsWith("http://") || media.startsWith("https://")) {
        return media;
      }

      /* Backend returns /uploads/filename */

      if (media.startsWith("/uploads/")) {
        if (!backendUrl) {
          return media;
        }

        return `${backendUrl}${media}`;
      }

      /* Backend returns only filename */

      if (!backendUrl) {
        return null;
      }

      return `${backendUrl}/uploads/${media}`;
    }

    return null;
  };

  /* =========================================================
     MEDIA TYPE
     ========================================================= */

  const getMediaType = (media) => {
    if (!media) {
      return "";
    }

    if (typeof media === "object") {
      return media.type || "";
    }

    return "";
  };

  /* =========================================================
     CHECK VIDEO
     ========================================================= */

  const isVideoFile = (media) => {
    if (!media) {
      return false;
    }

    const mediaType = getMediaType(media);

    if (mediaType === "video") {
      return true;
    }

    const mediaValue = typeof media === "string" ? media : media.url || "";

    return /\.(mp4|webm|ogg|mov)$/i.test(mediaValue);
  };

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <main className="post-details-page">
        <div className="post-details-loading">Loading story...</div>
      </main>
    );
  }

  /* =========================================================
     NOT FOUND / ERROR
     ========================================================= */

  if (!post) {
    return (
      <main className="post-details-page">
        <div className="post-not-found">
          <h2>{errorMsg || "Post not found"}</h2>

          <p>This story may have been deleted or is temporarily unavailable.</p>

          <Link to="/blogs" className="post-details-back">
            <ArrowLeft size={15} />
            Back to moments
          </Link>
        </div>
      </main>
    );
  }

  /* =========================================================
     MEDIA
     ========================================================= */

  const mediaUrl = getMediaUrl(post.media);
  const isVideo = isVideoFile(post.media);

  /* =========================================================
     LIKES
     ========================================================= */

  const likesCount = post.likesCount ?? post.likes?.length ?? 0;

  /* =========================================================
     DATE
     ========================================================= */

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <main className="post-details-page">
      {/* =====================================================
          BACK TO FEED
          ===================================================== */}

      <div className="post-details-topbar">
        <Link to="/blogs" className="post-details-back">
          <ArrowLeft size={15} />
          Back to moments
        </Link>
      </div>

      {/* =====================================================
          ARTICLE
          ===================================================== */}

      <article className="post-details-container">
        {/* =================================================
            MEDIA
            ================================================= */}

        {mediaUrl && (
          <div className="post-details-media-container">
            {isVideo ? (
              <video
                src={mediaUrl}
                controls
                preload="metadata"
                className="post-details-media"
              />
            ) : (
              <img
                src={mediaUrl}
                alt={post.title || "Moment"}
                className="post-details-media"
              />
            )}
          </div>
        )}

        {/* =================================================
            CONTENT
            ================================================= */}

        <div className="post-details-content">
          {/* =================================================
              JOURNEY
              ================================================= */}

          {post.journey && (
            <div className="post-details-journey">
              {post.journey.title || post.journey.name}
            </div>
          )}

          {/* =================================================
              TITLE
              ================================================= */}

          <h1>{post.title || "Untitled Moment"}</h1>

          {/* =================================================
              AUTHOR INFO
              ================================================= */}

          <div className="post-details-meta">
            <div className="post-details-author">
              <div className="details-avatar">
                <User size={17} />
              </div>

              <span>{post.author?.username || "Anonymous"}</span>
            </div>

            <div className="post-details-date">
              <Calendar size={16} />

              <span>{formattedDate}</span>
            </div>

            <div className="post-details-likes">
              <Heart size={16} />

              <span>{likesCount}</span>
            </div>
          </div>

          <div className="post-details-divider" />

          {/* =================================================
              STORY CONTENT
              ================================================= */}

          <div className="post-details-text">{post.content}</div>
        </div>
      </article>
    </main>
  );
}

export default PostDetails;
