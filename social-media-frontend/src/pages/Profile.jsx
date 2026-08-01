import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar  from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  getUserById,
  getUserByEmail,
  getUserPosts,
  getFollowersCount,
  getFollowingCount,
} from "../services/postService";
import "../App.css";

function Profile() {
  const { id: paramId }       = useParams();   // /profile/:id  OR  /profile (own)
  const navigate              = useNavigate();
  const [user,       setUser]       = useState(null);
  const [posts,      setPosts]      = useState([]);
  const [followers,  setFollowers]  = useState(0);
  const [following,  setFollowing]  = useState(0);
  const [activeTab,  setActiveTab]  = useState("posts");
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }
    resolveUser(token);
  }, [paramId, navigate]);

  const resolveUser = async (token) => {
    try {
      let userId = paramId;

      if (!userId) {
        // Own profile — decode email from JWT, then fetch user
        const payload = JSON.parse(atob(token.split(".")[1]));
        const email   = payload.sub;
        const r       = await getUserByEmail(email);
        userId        = r.data.id;
        setUser(r.data);
      } else {
        const r = await getUserById(userId);
        setUser(r.data);
      }

      // Parallel requests
      const [postsR, followersR, followingR] = await Promise.all([
        getUserPosts(userId),
        getFollowersCount(userId),
        getFollowingCount(userId),
      ]);

      setPosts(postsR.data    || []);
      setFollowers(followersR.data ?? 0);
      setFollowing(followingR.data ?? 0);

    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="feed-page">
        <Navbar />
        <div className="loading">LOADING PROFILE</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="feed-page">
        <Navbar />
        <div className="empty-feed">// user not found</div>
      </div>
    );
  }

  const initials = (user.username || "??").slice(0, 2).toUpperCase();

  return (
    <div className="feed-page">
      <Navbar />

      <div className="feed-layout">
        <Sidebar />

        <div style={{ flex: 1, padding: "28px 32px 40px", maxWidth: 860 }}>

          {/* Banner */}
          <div className="profile-banner" />

          {/* Header card */}
          <div className="profile-header-card">

            <button
              className="profile-edit-btn"
              onClick={() => alert("Edit profile — wire PUT /users/:id")}
            >
              EDIT PROFILE
            </button>

            {/* Avatar */}
            <div className="profile-avatar-wrap">
              <div className="profile-avatar-inner">{initials}</div>
            </div>

            <div className="profile-username">{user.fullName || user.username}</div>
            <div className="profile-handle">@{user.username}</div>

            {user.bio && <div className="profile-bio">{user.bio}</div>}

            {/* Stats */}
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-num">{posts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">{followers}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-num">{following}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>

          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            {["posts", "liked", "saved"].map(tab => (
              <button
                key={tab}
                className={`profile-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Posts */}
          {activeTab === "posts" && (
            posts.length > 0 ? (
              <div className="profile-posts-grid">
                {posts.map(p => (
                  <div key={p.id} className="profile-grid-item">
                    {p.imageUrl
                      ? <img src={p.imageUrl} alt="post" />
                      : (
                        <div style={{
                          width: "100%", height: "100%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          padding: 12, background: "var(--night-panel)",
                          fontFamily: "var(--font-body)", fontSize: 12,
                          color: "rgba(184,143,208,0.7)", lineHeight: 1.5,
                          overflow: "hidden",
                        }}>
                          {p.content?.slice(0, 80)}
                          {p.content?.length > 80 ? "..." : ""}
                        </div>
                      )
                    }
                    <div className="profile-grid-overlay">
                      ♡ {p.likes ?? 0}  ↗ {p.shares ?? 0}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-feed">// no posts yet</div>
            )
          )}

          {activeTab === "liked" && (
            <div className="empty-feed">// liked posts coming soon</div>
          )}

          {activeTab === "saved" && (
            <div className="empty-feed">// saved posts coming soon</div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;
