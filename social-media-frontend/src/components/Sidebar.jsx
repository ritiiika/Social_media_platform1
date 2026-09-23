import { FaHome, FaPlusSquare, FaUser, FaHashtag, FaBookmark } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";

const ITEMS = [
  { icon: <FaHome />,      label: "HOME",    path: "/feed"    },
  { icon: <FaPlusSquare />,label: "POST",    path: "/create"  },
  { icon: <FaUser />,      label: "PROFILE", path: "/profile" },
  { icon: <FaHashtag />,   label: "EXPLORE", path: "/explore" },
  { icon: <FaBookmark />,  label: "SAVED",   path: "/saved"   },
];

function Sidebar() {
  const navigate  = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">// MENU</h2>

      {ITEMS.map(item => {
        const active = pathname === item.path || pathname.startsWith(item.path + "/");
        return (
          <div
            key={item.path}
            className={`menu ${active ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            {item.label}
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;
