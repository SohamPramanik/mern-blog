import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";
import API from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await API.post("/auth/login", formData);

      // Save JWT token
      localStorage.setItem("token", res.data.token);

      // Save logged-in user's information
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Go to Explore/Blogs page
      navigate("/blogs");
    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message ||
          "Login failed. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      {/* ================= LEFT SIDE ================= */}

      <section className="login-story">
        <Link to="/" className="login-brand">
          MEMOIRE
        </Link>

        <div className="login-story-content">
          <span className="login-eyebrow">
            <Sparkles size={14} />
            WELCOME BACK
          </span>

          <h1>
            Your story
            <br />
            is waiting
            <br />
            <em>for you.</em>
          </h1>

          <p>
            Continue writing the moments that matter. Pick up where you left off
            and keep building your journey.
          </p>

          <div className="login-decoration">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className="login-quote">
            <BookOpen size={18} />

            <div>
              <p>
                "Some moments are worth remembering. Some are worth writing
                down."
              </p>

              <span>— MEMOIRE</span>
            </div>
          </div>
        </div>

        <div className="login-story-footer">
          Your words. Your journey. Your memories.
        </div>
      </section>

      {/* ================= RIGHT SIDE ================= */}

      <section className="login-form-section">
        <div className="login-card">
          {/* Mobile brand */}

          <div className="mobile-login-brand">MEMOIRE</div>

          {/* ================= HEADER ================= */}

          <div className="login-header">
            <span className="login-form-label">WELCOME BACK</span>

            <h2>
              Continue your <em>story.</em>
            </h2>

            <p>Sign in to return to your moments and journeys.</p>
          </div>

          {/* ================= FORM ================= */}

          <form onSubmit={handleSubmit}>
            {/* Email */}

            <div className="login-form-group">
              <label htmlFor="login-email">Email address</label>

              <div className="login-input-box">
                <Mail size={18} />

                <input
                  id="login-email"
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

            <div className="login-form-group">
              <div className="password-label-row">
                <label htmlFor="login-password">Password</label>
              </div>

              <div className="login-input-box">
                <Lock size={18} />

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error */}

            {errorMsg && <div className="login-error">{errorMsg}</div>}

            {/* Submit */}

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Signing you in...
                </>
              ) : (
                <>
                  Continue to Memoire
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* ================= REGISTER ================= */}

          <div className="login-register">
            <span>Don't have an account?</span>

            <Link to="/register">
              Create your Memoire
              <ArrowRight size={14} />
            </Link>
          </div>

          <p className="login-note">
            Your moments and journeys are waiting for you.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
