import { Link } from "react-router-dom";
import API from "../services/api";

function PostCard({ post }) {
  const token = localStorage.getItem("token");

  const likePost = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/posts/like/${post._id}`,
        {},
        {
          headers: { Authorization: token },
        },
      );

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const deletePost = async () => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await API.delete(`/posts/${post._id}`, {
        headers: { Authorization: token },
      });

      window.location.reload();
    } catch (error) {
      alert("Error deleting post");
    }
  };

  return (
    <div className="card">
      {/* POST TITLE */}
      <Link to={`/post/${post._id}`}>
        <h2>{post.title}</h2>
      </Link>

      {/* MEDIA (IMAGE / VIDEO) */}
      {post.media && (
        <div style={{ marginTop: "10px" }}>
          {post.media.match(/\.(mp4|webm|ogg)$/i) ? (
            <video
              src={`http://localhost:5000/uploads/${post.media}`}
              controls
              style={{
                width: "100%",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            />
          ) : (
            <img
              src={`http://localhost:5000/uploads/${post.media}`}
              alt="post media"
              style={{
                width: "100%",
                borderRadius: "10px",
                marginTop: "10px",
              }}
            />
          )}
        </div>
      )}

      {/* POST PREVIEW */}
      <p style={{ marginTop: "10px" }}>{post.content.substring(0, 120)}...</p>

      <p style={{ fontSize: "13px", color: "#aaa" }}>
        {new Date(post.createdAt).toLocaleString()}
      </p>

      {/* AUTHOR */}
      <p>
        <b>Author:</b> {post.author?.username}
      </p>

      <button className="like-btn" onClick={likePost}>
        ❤️ {post.likes?.length || 0}
      </button>

      {/* ACTION BUTTONS */}
      {token && (
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <Link to={`/edit/${post._id}`}>
            <button className="edit-btn">Edit</button>
          </Link>

          <button className="delete-btn" onClick={deletePost}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default PostCard;
