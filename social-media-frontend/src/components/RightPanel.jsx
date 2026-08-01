import { useState, useEffect } from "react";
import { searchUsers } from "../services/postService";
import "../App.css";

const FALLBACK = [
  { id: null, username: "sakura_xo",  hot: true  },
  { id: null, username: "neon_ronin",  hot: false },
  { id: null, username: "grid_ghost",  hot: false },
  { id: null, username: "cyber_miko",  hot: false },
  { id: null, username: "vaporwitch",  hot: true  },
];

function RightPanel() {
  const [suggestions, setSuggestions] = useState(FALLBACK);
  const [followed,    setFollowed]    = useState({});

  useEffect(() => {
    searchUsers("a")
      .then((res) => {
        const users = Array.isArray(res.data) ? res.data.slice(0, 5) : [];
        if (users.length > 0) {
          setSuggestions(
            users.map((u) => ({ id: u.id, username: u.username, hot: false }))
          );
        }
      })
      .catch(() => {
        // silently keep fallback list
      });
  }, []);

  const handleFollow = (username) => {
    setFollowed((prev) => ({ ...prev, [username]: !prev[username] }));
  };

  return (
    <div className="right-panel">
      <div className="right-panel-title">// Who to Follow</div>

      <div className="suggestion-card">
        {suggestions.map((s) => (
          <div key={s.username} className="suggestion-item">
            <span className="suggestion-name">
              <span className="suggestion-at">@</span>
              {s.username}
              {s.hot && (
                <span
                  className="status-badge badge-online"
                  style={{ fontSize: 5, padding: "2px 5px" }}
                >
                  HOT
                </span>
              )}
            </span>
            <button
              className={`follow-btn ${followed[s.username] ? "following" : ""}`}
              onClick={() => handleFollow(s.username)}
            >
              {followed[s.username] ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>

      {/* Live ticker */}
      <div className="ticker-box">
        <div className="ticker-label">// Live activity</div>
        <div className="ticker-text">
          sakura_xo liked your post · neon_ronin followed you · grid_ghost posted · cyber_miko commented · vaporwitch went live ·&nbsp;
        </div>
      </div>
    </div>
  );
}

export default RightPanel;
