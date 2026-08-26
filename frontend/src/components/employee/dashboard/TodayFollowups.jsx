import React, { useState } from "react";
import "./TodayFollowups.css";
import { PhoneCall, Clock3, Eye, Phone, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LeadDetailsDrawer from "../../common/LeadDetailsDrawer/LeadDetailsDrawer";

const TodayFollowups = ({ followUps = [] }) => {
  const navigate = useNavigate();
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenLead = (item) => {
    setSelectedLead({
      id: item.lead_id || item.id,
      lead_code: item.lead_code || `LEAD${String(item.id).padStart(6, "0")}`,
      full_name: item.full_name || "Student Lead",
      mobile: item.mobile || "",
      status: item.status || "FOLLOW_UP",
    });
    setIsDrawerOpen(true);
  };

  return (
    <div className="followup-card">
      <div className="followup-header">
        <h3>📞 Today's Scheduled Follow-ups</h3>

        <button
          type="button"
          className="followup-view-btn"
          onClick={() => navigate("/employee/followups")}
        >
          View All Planner
        </button>
      </div>

      {followUps.length === 0 ? (
        <div className="followup-empty">
          <Clock3 size={48} />
          <h4>No Follow-ups Scheduled For Today</h4>
          <p>All scheduled follow-up calls and reminders will appear here.</p>
        </div>
      ) : (
        <div className="followup-list">
          {followUps.map((item) => {
            const cleanMobile = (item.mobile || "").replace(/\D/g, "");
            return (
              <div className="followup-item" key={item.id}>
                <div className="followup-info">
                  <h4>{item.full_name}</h4>
                  <span>{item.mobile}</span>
                </div>

                <div className="followup-right" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <small>{item.next_followup || "Today"}</small>

                  {cleanMobile && (
                    <>
                      <a
                        href={`tel:${cleanMobile}`}
                        className="action-btn call-btn"
                        title={`Call ${item.full_name}`}
                        style={{ padding: "6px", borderRadius: "6px", backgroundColor: "#DCFCE7", color: "#16A34A" }}
                      >
                        <Phone size={14} />
                      </a>

                      <a
                        href={`https://wa.me/91${cleanMobile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn whatsapp-btn"
                        title={`WhatsApp ${item.full_name}`}
                        style={{ padding: "6px", borderRadius: "6px", backgroundColor: "#E0E7FF", color: "#4338CA" }}
                      >
                        <MessageCircle size={14} />
                      </a>
                    </>
                  )}

                  <button
                    type="button"
                    title="View & Update Lead"
                    onClick={() => handleOpenLead(item)}
                    style={{ padding: "6px 10px", fontSize: "12px", borderRadius: "6px" }}
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Guided Lead Details Drawer */}
      <LeadDetailsDrawer
        open={isDrawerOpen}
        lead={selectedLead}
        onClose={() => setIsDrawerOpen(false)}
        role="counsellor"
      />
    </div>
  );
};

export default TodayFollowups;