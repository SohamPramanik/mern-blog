import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">✨ Welcome to SohamBlog</span>

          <h1>
            Discover Amazing
            <br />
            Stories & Ideas
          </h1>

          <p>
            Read articles from developers, students, designers and creators.
            Learn something new every day and share your own knowledge with the
            world.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigate("/blogs")}>
              Start Reading →
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/create")}
            >
              Write a Blog
            </button>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat-card">
          <h2>1000+</h2>
          <span>Articles</span>
        </div>

        <div className="stat-card">
          <h2>500+</h2>
          <span>Authors</span>
        </div>

        <div className="stat-card">
          <h2>20K+</h2>
          <span>Readers</span>
        </div>
      </section>
    </div>
  );
}

export default Home;
