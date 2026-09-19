import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Heart,
  MessageCircle,
  PenLine,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";

import API from "../services/api";
import "./Blogs.css";

function Blogs() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likeLoading, setLikeLoading] = useState(null);

  // =========================================================
  // FETCH MOMENTS
  // =========================================================

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");

      const data = Array.isArray(res.data) ? res.data : res.data?.posts || [];

      setPosts(data);

      // Restore like state from backend response
      const liked = new Set();

      data.forEach((post) => {
        const currentUserId = localStorage.getItem("userId");

        if (
          currentUserId &&
          post.likes?.some((id) => String(id) === String(currentUserId))
        ) {
          liked.add(post._id);
        }
      });

      setLikedPosts(liked);
    } catch (error) {
      console.error("Failed to fetch moments:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredPosts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return posts;
    }

    return posts.filter((post) => {
      const title = post.title?.toLowerCase() || "";

      const content = post.content?.toLowerCase() || "";

      const username = post.author?.username?.toLowerCase() || "";

      const journey = post.journey?.title?.toLowerCase() || "";

      return (
        title.includes(searchText) ||
        content.includes(searchText) ||
        username.includes(searchText) ||
        journey.includes(searchText)
      );
    });
  }, [posts, search]);

  // =========================================================
  // LIKE
  // =========================================================

  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    if (likeLoading === postId) {
      return;
    }

    setLikeLoading(postId);

    try {
      const res = await API.put(`/posts/${postId}/like`);

      const { liked, likesCount } = res.data;

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post._id !== postId) {
            return post;
          }

          return {
            ...post,
            likesCount,
            likes: liked
              ? [...(post.likes || []), "current-user"]
              : (post.likes || []).filter(
                  (_, index, array) => index !== array.length - 1,
                ),
          };
        }),
      );

      setLikedPosts((current) => {
        const next = new Set(current);

        if (liked) {
          next.add(postId);
        } else {
          next.delete(postId);
        }

        return next;
      });
    } catch (error) {
      console.error("Failed to like moment:", error);
    } finally {
      setLikeLoading(null);
    }
  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Recently";
    }

    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // CONTENT PREVIEW
  // =========================================================

  const getPreview = (content) => {
    if (!content) {
      return "";
    }

    const cleanContent = content.replace(/\s+/g, " ").trim();

    if (cleanContent.length <= 220) {
      return cleanContent;
    }

    return cleanContent.slice(0, 220) + "...";
  };

  // =========================================================
  // MEDIA
  // =========================================================

  const getMediaUrl = (post) => {
    if (!post.media) {
      return "";
    }

    if (typeof post.media === "string") {
      return post.media;
    }

    return post.media.url || "";
  };

  const getMediaType = (post) => {
    if (!post.media) {
      return "";
    }

    if (typeof post.media === "string") {
      return "";
    }

    return post.media.type || "";
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="blogs-page">
      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="blogs-hero">
        <div className="blogs-hero-inner">
          <div className="blogs-hero-copy">
            <span className="blogs-eyebrow">
              <Sparkles size={13} />
              EXPLORE MEMOIRE
            </span>

            <h1>
              Every life is made
              <br />
              of <em>moments.</em>
            </h1>

            <p>
              Discover real experiences, quiet thoughts, big milestones and
              little memories written by people from the community.
            </p>
          </div>

          <div className="blogs-hero-side">
            <div className="hero-line"></div>

            <span>READ</span>

            <strong>
              STORIES
              <br />
              THAT MATTER
            </strong>
          </div>
        </div>

        {/* ===================================================
            SEARCH
            =================================================== */}

        <div className="blogs-search-wrap">
          <div className="blogs-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search moments, journeys or people..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="clear-search"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <section className="blogs-content">
        <div className="blogs-layout">
          {/* =================================================
              FEED
              ================================================= */}

          <div className="moments-column">
            <div className="feed-heading">
              <div>
                <span className="feed-eyebrow">THE MEMOIRE FEED</span>

                <h2>Latest moments</h2>
              </div>

              <span className="moment-count">
                {filteredPosts.length}{" "}
                {filteredPosts.length === 1 ? "moment" : "moments"}
              </span>
            </div>

            {/* =================================================
                LOADING
                ================================================= */}

            {loading && (
              <div className="blogs-loading">
                <div className="loading-spinner"></div>

                <p>Gathering stories...</p>
              </div>
            )}

            {/* =================================================
                EMPTY
                ================================================= */}

            {!loading && filteredPosts.length === 0 && (
              <div className="blogs-empty">
                <div className="empty-icon">
                  <PenLine size={23} />
                </div>

                <span>
                  {search ? "NOTHING FOUND" : "THE FIRST PAGE IS EMPTY"}
                </span>

                <h3>
                  {search
                    ? "No moments match your search."
                    : "Be the first to write a moment."}
                </h3>

                <p>
                  {search
                    ? "Try another keyword, journey or person's name."
                    : "Your story doesn't need to start perfectly. It just needs to start."}
                </p>

                {!search && (
                  <Link to="/create" className="empty-write-button">
                    Write your first moment
                    <ArrowRight size={15} />
                  </Link>
                )}
              </div>
            )}

            {/* =================================================
                MOMENTS
                ================================================= */}

            {!loading && filteredPosts.length > 0 && (
              <div className="moments-feed">
                {filteredPosts.map((post, index) => {
                  const mediaUrl = getMediaUrl(post);

                  const mediaType = getMediaType(post);

                  const isLiked = likedPosts.has(post._id);

                  const likesCount = post.likesCount ?? post.likes?.length ?? 0;

                  const commentsCount =
                    post.commentsCount ?? post.comments?.length ?? 0;

                  return (
                    <article className="moment-card" key={post._id}>
                      {/* =========================
                              CARD TOP
                              ========================= */}

                      <div className="moment-top">
                        <div className="moment-author">
                          <div className="author-avatar">
                            {post.author?.avatar ? (
                              <img
                                src={post.author.avatar}
                                alt={post.author?.username || "Author"}
                              />
                            ) : (
                              <UserRound size={17} />
                            )}
                          </div>

                          <div className="author-details">
                            <strong>
                              {post.author?.username || "Anonymous"}
                            </strong>

                            <span>
                              <CalendarDays size={11} />
                              {formatDate(post.createdAt)}
                            </span>
                          </div>
                        </div>

                        {post.journey && (
                          <Link
                            to={`/journeys/${post.journey._id}`}
                            className="moment-journey"
                          >
                            <BookOpen size={12} />

                            {post.journey.title}
                          </Link>
                        )}
                      </div>

                      {/* =========================
                              CARD CONTENT
                              ========================= */}

                      <div className="moment-body">
                        <h3>{post.title}</h3>

                        <p>{getPreview(post.content)}</p>
                      </div>

                      {/* =========================
                              MEDIA
                              ========================= */}

                      {mediaUrl && (
                        <div className="moment-media">
                          {mediaType === "video" ? (
                            <video src={mediaUrl} controls preload="metadata" />
                          ) : (
                            <img
                              src={mediaUrl}
                              alt={post.title || "Moment"}
                              loading="lazy"
                            />
                          )}
                        </div>
                      )}

                      {/* =========================
                              AI META
                              ========================= */}

                      {post.ai?.tags?.length > 0 && (
                        <div className="moment-tags">
                          {post.ai.tags.slice(0, 4).map((tag) => (
                            <span key={tag}>#{tag}</span>
                          ))}
                        </div>
                      )}

                      {/* =========================
                              CARD FOOTER
                              ========================= */}

                      <div className="moment-footer">
                        <div className="moment-social">
                          <button
                            type="button"
                            className={`social-button ${
                              isLiked ? "liked" : ""
                            }`}
                            onClick={() => handleLike(post._id)}
                            disabled={likeLoading === post._id}
                          >
                            <Heart
                              size={16}
                              fill={isLiked ? "currentColor" : "none"}
                            />

                            <span>{likesCount}</span>
                          </button>

                          <Link
                            to={`/post/${post._id}`}
                            className="social-button"
                          >
                            <MessageCircle size={16} />

                            <span>{commentsCount}</span>
                          </Link>
                        </div>

                        <div className="moment-actions">
                          <Link
                            to={`/post/${post._id}`}
                            className="read-moment"
                          >
                            Read full moment
                            <ArrowRight size={14} />
                          </Link>

                          {post.journey && (
                            <Link
                              to={`/journeys/${post.journey._id}`}
                              className="read-journey"
                            >
                              Read journey
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* =========================
                              TIMELINE MARKER
                              ========================= */}

                      <div className="moment-index">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* =================================================
              SIDEBAR
              ================================================= */}

          <aside className="blogs-sidebar">
            {/* =================================================
                WRITE CTA
                ================================================= */}

            <div className="write-card">
              <div className="write-card-icon">
                <PenLine size={19} />
              </div>

              <span>YOUR STORY</span>

              <h3>
                Have a moment
                <br />
                worth remembering?
              </h3>

              <p>
                Don't wait for the perfect words. Start with what you remember.
              </p>

              <Link to="/create" className="write-card-button">
                Write a moment
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* =================================================
                PHILOSOPHY
                ================================================= */}

            <div className="sidebar-note">
              <div className="sidebar-note-line"></div>

              <Sparkles size={15} />

              <p>
                <strong>Memoire is human first.</strong>
                <br />
                Your words stay yours. AI may help you discover connections, but
                your story is never rewritten.
              </p>
            </div>

            {/* =================================================
                DISCOVER
                ================================================= */}

            <div className="discover-card">
              <span>WHAT TO LOOK FOR</span>

              <div className="discover-item">
                <BookOpen size={15} />

                <div>
                  <strong>Journeys</strong>

                  <p>Follow someone's story from beginning to now.</p>
                </div>
              </div>

              <div className="discover-item">
                <Heart size={15} />

                <div>
                  <strong>Moments</strong>

                  <p>The small memories that make a life meaningful.</p>
                </div>
              </div>

              <div className="discover-item">
                <MessageCircle size={15} />

                <div>
                  <strong>Conversations</strong>

                  <p>Leave a thought behind when a story moves you.</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Blogs;
