import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  PenLine,
  BookOpen,
  User,
  LogOut,
} from "lucide-react";

import "./NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================================================
  // AUTHENTICATION STATE
  // =========================================================

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  // =========================================================
  // CHECK LOGIN STATE
  // =========================================================

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(
        Boolean(localStorage.getItem("token"))
      );
    };

    // Check whenever route changes
    checkAuth();

    // Listen for login/logout events
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, [location.pathname]);

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) {
      return;
    }

    // Remove authentication information
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    // Update Navbar immediately
    setIsLoggedIn(false);

    // Notify other components
    window.dispatchEvent(
      new Event("auth-change")
    );

    // Go to home
    navigate("/");
  };

  // =========================================================
  // ACTIVE LINK
  // =========================================================

  const isActive = (path) => {
    return location.pathname === path
      ? "active"
      : "";
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <header className="navbar">

      <div className="navbar-container">

        {/* ===================================================
            BRAND
        =================================================== */}

        <Link
          to="/"
          className="navbar-brand"
        >
          <span className="brand-name">
            MEMOIRE
          </span>

          <span className="brand-tagline">
            Your story, one moment at a time.
          </span>
        </Link>


        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <nav className="nav-links">

          {/* =================================================
              HOME

              Only visible when user is NOT logged in
          ================================================= */}

          {!isLoggedIn && (
            <Link
              to="/"
              className={isActive("/")}
            >
              Home
            </Link>
          )}


          {/* =================================================
              EXPLORE

              Visible to everyone
          ================================================= */}

          <Link
            to="/blogs"
            className={isActive("/blogs")}
          >
            <BookOpen size={15} />
            Explore
          </Link>


          {/* =================================================
              LOGGED-IN NAVIGATION
          ================================================= */}

          {isLoggedIn && (
            <>
              <Link
                to="/create"
                className={isActive("/create")}
              >
                <PenLine size={15} />
                Write a Moment
              </Link>

              <Link
                to="/profile"
                className={isActive("/profile")}
              >
                <User size={15} />
                Profile
              </Link>
            </>
          )}

        </nav>


        {/* ===================================================
            RIGHT SIDE ACTIONS
        =================================================== */}

        <div className="nav-actions">

          {isLoggedIn ? (

            /* ================= LOGGED IN ================= */

            <button
              className="logout-btn"
              onClick={logout}
              type="button"
            >
              <LogOut size={15} />
              Logout
            </button>

          ) : (

            /* ================= LOGGED OUT ================= */

            <>
              <Link
                to="/login"
                className="login-btn"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="join-btn"
              >
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