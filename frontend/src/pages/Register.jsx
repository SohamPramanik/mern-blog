import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, BookOpen, Sparkles } from "lucide-react";

import API from "../services/api";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMsg("");
    setLoading(true);

    try {
      await API.post("/auth/register", formData);

      navigate("/login");
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      {/* ================= LEFT SIDE ================= */}

      <section className="register-story">
        <Link to="/" className="register-brand">
          MEMOIRE
        </Link>

        <div className="story-content">
          <span className="story-eyebrow">
            <Sparkles size={14} />
            YOUR STORY BEGINS HERE
          </span>

          <h1>
            Every story
            <br />
            starts with
            <br />
            <em>one moment.</em>
          </h1>

          <p>
            Create your space on Memoire. Write the moments that matter, connect
            them into journeys, and preserve your story exactly the way you
            lived it.
          </p>

          <div className="story-line-decoration">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="story-quote">
            <BookOpen size={18} />

            <div>
              <p>
                "Your story doesn't have to be perfect. It just has to be
                yours."
              </p>

              <span>— MEMOIRE</span>
            </div>
          </div>
        </div>

        <div className="story-footer">
          Your words. Your journey. Your memories.
        </div>
      </section>

      {/* ================= RIGHT SIDE ================= */}

      <section className="register-form-section">
        <div className="register-card">
          <div className="register-header">
            <div className="mobile-brand">MEMOIRE</div>

            <span className="form-label">CREATE YOUR ACCOUNT</span>

            <h2>
              Begin your <em>Memoire.</em>
            </h2>

            <p>
              Join Memoire and start capturing the moments that make your story
              yours.
            </p>
          </div>

          {/* ================= FORM ================= */}

          <form onSubmit={handleSubmit}>
            {/* Username */}

            <div className="register-form-group">
              <label htmlFor="username">Username</label>

              <div className="register-input-box">
                <User size={18} />

                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="nickname"
                  required
                />
              </div>
            </div>

            {/* Email */}

            <div className="register-form-group">
              <label htmlFor="email">Email address</label>

              <div className="register-input-box">
                <Mail size={18} />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}

            <div className="register-form-group">
              <label htmlFor="password">Password</label>

              <div className="register-input-box">
                <Lock size={18} />

                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {/* Error */}

            {errorMsg && <div className="register-error">{errorMsg}</div>}

            {/* Submit */}

            <button
              className="register-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating your account...
                </>
              ) : (
                <>
                  Create My Memoire
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* ================= LOGIN ================= */}

          <div className="register-login">
            <span>Already have an account?</span>

            <Link to="/login">
              Sign in
              <ArrowRight size={14} />
            </Link>
          </div>

          <p className="register-privacy">
            By creating an account, you agree to preserve the authenticity of
            your own story.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;
