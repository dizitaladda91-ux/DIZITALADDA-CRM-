import SidebarHeader from "./SidebarHeader";
import SidebarProfile from "./SidebarProfile";
import SidebarNavigation from "./SidebarNavigation";
import SidebarFooter from "./SidebarFooter";
import "./Sidebar.css";

const Sidebar = ({ isOpen = false, onToggle = () => {} }) => {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? "show" : ""}`} onClick={onToggle} />
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <SidebarHeader />
        </div>

        <div className="sidebar-profile">
          <SidebarProfile />
        </div>

        <div className="sidebar-nav">
          <SidebarNavigation />
        </div>

        <SidebarFooter />
      </aside>
    </>
  );
};

export default Sidebar;