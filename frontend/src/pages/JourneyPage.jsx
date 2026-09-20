import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  PenLine,
} from "lucide-react";

import API from "../services/api";
import "./JourneyPage.css";

function JourneyDetails() {
  const { id } = useParams();

  const [journey, setJourney] = useState(null);
  const [moments, setMoments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH JOURNEY
  // =========================================================

  useEffect(() => {
    if (id) {
      fetchJourney();
    }
  }, [id]);

  const fetchJourney = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(`/journeys/${id}`);

      setJourney(response.data?.journey || null);

      setMoments(
        Array.isArray(response.data?.moments) ? response.data.moments : [],
      );
    } catch (error) {
      console.error("Failed to fetch journey:", error);

      setError(error.response?.data?.message || "Unable to open this journey.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DATE
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
  // PREVIEW
  // =========================================================

  const getPreview = (content) => {
    if (!content) {
      return "";
    }

    const clean = content.replace(/\s+/g, " ").trim();

    if (clean.length <= 230) {
      return clean;
    }

    return clean.slice(0, 230) + "...";
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="journey-details-page">
        <div className="journey-loading">
          <div className="journey-loader"></div>

          <p>Opening your journey...</p>
        </div>
      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !journey) {
    return (
      <main className="journey-details-page">
        <div className="journey-error">
          <BookOpen size={28} />

          <span>JOURNEY NOT FOUND</span>

          <h2>{error || "This journey could not be found."}</h2>

          <Link to="/profile">
            <ArrowLeft size={14} />
            Back to profile
          </Link>
        </div>
      </main>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="journey-details-page">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="journey-header">
        <Link to="/profile" className="journey-back-link">
          <ArrowLeft size={14} />
          Back to profile
        </Link>

        <div className="journey-header-icon">
          <BookOpen size={22} />
        </div>

        <span className="journey-eyebrow">YOUR JOURNEY</span>

        <h1>{journey.title || "Untitled Journey"}</h1>

        {journey.description && <p>{journey.description}</p>}

        <div className="journey-header-meta">
          <span>
            <PenLine size={13} />
            {moments.length} {moments.length === 1 ? "moment" : "moments"}
          </span>

          {journey.createdAt && (
            <span>
              <CalendarDays size={13} />
              Started {formatDate(journey.createdAt)}
            </span>
          )}
        </div>
      </section>

      {/* =====================================================
          TIMELINE
      ===================================================== */}

      <section className="journey-timeline-section">
        {moments.length === 0 ? (
          <div className="journey-empty">
            <BookOpen size={25} />

            <span>THE JOURNEY IS WAITING</span>

            <h2>No moments yet.</h2>

            <p>Write your first moment to begin this journey.</p>

            <Link to="/create">
              Write a moment
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="journey-timeline">
            {moments.map((moment, index) => {
              const dayNumber = index + 1;

              return (
                <article className="journey-timeline-item" key={moment._id}>
                  {/* ======================================
                        TIMELINE
                    ====================================== */}

                  <div className="journey-timeline-marker">
                    <div className="journey-timeline-dot">{dayNumber}</div>

                    {index !== moments.length - 1 && (
                      <div className="journey-timeline-line"></div>
                    )}
                  </div>

                  {/* ======================================
                        DAY STORY
                    ====================================== */}

                  <div className="journey-day-card">
                    <div className="journey-day-top">
                      <span className="journey-day-label">DAY {dayNumber}</span>

                      <span className="journey-day-date">
                        <CalendarDays size={11} />

                        {formatDate(moment.createdAt)}
                      </span>
                    </div>

                    <h2>{moment.title || `Day ${dayNumber}`}</h2>

                    <p>{getPreview(moment.content)}</p>

                    <div className="journey-day-footer">
                      <span>{moment.author?.username || ""}</span>

                      <Link
                        to={`/post/${moment._id}`}
                        className="journey-day-read"
                      >
                        Read More
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default JourneyDetails;
