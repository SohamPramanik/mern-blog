import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Heart,
  MessageCircle,
  PenLine,
  RotateCw,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import API from "../services/api";
import "./Blogs.css";

/* =========================================================
   CONSTANTS
   ========================================================= */

const PAGE_SIZE = 8;

const SORTS = [
  { id: "latest", label: "Latest" },
  { id: "loved", label: "Most loved" },
];

/* =========================================================
   HELPERS
   ========================================================= */

const getLikesCount = (post) => post.likesCount ?? post.likes?.length ?? 0;

const getCommentsCount = (post) =>
  post.commentsCount ?? post.comments?.length ?? 0;

const getTimestamp = (post) => {
  const time = new Date(post.createdAt).getTime();
  return Number.isNaN(time) ? 0 : time;
};

function getDateParts(date) {
  if (!date) return null;

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;

  return {
    iso: parsed.toISOString(),
    day: parsed.getDate(),
    month: parsed.toLocaleDateString("en-US", { month: "short" }),
    year: parsed.getFullYear(),
    monthLong: parsed.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    full: parsed.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  };
}

function getPreview(content, limit = 240) {
  if (!content) return "";

  const clean = content.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;

  const cut = clean.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");

  return `${cut.slice(0, lastSpace > 160 ? lastSpace : limit).trimEnd()}…`;
}

function getReadTime(content) {
  if (!content) return 1;

  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function getMedia(post) {
  if (!post.media) return { url: "", type: "" };
  if (typeof post.media === "string") return { url: post.media, type: "" };

  return { url: post.media.url || "", type: post.media.type || "" };
}

/* =========================================================
   MOMENT ENTRY
   ========================================================= */

function MomentEntry({ post, isLiked, isFresh, isPending, onLike, onTag }) {
  const media = getMedia(post);
  const date = getDateParts(post.createdAt);
  const author = post.author?.username || "Anonymous";
  const tags = post.ai?.tags?.slice(0, 4) || [];
  const readTime = getReadTime(post.content);
  const likes = getLikesCount(post);
  const comments = getCommentsCount(post);

  return (
    <article className="moment">
      <div className="moment-date">
        {date && (
          <time dateTime={date.iso}>
            <strong>{date.day}</strong>
            <span>
              {date.month} {date.year}
            </span>
          </time>
        )}
      </div>

      <div className="moment-main">
        <header className="moment-top">
          <div className="moment-author">
            <span className="author-avatar">
              {post.author?.avatar ? (
                <img src={post.author.avatar} alt="" />
              ) : (
                author.charAt(0).toUpperCase()
              )}
            </span>

            <span className="author-details">
              <strong>{author}</strong>

              <span className="author-meta">
                {date && <span className="meta-date">{date.full}</span>}

                <span className="meta-read">
                  <Clock size={12} aria-hidden="true" />
                  {readTime} min read
                </span>
              </span>
            </span>
          </div>

          {post.journey?._id && (
            <Link
              to={`/journeys/${post.journey._id}`}
              className="moment-journey"
              title={`Part of the journey: ${post.journey.title}`}
            >
              <BookOpen size={13} aria-hidden="true" />
              <span>{post.journey.title}</span>
            </Link>
          )}
        </header>

        <div className="moment-body">
          <h3>
            <Link to={`/post/${post._id}`}>
              {post.title || "Untitled moment"}
            </Link>
          </h3>

          <p>{getPreview(post.content)}</p>
        </div>

        {media.url && (
          <div className="moment-media">
            {media.type === "video" ? (
              <video src={media.url} controls preload="metadata" />
            ) : (
              <img
                src={media.url}
                alt={post.title || "Moment photo"}
                loading="lazy"
              />
            )}
          </div>
        )}

        {tags.length > 0 && (
          <div className="moment-tags">
            {tags.map((tag) => (
              <button key={tag} type="button" onClick={() => onTag(tag)}>
                #{tag}
              </button>
            ))}
          </div>
        )}

        <footer className="moment-footer">
          <div className="moment-social">
            <button
              type="button"
              className={`social-button ${isLiked ? "liked" : ""} ${
                isFresh ? "fresh" : ""
              }`}
              onClick={() => onLike(post._id)}
              disabled={isPending}
              aria-pressed={isLiked}
              aria-label={`${isLiked ? "Unlike" : "Like"} this moment. ${likes} ${
                likes === 1 ? "like" : "likes"
              }`}
            >
              <Heart
                size={18}
                fill={isLiked ? "currentColor" : "none"}
                aria-hidden="true"
              />
              <span>{likes}</span>
            </button>

            <Link
              to={`/post/${post._id}`}
              state={{ focusComments: true }}
              className="social-button"
              aria-label={`${comments} ${
                comments === 1 ? "comment" : "comments"
              }`}
            >
              <MessageCircle size={18} aria-hidden="true" />
              <span>{comments}</span>
            </Link>
          </div>

          <Link to={`/post/${post._id}`} className="read-moment">
            Read full moment
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </footer>
      </div>
    </article>
  );
}

/* =========================================================
   LOADING SKELETON
   ========================================================= */

function FeedSkeleton() {
  return (
    <div className="moments-feed" aria-busy="true">
      <p className="sr-only" role="status">
        Loading moments…
      </p>

      {[0, 1, 2].map((item) => (
        <div className="moment" key={item} aria-hidden="true">
          <div className="moment-date" />

          <div className="moment-main">
            <span className="sk sk-author" />
            <span className="sk sk-title" />
            <span className="sk sk-line" />
            <span className="sk sk-line sk-mid" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   PAGE
   ========================================================= */

function Blogs() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [sort, setSort] = useState("latest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [likedPosts, setLikedPosts] = useState(new Set());
  const [likeLoading, setLikeLoading] = useState(null);
  const [justLiked, setJustLiked] = useState(null);

  const [notice, setNotice] = useState("");

  const searchRef = useRef(null);
  const feedTopRef = useRef(null);
  const noticeTimer = useRef(null);

  /* -------------------------------------------------------
     NOTICE (small toast)
     ------------------------------------------------------- */

  const showNotice = (message) => {
    setNotice(message);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 3200);
  };

  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  /* -------------------------------------------------------
     FETCH MOMENTS
     ------------------------------------------------------- */

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await API.get("/posts");

      const data = Array.isArray(res.data) ? res.data : res.data?.posts || [];

      setPosts(data);

      // Restore like state from backend response
      const currentUserId = localStorage.getItem("userId");
      const liked = new Set();

      if (currentUserId) {
        data.forEach((post) => {
          if (post.likes?.some((id) => String(id) === String(currentUserId))) {
            liked.add(post._id);
          }
        });
      }

      setLikedPosts(liked);
    } catch (err) {
      console.error("Failed to fetch moments:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /* -------------------------------------------------------
     PRESS "/" TO FOCUS SEARCH
     ------------------------------------------------------- */

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const active = document.activeElement;
      const tag = active?.tagName;

      if (tag === "INPUT" || tag === "TEXTAREA" || active?.isContentEditable) {
        return;
      }

      event.preventDefault();
      searchRef.current?.focus();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  /* -------------------------------------------------------
     DERIVED DATA
     ------------------------------------------------------- */

  const topTags = useMemo(() => {
    const counts = new Map();

    posts.forEach((post) => {
      post.ai?.tags?.forEach((tag) => {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      });
    });

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag]) => tag);
  }, [posts]);

  const chipTags = useMemo(
    () =>
      activeTag && !topTags.includes(activeTag)
        ? [activeTag, ...topTags]
        : topTags,
    [activeTag, topTags],
  );

  const journeys = useMemo(() => {
    const map = new Map();

    posts.forEach((post) => {
      const journey = post.journey;
      if (!journey?._id) return;

      const entry = map.get(journey._id) || {
        id: journey._id,
        title: journey.title,
        count: 0,
      };

      entry.count += 1;
      map.set(journey._id, entry);
    });

    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 4);
  }, [posts]);

  const writerCount = useMemo(
    () =>
      new Set(
        posts
          .map((post) => post.author?._id || post.author?.username)
          .filter(Boolean),
      ).size,
    [posts],
  );

  /* -------------------------------------------------------
     SEARCH + FILTER + SORT
     ------------------------------------------------------- */

  const filteredPosts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    let result = posts;

    if (activeTag) {
      result = result.filter((post) => post.ai?.tags?.includes(activeTag));
    }

    if (searchText) {
      result = result.filter((post) => {
        const haystack = [
          post.title,
          post.content,
          post.author?.username,
          post.journey?.title,
          ...(post.ai?.tags || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(searchText);
      });
    }

    return [...result].sort((a, b) =>
      sort === "loved"
        ? getLikesCount(b) - getLikesCount(a) ||
          getTimestamp(b) - getTimestamp(a)
        : getTimestamp(b) - getTimestamp(a),
    );
  }, [posts, search, activeTag, sort]);

  // Start from the first page whenever the list changes shape
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, activeTag, sort]);

  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, visibleCount),
    [filteredPosts, visibleCount],
  );

  // Month markers only make sense when the feed is in date order
  const feedItems = useMemo(() => {
    const items = [];
    let lastMonth = null;

    visiblePosts.forEach((post) => {
      if (sort === "latest") {
        const label = getDateParts(post.createdAt)?.monthLong || "Earlier";

        if (label !== lastMonth) {
          items.push({ type: "month", label });
          lastMonth = label;
        }
      }

      items.push({ type: "post", post });
    });

    return items;
  }, [visiblePosts, sort]);

  const hasFilters = Boolean(search.trim() || activeTag);

  /* -------------------------------------------------------
     ACTIONS
     ------------------------------------------------------- */

  const clearFilters = () => {
    setSearch("");
    setActiveTag("");
  };

  const handleTagSelect = (tag) => {
    setActiveTag((current) => (current === tag ? "" : tag));

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    feedTopRef.current?.scrollIntoView({
      block: "start",
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      showNotice("Sign in to like a moment.");
      return;
    }

    if (likeLoading === postId) {
      return;
    }

    setLikeLoading(postId);

    try {
      const res = await API.put(`/posts/${postId}/like`);

      const { liked, likesCount } = res.data;

      const userId = localStorage.getItem("userId") || "current-user";

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post._id !== postId) {
            return post;
          }

          const others = (post.likes || []).filter(
            (id) => String(id) !== String(userId),
          );

          return {
            ...post,
            likesCount,
            likes: liked ? [...others, userId] : others,
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

      setJustLiked(liked ? postId : null);
    } catch (err) {
      console.error("Failed to like moment:", err);
      showNotice("Couldn't update your like. Try again.");
    } finally {
      setLikeLoading(null);
    }
  };

  /* -------------------------------------------------------
     RENDER
     ------------------------------------------------------- */

  const feedReady = !loading && !error;

  return (
    <main className="blogs-page">
      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="blogs-hero">
        <div className="blogs-hero-inner">
          <span className="blogs-eyebrow">
            <Sparkles size={14} aria-hidden="true" />
            Explore Memoire
          </span>

          <h1>
            Every life is made
            <br />
            <em>of moments.</em>
          </h1>

          <p className="blogs-hero-lede">
            Real experiences, quiet thoughts, big milestones and little
            memories, written by people in the community.
          </p>

          {feedReady && posts.length > 0 && (
            <p className="blogs-hero-stat">
              {posts.length} {posts.length === 1 ? "moment" : "moments"} from{" "}
              {writerCount} {writerCount === 1 ? "writer" : "writers"}
            </p>
          )}
        </div>

        <div className="blogs-search-wrap">
          <label className="blogs-search">
            <Search size={19} aria-hidden="true" />

            <input
              ref={searchRef}
              type="search"
              placeholder="Search moments, journeys, people or topics"
              aria-label="Search moments"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {search ? (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  searchRef.current?.focus();
                }}
                className="clear-search"
                aria-label="Clear search"
              >
                <X size={15} aria-hidden="true" />
              </button>
            ) : (
              <kbd className="search-kbd" aria-hidden="true">
                /
              </kbd>
            )}
          </label>
        </div>
      </section>

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <section className="blogs-content">
        <div className="blogs-layout">
          {/* ===============================================
              FEED
              =============================================== */}

          <div className="moments-column">
            <div className="feed-heading" ref={feedTopRef}>
              <div>
                <h2>
                  {sort === "loved" ? "Most loved moments" : "Latest moments"}
                </h2>

                {feedReady && posts.length > 0 && (
                  <p className="moment-count" aria-live="polite">
                    {filteredPosts.length}{" "}
                    {filteredPosts.length === 1 ? "moment" : "moments"}
                    {hasFilters ? " found" : ""}
                  </p>
                )}
              </div>

              {feedReady && posts.length > 1 && (
                <div
                  className="sort-toggle"
                  role="group"
                  aria-label="Sort moments"
                >
                  {SORTS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={sort === option.id}
                      className={sort === option.id ? "active" : ""}
                      onClick={() => setSort(option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {feedReady && chipTags.length > 0 && (
              <div
                className="tag-row"
                role="group"
                aria-label="Filter by topic"
              >
                <button
                  type="button"
                  className={`tag-chip ${!activeTag ? "active" : ""}`}
                  aria-pressed={!activeTag}
                  onClick={() => setActiveTag("")}
                >
                  All
                </button>

                {chipTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`tag-chip ${activeTag === tag ? "active" : ""}`}
                    aria-pressed={activeTag === tag}
                    onClick={() => handleTagSelect(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}

            {/* LOADING */}
            {loading && <FeedSkeleton />}

            {/* ERROR */}
            {!loading && error && (
              <div className="feed-state" role="alert">
                <div className="state-icon">
                  <RotateCw size={22} aria-hidden="true" />
                </div>

                <h3>We couldn't load moments.</h3>

                <p>Check your connection and try again.</p>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={fetchPosts}
                >
                  Try again
                </button>
              </div>
            )}

            {/* EMPTY */}
            {feedReady && filteredPosts.length === 0 && (
              <div className="feed-state">
                <div className="state-icon">
                  <PenLine size={22} aria-hidden="true" />
                </div>

                <h3>
                  {hasFilters
                    ? "No moments match your search."
                    : "Be the first to write a moment."}
                </h3>

                <p>
                  {hasFilters
                    ? "Try a different word, or clear your filters to see everything."
                    : "Your story doesn't need to start perfectly. It just needs to start."}
                </p>

                {hasFilters ? (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={clearFilters}
                  >
                    Clear filters
                  </button>
                ) : (
                  <Link to="/create" className="btn-primary">
                    Write a moment
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                )}
              </div>
            )}

            {/* MOMENTS */}
            {feedReady && filteredPosts.length > 0 && (
              <>
                <div className="moments-feed">
                  {feedItems.map((item) =>
                    item.type === "month" ? (
                      <h3 className="month-marker" key={`month-${item.label}`}>
                        {item.label}
                      </h3>
                    ) : (
                      <MomentEntry
                        key={item.post._id}
                        post={item.post}
                        isLiked={likedPosts.has(item.post._id)}
                        isFresh={justLiked === item.post._id}
                        isPending={likeLoading === item.post._id}
                        onLike={handleLike}
                        onTag={handleTagSelect}
                      />
                    ),
                  )}
                </div>

                {filteredPosts.length > visibleCount && (
                  <div className="show-more">
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() =>
                        setVisibleCount((count) => count + PAGE_SIZE)
                      }
                    >
                      Show more moments
                      <span>{filteredPosts.length - visibleCount} left</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ===============================================
              SIDEBAR
              =============================================== */}

          <aside className="blogs-sidebar">
            <div className="write-card">
              <div className="write-card-icon">
                <PenLine size={19} aria-hidden="true" />
              </div>

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
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>

            {journeys.length > 0 && (
              <div className="journey-list">
                <h4>Journeys to follow</h4>

                <ul>
                  {journeys.map((journey) => (
                    <li key={journey.id}>
                      <Link to={`/journeys/${journey.id}`}>
                        <BookOpen size={16} aria-hidden="true" />

                        <span className="journey-name">{journey.title}</span>

                        <span className="journey-count">
                          {journey.count}{" "}
                          {journey.count === 1 ? "moment" : "moments"}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="sidebar-note">
              <p>
                <strong>Memoire is human first.</strong>
                Your words stay yours. AI may help you discover connections, but
                your story is never rewritten.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* TOAST */}
      <div
        className={`toast ${notice ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {notice}
      </div>
    </main>
  );
}

export default Blogs;
