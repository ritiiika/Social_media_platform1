

import { useState } from "react";
import { likePost, addComment } from "../services/postService";
import "../App.css";
 
function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
 
function PostCard({ post }) {
  const [liked,      setLiked]      = useState(false);
  const [likeCount,  setLikeCount]  = useState(post.likes || 0);
  const [comment,    setComment]    = useState("");
  const [submitting, setSubmitting] = useState(false);
 
  const username = post.user?.username || "anonymous";
  const initials = username.slice(0, 2).toUpperCase();
 
  const handleLike = async () => {
    try {
      await likePost(post.id);
      setLiked((prev) => !prev);
      setLikeCount((c) => (liked ? c - 1 : c + 1));
    } catch (err) {
      console.error("Like failed:", err);
    }
  };
 
  const handleComment = async (e) => {
    if (e.key !== "Enter" || !comment.trim()) return;
    setSubmitting(true);
    try {
      await addComment(post.id, comment.trim());
      setComment("");
    } catch (err) {
      console.error("Comment failed:", err);
    } finally {
      setSubmitting(false);
    }
  };
 
  return (
    <div className="post">
 
      <div className="post-window-bar">
        <span className="dot red"    />
        <span className="dot yellow" />
        <span className="dot green"  />
        <span className="post-window-title">{"POST_" + post.id}</span>
      </div>
 
      <div className="post-header">
        <div className="post-avatar">{initials}</div>
        <span className="post-username">{username}</span>
        <span className="post-time">{timeAgo(post.createdAt)}</span>
      </div>
 
      {post.content && (
        <div className="post-content">{post.content}</div>
      )}
 
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          className="post-image"
          alt="post"
          loading="lazy"
        />
      )}
 
      <div className="post-actions">
        <button
          className={"action-btn" + (liked ? " liked" : "")}
          onClick={handleLike}
        >
          {liked ? "❤️" : "🤍"} {likeCount}
        </button>
        <button className="action-btn">
          {"💬 Comment"}
        </button>
        <button className="action-btn">
          {"↗ " + (post.shares || 0)}
        </button>
      </div>
 
      <input
        className="comment-box"
        placeholder={submitting ? "Posting..." : "// add a comment · press Enter"}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={handleComment}
        disabled={submitting}
      />
 
    </div>
  );
}
 
export default PostCard;