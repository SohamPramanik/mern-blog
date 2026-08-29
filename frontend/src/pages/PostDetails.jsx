import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User, Calendar, Heart } from "lucide-react";

import API from "../services/api";

import "./PostDetails.css";

function PostDetails() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${id}`);
        setPost(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const getMediaUrl = (media) => {
    if (!media) return null;

    if (media.startsWith("http://") || media.startsWith("https://")) {
      return media;
    }

    return `http://localhost:5000/uploads/${media}`;
  };

  if (loading) {
    return (
      <main className="post-details-page">
        <div className="post-details-loading">Loading story...</div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="post-details-page">
        <div className="post-not-found">
          <h2>Post not found</h2>
          <p>This story may have been deleted.</p>
        </div>
      </main>
    );
  }

  const mediaUrl = getMediaUrl(post.media);

  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(post.media || "");

  return (
    <main className="post-details-page">
      <article className="post-details-container">
        {/* MEDIA */}
        {mediaUrl && (
          <div className="post-details-media-container">
            {isVideo ? (
              <video src={mediaUrl} controls className="post-details-media" />
            ) : (
              <img
                src={mediaUrl}
                alt={post.title}
                className="post-details-media"
              />
            )}
          </div>
        )}

        <div className="post-details-content">
          {/* TITLE */}
          <h1>{post.title}</h1>

          {/* AUTHOR INFO */}
          <div className="post-details-meta">
            <div className="post-details-author">
              <div className="details-avatar">
                <User size={17} />
              </div>

              <span>{post.author?.username || "Anonymous"}</span>
            </div>

            <div className="post-details-date">
              <Calendar size={16} />

              <span>
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString()
                  : ""}
              </span>
            </div>

            <div className="post-details-likes">
              <Heart size={16} />

              <span>{post.likes?.length || 0}</span>
            </div>
          </div>

          <div className="post-details-divider" />

          {/* CONTENT */}
          <div className="post-details-text">{post.content}</div>
        </div>
      </article>
    </main>
  );
}

export default PostDetails;
