import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/sidebar/Sidebar";
import Topbar from "../components/layout/Topbar/Topbar";
import PageContainer from "../components/PageContainer/PageContainer";

const MainLayout = () => {

  return (

    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div
  className="flex flex-1 flex-col"
  style={{
    marginLeft: "280px",
    width: "calc(100% - 280px)",
  }}
>

        <div className="sticky top-0 z-30 bg-white">

          <Topbar />

        </div>

        <main className="flex-1 overflow-y-auto">

          <PageContainer>

            <Outlet />

          </PageContainer>

        </main>

      </div>

    </div>

  );

};

export default MainLayout;