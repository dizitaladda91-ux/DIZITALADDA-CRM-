import React, { useEffect, useState, useCallback } from "react";
import {
  X,
  Clock,
  User,
  Calendar,
  PhoneCall,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  FileText,
  Building,
  DollarSign,
  Tag
} from "lucide-react";

import { getLeadById } from "../../services/leadService";
import {
  addLeadFeedback,
  getLeadFeedbackHistory,
} from "../../services/leadFeedbackService";

const LeadDetailsDrawer = ({
  open = false,
  lead = null,
  onClose,
  onStatusUpdated,
  readOnly = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [leadDetails, setLeadDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Feedback State
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Dynamic Feedback Form State
  const [selectedStatus, setSelectedStatus] = useState("NOT_CONTACTED");
  const [feedbackFields, setFeedbackFields] = useState({});
  const [remarks, setRemarks] = useState("");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "feedback", label: "Feedback & History" },
    { id: "timeline", label: "Timeline" },
    { id: "notes", label: "Notes" },
    { id: "followups", label: "Follow-ups" },
  ];

  const loadLeadData = useCallback(async () => {
    if (!lead?.id) return;

    try {
      setLoading(true);
      const response = await getLeadById(lead.id);
      const leadData = response.data || response;
      setLeadDetails(leadData);

      // Prefill status for feedback form
      if (leadData.status) {
        setSelectedStatus(leadData.status.toUpperCase());
      }
    } catch (error) {
      console.error("Error fetching lead details:", error);
    } finally {
      setLoading(false);
    }
  }, [lead?.id]);

  const loadFeedbackHistory = useCallback(async () => {
    if (!lead?.id) return;
    try {
      setHistoryLoading(true);
      const res = await getLeadFeedbackHistory(lead.id);
      setFeedbackHistory(res.data || res || []);
    } catch (err) {
      console.error("Error fetching feedback history:", err);
    } finally {
      setHistoryLoading(false);
    }
  }, [lead?.id]);

  useEffect(() => {
    if (open && lead?.id) {
      loadLeadData();
      loadFeedbackHistory();
    }
  }, [open, lead?.id, loadLeadData, loadFeedbackHistory]);

  const handleFieldChange = (field, value) => {
    setFeedbackFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!lead?.id) return;

    try {
      setSubmittingFeedback(true);
      const payload = {
        status: selectedStatus,
        feedback_fields: feedbackFields,
        remarks: remarks.trim(),
      };

      await addLeadFeedback(lead.id, payload);

      // Reset form
      setFeedbackFields({});
      setRemarks("");

      // Refresh feedback history and lead details
      await loadFeedbackHistory();
      await loadLeadData();

      if (typeof onStatusUpdated === "function") {
        onStatusUpdated();
      }

      alert("Feedback saved & priority updated successfully!");
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      alert(error?.response?.data?.message || "Failed to save feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (!open) return null;

  if (loading && !leadDetails) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs">
        <div className="rounded-2xl bg-white p-8 shadow-xl flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
          <span className="font-medium text-slate-700">Loading Lead Details...</span>
        </div>
      </div>
    );
  }

  const currentLead = leadDetails || lead;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className="
          fixed right-0 top-0 z-50 flex h-screen w-full max-w-2xl flex-col bg-white shadow-2xl transition-all duration-300 sm:w-[600px] xl:w-[720px]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">
                {currentLead?.full_name || "Lead Details"}
              </h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  currentLead?.priority?.toLowerCase() === "high"
                    ? "bg-rose-100 text-rose-700 border border-rose-200"
                    : currentLead?.priority?.toLowerCase() === "medium"
                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                    : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                }`}
              >
                {currentLead?.priority || "MEDIUM"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 font-mono">
              {currentLead?.lead_code}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation (FIXED: Placed inside Drawer body) */}
        <div className="border-b border-slate-200 bg-white px-2">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600 font-semibold"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600 uppercase">
                  {currentLead?.full_name?.charAt(0) || "L"}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {currentLead?.full_name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    Source: <span className="font-medium text-slate-700">{currentLead?.source || "--"}</span>
                  </p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoItem label="Mobile" value={currentLead?.mobile} icon={<PhoneCall size={16} />} />
                <InfoItem label="Email" value={currentLead?.email} icon={<User size={16} />} />
                <InfoItem label="Course" value={currentLead?.course_name || currentLead?.interested_course || currentLead?.campaign_name} icon={<Building size={16} />} />
                <InfoItem label="Status" value={currentLead?.status} icon={<Tag size={16} />} />
                <InfoItem label="Priority" value={currentLead?.priority} icon={<AlertCircle size={16} />} />
                <InfoItem label="Assigned To" value={currentLead?.assigned_employee} icon={<User size={16} />} />
                <InfoItem
                  label="Next Follow-up"
                  value={
                    currentLead?.next_followup
                      ? new Date(currentLead.next_followup).toLocaleString("en-IN")
                      : "--"
                  }
                  icon={<Calendar size={16} />}
                />
                <InfoItem
                  label="Created Date"
                  value={
                    currentLead?.created_at
                      ? new Date(currentLead.created_at).toLocaleDateString("en-IN")
                      : "--"
                  }
                  icon={<Clock size={16} />}
                />
              </div>

              {currentLead?.remarks && (
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remarks / Summary</span>
                  <p className="mt-1 text-sm text-slate-700">{currentLead.remarks}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FEEDBACK & HISTORY */}
          {activeTab === "feedback" && (
            <div className="space-y-6">
              {/* Add Feedback Form (Visible if not readOnly) */}
              {!readOnly && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                    <PlusCircle className="text-blue-600" size={20} />
                    <h3 className="text-base font-bold text-slate-800">Add Status & Feedback</h3>
                  </div>

                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    {/* Status Dropdown */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                        Select Lead Status <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => {
                          setSelectedStatus(e.target.value);
                          setFeedbackFields({});
                        }}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Not Contacted / Contacted</option>
                        <option value="FOLLOW_UP">Follow-up Required</option>
                        <option value="QUALIFIED">Walk-in Scheduled / Interested</option>
                        <option value="ADMISSION_DONE">Admission Done / Enrolled</option>
                        <option value="NOT_INTERESTED">Not Interested / Lost</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </div>

                    {/* DYNAMIC FIELDS PER STATUS */}
                    {/* 1. NOT_CONTACTED / NEW / CONTACTED */}
                    {(selectedStatus === "NOT_CONTACTED" || selectedStatus === "NEW" || selectedStatus === "CONTACTED") && (
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                          Reason (Why uncontacted?)
                        </label>
                        <select
                          value={feedbackFields.reason || ""}
                          onChange={(e) => handleFieldChange("reason", e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                            Next Follow-up Date & Time <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="datetime-local"
                            value={feedbackFields.next_followup || ""}
                            onChange={(e) => handleFieldChange("next_followup", e.target.value)}
                            required
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                            Follow-up Mode
                          </label>
                          <select
                            value={feedbackFields.followup_type || "CALL"}
                            onChange={(e) => handleFieldChange("followup_type", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
                          >
                            <option value="CALL">Call</option>
                            <option value="WHATSAPP">WhatsApp</option>
                            <option value="EMAIL">Email</option>
                            <option value="MEETING">Meeting</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* 3. WALK_IN_SCHEDULED / QUALIFIED */}
                    {(selectedStatus === "WALK_IN_SCHEDULED" || selectedStatus === "QUALIFIED" || selectedStatus === "INTERESTED") && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                            Walk-in Date
                          </label>
                          <input
                            type="date"
                            value={feedbackFields.walkin_date || ""}
                            onChange={(e) => handleFieldChange("walkin_date", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                            Walk-in Time
                          </label>
                          <input
                            type="time"
                            value={feedbackFields.walkin_time || ""}
                            onChange={(e) => handleFieldChange("walkin_time", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                            Preferred Centre
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Main Campus"
                            value={feedbackFields.preferred_centre || ""}
                            onChange={(e) => handleFieldChange("preferred_centre", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* 4. ADMISSION_DONE */}
                    {(selectedStatus === "ADMISSION_DONE" || selectedStatus === "ENROLLED") && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                            Course Enrolled
                          </label>
                          <input
                            type="text"
                            placeholder="Course name"
                            value={feedbackFields.course_name || ""}
                            onChange={(e) => handleFieldChange("course_name", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                            Fee Paid (₹)
                          </label>
                          <input
                            type="number"
                            placeholder="Amount"
                            value={feedbackFields.fee_paid || ""}
                            onChange={(e) => handleFieldChange("fee_paid", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                            Receipt / Ref No
                          </label>
                          <input
                            type="text"
                            placeholder="Receipt #"
                            value={feedbackFields.receipt_no || ""}
                            onChange={(e) => handleFieldChange("receipt_no", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* 5. NOT_INTERESTED / REJECTED / LOST */}
                    {(selectedStatus === "NOT_INTERESTED" || selectedStatus === "LOST" || selectedStatus === "REJECTED") && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                            Rejection Reason <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={feedbackFields.rejection_reason || ""}
                            onChange={(e) => handleFieldChange("rejection_reason", e.target.value)}
                            required
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
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

                        <div>
                          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                            Competitor / Joined College (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. ABC Institute"
                            value={feedbackFields.competitor_name || ""}
                            onChange={(e) => handleFieldChange("competitor_name", e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Remarks Textarea */}
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                        Counsellor Remarks / Detailed Note
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Write feedback notes here..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={submittingFeedback}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition"
                      >
                        {submittingFeedback ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={16} />
                            <span>Save Feedback Entry</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Feedback History Timeline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Feedback History Timeline ({feedbackHistory.length})
                  </h3>
                  {readOnly && (
                    <span className="text-xs text-slate-400 bg-slate-200 px-2 py-0.5 rounded font-medium">
                      Read-Only (Admin Monitoring)
                    </span>
                  )}
                </div>

                {historyLoading ? (
                  <div className="py-8 text-center text-sm text-slate-500">
                    Loading feedback history...
                  </div>
                ) : feedbackHistory.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                    No feedback entries recorded yet for this lead.
                  </div>
                ) : (
                  <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
                    {feedbackHistory.map((item, idx) => {
                      const fields = item.feedback_fields || {};
                      return (
                        <div key={item.id || idx} className="relative pl-6">
                          {/* Marker dot */}
                          <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-blue-600 bg-white" />

                          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                              <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-200 uppercase">
                                {item.status_at_feedback}
                              </span>
                              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                <span className="flex items-center gap-1">
                                  <User size={13} className="text-slate-400" />
                                  {item.created_by_name || "Counsellor"}
                                </span>
                                <span className="flex items-center gap-1 font-mono">
                                  <Clock size={13} className="text-slate-400" />
                                  {item.created_at
                                    ? new Date(item.created_at).toLocaleString("en-IN", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                      })
                                    : "--"}
                                </span>
                              </div>
                            </div>

                            {/* Structured Fields Summary */}
                            {Object.keys(fields).length > 0 && (
                              <div className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-700">
                                {Object.entries(fields).map(([k, v]) => {
                                  if (!v) return null;
                                  return (
                                    <div key={k}>
                                      <span className="font-semibold text-slate-500 uppercase tracking-wide">
                                        {k.replace(/_/g, " ")}:
                                      </span>{" "}
                                      <span className="font-medium text-slate-800">{String(v)}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Remarks */}
                            {item.remarks && (
                              <p className="mt-2.5 text-xs text-slate-600 leading-relaxed bg-amber-50/60 p-2.5 rounded-lg border border-amber-100/80">
                                <span className="font-semibold text-amber-800">Note:</span> {item.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === "timeline" && (
            <div className="py-12 text-center text-slate-500">
              <Clock className="mx-auto mb-2 text-slate-400" size={32} />
              <p className="text-sm font-medium">Timeline history is available in Feedback & History tab.</p>
            </div>
          )}

          {/* TAB 4: NOTES */}
          {activeTab === "notes" && (
            <div className="py-12 text-center text-slate-500">
              <FileText className="mx-auto mb-2 text-slate-400" size={32} />
              <p className="text-sm font-medium">Notes captured as part of feedback entries.</p>
            </div>
          )}

          {/* TAB 5: FOLLOWUPS */}
          {activeTab === "followups" && (
            <div className="py-12 text-center text-slate-500">
              <Calendar className="mx-auto mb-2 text-slate-400" size={32} />
              <p className="text-sm font-medium">
                Next Follow-up:{" "}
                <span className="font-bold text-slate-700">
                  {currentLead?.next_followup
                    ? new Date(currentLead.next_followup).toLocaleString("en-IN")
                    : "No follow-up set"}
                </span>
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

const InfoItem = ({ label, value, icon }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
      {icon}
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
    </div>
    <p className="text-sm font-semibold text-slate-800 break-words">
      {value || "--"}
    </p>
  </div>
);

export default LeadDetailsDrawer;