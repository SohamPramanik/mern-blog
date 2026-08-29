import { useEffect, useState } from "react";
import { Search, PenLine, BookOpen, Sparkles } from "lucide-react";

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
      {/* Background Effects */}
      <div className="blogs-grid" />
      <div className="blogs-glow blogs-glow-one" />
      <div className="blogs-glow blogs-glow-two" />

      {/* Hero */}
      <section className="blogs-hero">
        <div className="blogs-hero-content">
          <div className="blogs-eyebrow">
            <Sparkles size={14} />
            <span>Discover Ideas</span>
          </div>

          <h1>
            Stories worth
            <span> getting lost in.</span>
          </h1>

          <p>
            Explore thoughts, experiences, and ideas from writers who still
            believe that words have the power to move people.
          </p>

          <div className="blogs-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search stories, ideas, or writers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="blogs-content">
        <div className="blogs-content-header">
          <div>
            <span className="blogs-section-label">
              <BookOpen size={14} />
              THE COLLECTION
            </span>

            <h2>Latest stories</h2>
          </div>

          <div className="blogs-count">
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "story" : "stories"}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="blogs-loading">
            <div className="loading-ring" />
            <p>Gathering stories...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPosts.length === 0 && (
          <div className="blogs-empty">
            <div className="empty-icon">
              {search ? <Search size={28} /> : <PenLine size={28} />}
            </div>

            <h3>
              {search
                ? "No stories found"
                : "The page is waiting for its first story"}
            </h3>

            <p>
              {search
                ? "Try searching with a different word or phrase."
                : "Be the first voice to leave something worth reading."}
            </p>
          </div>
        )}

        {/* Posts */}
        {!loading && filteredPosts.length > 0 && (
          <div className="blogs-posts">
            {filteredPosts.map((post, index) => (
              <div
                className="blogs-post-wrapper"
                key={post._id}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
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
