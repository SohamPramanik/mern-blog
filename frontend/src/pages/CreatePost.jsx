import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    setFile(selected);

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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

      alert("Post created successfully!");

      setTimeout(() => {
        navigate("/blogs");
      }, 500);
    } catch (err) {
      console.log(err);
      alert("Error creating post");
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Create New Post</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Post Title"
            onChange={handleChange}
            required
          />

          <textarea
            name="content"
            placeholder="Write your thoughts..."
            onChange={handleChange}
            required
          />

          {/* <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
          /> */}

          <div className="media-upload">
            <label className="upload-btn">
              📷 Choose Image / Video
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                hidden
              />
            </label>

            {preview && (
              <div className="preview-box">
                {file?.type.startsWith("video") ? (
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
                      onChange={handleFileChange}
                      hidden
                    />
                  </label>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="publish-btn" type="submit">
            Publish Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
