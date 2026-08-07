import React from "react";
import { Sparkles, Tag, AlertCircle, Clock, User } from "lucide-react";
import "./LeadDetailsDrawer.css";

/**
 * CounsellorNotesTab Component
 * Shared Counsellor Notes, Status control, Dynamic Fields, and Interaction History timeline.
 */
const CounsellorNotesTab = ({
  selectedStatus,
  onStatusSelect,
  feedbackFields,
  onFieldChange,
  remarks,
  onRemarksChange,
  feedbackHistory = [],
  historyLoading = false,
  lead,
  isEditable = true,
  statusOptions = [],
}) => {
  const priority = (lead?.priority || "MEDIUM").toLowerCase();
  const priorityClass =
    priority === "high"
      ? "crm-badge-high"
      : priority === "medium"
      ? "crm-badge-medium"
      : "crm-badge-low";

  return (
    <>
      {/* STATUS & PRIORITY CARD */}
      <div className="crm-card">
        <div className="crm-card-header">
          <Tag className="text-blue-600" size={20} />
          <div>
            <h3 className="crm-card-title">📌 Lead Status & Priority</h3>
            <p className="crm-card-subtitle">Manage CRM lifecycle status and auto-derived priority</p>
          </div>
        </div>

        <div className="crm-grid crm-grid-2">
          {/* Status Select */}
          <div className="crm-field">
            <label className="crm-label">
              Lead Status <span className="crm-required">*</span>
            </label>
            <select
              disabled={!isEditable}
              value={selectedStatus}
              onChange={(e) => onStatusSelect(e.target.value)}
              className="crm-select"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Derived Priority Badge */}
          <div className="crm-field">
            <label className="crm-label">Priority (Auto Derived)</label>
            <div style={{ display: "flex", alignItems: "center", height: "48px" }}>
              <span className={`crm-badge ${priorityClass}`}>
                <AlertCircle size={14} />
                {lead?.priority || "MEDIUM"} PRIORITY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* COUNSELLOR NOTES & DYNAMIC FORM CARD */}
      {isEditable && (
        <div className="crm-card" style={{ borderColor: "#BFDBFE" }}>
          <div className="crm-card-header">
            <Sparkles className="text-blue-600" size={20} />
            <div>
              <h3 className="crm-card-title">💬 Record Today's Discussion & Feedback</h3>
              <p className="crm-card-subtitle">Dynamic fields change according to lead status</p>
            </div>
          </div>

          {/* DYNAMIC FIELDS CONTAINER */}
          <div style={{ backgroundColor: "#F8FAFC", padding: "16px", borderRadius: "12px", border: "1px solid #E2E8F0", marginBottom: "16px" }}>
            {/* 1. NOT_CONTACTED / NEW / CONTACTED */}
            {(selectedStatus === "NOT_CONTACTED" || selectedStatus === "NEW" || selectedStatus === "CONTACTED") && (
              <div className="crm-field">
                <label className="crm-label">
                  Uncontacted Reason <span className="crm-required">*</span>
                </label>
                <select
                  value={feedbackFields.reason || ""}
                  onChange={(e) => onFieldChange("reason", e.target.value)}
                  className="crm-select"
                >
                  <option value="">-- Select Reason --</option>
                  <option value="Switched Off">Switched Off</option>
                  <option value="Not Reachable">Not Reachable</option>
                  <option value="Ringing No Response">Ringing No Response</option>
                  <option value="Invalid Number">Invalid Number</option>
                  <option value="Busy">Busy</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            {/* 2. FOLLOW_UP */}
            {(selectedStatus === "FOLLOW_UP" || selectedStatus === "FOLLOW_UP_REQUIRED") && (
              <div className="crm-grid crm-grid-2">
                <div className="crm-field">
                  <label className="crm-label">
                    Next Follow-up Date & Time <span className="crm-required">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={feedbackFields.next_followup || ""}
                    onChange={(e) => onFieldChange("next_followup", e.target.value)}
                    className="crm-input"
                  />
                </div>

                <div className="crm-field">
                  <label className="crm-label">Follow-up Mode / Action</label>
                  <select
                    value={feedbackFields.followup_type || "CALL"}
                    onChange={(e) => onFieldChange("followup_type", e.target.value)}
                    className="crm-select"
                  >
                    <option value="CALL">Phone Call</option>
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="EMAIL">Email</option>
                    <option value="MEETING">Campus Meeting</option>
                  </select>
                </div>
              </div>
            )}

            {/* 3. QUALIFIED / INTERESTED */}
            {(selectedStatus === "QUALIFIED" || selectedStatus === "INTERESTED") && (
              <div className="crm-grid crm-grid-3">
                <div className="crm-field">
                  <label className="crm-label">Walk-in Date</label>
                  <input
                    type="date"
                    value={feedbackFields.walkin_date || ""}
                    onChange={(e) => onFieldChange("walkin_date", e.target.value)}
                    className="crm-input"
                  />
                </div>

                <div className="crm-field">
                  <label className="crm-label">Walk-in Time</label>
                  <input
                    type="time"
                    value={feedbackFields.walkin_time || ""}
                    onChange={(e) => onFieldChange("walkin_time", e.target.value)}
                    className="crm-input"
                  />
                </div>

                <div className="crm-field">
                  <label className="crm-label">Preferred Campus</label>
                  <input
                    type="text"
                    placeholder="e.g. Main Campus"
                    value={feedbackFields.preferred_centre || ""}
                    onChange={(e) => onFieldChange("preferred_centre", e.target.value)}
                    className="crm-input"
                  />
                </div>
              </div>
            )}

            {/* 4. ADMISSION_DONE / ENROLLED */}
            {(selectedStatus === "ADMISSION_DONE" || selectedStatus === "ENROLLED") && (
              <div className="crm-grid crm-grid-3">
                <div className="crm-field">
                  <label className="crm-label">Course Enrolled</label>
                  <input
                    type="text"
                    placeholder="Course name"
                    value={feedbackFields.course_name || ""}
                    onChange={(e) => onFieldChange("course_name", e.target.value)}
                    className="crm-input"
                  />
                </div>

                <div className="crm-field">
                  <label className="crm-label">Fee Paid (₹)</label>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={feedbackFields.fee_paid || ""}
                    onChange={(e) => onFieldChange("fee_paid", e.target.value)}
                    className="crm-input"
                  />
                </div>

                <div className="crm-field">
                  <label className="crm-label">Receipt / Ref No</label>
                  <input
                    type="text"
                    placeholder="Receipt #"
                    value={feedbackFields.receipt_no || ""}
                    onChange={(e) => onFieldChange("receipt_no", e.target.value)}
                    className="crm-input"
                  />
                </div>
              </div>
            )}

            {/* 5. NOT_INTERESTED / REJECTED */}
            {(selectedStatus === "NOT_INTERESTED" || selectedStatus === "LOST" || selectedStatus === "REJECTED") && (
              <div className="crm-grid crm-grid-2">
                <div className="crm-field">
                  <label className="crm-label">
                    Rejection Reason <span className="crm-required">*</span>
                  </label>
                  <select
                    value={feedbackFields.rejection_reason || ""}
                    onChange={(e) => onFieldChange("rejection_reason", e.target.value)}
                    className="crm-select"
                  >
                    <option value="">-- Select Reason --</option>
                    <option value="Fee High">Fee High</option>
                    <option value="Joined Another Institute">Joined Another Institute</option>
                    <option value="Location / Distance Issue">Location / Distance Issue</option>
                    <option value="Course Not Available">Course Not Available</option>
                    <option value="Not Interested Anymore">Not Interested Anymore</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="crm-field">
                  <label className="crm-label">Joined Competitor (Optional)</label>
                  <input
                    type="text"
                    placeholder="Institute name"
                    value={feedbackFields.competitor_name || ""}
                    onChange={(e) => onFieldChange("competitor_name", e.target.value)}
                    className="crm-input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Today's Discussion Notes Textarea */}
          <div className="crm-field">
            <label className="crm-label">Today's Discussion / Counsellor Notes</label>
            <textarea
              rows={4}
              placeholder="Add today's discussion, counselling notes, student concerns, parent discussion, or next action..."
              value={remarks}
              onChange={(e) => onRemarksChange(e.target.value)}
              className="crm-textarea"
            />
          </div>
        </div>
      )}

      {/* DATE-WISE INTERACTION HISTORY TIMELINE */}
      <div className="crm-card">
        <div className="crm-card-header">
          <Clock className="text-blue-600" size={20} />
          <div>
            <h3 className="crm-card-title">
              🕒 Interaction & Feedback History ({feedbackHistory.length})
            </h3>
            <p className="crm-card-subtitle">Complete chronological record of all recorded discussions</p>
          </div>
        </div>

        {historyLoading ? (
          <div style={{ textAlign: "center", padding: "32px", fontSize: "13px", color: "#64748B" }}>
            Loading history timeline...
          </div>
        ) : feedbackHistory.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px", backgroundColor: "#F8FAFC", borderRadius: "12px", border: "1px dashed #CBD5E1", fontSize: "13px", color: "#64748B" }}>
            No feedback entries recorded yet for this lead.
          </div>
        ) : (
          <div className="crm-timeline">
            {feedbackHistory.map((item, idx) => {
              const fields = item.feedback_fields || {};
              const formattedDateTime = item.created_at
                ? new Date(item.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }) +
                  " • " +
                  new Date(item.created_at).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "-";

              return (
                <div key={item.id || idx} className="crm-timeline-item">
                  <div className="crm-timeline-dot" />
                  <div className="crm-timeline-card">
                    <div className="crm-timeline-header">
                      <span className="crm-badge crm-badge-status">
                        {item.status_at_feedback || "STATUS"}
                      </span>

                      <div className="crm-timeline-meta">
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <User size={13} />
                          Counsellor: {item.created_by_name || "Rohit Sharma"}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontFamily: "monospace" }}>
                          <Clock size={13} />
                          {formattedDateTime}
                        </span>
                      </div>
                    </div>

                    {/* Key-Value Details Grid */}
                    {Object.keys(fields).length > 0 && (
                      <div className="crm-timeline-fields">
                        {Object.entries(fields).map(([k, v]) => {
                          if (!v || typeof v === "object") return null;
                          return (
                            <div key={k}>
                              <span style={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase", fontSize: "10px" }}>
                                {k.replace(/_/g, " ")}:
                              </span>{" "}
                              <strong style={{ color: "#0F172A" }}>{String(v)}</strong>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Remarks Discussion Note */}
                    {item.remarks && (
                      <div className="crm-timeline-note">
                        <strong style={{ display: "block", fontSize: "11px", textTransform: "uppercase", color: "#92400E", marginBottom: "2px" }}>
                          Discussion Note:
                        </strong>
                        {item.remarks}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default CounsellorNotesTab;
