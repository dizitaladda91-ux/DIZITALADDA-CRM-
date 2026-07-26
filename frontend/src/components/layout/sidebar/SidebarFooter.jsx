import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";

const SidebarFooter = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return null;
};

export default SidebarFooter;