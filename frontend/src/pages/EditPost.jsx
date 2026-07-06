import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${id}`);

        setFormData({
          title: res.data.title,
          content: res.data.content,
        });

        if (res.data.media) {
          setPreview(`http://localhost:5000/uploads/${res.data.media}`);
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
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const removeMedia = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Edit Post</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Post Title"
            required
          />

          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write something..."
            required
          />

          <div className="media-upload">
            <label className="upload-btn">
              📷 Choose New Image / Video
              <input
                type="file"
                accept="image/*,video/*"
                hidden
                onChange={handleFileChange}
              />
            </label>

            {preview && (
              <div className="preview-box">
                {file ? (
                  file.type.startsWith("video") ? (
                    <video src={preview} controls className="preview-media" />
                  ) : (
                    <img
                      src={preview}
                      alt="preview"
                      className="preview-media"
                    />
                  )
                ) : preview.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video src={preview} controls className="preview-media" />
                ) : (
                  <img src={preview} alt="preview" className="preview-media" />
                )}

                <div className="media-actions">
                  <label className="change-btn">
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
                    className="remove-btn"
                    onClick={removeMedia}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="publish-btn" type="submit">
            Update Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditPost;
