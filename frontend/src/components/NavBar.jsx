import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
        {/* BRAND */}
        <Link to="/" className="navbar-brand">
          InkWhisper
        </Link>

        {/* NAVIGATION */}
        <nav className="nav-links">
          <Link to="/" className={isActive("/")}>
            Home
          </Link>

          <Link to="/blogs" className={isActive("/blogs")}>
            Explore
          </Link>

          {token && (
            <>
              <Link to="/create" className={isActive("/create")}>
                Write
              </Link>

              <Link to="/profile" className={isActive("/profile")}>
                Profile
              </Link>
            </>
          )}
        </nav>

        {/* ACTIONS */}
        <div className="nav-actions">
          {token ? (
            <button className="logout-btn" onClick={logout} type="button">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="login-btn">
                Sign in
              </Link>

              <Link to="/register" className="join-btn">
                Start Writing →
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavBar;
