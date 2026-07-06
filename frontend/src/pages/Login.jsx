import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setErrorMsg("");

    try {

      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);

      // show success toast
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/Blogs");
      }, 1500);

    } catch (error) {

      setErrorMsg("Login failed. Check your email or password.");

    }

  };

  return (

    <div className="login-wrapper">

      {/* SUCCESS TOAST */}
      {showSuccess && (
        <div className="success-toast">
          <span className="success-icon">👍</span>
          Login Successful
        </div>
      )}

      <div className="login-card">

        <h2>⚡ Login</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button className="login-btn" type="submit">
            🚀 Login
          </button>

        </form>

        {errorMsg && (
          <p style={{ color: "#ff6b6b", marginTop: "10px" }}>
            {errorMsg}
          </p>
        )}

        <div className="login-extra">
          Welcome back to SohamBlog
        </div>

      </div>

    </div>

  );

}

export default Login;