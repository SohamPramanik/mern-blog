import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Heart,
  PenLine,
  Sparkles,
  Clock3,
  Users,
} from "lucide-react";
import "./Home.css";

function Home() {
  return (
    <main className="home">
      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">YOUR STORY, ONE MOMENT AT A TIME.</p>

          <h1>
            Life isn't a single story.
            <span> It's a collection of moments.</span>
          </h1>

          <p className="hero-description">
            Memoire is a place to write the moments that matter, build journeys
            from them, and discover the stories that make people who they are.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">
              Start Your Story
              <ArrowRight size={18} />
            </Link>

            <Link to="/blogs" className="btn-secondary">
              Explore Stories
            </Link>
          </div>

          <div className="hero-note">
            <span></span>
            Your words. Your journey. Your memories.
          </div>
        </div>

        {/* Decorative timeline */}
        <div className="hero-timeline">
          <div className="timeline-line"></div>

          <div className="timeline-item timeline-item-1">
            <div className="timeline-dot"></div>
            <div className="timeline-card">
              <span>08 MAY 2024</span>
              <strong>The day everything changed.</strong>
            </div>
          </div>

          <div className="timeline-item timeline-item-2">
            <div className="timeline-dot"></div>
            <div className="timeline-card">
              <span>17 AUG 2025</span>
              <strong>A journey worth remembering.</strong>
            </div>
          </div>

          <div className="timeline-item timeline-item-3">
            <div className="timeline-dot"></div>
            <div className="timeline-card">
              <span>TODAY</span>
              <strong>Still writing the story...</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTRO ================= */}
      <section className="intro-section">
        <div className="section-label">
          <span>01</span>
          THE IDEA
        </div>

        <div className="intro-content">
          <h2>
            Don't just post.
            <br />
            <em>Tell your story.</em>
          </h2>

          <p>
            Social media gives you posts. Memoire gives you a story. Every
            thought, experience, achievement, failure and memory can become part
            of something bigger.
          </p>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features-section">
        <div className="section-heading">
          <div>
            <div className="section-label">
              <span>02</span>
              HOW MEMOIRE WORKS
            </div>

            <h2>
              One moment.
              <br />
              <em>One journey.</em>
            </h2>
          </div>

          <p>
            Your life doesn't happen in categories. It happens moment by moment.
          </p>
        </div>

        <div className="features-grid">
          <article className="feature-card feature-large">
            <div className="feature-icon">
              <PenLine size={22} />
            </div>

            <span className="feature-number">01</span>

            <h3>Write a Moment</h3>

            <p>
              Capture something that happened, something you felt, something you
              learned, or simply something you want to remember.
            </p>

            <div className="feature-decoration">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <BookOpen size={22} />
            </div>

            <span className="feature-number">02</span>

            <h3>Build a Journey</h3>

            <p>
              Connect moments together and create journeys around the chapters
              of your life.
            </p>

            <div className="feature-example">My College Journey</div>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <Clock3 size={22} />
            </div>

            <span className="feature-number">03</span>

            <h3>Follow the Timeline</h3>

            <p>
              Read a journey from the beginning and watch how a story evolves
              over time.
            </p>

            <div className="mini-timeline">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <Heart size={22} />
            </div>

            <span className="feature-number">04</span>

            <h3>Connect</h3>

            <p>
              Like moments, leave thoughtful comments and connect with people
              through their stories.
            </p>

            <div className="heart-decoration">♥</div>
          </article>

          <article className="feature-card ai-card">
            <div className="feature-icon">
              <Sparkles size={22} />
            </div>

            <span className="feature-number">05</span>

            <h3>AI That Understands</h3>

            <p>
              AI can understand the emotions, themes and connections inside your
              writing — without changing your words.
            </p>

            <div className="ai-note">
              <Sparkles size={14} />
              Your story stays yours.
            </div>
          </article>

          <article className="feature-card">
            <div className="feature-icon">
              <Users size={22} />
            </div>

            <span className="feature-number">06</span>

            <h3>Discover People</h3>

            <p>
              Explore different journeys and discover stories from people around
              the world.
            </p>
          </article>
        </div>
      </section>

      {/* ================= STORY PREVIEW ================= */}
      <section className="story-section">
        <div className="section-label">
          <span>03</span>A STORY IN MOTION
        </div>

        <div className="story-header">
          <div>
            <p className="story-author">ARJUN'S MEMOIRE</p>

            <h2>
              My College
              <br />
              <em>Journey</em>
            </h2>
          </div>

          <p className="story-description">
            Three moments. Three different versions of the same person. That's
            what makes a journey a story.
          </p>
        </div>

        <div className="story-timeline">
          <div className="story-line"></div>

          <article className="story-moment">
            <div className="story-date">
              <span>12</span>
              <small>
                AUG
                <br />
                2023
              </small>
            </div>

            <div className="story-dot"></div>

            <div className="story-content">
              <span className="moment-label">FIRST MOMENT</span>

              <h3>The first day didn't feel real.</h3>

              <p>
                New campus. New people. A completely different chapter of life
                was beginning...
              </p>

              <button className="read-moment">
                Read Moment <ArrowRight size={15} />
              </button>
            </div>
          </article>

          <article className="story-moment">
            <div className="story-date">
              <span>27</span>
              <small>
                JAN
                <br />
                2024
              </small>
            </div>

            <div className="story-dot"></div>

            <div className="story-content">
              <span className="moment-label">MILESTONE</span>

              <h3>I finally built something I was proud of.</h3>

              <p>
                Months of learning, breaking things and trying again. Somehow,
                it started making sense...
              </p>

              <button className="read-moment">
                Read Moment <ArrowRight size={15} />
              </button>
            </div>
          </article>

          <article className="story-moment">
            <div className="story-date">
              <span>18</span>
              <small>
                SEP
                <br />
                2026
              </small>
            </div>

            <div className="story-dot"></div>

            <div className="story-content">
              <span className="moment-label">TODAY</span>

              <h3>I'm still figuring it all out.</h3>

              <p>Maybe that's the point. The story isn't finished yet.</p>

              <button className="read-moment">
                Read Journey <ArrowRight size={15} />
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* ================= COMMUNITY ================= */}
      <section className="community-section">
        <div className="community-inner">
          <div className="community-icon">
            <BookOpen size={25} />
          </div>

          <p className="community-label">THE MEMOIRE COMMUNITY</p>

          <h2>
            Every person has a story
            <br />
            <em>worth reading.</em>
          </h2>

          <p className="community-text">
            Somewhere between the big milestones are the small moments that
            actually make us who we are.
          </p>

          <Link to="/blogs" className="community-button">
            Explore Stories
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      {/* <section className="final-cta">
        <div className="cta-decoration">
          <span></span>
          <span></span>
          <span></span>
        </div>

        <p>YOUR STORY STARTS HERE</p>

        <h2>
          Write the moment.
          <br />
          <em>Build the journey.</em>
        </h2>

        <Link to="/register" className="btn-primary cta-button">
          Start Writing
          <ArrowRight size={18} />
        </Link>
      </section> */}

      {/* ================= FOOTER ================= */}
      <footer className="home-footer">
        <div className="footer-brand">
          <span>MEMOIRE</span>
          <p>Your story, one moment at a time.</p>
        </div>

        <div className="footer-right">© 2026 Memoire</div>
      </footer>
    </main>
  );
}

export default Home;
