

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar     from "../components/Navbar";
import Sidebar    from "../components/Sidebar";
import RightPanel from "../components/RightPanel";
import PostCard   from "../components/PostCard";
import { getPosts } from "../services/postService";
import "../App.css";
 
function Feed() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    loadPosts();
  }, [navigate]);
 
  const loadPosts = async () => {
    try {
      const res = await getPosts();
      const data = res.data;
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Feed load error:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="feed-page">
      <Navbar />
      <div className="feed-layout">
        <Sidebar />
 
        <div className="feed-container">
          <div className="feed-header">
            <h2 className="feed-title">{"// Home Feed"}</h2>
            <button className="create-post-btn" onClick={() => navigate("/create")}>
              + Create Post
            </button>
          </div>
 
          {loading && (
            <div className="loading">Loading posts...</div>
          )}
 
          {!loading && posts.length === 0 && (
            <div className="empty-feed">{"// No posts yet — be first to post"}</div>
          )}
 
          {posts.map((post, i) => (
            <div
              key={post.id}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>
 
        <RightPanel />
      </div>
    </div>
  );
}
 
export default Feed;