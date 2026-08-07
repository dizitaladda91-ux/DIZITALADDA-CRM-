import React from "react";
import { User, GraduationCap, MessageSquareText } from "lucide-react";

/**
 * LeadDetailsTabsNav Component
 * 3-Tab horizontal navigation bar for switching between Personal, Academic, and Counsellor Notes & Feedback views.
 */
const LeadDetailsTabsNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: "personal",
      label: "Personal Information",
      icon: <User size={16} />,
    },
    {
      id: "academic",
      label: "Academic Information",
      icon: <GraduationCap size={16} />,
    },
    {
      id: "counselling",
      label: "Counsellor Notes & Feedback",
      icon: <MessageSquareText size={16} />,
    },
  ];

  return (
    <div className="border-b border-slate-200 bg-white px-6 py-1">
      <nav className="flex space-x-2 overflow-x-auto" aria-label="Lead Details Navigation">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all whitespace-nowrap cursor-pointer rounded-t-lg
                ${
                  isActive
                    ? "border-blue-600 text-blue-600 bg-blue-50/60 font-extrabold shadow-2xs"
                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }
              `}
            >
              <span className={isActive ? "text-blue-600" : "text-slate-400"}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default LeadDetailsTabsNav;
