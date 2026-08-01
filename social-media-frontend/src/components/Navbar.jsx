import { useState } from "react";
import { FaBell, FaEnvelope, FaUserCircle, FaSearch, FaPowerOff } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "../services/postService";
import "../App.css";

function Navbar() {
  const navigate = useNavigate();
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const [showDrop, setShowDrop] = useState(false);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setQuery(q);
    if (q.trim().length < 2) { setResults([]); setShowDrop(false); return; }
    try {
      const r = await searchUsers(q.trim());
      setResults(r.data || []);
      setShowDrop(true);
    } catch { setResults([]); }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="navbar">

      <div className="logo" onClick={() => navigate("/feed")}>
        RETROSOCIAL
      </div>

      {/* Search with live dropdown */}
      <div style={{ position: "relative" }}>
        <div className="search-bar">
          <FaSearch />
          <input
            placeholder="Search users..."
            value={query}
            onChange={handleSearch}
            onBlur={() => setTimeout(() => setShowDrop(false), 200)}
          />
        </div>

        {showDrop && results.length > 0 && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4,
            background: "var(--night-panel)",
            border: "1px solid var(--border-glow)",
            borderRadius: 4,
            zIndex: 300,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}>
            {results.slice(0, 6).map(u => (
              <div
                key={u.id}
                onClick={() => { setShowDrop(false); setQuery(""); navigate(`/profile/${u.id}`); }}
                style={{
                  padding: "9px 14px",
                  fontFamily: "var(--font-mono)", fontSize: 11,
                  color: "var(--star-white)",
                  cursor: "pointer",
                  borderBottom: "1px solid var(--border-subtle)",
                  transition: "background .15s",
                  display: "flex", alignItems: "center", gap: 8,
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(93,223,255,0.07)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{ color: "var(--cyan-glow)" }}>@</span>
                {u.username}
                {u.fullName && (
                  <span style={{ color: "rgba(184,143,208,0.5)", fontSize: 10, marginLeft: "auto" }}>
                    {u.fullName}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="nav-icons">
        <FaEnvelope title="Messages" />
        <FaBell title="Notifications" />
        <FaUserCircle
          title="My Profile"
          onClick={() => navigate("/profile")}
          style={{ cursor: "pointer" }}
        />
        <FaPowerOff
          title="Logout"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        />
      </div>

    </div>
  );
}

export default Navbar;
