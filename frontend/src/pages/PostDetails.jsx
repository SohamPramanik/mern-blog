import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Heart,
  User,
  MessageCircle,
  Send,
  Trash2,
} from "lucide-react";

import API from "../services/api";
import "./PostDetails.css";

function PostDetails() {
  const { id } = useParams();
  const location = useLocation();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [commentError, setCommentError] = useState("");

  const commentsRef = useRef(null);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  /* =========================================================
     BACKEND URL
  ========================================================= */

  const getBackendUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) return "";

    return apiUrl.replace(/\/api\/?$/, "");
  };

  /* =========================================================
     FETCH POST
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
     FETCH COMMENTS
  ========================================================= */

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      setCommentError("");

      const res = await API.get(`/posts/${id}/comments`);

      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);

      setCommentError(
        error?.response?.data?.message || "Unable to load comments.",
      );
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchComments();
    }
  }, [id]);

  /* =========================================================
     SCROLL TO COMMENTS
  ========================================================= */

  useEffect(() => {
    if (!loading && location.state?.focusComments && commentsRef.current) {
      setTimeout(() => {
        commentsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    }
  }, [loading, location.state]);

  /* =========================================================
     MEDIA
  ========================================================= */

  const getMediaUrl = (media) => {
    if (!media) return null;

    const backendUrl = getBackendUrl();

    if (typeof media === "object") {
      const mediaUrl = media.url;

      if (!mediaUrl) return null;

      if (mediaUrl.startsWith("http://") || mediaUrl.startsWith("https://")) {
        return mediaUrl;
      }

      if (!backendUrl) return mediaUrl;

      return `${backendUrl}${mediaUrl.startsWith("/") ? "" : "/"}${mediaUrl}`;
    }

    if (typeof media === "string") {
      if (media.startsWith("http://") || media.startsWith("https://")) {
        return media;
      }

      if (media.startsWith("/uploads/")) {
        if (!backendUrl) return media;

        return `${backendUrl}${media}`;
      }

      if (!backendUrl) return null;

      return `${backendUrl}/uploads/${media}`;
    }

    return null;
  };

  const getMediaType = (media) => {
    if (!media) return "";

    if (typeof media === "object") {
      return media.type || "";
    }

    return "";
  };

  const isVideoFile = (media) => {
    if (!media) return false;

    const mediaType = getMediaType(media);

    if (mediaType === "video") {
      return true;
    }

    const mediaValue = typeof media === "string" ? media : media.url || "";

    return /\.(mp4|webm|ogg|mov)$/i.test(mediaValue);
  };

  /* =========================================================
     ADD COMMENT
  ========================================================= */

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!token) {
      setCommentError("Please sign in to comment.");
      return;
    }

    const trimmedComment = commentText.trim();

    if (!trimmedComment) {
      setCommentError("Comment cannot be empty.");
      return;
    }

    try {
      setCommentLoading(true);
      setCommentError("");

      const res = await API.post(`/posts/${id}/comments`, {
        text: trimmedComment,
      });

      const newComment = res.data?.comment;

      if (newComment) {
        setComments((prev) => [...prev, newComment]);
      } else {
        await fetchComments();
      }

      setCommentText("");
    } catch (error) {
      console.error("Failed to add comment:", error);

      setCommentError(
        error?.response?.data?.message || "Failed to add comment.",
      );
    } finally {
      setCommentLoading(false);
    }
  };

  /* =========================================================
     DELETE COMMENT
  ========================================================= */

  const handleDeleteComment = async (commentId) => {
    if (!token) return;

    const confirmed = window.confirm("Delete this comment?");

    if (!confirmed) return;

    try {
      setDeletingCommentId(commentId);

      await API.delete(`/posts/${id}/comments/${commentId}`);

      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId),
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);

      setCommentError(
        error?.response?.data?.message || "Failed to delete comment.",
      );
    } finally {
      setDeletingCommentId(null);
    }
  };

  /* =========================================================
     CTRL + ENTER TO SUBMIT
  ========================================================= */

  const handleCommentKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleAddComment(e);
    }
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
     NOT FOUND
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
     DATA
  ========================================================= */

  const mediaUrl = getMediaUrl(post.media);
  const isVideo = isVideoFile(post.media);

  const likesCount = post.likesCount ?? post.likes?.length ?? 0;

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
      {/* BACK */}
      <div className="post-details-topbar">
        <Link to="/blogs" className="post-details-back">
          <ArrowLeft size={15} />
          Back to moments
        </Link>
      </div>

      <article className="post-details-container">
        {/* MEDIA */}

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

        <div className="post-details-content">
          {/* JOURNEY */}

          {post.journey && (
            <div className="post-details-journey">
              {post.journey.title || post.journey.name}
            </div>
          )}

          {/* TITLE */}

          <h1>{post.title || "Untitled Moment"}</h1>

          {/* META */}

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

          {/* CONTENT */}

          <div className="post-details-text">{post.content}</div>

          {/* =================================================
              COMMENTS
          ================================================= */}

          <section className="post-comments" id="comments" ref={commentsRef}>
            <div className="post-comments-header">
              <div>
                <span className="post-comments-label">Conversation</span>

                <h2>
                  Comments
                  <span>{comments.length}</span>
                </h2>
              </div>

              <MessageCircle size={22} strokeWidth={1.7} />
            </div>

            {/* COMMENT FORM */}

            {token ? (
              <form className="post-comment-form" onSubmit={handleAddComment}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={handleCommentKeyDown}
                  placeholder="Write something about this moment..."
                  maxLength={1000}
                  rows={4}
                />

                <div className="post-comment-form-bottom">
                  <span>
                    {commentText.length}/1000
                    <br />
                    Ctrl + Enter to post
                  </span>

                  <button
                    type="submit"
                    disabled={commentLoading || !commentText.trim()}
                  >
                    <Send size={15} />

                    {commentLoading ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="post-comments-login">
                <MessageCircle size={18} />

                <span>Sign in to join the conversation.</span>

                <Link to="/login">Sign in</Link>
              </div>
            )}

            {commentError && (
              <div className="post-comment-error">{commentError}</div>
            )}

            {/* COMMENTS LIST */}

            <div className="post-comments-list">
              {commentsLoading ? (
                <div className="post-comments-empty">Loading comments...</div>
              ) : comments.length === 0 ? (
                <div className="post-comments-empty">
                  <MessageCircle size={24} />

                  <h3>No comments yet</h3>

                  <p>Be the first to share your thoughts on this moment.</p>
                </div>
              ) : (
                comments.map((comment) => {
                  const commentUserId = comment.user?._id || comment.user;

                  const isOwnComment =
                    currentUserId &&
                    String(commentUserId) === String(currentUserId);

                  const commentDate = comment.createdAt
                    ? new Date(comment.createdAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "";

                  return (
                    <article key={comment._id} className="post-comment">
                      <div className="post-comment-avatar">
                        {comment.user?.avatar ? (
                          <img src={comment.user.avatar} alt="" />
                        ) : (
                          <User size={17} />
                        )}
                      </div>

                      <div className="post-comment-body">
                        <div className="post-comment-top">
                          <strong>
                            {comment.user?.username || "Anonymous"}
                          </strong>

                          <span>{commentDate}</span>
                        </div>

                        <p>{comment.text}</p>

                        {isOwnComment && (
                          <button
                            type="button"
                            className="post-comment-delete"
                            onClick={() => handleDeleteComment(comment._id)}
                            disabled={deletingCommentId === comment._id}
                          >
                            <Trash2 size={13} />

                            {deletingCommentId === comment._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}

export default PostDetails;
