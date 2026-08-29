import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

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
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join InkWhisper and start sharing your ideas.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="register-form-group">
            <label>Username</label>

            <div className="register-input-box">
              <User size={18} />

              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="register-form-group">
            <label>Email</label>

            <div className="register-input-box">
              <Mail size={18} />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="register-form-group">
            <label>Password</label>

            <div className="register-input-box">
              <Lock size={18} />

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {errorMsg && (
            <div className="register-error">
              {errorMsg}
            </div>
          )}

          <button
            className="register-submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="register-login">
          Already have an account?{" "}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;