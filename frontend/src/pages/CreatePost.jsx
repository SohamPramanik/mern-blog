import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  FileImage,
  Globe2,
  Heart,
  ImagePlus,
  Lock,
  PenLine,
  Plus,
  Sparkles,
  Upload,
  Users,
  X,
  Play,
} from "lucide-react";

import API from "../services/api";
import "./CreatePost.css";

function CreatePost() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [mode, setMode] = useState("existing");

  const [journeys, setJourneys] = useState([]);
  const [selectedJourney, setSelectedJourney] = useState("");

  const [newJourneyName, setNewJourneyName] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [privacy, setPrivacy] = useState("public");

  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const [showPrivacy, setShowPrivacy] = useState(false);

  const [loadingJourneys, setLoadingJourneys] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  /* =========================================================
     LOAD USER JOURNEYS
     ========================================================= */

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const res = await API.get("/journeys");

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.journeys || [];

        setJourneys(data);

        if (data.length > 0) {
          setSelectedJourney(data[0]._id || data[0].id);
        }
      } catch (error) {
        console.error("Failed to load journeys:", error);
      } finally {
        setLoadingJourneys(false);
      }
    };

    fetchJourneys();
  }, []);

  /* =========================================================
     CLEAN MEDIA PREVIEW
     ========================================================= */

  useEffect(() => {
    return () => {
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
    };
  }, [mediaPreview]);

  /* =========================================================
     MODE
     ========================================================= */

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setErrorMsg("");

    if (newMode !== "existing") {
      setSelectedJourney("");
    }

    if (newMode === "existing" && journeys.length > 0) {
      setSelectedJourney(journeys[0]._id || journeys[0].id);
    }
  };

  /* =========================================================
     MEDIA
     ========================================================= */

  const handleMedia = (file) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMsg(
        "Only JPG, PNG, WEBP, GIF, MP4 and WEBM files are allowed."
      );
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg("Media file must be smaller than 20 MB.");
      return;
    }

    setErrorMsg("");

    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setMediaFile(file);
    setMediaPreview(previewUrl);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      handleMedia(file);
    }

    e.target.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    setDragActive(false);

    const file = e.dataTransfer.files?.[0];

    if (file) {
      handleMedia(file);
    }
  };

  const removeMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }

    setMediaFile(null);
    setMediaPreview("");
  };

  /* =========================================================
     PRIVACY
     ========================================================= */

  const getPrivacyIcon = () => {
    if (privacy === "public") {
      return <Globe2 size={17} />;
    }

    if (privacy === "followers") {
      return <Users size={17} />;
    }

    return <Lock size={17} />;
  };

  const getPrivacyLabel = () => {
    if (privacy === "public") return "Everyone";
    if (privacy === "followers") return "Followers";

    return "Only me";
  };

  /* =========================================================
     SUBMIT
     ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("Give this moment a title.");
      return;
    }

    if (!content.trim()) {
      setErrorMsg("Your moment needs some words.");
      return;
    }

    if (mode === "existing" && !selectedJourney) {
      setErrorMsg("Choose a journey or start a new one.");
      return;
    }

    if (mode === "new" && !newJourneyName.trim()) {
      setErrorMsg("Give your new journey a name.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("content", content.trim());
      formData.append("privacy", privacy);

      if (mode === "existing") {
        formData.append("journeyId", selectedJourney);
        formData.append("isStandalone", "false");
      }

      if (mode === "new") {
        formData.append("newJourneyName", newJourneyName.trim());
        formData.append("isStandalone", "false");
      }

      if (mode === "standalone") {
        formData.append("isStandalone", "true");
      }

      if (mediaFile) {
        formData.append("media", mediaFile);
      }

      const res = await API.post("/posts", formData);

      console.log("Moment created:", res.data);

      navigate("/blogs");
    } catch (error) {
      console.error("CREATE MOMENT ERROR:", error);

      setErrorMsg(
        error?.response?.data?.message ||
          "Something went wrong while saving your moment."
      );
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isVideo = mediaFile?.type?.startsWith("video/");

  return (
    <main className="create-page">

      {/* Ambient decoration */}
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />

      {/* =====================================================
          MAIN
          ===================================================== */}

      <section className="create-layout">

        {/* ===================================================
            WRITING AREA
            =================================================== */}

        <form
          className="writing-section"
          onSubmit={handleSubmit}
        >

          <div className="writing-intro">

            <div className="intro-decoration">
              <span />
              <span />
              <span />
            </div>

            <span className="writing-eyebrow">
              <PenLine size={14} />
              A NEW MOMENT
            </span>

            <h1>
              What happened<span>?</span>
            </h1>

            <p>
              Write it the way you remember it.
              There is no perfect way to tell a story.
            </p>

          </div>

          {/* TITLE */}

          <div className="title-area">

            <div className="field-label">
              MOMENT TITLE
            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give this moment a title..."
              className="moment-title-input"
              maxLength={150}
              required
            />

            <div className="title-count">
              {title.length}/150
            </div>

          </div>

          {/* CONTENT */}

          <div className="content-area">

            <div className="field-label">
              YOUR STORY
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                "Start writing...\n\nTell the story in your own words. What happened? What did you feel? What do you remember?\n\nDon't worry about making it perfect."
              }
              className="moment-content-input"
              required
            />

            <div className="content-footer">
              <span>
                {content.length.toLocaleString()} characters
              </span>

              <span className="private-note">
                <Lock size={11} />
                Your words stay yours.
              </span>
            </div>

          </div>

          {/* MEDIA */}

          <div className="media-section">

            <div className="media-heading">

              <div>
                <span className="section-kicker">
                  OPTIONAL
                </span>

                <h3>Add to the memory</h3>

                <p>
                  A photo or video can make the moment feel alive again.
                </p>
              </div>

            </div>

            {!mediaFile ? (

              <div
                className={`media-dropzone ${
                  dragActive ? "drag-active" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >

                <div className="upload-icon">
                  <ImagePlus size={23} />
                </div>

                <div className="upload-text">

                  <strong>
                    Add a photo or video
                  </strong>

                  <span>
                    Drag & drop here or click to browse
                  </span>

                  <small>
                    JPG · PNG · WEBP · GIF · MP4 · WEBM
                    <br />
                    Maximum 20 MB
                  </small>

                </div>

                <div className="upload-button">
                  <Upload size={15} />
                  Choose file
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp,image/gif,video/mp4,video/webm"
                  onChange={handleFileChange}
                  hidden
                />

              </div>

            ) : (

              <div className="media-preview">

                {isVideo ? (
                  <video
                    src={mediaPreview}
                    controls
                  />
                ) : (
                  <img
                    src={mediaPreview}
                    alt="Moment preview"
                  />
                )}

                <div className="media-overlay">

                  <div className="media-file-info">
                    {isVideo ? (
                      <Play size={15} />
                    ) : (
                      <FileImage size={15} />
                    )}

                    <span>
                      {mediaFile.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="remove-media"
                    onClick={removeMedia}
                    aria-label="Remove media"
                  >
                    <X size={17} />
                  </button>

                </div>

              </div>
            )}

          </div>

          {/* ERROR */}

          {errorMsg && (
            <div className="create-error">
              <X size={17} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ACTION */}

          <div className="writing-actions">

            <div className="writing-ai-note">
              <Sparkles size={15} />

              <span>
                Memoire may understand the emotions and themes
                inside this moment — your words will never be rewritten.
              </span>
            </div>

            <button
              type="submit"
              className="publish-button"
              disabled={saving}
            >

              {saving ? (
                <>
                  <span className="button-spinner" />
                  Saving...
                </>
              ) : (
                <>
                  Save Moment
                  <ArrowRight size={17} />
                </>
              )}

            </button>

          </div>

        </form>

        {/* ===================================================
            SETTINGS
            =================================================== */}

        <aside className="story-settings">

          <div className="settings-panel">

            <div className="panel-top-line" />

            {/* JOURNEY */}

            <div className="settings-block">

              <div className="settings-heading">

                <div className="settings-heading-icon">
                  <BookOpen size={17} />
                </div>

                <div>
                  <span className="panel-kicker">
                    ORGANIZE
                  </span>

                  <h3>Where does this belong?</h3>

                  <p>
                    Connect this moment to your story.
                  </p>
                </div>

              </div>

              <div className="journey-options">

                {/* Existing */}

                <button
                  type="button"
                  className={`journey-option ${
                    mode === "existing" ? "selected" : ""
                  }`}
                  onClick={() => handleModeChange("existing")}
                >

                  <div className="option-radio">
                    {mode === "existing" && (
                      <Check size={12} />
                    )}
                  </div>

                  <div className="option-content">
                    <strong>Continue a Journey</strong>

                    <span>
                      Add this moment to something you're already writing.
                    </span>
                  </div>

                  {mode === "existing" && (
                    <span className="option-number">01</span>
                  )}

                </button>

                {/* New */}

                <button
                  type="button"
                  className={`journey-option ${
                    mode === "new" ? "selected" : ""
                  }`}
                  onClick={() => handleModeChange("new")}
                >

                  <div className="option-radio">
                    {mode === "new" && (
                      <Check size={12} />
                    )}
                  </div>

                  <div className="option-content">
                    <strong>Start a New Journey</strong>

                    <span>
                      Give a new chapter of your life a beginning.
                    </span>
                  </div>

                  {mode === "new" && (
                    <span className="option-number">02</span>
                  )}

                </button>

                {/* Standalone */}

                <button
                  type="button"
                  className={`journey-option ${
                    mode === "standalone" ? "selected" : ""
                  }`}
                  onClick={() => handleModeChange("standalone")}
                >

                  <div className="option-radio">
                    {mode === "standalone" && (
                      <Check size={12} />
                    )}
                  </div>

                  <div className="option-content">
                    <strong>Standalone Moment</strong>

                    <span>
                      Keep this moment on its own.
                    </span>
                  </div>

                  {mode === "standalone" && (
                    <span className="option-number">03</span>
                  )}

                </button>

              </div>

              {/* Existing journeys */}

              {mode === "existing" && (

                <div className="journey-select-area">

                  <label>
                    CHOOSE A JOURNEY
                  </label>

                  {loadingJourneys ? (

                    <div className="journey-loading">
                      <span className="mini-spinner" />
                      Loading your journeys...
                    </div>

                  ) : journeys.length > 0 ? (

                    <div className="select-wrapper">

                      <BookOpen size={16} />

                      <select
                        value={selectedJourney}
                        onChange={(e) =>
                          setSelectedJourney(e.target.value)
                        }
                      >

                        {journeys.map((journey) => (
                          <option
                            key={journey._id || journey.id}
                            value={journey._id || journey.id}
                          >
                            {journey.title ||
                              journey.name ||
                              "Untitled Journey"}
                          </option>
                        ))}

                      </select>

                      <ChevronDown size={15} />

                    </div>

                  ) : (

                    <div className="no-journeys">

                      <BookOpen size={18} />

                      <div>
                        <strong>No journeys yet</strong>
                        <span>
                          Start your first one below.
                        </span>
                      </div>

                    </div>

                  )}

                </div>

              )}

              {/* New journey */}

              {mode === "new" && (

                <div className="new-journey-area">

                  <label htmlFor="journey-name">
                    JOURNEY NAME
                  </label>

                  <div className="new-journey-input">

                    <Plus size={16} />

                    <input
                      id="journey-name"
                      type="text"
                      placeholder="e.g. My College Journey"
                      value={newJourneyName}
                      onChange={(e) =>
                        setNewJourneyName(e.target.value)
                      }
                      maxLength={80}
                    />

                  </div>

                  <small>
                    You can add more moments to this journey later.
                  </small>

                </div>

              )}

            </div>

            <div className="settings-divider" />

            {/* DATE */}

            <div className="settings-block">

              <div className="settings-heading">

                <div className="settings-heading-icon">
                  <CalendarDays size={17} />
                </div>

                <div>
                  <span className="panel-kicker">
                    TIMELINE
                  </span>

                  <h3>Moment details</h3>

                  <p>
                    A little context for your memory.
                  </p>
                </div>

              </div>

              <div className="date-display">

                <div className="date-icon">
                  <CalendarDays size={17} />
                </div>

                <div>
                  <span>Published date</span>
                  <strong>{formattedDate}</strong>
                </div>

              </div>

            </div>

            <div className="settings-divider" />

            {/* PRIVACY */}

            <div className="settings-block">

              <div className="settings-heading">

                <div className="settings-heading-icon">
                  {getPrivacyIcon()}
                </div>

                <div>
                  <span className="panel-kicker">
                    VISIBILITY
                  </span>

                  <h3>Who can see this?</h3>

                  <p>
                    You control who gets to read your moment.
                  </p>
                </div>

              </div>

              <div className="privacy-selector">

                <button
                  type="button"
                  className="privacy-current"
                  onClick={() =>
                    setShowPrivacy(!showPrivacy)
                  }
                >

                  <div className="privacy-current-left">
                    {getPrivacyIcon()}
                    <span>{getPrivacyLabel()}</span>
                  </div>

                  <ChevronDown
                    size={15}
                    className={
                      showPrivacy ? "chevron-open" : ""
                    }
                  />

                </button>

                {showPrivacy && (

                  <div className="privacy-dropdown">

                    <button
                      type="button"
                      className={`privacy-option ${
                        privacy === "public"
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => {
                        setPrivacy("public");
                        setShowPrivacy(false);
                      }}
                    >

                      <Globe2 size={17} />

                      <div>
                        <strong>Everyone</strong>
                        <span>
                          Anyone can discover this moment.
                        </span>
                      </div>

                      {privacy === "public" && (
                        <Check size={15} />
                      )}

                    </button>

                    <button
                      type="button"
                      className={`privacy-option ${
                        privacy === "followers"
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => {
                        setPrivacy("followers");
                        setShowPrivacy(false);
                      }}
                    >

                      <Users size={17} />

                      <div>
                        <strong>Followers</strong>
                        <span>
                          Only people who follow you.
                        </span>
                      </div>

                      {privacy === "followers" && (
                        <Check size={15} />
                      )}

                    </button>

                    <button
                      type="button"
                      className={`privacy-option ${
                        privacy === "private"
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => {
                        setPrivacy("private");
                        setShowPrivacy(false);
                      }}
                    >

                      <Lock size={17} />

                      <div>
                        <strong>Only me</strong>
                        <span>
                          Keep this moment private.
                        </span>
                      </div>

                      {privacy === "private" && (
                        <Check size={15} />
                      )}

                    </button>

                  </div>

                )}

              </div>

            </div>

            {/* PHILOSOPHY */}

            <div className="philosophy-card">

              <div className="philosophy-icon">
                <Heart size={16} />
              </div>

              <div>
                <span className="philosophy-label">
                  MEMOIRE PHILOSOPHY
                </span>

                <strong>Keep it human.</strong>

                <p>
                  Write naturally. Your memories belong
                  to you — not to an algorithm.
                </p>
              </div>

            </div>

          </div>

        </aside>

      </section>

    </main>
  );
}

export default CreatePost;