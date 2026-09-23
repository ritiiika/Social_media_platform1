import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login      from "./pages/Login";
import Register   from "./pages/Register";
import Feed       from "./pages/Feed";
import Profile    from "./pages/Profile";
import CreatePost from "./pages/CreatePost";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"            element={<Login />}      />
        <Route path="/register"    element={<Register />}   />
        <Route path="/feed"        element={<Feed />}       />
        <Route path="/profile"     element={<Profile />}    />
        <Route path="/profile/:id" element={<Profile />}    />
        <Route path="/create"      element={<CreatePost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
