import React from "react";
import { Tag, AlertCircle, Calendar, CreditCard, DollarSign, Sliders } from "lucide-react";
import "./LeadDetailsDrawer.css";

/**
 * CounsellorNotesTab Component (Tab 3)
 * Clean Enterprise Guided Counselling Form
 * Statuses: INTERESTED, FOLLOW_UP, VISITED, ENROLLED, NOT_INTERESTED, NEW
 */
const CounsellorNotesTab = ({
  selectedStatus,
  onStatusSelect,
  feedbackFields,
  onFieldChange,
  remarks,
  onRemarksChange,
  lead,
  isEditable = true,
}) => {
  const normStatus = (selectedStatus || "NEW").toUpperCase();
  const rawPriority = (lead?.priority || "MEDIUM").toUpperCase();
  const priorityClass =
    rawPriority === "HIGH"
      ? "crm-badge-high"
      : rawPriority === "MEDIUM"
      ? "crm-badge-medium"
      : "crm-badge-low";

  const priorityLabel = rawPriority;

  return (
    <>
      {/* Lead Status & Priority Card */}
      <div className="crm-card">
        <div className="crm-card-header">
          <Tag className="text-blue-600" size={20} />
          <div>
            <h3 className="crm-card-title">Step 3: Lead Status & Priority Engine</h3>
            <p className="crm-card-subtitle">Select status to trigger relevant workflow fields</p>
          </div>
        </div>

        <div className="crm-grid crm-grid-2">
          {/* Standardized Status Selector */}
          <div className="crm-field">
            <label className="crm-label">
              Lead Status <span className="crm-required">*</span>
            </label>
            <select
              disabled={!isEditable}
              value={normStatus}
              onChange={(e) => onStatusSelect(e.target.value)}
              className="crm-select"
            >
              <option value="INTERESTED">INTERESTED (High Intent)</option>
              <option value="FOLLOW_UP">FOLLOW_UP (Scheduled Callback)</option>
              <option value="VISITED">VISITED (Campus Visited)</option>
              <option value="ENROLLED">ENROLLED (Admission Confirmed & Fee Paid)</option>
              <option value="NOT_INTERESTED">NOT_INTERESTED (Lost / Dropped)</option>
              <option value="NEW">NEW (Fresh Uncontacted Lead)</option>
            </select>
          </div>

          {/* Smart Priority Display */}
          <div className="crm-field">
            <label className="crm-label">Calculated Priority</label>
            <div style={{ display: "flex", alignItems: "center", height: "48px" }}>
              <span className={`crm-badge ${priorityClass}`}>
                <AlertCircle size={14} />
                {priorityLabel} PRIORITY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Action Form Card */}
      {isEditable && (
        <div className="crm-card">
          <div className="crm-card-header">
            <Sliders className="text-blue-600" size={20} />
            <div>
              <h3 className="crm-card-title">Status Workflow Fields</h3>
              <p className="crm-card-subtitle">Additional fields for selected status</p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#F8FAFC",
              padding: "18px",
              borderRadius: "12px",
              border: "1px solid #E2E8F0",
              marginBottom: "18px",
            }}
          >
            {/* 1. FOLLOW_UP WORKFLOW */}
            {normStatus === "FOLLOW_UP" && (
              <div className="crm-grid crm-grid-2">
                <div className="crm-field">
                  <label className="crm-label">
                    Next Callback Date & Time <span className="crm-required">*</span>
                  </label>
                  <div className="crm-input-wrapper">
                    <Calendar size={16} className="crm-input-icon" />
                    <input
                      type="datetime-local"
                      value={feedbackFields.next_followup || ""}
                      onChange={(e) => onFieldChange("next_followup", e.target.value)}
                      className="crm-input has-icon"
                      required
                    />
                  </div>
                </div>

                <div className="crm-field">
                  <label className="crm-label">Communication Channel</label>
                  <select
                    value={feedbackFields.followup_type || "CALL"}
                    onChange={(e) => onFieldChange("followup_type", e.target.value)}
                    className="crm-select"
                  >
                    <option value="CALL">Phone Call</option>
                    <option value="WHATSAPP">WhatsApp Message</option>
                    <option value="MEETING">Campus Meeting</option>
                  </select>
                </div>
              </div>
            )}

            {/* 2. VISITED WORKFLOW */}
            {normStatus === "VISITED" && (
              <div className="crm-grid crm-grid-3">
                <div className="crm-field">
                  <label className="crm-label">Campus Visit Date</label>
                  <input
                    type="date"
                    value={feedbackFields.visit_date || ""}
                    onChange={(e) => onFieldChange("visit_date", e.target.value)}
                    className="crm-input"
                  />
                </div>

                <div className="crm-field">
                  <label className="crm-label">Time Slot</label>
                  <input
                    type="time"
                    value={feedbackFields.visit_time || ""}
                    onChange={(e) => onFieldChange("visit_time", e.target.value)}
                    className="crm-input"
                  />
                </div>

                <div className="crm-field">
                  <label className="crm-label">Visited Centre</label>
                  <input
                    type="text"
                    placeholder="e.g. Main Campus"
                    value={feedbackFields.visited_centre || ""}
                    onChange={(e) => onFieldChange("visited_centre", e.target.value)}
                    className="crm-input"
                  />
                </div>
              </div>
            )}

            {/* 3. ENROLLED WORKFLOW */}
            {normStatus === "ENROLLED" && (
              <div>
                <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <CreditCard size={16} className="text-blue-600" />
                  <strong style={{ fontSize: "13px", color: "#1E293B" }}>
                    Admission & Fee Payment Details
                  </strong>
                </div>

                <div className="crm-grid crm-grid-3">
                  <div className="crm-field">
                    <label className="crm-label">
                      Confirmed Course <span className="crm-required">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Course name"
                      value={feedbackFields.course_name || lead?.interested_course || "BCA"}
                      onChange={(e) => onFieldChange("course_name", e.target.value)}
                      className="crm-input"
                    />
                  </div>

                  <div className="crm-field">
                    <label className="crm-label">
                      Total Fee Amount (₹) <span className="crm-required">*</span>
                    </label>
                    <div className="crm-input-wrapper">
                      <DollarSign size={16} className="crm-input-icon" />
                      <input
                        type="number"
                        placeholder="e.g. 120000"
                        value={feedbackFields.total_fee || ""}
                        onChange={(e) => onFieldChange("total_fee", e.target.value)}
                        className="crm-input has-icon"
                      />
                    </div>
                  </div>

                  <div className="crm-field">
                    <label className="crm-label">
                      Paid Fee Amount (₹) <span className="crm-required">*</span>
                    </label>
                    <div className="crm-input-wrapper">
                      <DollarSign size={16} className="crm-input-icon" />
                      <input
                        type="number"
                        placeholder="e.g. 25000"
                        value={feedbackFields.fee_paid || ""}
                        onChange={(e) => onFieldChange("fee_paid", e.target.value)}
                        className="crm-input has-icon"
                      />
                    </div>
                  </div>

                  <div className="crm-field">
                    <label className="crm-label">Receipt / Transaction No.</label>
                    <input
                      type="text"
                      placeholder="Receipt #"
                      value={feedbackFields.receipt_no || ""}
                      onChange={(e) => onFieldChange("receipt_no", e.target.value)}
                      className="crm-input"
                    />
                  </div>

                  <div className="crm-field">
                    <label className="crm-label">Next Installment Due Date</label>
                    <input
                      type="date"
                      value={feedbackFields.next_due_date || ""}
                      onChange={(e) => onFieldChange("next_due_date", e.target.value)}
                      className="crm-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. NOT_INTERESTED WORKFLOW */}
            {normStatus === "NOT_INTERESTED" && (
              <div className="crm-grid crm-grid-2">
                <div className="crm-field">
                  <label className="crm-label">
                    Drop / Rejection Reason <span className="crm-required">*</span>
                  </label>
                  <select
                    value={feedbackFields.rejection_reason || ""}
                    onChange={(e) => onFieldChange("rejection_reason", e.target.value)}
                    className="crm-select"
                  >
                    <option value="">-- Select Reason --</option>
                    <option value="Fee constraint / High Fee">Fee Constraint / High Fee</option>
                    <option value="Location / Distance Issue">Location / Distance Issue</option>
                    <option value="Chose Competitor Institute">Chose Competitor Institute</option>
                    <option value="Course Not Available">Course Not Available</option>
                    <option value="Not Interested Anymore">Not Interested Anymore</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="crm-field">
                  <label className="crm-label">Competitor Details (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. ABC Institute"
                    value={feedbackFields.competitor_name || ""}
                    onChange={(e) => onFieldChange("competitor_name", e.target.value)}
                    className="crm-input"
                  />
                </div>
              </div>
            )}

            {/* 5. INTERESTED WORKFLOW */}
            {normStatus === "INTERESTED" && (
              <div className="crm-field">
                <label className="crm-label">Student Key Interest & Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Student requested fee structure & hostel details"
                  value={feedbackFields.interest_notes || ""}
                  onChange={(e) => onFieldChange("interest_notes", e.target.value)}
                  className="crm-input"
                />
              </div>
            )}
          </div>

          {/* Discussion Remarks Textarea */}
          <div className="crm-field">
            <label className="crm-label">
              Discussion Remarks & Summary
            </label>
            <textarea
              rows={4}
              placeholder="Record discussion summary, student response, parent concerns, and action items..."
              value={remarks}
              onChange={(e) => onRemarksChange(e.target.value)}
              className="crm-textarea"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CounsellorNotesTab;
