import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">✦ Modern Publishing Platform</span>

          <h1>
            Where Great Ideas
            <br />
            Find Their Voice.
          </h1>

          <p>
            Explore thoughtfully crafted articles on technology, design,
            software development, productivity, and innovation. Share your
            knowledge, inspire others, and become part of a growing community of
            passionate creators.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate("/blogs")}>
              Explore Articles
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/create")}
            >
              Start Writing
            </button>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <h2>1K+</h2>
          <span>Published Articles</span>
        </div>

        <div className="stat-card">
          <h2>500+</h2>
          <span>Writers</span>
        </div>

        <div className="stat-card">
          <h2>20K+</h2>
          <span>Monthly Readers</span>
        </div>
      </section>
    </div>
  );
}

export default Home;
