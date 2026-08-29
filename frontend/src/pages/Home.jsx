import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import "./Home.css";

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <p className="hero-tag">INKWHISPER</p>

        <h1>Write. Share. Discover.</h1>

        <p className="hero-text">
          A simple place to share your thoughts and discover stories from
          others.
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="btn-primary">
            Start Writing <ArrowRight size={18} />
          </Link>

          <Link to="/blogs" className="btn-secondary">
            Explore Blogs
          </Link>
        </div>
      </section>

      <section className="home-info">
        <div>
          <h3>Write freely</h3>
          <p>Share your thoughts, ideas, and experiences.</p>
        </div>

        <div>
          <h3>Discover stories</h3>
          <p>Read blogs written by people from the community.</p>
        </div>

        <div>
          <h3>Connect</h3>
          <p>Join a growing community of writers and readers.</p>
        </div>
      </section>

      <footer className="home-footer">© 2026 InkWhisper</footer>
    </main>
  );
}

export default Home;
