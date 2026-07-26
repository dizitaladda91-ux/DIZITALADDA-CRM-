import { useNavigate } from "react-router-dom";
import {
  LogOut,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";

const SidebarFooter = () => {
  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/", {
      replace: true,
    });
  };

  return (
    <footer className="space-y-4">
      <button
        onClick={handleLogout}
        className="
          flex
          h-12
          w-full
          items-center
          justify-center
          gap-3
          rounded-2xl
          border
          border-red-200
          bg-red-50
          text-sm
          font-semibold
          text-red-600
          transition-all
          duration-200
          hover:bg-red-100
          hover:shadow-md
          active:scale-[0.98]
        "
      >

        <LogOut size={18} />

        Logout

      </button>

    </footer>
  );
};

export default SidebarFooter;