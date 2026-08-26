import React from "react";
import "../../styles/LeadManagement/LeadHeader.css";
import { RefreshCw, Plus, CalendarDays, Download } from "lucide-react";

const LeadHeader = ({
  loading = false,
  onRefresh,
  onCreateLead,
  onExport,
}) => {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="lead-header">
      <div className="lead-header-left">
        <span className="lead-badge">Lead Management</span>
        <h1>Incoming Leads</h1>
        <p>
          Monitor, assign and manage enquiries captured from Meta Ads, Google Ads, Landing Pages and Website.
        </p>
      </div>

      <div className="lead-header-right">
        <div className="lead-date-card">
          <CalendarDays size={18} />
          <div>
            <span>Today</span>
            <strong>{today}</strong>
          </div>
        </div>

        <div className="lead-header-actions">
          {onExport && (
            <button
              type="button"
              className="refresh-btn"
              onClick={onExport}
              title="Export Leads to CSV"
              style={{ backgroundColor: "#F1F5F9", color: "#334155" }}
            >
              <Download size={17} />
              Export CSV
            </button>
          )}

          <button
            type="button"
            className="refresh-btn"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw size={17} className={loading ? "spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            className="create-btn"
            onClick={onCreateLead}
          >
            <Plus size={18} />
            Create Lead
          </button>
        </div>
      </div>
    </section>
  );
};

export default LeadHeader;