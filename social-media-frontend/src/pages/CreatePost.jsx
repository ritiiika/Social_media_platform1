import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar  from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { createPost, getUserByEmail, getTokenPayload } from "../services/postService";
import "../App.css";

function CreatePost() {
  const [caption,   setCaption]   = useState("");
  const [imageUrl,  setImageUrl]  = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [userReady, setUserReady] = useState(false);

  const userIdRef = useRef(null);   // always-current, avoids stale closure
  const navigate  = useNavigate();

  /* ── Resolve userId once on mount ── */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const payload = getTokenPayload();
    const email   = payload?.sub;

    if (!email) {
      setError("Session expired — please login again");
      return;
    }

    getUserByEmail(email)
      .then((res) => {
        const id = res.data?.id;
        if (!id) {
          setError("Could not load user — please re-login");
          return;
        }
        userIdRef.current = id;
        setUserReady(true);
      })
      .catch(() => {
        setError("Could not load user — please re-login");
      });
  }, [navigate]);

  /* ── Submit ── */
  const handleSubmit = async () => {
    setError("");

    if (!caption.trim()) {
      setError("// Please write something before broadcasting");
      return;
    }

    if (!userIdRef.current) {
      setError("// User not loaded yet — please wait a moment");
      return;
    }

    setLoading(true);

    try {
      await createPost({
        userId:   userIdRef.current,
        caption:  caption.trim(),
        imageUrl: imageUrl.trim(),
      });
      navigate("/feed");
    } catch (err) {
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Post failed — try again";
      setError(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));
      setLoading(false);
    }
  };

  const charCount  = caption.length;
  const canSubmit  = caption.trim().length > 0 && userReady && !loading;
  const previewUrl = imageUrl.trim() || null;

  return (
    <div className="feed-page">
      <Navbar />
      <div className="feed-layout">
        <Sidebar />

        <div className="create-page">
          <div className="create-card">

            {/* Pixel title bar */}
            <div className="post-window-bar">
              <span className="dot red"    />
              <span className="dot yellow" />
              <span className="dot green"  />
              <span className="post-window-title">NEWPOST.EXE</span>
            </div>

            <div className="create-card-header">
              <span className="create-card-title">// Broadcast to Grid</span>
            </div>

            <div className="create-body">

              {/* Error */}
              {error && (
                <div
                  className="auth-error"
                  style={{
                    fontFamily: "var(--font-vt)",
                    fontSize: 16,
                    lineHeight: 1.5,
                    wordBreak: "break-word",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Loading user */}
              {!userReady && !error && (
                <div
                  style={{
                    fontFamily: "var(--font-vt)",
                    fontSize: 17,
                    color: "var(--txt-dim)",
                    textAlign: "center",
                  }}
                >
                  Loading user...
                </div>
              )}

              {/* Caption / message */}
              <div>
                <label className="create-label">Your Message</label>
                <textarea
                  className="create-input create-textarea"
                  placeholder="// share something with the grid..."
                  value={caption}
                  maxLength={1000}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <div
                  style={{
                    textAlign: "right",
                    marginTop: 4,
                    fontFamily: "var(--font-vt)",
                    fontSize: 14,
                    color: charCount > 900 ? "var(--neon-pink)" : "var(--txt-dim)",
                  }}
                >
                  {charCount} / 1000
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="create-label">Image URL (optional)</label>
                <input
                  className="create-input"
                  type="text"
                  placeholder="https://image-url..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              {/* Live image preview */}
              {previewUrl && (
                <div>
                  <label className="create-label">Preview</label>
                  <div
                    style={{
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid var(--glass-border)",
                    }}
                  >
                    <img
                      src={previewUrl}
                      alt="preview"
                      style={{
                        width: "100%",
                        maxHeight: 240,
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Broadcast button */}
              <button
                className="auth-submit"
                onClick={handleSubmit}
                disabled={!canSubmit}
                style={{ marginTop: 4 }}
              >
                {loading ? "Transmitting..." : "Broadcast →"}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
