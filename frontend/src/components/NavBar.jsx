import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { PenLine, BookOpen, User, LogOut } from "lucide-react";

import "./NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Force Navbar to re-render when auth changes
  const [, setAuthVersion] = useState(0);

  // =========================================================
  // AUTH STATE
  // =========================================================

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // =========================================================
  // REFRESH NAVBAR WHEN ROUTE CHANGES
  // =========================================================

  useEffect(() => {
    setAuthVersion((value) => value + 1);
  }, [location.pathname]);

  // =========================================================
  // REFRESH NAVBAR WHEN AUTH CHANGES
  // =========================================================

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthVersion((value) => value + 1);
    };

    window.addEventListener("auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

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

    // Tell Navbar that authentication changed
    window.dispatchEvent(new Event("auth-change"));

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

              ONLY LOGGED-OUT USERS SEE THIS
          ================================================= */}

          {!isLoggedIn && (
            <Link to="/" className={isActive("/")}>
              Home
            </Link>
          )}

          {/* =================================================
              EXPLORE

              EVERYONE CAN SEE THIS
          ================================================= */}

          <Link to="/blogs" className={isActive("/blogs")}>
            <BookOpen size={15} />
            Explore
          </Link>

          {/* =================================================
              LOGGED-IN OPTIONS
          ================================================= */}

          {isLoggedIn && (
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
            RIGHT SIDE
        ================================================= */}

        <div className="nav-actions">
          {isLoggedIn ? (
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
