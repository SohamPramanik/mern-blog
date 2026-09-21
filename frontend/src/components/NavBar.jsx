import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { PenLine, BookOpen, User, LogOut } from "lucide-react";
import "./NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token")),
  );

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };

    checkAuth();

    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, [location.pathname]);

  const logout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");

    if (!confirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    setIsLoggedIn(false);

    window.dispatchEvent(new Event("auth-change"));

    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* BRAND */}
        {isLoggedIn ? (
          <div className="navbar-brand">
            <span className="brand-name">MEMOIRE</span>
            <span className="brand-tagline">
              Your story, one moment at a time.
            </span>
          </div>
        ) : (
          <Link to="/" className="navbar-brand">
            <span className="brand-name">MEMOIRE</span>
            <span className="brand-tagline">
              Your story, one moment at a time.
            </span>
          </Link>
        )}

        {/* NAVIGATION */}
        <nav className="nav-links">
          {/* HOME ONLY WHEN LOGGED OUT */}
          {!isLoggedIn && (
            <Link to="/" className={isActive("/")}>
              Home
            </Link>
          )}

          {/* EXPLORE */}
          <Link to="/blogs" className={isActive("/blogs")}>
            <BookOpen size={15} />
            Explore
          </Link>

          {/* LOGGED-IN LINKS */}
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

        {/* RIGHT SIDE */}
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
