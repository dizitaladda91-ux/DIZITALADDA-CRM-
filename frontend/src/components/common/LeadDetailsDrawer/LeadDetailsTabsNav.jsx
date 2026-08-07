import React from "react";
import { User, GraduationCap, MessageSquareText } from "lucide-react";
import "./LeadDetailsDrawer.css";

/**
 * LeadDetailsTabsNav Component
 * Shared 3-Tab navigation bar for Admin & Employee portals.
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
    <div className="crm-tabs-container">
      <nav className="crm-tabs-nav">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`crm-tab-button ${isActive ? "active" : ""}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default LeadDetailsTabsNav;
