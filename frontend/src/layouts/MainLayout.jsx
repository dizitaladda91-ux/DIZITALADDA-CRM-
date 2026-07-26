import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/layout/sidebar/Sidebar";
import Topbar from "../components/layout/Topbar/Topbar";
import PageContainer from "../components/PageContainer/PageContainer";

const SIDEBAR_WIDTH = 280;

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div
        className="flex min-h-screen flex-col transition-all duration-300"
        style={{
          marginLeft:
            typeof window !== "undefined" && window.innerWidth >= 768
              ? `${SIDEBAR_WIDTH}px`
              : "0px",
        }}
      >
        {/* Topbar */}
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <PageContainer>
            <Outlet />
          </PageContainer>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;