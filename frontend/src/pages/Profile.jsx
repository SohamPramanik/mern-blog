import { useEffect, useState } from "react";
import API from "../services/api";
import PostCard from "../components/PostCard";
import { User, PenLine } from "lucide-react";

import "./Profile.css";

function Profile() {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/posts/myposts", {
          headers: {
            Authorization: token,
          },
        });

        setPosts(res.data);

        if (res.data.length > 0) {
          setUsername(res.data[0].author?.username || "");
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <main className="profile-page">
        <div className="profile-loading">
          Loading profile...
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <div className="profile-container">

        <section className="profile-header">
          <div className="profile-avatar">
            <User size={32} />
          </div>

          <div className="profile-info">
            <p>MY PROFILE</p>

            <h1>{username ? username : "User"}</h1>

            <span>
              {posts.length}{" "}
              {posts.length === 1 ? "story" : "stories"} published
            </span>
          </div>
        </section>

        <section className="profile-posts-section">
          <div className="profile-section-title">
            <div>
              <span>
                <PenLine size={16} />
                MY STORIES
              </span>

              <h2>Your posts</h2>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="profile-empty">
              <PenLine size={32} />

              <h3>No stories yet</h3>

              <p>
                Start writing and share your first story with the InkWhisper
                community.
              </p>
            </div>
          ) : (
            <div className="profile-posts">
              {posts.map((post) => (
                <div className="profile-post-box" key={post._id}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default Profile;