import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { PenLine, Image, Video, Upload, X, ArrowRight } from "lucide-react";

import "./CreatePost.css";

function CreatePost() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];

    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const form = new FormData();

      form.append("title", formData.title);
      form.append("content", formData.content);

      if (file) {
        form.append("media", file);
      }

      await API.post("/posts", form, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Post published successfully!");

      navigate("/blogs");
    } catch (err) {
      console.error("CREATE POST ERROR:", err);

      console.error("SERVER RESPONSE:", err.response?.data);

      alert(
        err.response?.data?.message || "Error creating post. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-page">
      <section className="create-container">
        <div className="create-header">
          <span className="create-tag">CREATE STORY</span>

          <h1>Share your thoughts.</h1>

          <p>
            Write something meaningful and share it with the InkWhisper
            community.
          </p>
        </div>

        <div className="create-card">
          <div className="create-card-header">
            <div className="create-icon">
              <PenLine size={20} />
            </div>

            <div>
              <h2>New Story</h2>
              <p>Start writing your next idea.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="create-form">
            <div className="create-input-group">
              <label>Title</label>

              <input
                type="text"
                name="title"
                placeholder="Enter your story title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-input-group">
              <label>Your Story</label>

              <textarea
                name="content"
                placeholder="Write your thoughts here..."
                value={formData.content}
                onChange={handleChange}
                required
              />
            </div>

            <div className="create-media-section">
              <label className="create-media-label">
                {!preview ? (
                  <>
                    <Upload size={18} />
                    Add Image or Video
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      hidden
                    />
                  </>
                ) : (
                  <>
                    <Image size={18} />
                    Change Media
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      hidden
                    />
                  </>
                )}
              </label>

              {preview && (
                <div className="create-preview">
                  <div className="preview-top">
                    <span>Preview</span>

                    <button
                      type="button"
                      onClick={removeFile}
                      className="remove-media-btn"
                    >
                      <X size={16} />
                      Remove
                    </button>
                  </div>

                  {file?.type.startsWith("video") ? (
                    <video src={preview} controls className="preview-media" />
                  ) : (
                    <img
                      src={preview}
                      alt="Preview"
                      className="preview-media"
                    />
                  )}
                </div>
              )}
            </div>

            <div className="create-footer">
              <p>Your story will be visible to the community.</p>

              <button className="publish-btn" type="submit" disabled={loading}>
                {loading ? "Publishing..." : "Publish Story"}

                {!loading && <ArrowRight size={18} />}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default CreatePost;
