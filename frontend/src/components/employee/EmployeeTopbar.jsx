import "./EmployeeTopbar.css";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle";

const EmployeeTopbar = ({ onMenuClick }) => {

  // Pehle user lo
  const { user } = useAuth();

  // Fir initials banao
  const initials = (user?.full_name || user?.name || "Employee")
    .split(" ")
    .map((name) => name[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="employee-topbar">

      <div className="topbar-left">

        <button className="menu-toggle" onClick={onMenuClick}>
          <Menu size={22} />
        </button>

        <div className="topbar-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search leads, admissions, follow-ups..."
          />
        </div>

      </div>

      <div className="topbar-right">

        <div className="topbar-date">
          {today}
        </div>

        <ThemeToggle />

        <button className="notification-btn">
          <Bell size={21} />
          <span className="notification-badge">0</span>
        </button>

        <div className="profile-avatar">
          {initials}
        </div>

        <div className="profile-box">

          <div className="profile-info">
            <h4>{user?.full_name || user?.name || "Employee"}</h4>
            <p>{user?.role || "Employee"}</p>
          </div>

          <ChevronDown size={18} />

        </div>

      </div>

    </header>
  );
};

export default EmployeeTopbar;
