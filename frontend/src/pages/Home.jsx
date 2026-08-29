import { Link } from "react-router-dom";

import {
  ArrowRight,
  PenLine,
  BookOpen,
  Sparkles,
  Users,
  Heart,
  Feather,
  TrendingUp,
  Quote,
} from "lucide-react";

import "./Home.css";

export default function Home() {
  const features = [
    {
      icon: <PenLine size={26} />,
      title: "Write Freely",
      description:
        "Turn thoughts, stories, and ideas into beautifully crafted digital experiences.",
    },
    {
      icon: <BookOpen size={26} />,
      title: "Discover Stories",
      description:
        "Explore perspectives, experiences, and ideas shared by a growing community.",
    },
    {
      icon: <Heart size={26} />,
      title: "Meaningful Connections",
      description:
        "Engage with writers and readers who share your curiosity and imagination.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Stories Shared" },
    { number: "5K+", label: "Creative Minds" },
    { number: "50K+", label: "Ideas Explored" },
  ];

  return (
    <main className="ink-home">
      {/* ================= BACKGROUND ================= */}

      <div className="ink-grid" />
      <div className="ink-orb ink-orb-one" />
      <div className="ink-orb ink-orb-two" />
      <div className="ink-orb ink-orb-three" />

      {/* ================= HERO ================= */}

      <section className="ink-hero">
        <div className="ink-hero-glow" />

        <div className="ink-hero-content">
          <div className="ink-eyebrow">
            <Sparkles size={15} />
            <span>A space for ideas that deserve to live</span>
          </div>

          <h1>
            Where words become
            <span> unforgettable.</span>
          </h1>

          <p>
            InkWhisper is a home for curious minds, thoughtful stories, and
            ideas waiting to be discovered. Write what matters. Read what moves
            you.
          </p>

          <div className="ink-hero-actions">
            <Link to="/register" className="ink-btn ink-btn-primary">
              Start Writing
              <ArrowRight size={18} />
            </Link>

            <Link to="/blogs" className="ink-btn ink-btn-secondary">
              Explore Stories
              <BookOpen size={18} />
            </Link>
          </div>

          <div className="ink-trusted">
            <div className="ink-trusted-line" />

            <span>
              <Feather size={16} />
              Built for thinkers, dreamers & storytellers
            </span>

            <div className="ink-trusted-line" />
          </div>
        </div>

        {/* Floating Cards */}

        <div className="ink-floating-card ink-card-left">
          <div className="floating-icon">
            <Quote size={20} />
          </div>

          <p>"Every great idea begins as a quiet whisper."</p>

          <span>— InkWhisper</span>
        </div>

        <div className="ink-floating-card ink-card-right">
          <div className="mini-stat">
            <TrendingUp size={19} />
            <span>Growing Community</span>
          </div>

          <strong>+128%</strong>

          <p>More stories discovered this month.</p>
        </div>
      </section>

      {/* ================= STATS ================= */}

      <section className="ink-stats-section">
        <div className="ink-stats">
          {stats.map((stat, index) => (
            <div className="ink-stat" key={index}>
              <h2>{stat.number}</h2>

              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURE SECTION ================= */}

      <section className="ink-features">
        <div className="ink-section-heading">
          <span className="section-tag">
            <Sparkles size={15} />
            WHY INKWHISPER
          </span>

          <h2>
            More than a blog.
            <span> A place to belong.</span>
          </h2>

          <p>
            A thoughtfully designed space where writing feels effortless and
            discovering ideas feels inspiring.
          </p>
        </div>

        <div className="ink-feature-grid">
          {features.map((feature, index) => (
            <div className="ink-feature-card" key={index}>
              <div className="ink-feature-number">0{index + 1}</div>

              <div className="ink-feature-icon">{feature.icon}</div>

              <h3>{feature.title}</h3>

              <p>{feature.description}</p>

              <div className="ink-feature-arrow">
                <ArrowRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= EXPERIENCE SECTION ================= */}

      <section className="ink-experience">
        <div className="ink-experience-content">
          <div className="experience-label">
            <Users size={16} />A COMMUNITY OF IDEAS
          </div>

          <h2>
            Your thoughts deserve
            <span> an audience.</span>
          </h2>

          <p>
            Whether you're documenting your journey, sharing knowledge, or
            simply putting your imagination into words, InkWhisper gives your
            voice a place to be heard.
          </p>

          <Link to="/register" className="ink-text-link">
            Begin your journey
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="ink-experience-visual">
          <div className="experience-window">
            <div className="window-top">
              <div className="window-dots">
                <span />
                <span />
                <span />
              </div>

              <span>inkwhisper.com/write</span>
            </div>

            <div className="window-body">
              <span className="draft-label">NEW STORY</span>

              <h3>
                The quiet power
                <br />
                of imagination.
              </h3>

              <div className="draft-lines">
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="draft-footer">
                <div className="draft-author">
                  <div className="author-avatar">I</div>

                  <span>InkWhisper Writer</span>
                </div>

                <div className="draft-status">
                  <span />
                  Saved
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section className="ink-cta">
        <div className="ink-cta-glow" />

        <div className="ink-cta-content">
          <div className="cta-icon">
            <Feather size={28} />
          </div>

          <h2>
            Your next story is
            <span> waiting to be written.</span>
          </h2>

          <p>
            Join a growing community of writers and readers who believe that
            ideas have the power to inspire.
          </p>

          <Link to="/register" className="ink-btn ink-btn-primary">
            Create Your Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <footer className="ink-footer">
        <div className="footer-brand">
          <Feather size={19} />
          <span>InkWhisper</span>
        </div>

        <p>© 2026 InkWhisper. Where ideas find their voice.</p>

        <div className="footer-links">
          <Link to="/blogs">Stories</Link>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Join Us</Link>
        </div>
      </footer>
    </main>
  );
}
