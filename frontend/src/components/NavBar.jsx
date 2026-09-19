import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { PenLine, BookOpen, User, LogOut } from "lucide-react";

import "./NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem("token"));

  // =========================================================
  // KEEP LOGIN STATE IN SYNC
  // =========================================================

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location.pathname]);

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");

    if (!confirmed) {
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    setToken(null);

    navigate("/");
  };

  // =========================================================
  // ACTIVE LINK
  // =========================================================

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* =================================================
            BRAND
        ================================================= */}

        <Link to="/" className="navbar-brand">
          <span className="brand-name">MEMOIRE</span>

          <span className="brand-tagline">
            Your story, one moment at a time.
          </span>
        </Link>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="nav-links">
          {/* =================================================
              HOME

              IMPORTANT:
              Home is ONLY shown when logged OUT.
          ================================================= */}

          {!token && (
            <Link to="/" className={isActive("/")}>
              Home
            </Link>
          )}

          {/* =================================================
              EXPLORE

              Available to everyone.
          ================================================= */}

          <Link to="/blogs" className={isActive("/blogs")}>
            <BookOpen size={15} />
            Explore
          </Link>

          {/* =================================================
              LOGGED-IN NAVIGATION
          ================================================= */}

          {token && (
            <>
              <Link to="/create" className={isActive("/create")}>
                <PenLine size={15} />
                Write a Moment
              </Link>

              <Link to="/profile" className={isActive("/profile")}>
                <User size={15} />
                Profile
              </Link>
            </>
          )}
        </nav>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="nav-actions">
          {token ? (
            <button className="logout-btn" onClick={logout} type="button">
              <LogOut size={15} />
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Sign in
              </Link>

              <Link to="/register" className="join-btn">
                Start Writing
                <span>→</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavBar;
