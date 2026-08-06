import {
  LayoutDashboard,
  UserPlus,
  Megaphone,
  Radio,
  GraduationCap,
  BookOpen,
  Users,
  PhoneCall,
  FileBarChart,
  Settings,
} from "lucide-react";

const menuItems = [

  {
    title: "MAIN",

    items: [

      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
      },

      {
        title: "Lead Management",
        icon: UserPlus,
        path: "/leads",
      },

      {
        title: "Campaigns",
        icon: Megaphone,
        path: "/campaigns",
      },

      {
        title: "Lead Sources",
        icon: Radio,
        path: "/lead-sources",
      },

      {
        title: "Employees",
        icon: Users,
        path: "/employees",
      },

      {
        title: "Follow-ups",
        icon: PhoneCall,
        path: "/followups",
      },

    ],
  },

  {
    title: "ACADEMICS",

    items: [

      {
        title: "Admissions",
        icon: GraduationCap,
        path: "/admissions",
      },

      {
        title: "Students",
        icon: BookOpen,
        path: "/students",
      },
    ],
  },

  {
    title: "INSIGHTS & SETTINGS",
    items: [
      { title: "Reports", icon: FileBarChart, path: "/reports" },
      { title: "Settings", icon: Settings, path: "/settings" },
    ],
  },

];

export default menuItems;
