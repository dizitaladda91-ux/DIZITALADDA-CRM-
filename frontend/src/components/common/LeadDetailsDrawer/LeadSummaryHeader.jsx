import React from "react";
import { Phone, Mail, MapPin, AlertCircle, Tag, X } from "lucide-react";
import "./LeadDetailsDrawer.css";

/**
 * LeadSummaryHeader Component
 * Shared compact header for Admin & Employee portals.
 */
const LeadSummaryHeader = ({ lead, onClose }) => {
  if (!lead) return null;

  const initials = lead.full_name
    ? lead.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "LD";

  const priority = (lead.priority || "MEDIUM").toLowerCase();
  const priorityClass =
    priority === "high"
      ? "crm-badge-high"
      : priority === "medium"
      ? "crm-badge-medium"
      : "crm-badge-low";

  const locationText = [lead.city, lead.state].filter(Boolean).join(", ");

  return (
    <div className="crm-header">
      <div className="crm-header-info">
        <div className="crm-avatar">{initials}</div>
        <div>
          <div className="crm-header-meta" style={{ marginTop: 0 }}>
            <h2 className="crm-header-title">{lead.full_name || "Lead Details"}</h2>
            <span>
              Lead ID: <strong style={{ color: "#2563EB" }}>{lead.lead_code || "--"}</strong>
            </span>
          </div>

          <div className="crm-header-meta">
            {lead.mobile && (
              <span className="crm-header-meta-item">
                <Phone size={13} />
                {lead.mobile}
              </span>
            )}
            {lead.email && (
              <span className="crm-header-meta-item">
                <Mail size={13} />
                {lead.email}
              </span>
            )}
            {locationText && (
              <span className="crm-header-meta-item">
                <MapPin size={13} />
                {locationText}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span className={`crm-badge ${priorityClass}`}>
          <AlertCircle size={13} />
          {lead.priority || "MEDIUM"} PRIORITY
        </span>

        <span className="crm-badge crm-badge-status">
          <Tag size={13} />
          {lead.status || "NEW"}
        </span>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close lead details"
          className="crm-close-btn"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default LeadSummaryHeader;
