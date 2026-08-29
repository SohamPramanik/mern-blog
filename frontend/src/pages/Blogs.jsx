import { useEffect, useState } from "react";
import { Search, PenLine } from "lucide-react";

import API from "../services/api";
import PostCard from "../components/PostCard";

import "./Blogs.css";

function Blogs() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const searchText = search.toLowerCase();

    return (
      post.title?.toLowerCase().includes(searchText) ||
      post.content?.toLowerCase().includes(searchText) ||
      post.author?.name?.toLowerCase().includes(searchText)
    );
  });

  return (
    <main className="blogs-page">
      <section className="blogs-hero">
        <div className="blogs-hero-content">
          <span className="blogs-tag">EXPLORE STORIES</span>

          <h1>Discover ideas and stories.</h1>

          <p>
            Read thoughts, experiences, and stories shared by the InkWhisper
            community.
          </p>

          <div className="blogs-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search stories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="blogs-content">
        <div className="blogs-header">
          <div>
            <span className="blogs-small-title">LATEST POSTS</span>
            <h2>Stories</h2>
          </div>

          <span className="blogs-count">
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "story" : "stories"}
          </span>
        </div>

        {loading && (
          <div className="blogs-loading">
            <div className="loading-spinner"></div>
            <p>Loading stories...</p>
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <div className="blogs-empty">
            <PenLine size={32} />

            <h3>{search ? "No stories found" : "No stories available yet"}</h3>

            <p>
              {search
                ? "Try searching with another keyword."
                : "Be the first person to share a story."}
            </p>
          </div>
        )}

        {!loading && filteredPosts.length > 0 && (
          <div className="blogs-posts">
            {filteredPosts.map((post) => (
              <div className="blog-post-box" key={post._id}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Blogs;
