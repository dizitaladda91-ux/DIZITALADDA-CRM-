import { useState } from "react";
import { Outlet } from "react-router-dom";
import EmployeeSidebar from "../components/employee/EmployeeSidebar";
import EmployeeTopbar from "../components/employee/EmployeeTopbar";
import EmployeeFooter from "../components/employee/EmployeeFooter";

import "./EmployeeLayout.css";

const EmployeeLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="employee-layout">
      <EmployeeSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      <div className="employee-main">
        <EmployeeTopbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="employee-content">
          <Outlet />
        </main>

        <EmployeeFooter />
      </div>
    </div>
  );
};

export default EmployeeLayout;