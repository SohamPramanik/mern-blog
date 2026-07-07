import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="bg-gradient"></div>
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
      <div className="blob blob3"></div>

      <section className="hero">
        <span className="badge"> INSPIRED EXPERIENCE</span>

        <h1>
          Think.
          <br />
          Write.
          <br />
          Inspire.
        </h1>

        <p>
          A beautifully crafted space where ideas become stories, and stories
          become inspiration. Designed for creators who believe words deserve
          elegance.
        </p>

        <div className="buttons">
          <button className="primary" onClick={() => navigate("/blogs")}>
            Explore Stories
          </button>

          <button className="secondary" onClick={() => navigate("/create")}>
            Start Writing
          </button>
        </div>

        <div className="stats">
          <div>
            <h2>1K+</h2>
            <span>Articles</span>
          </div>

          <div>
            <h2>500+</h2>
            <span>Creators</span>
          </div>

          <div>
            <h2>20K+</h2>
            <span>Readers</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
