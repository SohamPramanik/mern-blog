import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { PenLine, BookOpen, User, LogOut } from "lucide-react";
import "./NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* ================= BRAND ================= */}

        <Link to="/" className="navbar-brand">
          <span className="brand-name">MEMOIRE</span>
          <span className="brand-tagline">
            Your story, one moment at a time.
          </span>
        </Link>

        {/* ================= NAVIGATION ================= */}

        <nav className="nav-links">
          <Link to="/" className={isActive("/")}>
            Home
          </Link>

          <Link to="/blogs" className={isActive("/blogs")}>
            <BookOpen size={15} />
            Explore
          </Link>

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

        {/* ================= ACTIONS ================= */}

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
