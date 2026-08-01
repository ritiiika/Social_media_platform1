import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../App.css";

const API = "http://localhost:8080";

function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "// ACCESS DENIED — invalid credentials");
        setLoading(false);
        return;
      }

      // Backend returns: { message, token }
      localStorage.setItem("token", data.token);
      navigate("/feed");

    } catch (err) {
      setError("// CONNECTION FAILED — server unreachable");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Y2K pixel titlebar */}
        <div className="auth-window-bar">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
          <span className="auth-window-title">RETROSOCIAL_LOGIN.EXE</span>
        </div>

        <div className="auth-body">

          {/* Brand */}
          <div className="auth-logo">
            <span className="auth-logo-text">RETRO<br/>SOCIAL</span>
            <span className="auth-logo-sub">// jack in to the grid</span>
            <div className="auth-pixel-row">
              <span>🌸</span><span>🌙</span><span>🎮</span><span>🌸</span>
            </div>
          </div>

          <hr className="auth-divider" />

          {error && <div className="auth-error">⚠ {error}</div>}

          <form className="auth-form" onSubmit={handleLogin}>

            <div className="input-group">
              <label className="input-label">Email address</label>
              <FaEnvelope className="input-icon" />
              <input
                className="auth-input"
                type="email"
                placeholder="sakura@grid.net"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <FaLock className="input-icon" />
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required autoComplete="current-password"
              />
            </div>

            {loading && (
              <div className="pixel-loading-bar">
                <div className="pixel-loading-fill" />
              </div>
            )}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "AUTHENTICATING..." : "JACK IN  →"}
            </button>

          </form>

          <div className="auth-footer">
            No account?{" "}
            <span className="auth-link" onClick={() => navigate("/register")}>
              Register here
            </span>
            <span className="cursor-blink" />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
