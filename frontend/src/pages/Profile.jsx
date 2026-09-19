import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Edit3,
  Heart,
  MessageCircle,
  PenLine,
  Plus,
  Sparkles,
  UserRound,
} from "lucide-react";

import API from "../services/api";
import "./Profile.css";

function Profile() {
  // =========================================================
  // LOGGED-IN USER
  // =========================================================

  const storedUser = JSON.parse(localStorage.getItem("user") || "null");

  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [posts, setPosts] = useState([]);
  const [journeys, setJourneys] = useState([]);

  const [username, setUsername] = useState(storedUser?.username || "");

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("moments");

  // =========================================================
  // FETCH PROFILE DATA
  // =========================================================

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [postsResponse, journeysResponse] = await Promise.all([
        API.get("/posts/myposts"),
        API.get("/journeys"),
      ]);

      const postsData = Array.isArray(postsResponse.data)
        ? postsResponse.data
        : postsResponse.data?.posts || [];

      const journeysData = Array.isArray(journeysResponse.data)
        ? journeysResponse.data
        : journeysResponse.data?.journeys || [];

      setPosts(postsData);
      setJourneys(journeysData);

      // =====================================================
      // USERNAME
      // =====================================================

      const currentUser = JSON.parse(localStorage.getItem("user") || "null");

      if (currentUser?.username) {
        setUsername(currentUser.username);
      } else if (postsData.length > 0) {
        setUsername(
          postsData[0]?.author?.username || postsData[0]?.user?.username || "",
        );
      } else if (journeysData.length > 0) {
        setUsername(journeysData[0]?.owner?.username || "");
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // FULL DATE
  // =========================================================

  const formatFullDate = (date) => {
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

    const clean = content.replace(/\s+/g, " ").trim();

    if (clean.length <= 170) {
      return clean;
    }

    return clean.slice(0, 170) + "...";
  };

  // =========================================================
  // GET JOURNEY ID FROM POST
  // =========================================================

  const getPostJourneyId = (post) => {
    return post?.journey?._id || post?.journey?.id || post?.journey || null;
  };

  // =========================================================
  // STANDALONE MOMENTS
  //
  // A standalone moment = moment with NO journey
  // =========================================================

  const standalonePosts = useMemo(() => {
    return [...posts]
      .filter((post) => {
        const journeyId = getPostJourneyId(post);

        return !journeyId;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [posts]);

  // =========================================================
  // JOURNEY MOMENT COUNT
  // =========================================================

  const getJourneyMomentCount = (journey) => {
    if (typeof journey.momentCount === "number") {
      return journey.momentCount;
    }

    if (typeof journey.postsCount === "number") {
      return journey.postsCount;
    }

    if (Array.isArray(journey.moments)) {
      return journey.moments.length;
    }

    const journeyId = journey._id || journey.id;

    return posts.filter((post) => {
      const postJourneyId = getPostJourneyId(post);

      return String(postJourneyId) === String(journeyId);
    }).length;
  };

  // =========================================================
  // JOURNEY DATE RANGE
  // =========================================================

  const getJourneyDateRange = (journey) => {
    const journeyId = journey._id || journey.id;

    const journeyPosts = posts
      .filter((post) => {
        const postJourneyId = getPostJourneyId(post);

        return String(postJourneyId) === String(journeyId);
      })
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    if (journeyPosts.length === 0) {
      return "";
    }

    const first = journeyPosts[0]?.createdAt;
    const last = journeyPosts[journeyPosts.length - 1]?.createdAt;

    const firstDate = formatDate(first);
    const lastDate = formatDate(last);

    if (firstDate === lastDate) {
      return firstDate;
    }

    return `${firstDate} — ${lastDate}`;
  };

  // =========================================================
  // STATS
  // =========================================================

  const totalMoments = standalonePosts.length;

  const totalJourneys = journeys.length;

  const totalLikes = posts.reduce(
    (total, post) => total + (post.likesCount ?? post.likes?.length ?? 0),
    0,
  );

  // =========================================================
  // FIRST MOMENT DATE
  // =========================================================

  const firstMomentDate = useMemo(() => {
    if (posts.length === 0) {
      return "";
    }

    const sortedPosts = [...posts].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );

    return sortedPosts[0]?.createdAt;
  }, [posts]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-loading">
          <div className="profile-loader"></div>

          <p>Opening your Memoire...</p>
        </div>
      </main>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <main className="profile-page">
      {/* =====================================================
          PROFILE HERO
      ===================================================== */}

      <section className="profile-hero">
        <div className="profile-hero-inner">
          <div className="profile-avatar">
            <UserRound size={31} />
          </div>

          <div className="profile-identity">
            <span className="profile-eyebrow">MY MEMOIRE</span>

            <h1>{username ? `${username}'s Profile` : "Your Profile"}</h1>

            <p>Your story, one moment at a time.</p>
          </div>

          <Link to="/create" className="profile-write-button">
            <PenLine size={15} />
            Write a moment
          </Link>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="profile-stats-section">
        <div className="profile-stats">
          <div className="profile-stat">
            <span>JOURNEYS</span>
            <strong>{totalJourneys}</strong>
          </div>

          <div className="profile-stat">
            <span>MOMENTS</span>
            <strong>{totalMoments}</strong>
          </div>

          <div className="profile-stat">
            <span>APPRECIATION</span>
            <strong>{totalLikes}</strong>
          </div>

          <div className="profile-stat">
            <span>WRITING SINCE</span>

            <strong className="profile-stat-date">
              {firstMomentDate ? formatDate(firstMomentDate) : "Today"}
            </strong>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="profile-content">
        <div className="profile-layout">
          {/* =================================================
              LEFT
          ================================================= */}

          <div className="profile-main">
            {/* =================================================
                INTRO
            ================================================= */}

            <div className="profile-intro">
              <span>
                <Sparkles size={13} />
                YOUR STORY SPACE
              </span>

              <h2>
                Everything you've
                <br />
                chosen to remember.
              </h2>

              <p>
                Your moments become journeys over time. Look back, continue
                writing, or start something completely new.
              </p>
            </div>

            {/* =================================================
                TABS
            ================================================= */}

            <div className="profile-tabs">
              <button
                type="button"
                className={activeTab === "moments" ? "active" : ""}
                onClick={() => setActiveTab("moments")}
              >
                <PenLine size={14} />
                Moments
              </button>

              <button
                type="button"
                className={activeTab === "journeys" ? "active" : ""}
                onClick={() => setActiveTab("journeys")}
              >
                <BookOpen size={14} />
                Journeys
              </button>
            </div>

            {/* =================================================
                MOMENTS TAB
            ================================================= */}

            {activeTab === "moments" && (
              <section className="profile-moments">
                {standalonePosts.length === 0 ? (
                  <div className="profile-empty">
                    <div className="profile-empty-icon">
                      <PenLine size={22} />
                    </div>

                    <span>YOUR FIRST PAGE</span>

                    <h3>Nothing has been written yet.</h3>

                    <p>
                      Every Memoire starts with a single moment. Write yours
                      whenever you're ready.
                    </p>

                    <Link to="/create" className="profile-empty-button">
                      Write your first moment
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <div className="profile-moments-list">
                    {standalonePosts.map((post) => {
                      const likes = post.likesCount ?? post.likes?.length ?? 0;

                      const comments =
                        post.commentsCount ?? post.comments?.length ?? 0;

                      return (
                        <article
                          className="profile-standalone-moment"
                          key={post._id}
                        >
                          {/* DATE */}

                          <div className="profile-standalone-date">
                            <CalendarDays size={12} />

                            {formatFullDate(post.createdAt)}
                          </div>

                          {/* CONTENT */}

                          <h3>{post.title}</h3>

                          <p>{getPreview(post.content)}</p>

                          {/* MEDIA */}

                          {post.media &&
                            (typeof post.media === "string"
                              ? post.media
                              : post.media?.url) && (
                              <div className="profile-moment-media">
                                {typeof post.media === "string" &&
                                /\.(mp4|webm|ogg|mov)$/i.test(post.media) ? (
                                  <video
                                    src={
                                      post.media.startsWith("http")
                                        ? post.media
                                        : `${import.meta.env.VITE_API_URL.replace(
                                            "/api",
                                            "",
                                          )}/uploads/${post.media}`
                                    }
                                    controls
                                  />
                                ) : (
                                  <img
                                    src={
                                      typeof post.media === "string"
                                        ? post.media.startsWith("http")
                                          ? post.media
                                          : `${import.meta.env.VITE_API_URL.replace(
                                              "/api",
                                              "",
                                            )}/uploads/${post.media}`
                                        : post.media?.url
                                    }
                                    alt={post.title || "Moment"}
                                  />
                                )}
                              </div>
                            )}

                          {/* FOOTER */}

                          <div className="profile-moment-footer">
                            <div className="profile-moment-stats">
                              <span>
                                <Heart size={13} />
                                {likes}
                              </span>

                              <span>
                                <MessageCircle size={13} />
                                {comments}
                              </span>
                            </div>

                            <div className="profile-moment-actions">
                              <button
                                type="button"
                                className="profile-edit-button"
                                onClick={() => navigate(`/edit/${post._id}`)}
                              >
                                <Edit3 size={13} />
                                Edit
                              </button>

                              <Link
                                to={`/post/${post._id}`}
                                className="profile-read-link"
                              >
                                Read moment
                                <ArrowRight size={13} />
                              </Link>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            )}

            {/* =================================================
                JOURNEYS TAB
            ================================================= */}

            {activeTab === "journeys" && (
              <section className="profile-journeys">
                {journeys.length === 0 ? (
                  <div className="profile-empty">
                    <div className="profile-empty-icon">
                      <BookOpen size={22} />
                    </div>

                    <span>YOUR FIRST JOURNEY</span>

                    <h3>Your story hasn't taken shape yet.</h3>

                    <p>
                      Start writing a moment and create your first journey along
                      the way.
                    </p>

                    <Link to="/create" className="profile-empty-button">
                      Start a journey
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <div className="journeys-grid">
                    {journeys.map((journey) => {
                      const journeyId = journey._id || journey.id;

                      const momentCount = getJourneyMomentCount(journey);

                      const dateRange = getJourneyDateRange(journey);

                      return (
                        <article
                          className="profile-journey-card"
                          key={journeyId}
                        >
                          <div className="journey-card-top">
                            <div className="journey-card-icon">
                              <BookOpen size={19} />
                            </div>

                            <span>
                              {momentCount}{" "}
                              {momentCount === 1 ? "moment" : "moments"}
                            </span>
                          </div>

                          <h3>
                            {journey.title ||
                              journey.name ||
                              "Untitled Journey"}
                          </h3>

                          {journey.description ? (
                            <p>{journey.description}</p>
                          ) : dateRange ? (
                            <p>A collection of moments from {dateRange}.</p>
                          ) : (
                            <p>A new chapter waiting to be written.</p>
                          )}

                          <div className="journey-card-bottom">
                            <span>{dateRange || "Just beginning"}</span>

                            <Link
                              to={`/journeys/${journeyId}`}
                              className="journey-read-link"
                            >
                              Read More
                              <ArrowRight size={13} />
                            </Link>
                          </div>
                        </article>
                      );
                    })}

                    {/* CREATE JOURNEY */}

                    <Link to="/create" className="new-journey-card">
                      <div className="new-journey-icon">
                        <Plus size={19} />
                      </div>

                      <strong>Start another journey</strong>

                      <span>
                        There is always another story waiting to be written.
                      </span>
                    </Link>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <aside className="profile-sidebar">
            {/* STORY CARD */}

            <div className="profile-story-card">
              <span>YOUR MEMOIRE</span>

              <div className="story-card-decoration">
                <div></div>
                <div></div>
                <div></div>
              </div>

              <h3>
                A life isn't
                <br />
                one story.
              </h3>

              <p>It's all the moments you choose to keep.</p>
            </div>

            {/* QUICK ACTIONS */}

            <div className="profile-sidebar-section">
              <span className="sidebar-label">QUICK ACTIONS</span>

              <Link to="/create" className="sidebar-action">
                <div>
                  <PenLine size={15} />
                </div>

                <span>Write a moment</span>

                <ArrowRight size={13} />
              </Link>

              <button
                type="button"
                className="sidebar-action"
                onClick={() => setActiveTab("journeys")}
              >
                <div>
                  <BookOpen size={15} />
                </div>

                <span>View journeys</span>

                <ArrowRight size={13} />
              </button>
            </div>

            {/* PHILOSOPHY */}

            <div className="profile-philosophy">
              <Sparkles size={15} />

              <p>
                <strong>Your words stay yours.</strong> Memoire may understand
                themes, emotions and connections inside your writing — but your
                story remains in your voice.
              </p>
            </div>

            {/* APPRECIATION */}

            <div className="profile-appreciation">
              <Heart size={15} />

              <div>
                <span>TOTAL APPRECIATION</span>

                <strong>{totalLikes}</strong>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default Profile;
