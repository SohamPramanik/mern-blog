import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Upload,
  X,
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Video,
} from "lucide-react";

import API from "../services/api";

import "./EditPost.css";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH POST
  // =========================================================

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get(`/posts/${id}`);

        const post = res.data;

        setFormData({
          title: post.title || "",
          content: post.content || "",
        });

        // =====================================================
        // CLOUDINARY MEDIA
        // =====================================================

        if (post.media?.url) {
          setPreview(post.media.url);
          setMediaType(post.media.type || "");
        } else {
          setPreview(null);
          setMediaType("");
        }
      } catch (err) {
        console.error("FETCH EDIT POST ERROR:", err);

        if (err.response?.status === 401) {
          navigate("/login");
          return;
        }

        if (err.response?.status === 403) {
          setError("You are not allowed to edit this moment.");
          return;
        }

        setError(err.response?.data?.message || "Failed to load this moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // FILE CHANGE
  // =========================================================

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];

    if (!selected) return;

    setFile(selected);

    const objectUrl = URL.createObjectURL(selected);

    setPreview(objectUrl);

    if (selected.type.startsWith("video/")) {
      setMediaType("video");
    } else {
      setMediaType("image");
    }

    setError("");
  };

  // =========================================================
  // REMOVE MEDIA
  // =========================================================

  const removeMedia = () => {
    if (preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview(null);
    setMediaType("");
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError("Moment title is required.");
      return;
    }

    if (!formData.content.trim()) {
      setError("Moment content is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const form = new FormData();

      form.append("title", formData.title.trim());
      form.append("content", formData.content.trim());

      // =====================================================
      // MEDIA
      // =====================================================

      if (file) {
        // New image/video selected
        form.append("media", file);
      } else if (!preview) {
        // Existing media removed
        form.append("removeMedia", "true");
      }

      await API.put(`/posts/${id}`, form);

      // =====================================================
      // CLEANUP LOCAL PREVIEW
      // =====================================================

      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }

      navigate("/profile");
    } catch (err) {
      console.error("UPDATE POST ERROR:", err);

      setError(err.response?.data?.message || "Failed to update your moment.");
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="edit-page">
        <div className="edit-container">
          <div className="edit-loading">
            <span>LOADING MOMENT</span>
            <p>Preparing your story...</p>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error && !formData.title) {
    return (
      <main className="edit-page">
        <div className="edit-container">
          <div className="edit-error-card">
            <span>UNABLE TO EDIT</span>

            <h1>Something went wrong.</h1>

            <p>{error}</p>

            <button type="button" onClick={() => navigate("/profile")}>
              Back to profile
            </button>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="edit-page">
      <div className="edit-container">
        {/* ===================================================
            TOP BAR
        =================================================== */}

        <div className="edit-topbar">
          <button
            type="button"
            className="edit-back-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <span>MEMOIRE · EDITOR</span>
        </div>

        {/* ===================================================
            CARD
        =================================================== */}

        <div className="edit-card">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="edit-header">
            <span className="edit-eyebrow">EDIT MOMENT</span>

            <h1>Refine your story.</h1>

            <p>Make changes to your moment while keeping the story yours.</p>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && <div className="edit-inline-error">{error}</div>}

          {/* =================================================
              FORM
          ================================================= */}

          <form onSubmit={handleSubmit} className="edit-form">
            {/* ===============================================
                TITLE
            =============================================== */}

            <div className="edit-input-group">
              <div className="edit-label-row">
                <label htmlFor="title">Moment title</label>

                <span>{formData.title.length}/150</span>
              </div>

              <input
                id="title"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Give this moment a title..."
                maxLength={150}
                required
              />
            </div>

            {/* ===============================================
                CONTENT
            =============================================== */}

            <div className="edit-input-group">
              <div className="edit-label-row">
                <label htmlFor="content">Your story</label>

                <span>{formData.content.length} characters</span>
              </div>

              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your moment..."
                required
              />
            </div>

            {/* ===============================================
                MEDIA
            =============================================== */}

            <div className="edit-media-section">
              <div className="edit-section-heading">
                <div>
                  <label>Moment media</label>

                  <p>
                    Replace or remove the image or video attached to this
                    moment.
                  </p>
                </div>

                <span>OPTIONAL</span>
              </div>

              {/* =============================================
                  NO MEDIA
              ============================================= */}

              {!preview ? (
                <label className="edit-upload-box">
                  <div className="edit-upload-icon">
                    <Upload size={22} />
                  </div>

                  <strong>Add an image or video</strong>

                  <span>Choose a new file from your device</span>

                  <small>Images and videos up to 20 MB</small>

                  <input
                    type="file"
                    accept="image/*,video/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="edit-preview-container">
                  {/* =========================================
                      MEDIA PREVIEW
                  ========================================= */}

                  <div className="edit-preview">
                    {mediaType === "video" ? (
                      <video
                        src={preview}
                        controls
                        className="edit-preview-media"
                      />
                    ) : (
                      <img
                        src={preview}
                        alt="Moment preview"
                        className="edit-preview-media"
                      />
                    )}

                    <div className="edit-media-type">
                      {mediaType === "video" ? (
                        <>
                          <Video size={14} />
                          Video
                        </>
                      ) : (
                        <>
                          <ImageIcon size={14} />
                          Image
                        </>
                      )}
                    </div>
                  </div>

                  {/* =========================================
                      MEDIA ACTIONS
                  ========================================= */}

                  <div className="edit-media-actions">
                    <label className="edit-change-btn">
                      <Upload size={15} />
                      Replace media
                      <input
                        type="file"
                        accept="image/*,video/*"
                        hidden
                        onChange={handleFileChange}
                      />
                    </label>

                    <button
                      type="button"
                      className="edit-remove-btn"
                      onClick={removeMedia}
                    >
                      <X size={15} />
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ===============================================
                FOOTER
            =============================================== */}

            <div className="edit-footer">
              <div className="edit-footer-note">
                <span>YOUR STORY</span>

                <p>Memoire never rewrites your story. You remain the author.</p>
              </div>

              <div className="edit-footer-actions">
                <button
                  type="button"
                  className="edit-cancel-btn"
                  onClick={() => navigate(-1)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="edit-submit-btn"
                  disabled={saving}
                >
                  {saving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save size={16} />
                      Save changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default EditPost;
