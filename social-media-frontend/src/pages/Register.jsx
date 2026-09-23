import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaIdCard, FaExclamationTriangle } from "react-icons/fa";
import { registerUser } from "../services/postService";
import "../App.css";

function Register() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email:    "",
    password: "",
    bio:      "",
  });
  const [confirm, setConfirm] = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res  = await registerUser(form);
      // RegisterResponseDTO: { message, token, user }
      localStorage.setItem("token", res.data.token);
      navigate("/feed");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.data && JSON.stringify(err.response.data)) ||
        "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Pixel title bar */}
        <div className="auth-titlebar">
          <span className="wdot wdot-red"    />
          <span className="wdot wdot-yellow" />
          <span className="wdot wdot-green"  />
          <span className="auth-titlebar-text">RETROSOCIAL_REGISTER.EXE</span>
        </div>

        <div className="auth-body">
          <div className="auth-brand">
            <span className="auth-brand-name">CREATE<br />IDENTITY</span>
            <span className="auth-brand-sub">// claim your handle</span>
          </div>

          <hr className="auth-divider" />

          {error && (
            <div className="auth-error" style={{ marginBottom: 12 }}>
              <FaExclamationTriangle /> {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleRegister}>

            <div>
              <label className="field-label">Full Name</label>
              <div className="field-wrap">
                <FaIdCard className="field-icon" />
                <input
                  className="auth-input"
                  type="text"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  required
                  minLength={3}
                />
              </div>
            </div>

            <div>
              <label className="field-label">Username</label>
              <div className="field-wrap">
                <FaUser className="field-icon" />
                <input
                  className="auth-input"
                  type="text"
                  placeholder="xX_handle_Xx"
                  value={form.username}
                  onChange={handleChange("username")}
                  required
                  minLength={3}
                />
              </div>
            </div>

            <div>
              <label className="field-label">Email</label>
              <div className="field-wrap">
                <FaEnvelope className="field-icon" />
                <input
                  className="auth-input"
                  type="email"
                  placeholder="user@grid.net"
                  value={form.email}
                  onChange={handleChange("email")}
                  required
                />
              </div>
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="field-wrap">
                <FaLock className="field-icon" />
                <input
                  className="auth-input"
                  type="password"
                  placeholder="min 6 characters"
                  value={form.password}
                  onChange={handleChange("password")}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="field-label">Confirm Password</label>
              <div className="field-wrap">
                <FaLock className="field-icon" />
                <input
                  className="auth-input"
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Initializing..." : "Create Account →"}
            </button>

          </form>

          <div className="auth-footer">
            Already signed up?{" "}
            <span className="auth-link" onClick={() => navigate("/")}>
              Login here
            </span>
            <span className="cursor-blink" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
