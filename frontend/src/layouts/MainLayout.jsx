import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/layout/sidebar/Sidebar";
import Topbar from "../components/layout/Topbar/Topbar";
import PageContainer from "../components/PageContainer/PageContainer";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col md:ml-[280px]">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex-1">
  <PageContainer>
    <Outlet />
  </PageContainer>
</div>
      </div>
    </div>
  );
};

export default MainLayout;