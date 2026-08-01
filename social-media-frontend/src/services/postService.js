import axios from "axios";
 
const API = "http://localhost:8080";
 
const authHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
 
// ── AUTH ──────────────────────────────────────────────────
export const loginUser = (email, password) =>
  axios.post(`${API}/auth/login`, { email, password });
 
export const registerUser = (data) =>
  axios.post(`${API}/auth/register`, data);
 
// ── POSTS ─────────────────────────────────────────────────
export const getPosts = () =>
  axios.get(`${API}/posts`, { headers: authHeader() });
 
export const getPostById = (id) =>
  axios.get(`${API}/posts/${id}`, { headers: authHeader() });
 
export const getPostsByUser = (userId) =>
  axios.get(`${API}/posts/user/${userId}`, { headers: authHeader() });
 
/**
 * createPost — sends BOTH field-name conventions so it works
 * regardless of whether your backend reads "caption"/"imageUrl"
 * (Postman version) or "userId"/"content" (PostController source).
 */
export const createPost = ({ userId, caption, imageUrl }) => {
  const payload = {
    // PostController (source code) reads these:
    userId:  String(userId),
    content: caption || "",
    // Postman collection version reads these:
    caption:  caption || "",
    imageUrl: imageUrl || "",
  };
  return axios.post(`${API}/posts`, payload, { headers: authHeader() });
};
 
export const likePost = (postId) =>
  axios.post(`${API}/posts/${postId}/like`, {}, { headers: authHeader() });
 
export const sharePost = (postId) =>
  axios.post(`${API}/posts/${postId}/share`, {}, { headers: authHeader() });
 
export const deletePost = (id) =>
  axios.delete(`${API}/posts/${id}`, { headers: authHeader() });
 
// ── USERS ─────────────────────────────────────────────────
export const getUserById = (id) =>
  axios.get(`${API}/users/${id}`, { headers: authHeader() });
 
export const getUserByEmail = (email) =>
  axios.get(`${API}/users/email/${email}`, { headers: authHeader() });
 
export const getUserPosts = (id) =>
  axios.get(`${API}/users/${id}/posts`, { headers: authHeader() });
 
export const getFollowersCount = (id) =>
  axios.get(`${API}/users/${id}/followers/count`, { headers: authHeader() });
 
export const getFollowingCount = (id) =>
  axios.get(`${API}/users/${id}/following/count`, { headers: authHeader() });
 
export const getTimeline = (id) =>
  axios.get(`${API}/users/${id}/timeline`, { headers: authHeader() });
 
export const searchUsers = (username) =>
  axios.get(`${API}/users/search`, { params: { username }, headers: authHeader() });
 
export const updateUser = (id, data) =>
  axios.put(`${API}/users/${id}`, data, { headers: authHeader() });
 
// ── COMMENTS ──────────────────────────────────────────────
export const getCommentsByPost = (postId) =>
  axios.get(`${API}/comments/post/${postId}`, { headers: authHeader() });
 
export const addComment = (postId, message) =>
  axios.post(`${API}/comments`, { postId, message }, { headers: authHeader() });
 
export const deleteComment = (id) =>
  axios.delete(`${API}/comments/${id}`, { headers: authHeader() });
 
// ── FOLLOW ────────────────────────────────────────────────
export const followUser = (followerId, followingId) =>
  axios.post(
    `${API}/follow`,
    { followerId: String(followerId), followingId: String(followingId) },
    { headers: authHeader() }
  );
 
// ── JWT HELPERS ───────────────────────────────────────────
export const getTokenPayload = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};