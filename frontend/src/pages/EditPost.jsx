import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, X } from "lucide-react";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${id}`);

        setFormData({
          title: res.data.title || "",
          content: res.data.content || "",
        });

        if (res.data.media) {
          const backendUrl =
            import.meta.env.VITE_API_URL?.replace("/api", "") ||
            "http://localhost:5000";

          const mediaUrl = res.data.media.startsWith("http")
            ? res.data.media
            : `${backendUrl}/uploads/${res.data.media}`;

          setPreview(mediaUrl);

          if (res.data.media.match(/\.(mp4|webm|ogg)$/i)) {
            setMediaType("video");
          } else {
            setMediaType("image");
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchPost();
  }, [id]);

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

    const url = URL.createObjectURL(selected);

    setPreview(url);

    if (selected.type.startsWith("video")) {
      setMediaType("video");
    } else {
      setMediaType("image");
    }
  };

  const removeMedia = () => {
    setFile(null);
    setPreview(null);
    setMediaType("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const form = new FormData();

      form.append("title", formData.title);
      form.append("content", formData.content);

      if (!preview) {
        form.append("removeMedia", "true");
      }

      if (file) {
        form.append("media", file);
      }

      await API.put(`/posts/${id}`, form, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Post updated successfully!");

      navigate("/blogs");
    } catch (error) {
      console.log(error);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="edit-page">
      <div className="edit-container">
        <div className="edit-card">
          <div className="edit-header">
            <span>EDIT STORY</span>

            <h1>Update your post</h1>

            <p>Make changes to your story and save them.</p>
          </div>

          <form onSubmit={handleSubmit} className="edit-form">
            <div className="edit-input-group">
              <label>Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Post title"
                required
              />
            </div>

            <div className="edit-input-group">
              <label>Content</label>

              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your story..."
                required
              />
            </div>

            <div className="edit-media-section">
              <label>Media</label>

              {!preview ? (
                <label className="edit-upload-box">
                  <Upload size={24} />

                  <span>Upload image or video</span>

                  <small>Click to choose a file</small>

                  <input
                    type="file"
                    accept="image/*,video/*"
                    hidden
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="edit-preview-container">
                  {mediaType === "video" ? (
                    <video
                      src={preview}
                      controls
                      className="edit-preview-media"
                    />
                  ) : (
                    <img
                      src={preview}
                      alt="Preview"
                      className="edit-preview-media"
                    />
                  )}

                  <div className="edit-media-actions">
                    <label className="edit-change-btn">
                      Change
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
                      <X size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="edit-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Post"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default EditPost;
