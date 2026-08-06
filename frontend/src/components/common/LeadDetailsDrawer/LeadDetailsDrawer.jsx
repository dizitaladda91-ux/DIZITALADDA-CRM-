import React, { useEffect, useState, useCallback } from "react";
import {
  X,
  Clock,
  User,
  Calendar,
  PhoneCall,
  PlusCircle,
  FileText,
  Building,
  AlertCircle,
  Tag,
  CheckCircle2,
  Edit3
} from "lucide-react";

import { getLeadById, updateLeadStatus } from "../../../services/leadService";
import {
  addLeadFeedback,
  getLeadFeedbackHistory,
} from "../../../services/leadFeedbackService";

/**
 * Shared LeadDetailsDrawer component used by both Counsellor Portal and Admin Portal.
 * 
 * Props:
 * - open: boolean
 * - lead: lead object or null
 * - onClose: function
 * - onStatusUpdated: function callback
 * - role: "counsellor" | "admin" (default: "counsellor")
 */
const LeadDetailsDrawer = ({
  open = false,
  lead = null,
  onClose,
  onStatusUpdated,
  role = "counsellor",
}) => {
  const isAdmin = role === "admin";
  const isCounsellor = role === "counsellor";

  const [loading, setLoading] = useState(false);
  const [leadDetails, setLeadDetails] = useState(null);
  
  // Set default tab: "feedback" for counsellor so form is immediately accessible, "overview" for admin
  const [activeTab, setActiveTab] = useState(isCounsellor ? "feedback" : "overview");

  // Feedback State
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Dynamic Feedback Form State
  const [selectedStatus, setSelectedStatus] = useState("CONTACTED");
  const [feedbackFields, setFeedbackFields] = useState({});
  const [remarks, setRemarks] = useState("");

  // Status options list
  const STATUS_OPTIONS = [
    { value: "NEW", label: "New Lead" },
    { value: "CONTACTED", label: "Not Contacted / Attempted" },
    { value: "FOLLOW_UP", label: "Follow-up Required" },
    { value: "QUALIFIED", label: "Walk-in Scheduled / Interested" },
    { value: "ADMISSION_DONE", label: "Admission Done / Enrolled" },
    { value: "NOT_INTERESTED", label: "Not Interested / Lost" },
    { value: "REJECTED", label: "Rejected" },
  ];

  // Role-based Tab Bar Definition
  const tabs = isCounsellor
    ? [
        { id: "feedback", label: "Feedback & Status Update" },
        { id: "overview", label: "Overview" },
      ]
    : [
        { id: "overview", label: "Overview" },
        { id: "feedback", label: "Feedback History (Read-Only)" },
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
      setActiveTab(isCounsellor ? "feedback" : "overview");
      loadLeadData();
      loadFeedbackHistory();
    }
  }, [open, lead?.id, isCounsellor, loadLeadData, loadFeedbackHistory]);

  // Handle direct status change in Overview tab for Counsellor
  const handleDirectStatusChange = async (newStatus) => {
    if (!lead?.id || !newStatus || newStatus === leadDetails?.status) return;

    try {
      setUpdatingStatus(true);
      await updateLeadStatus(lead.id, { status: newStatus });

      setSelectedStatus(newStatus);
      await loadLeadData();

      if (typeof onStatusUpdated === "function") {
        onStatusUpdated();
      }

      alert(`Lead status updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error("Failed to update lead status:", error);
      alert(error?.response?.data?.message || "Failed to update lead status");
    } finally {
      setUpdatingStatus(false);
    }
  };

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

      alert("Feedback entry saved & status/priority updated successfully!");
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
              Code: {currentLead?.lead_code} | Mode: <span className="uppercase font-bold text-blue-600">{role}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoItem label="Mobile" value={currentLead?.mobile} icon={<PhoneCall size={16} />} />
                <InfoItem label="Email" value={currentLead?.email} icon={<User size={16} />} />
                <InfoItem label="Course" value={currentLead?.course_name || currentLead?.interested_course || currentLead?.campaign_name} icon={<Building size={16} />} />
                
                {/* STATUS FIELD: Editable select for Counsellor, static for Admin */}
                {isCounsellor ? (
                  <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-3.5 shadow-2xs">
                    <div className="flex items-center justify-between text-blue-700 mb-1">
                      <div className="flex items-center gap-1.5">
                        <Tag size={16} />
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          Status (Editable)
                        </span>
                      </div>
                      {updatingStatus && <span className="text-xs text-blue-600 animate-pulse">Updating...</span>}
                    </div>
                    <select
                      value={currentLead?.status?.toUpperCase() || "NEW"}
                      onChange={(e) => handleDirectStatusChange(e.target.value)}
                      disabled={updatingStatus}
                      className="w-full mt-1 rounded-lg border border-blue-300 bg-white px-2.5 py-1.5 text-sm font-bold text-blue-900 outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <InfoItem label="Status" value={currentLead?.status} icon={<Tag size={16} />} />
                )}

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
            </div>
          )}

          {/* TAB 2: FEEDBACK & STATUS UPDATE */}
          {activeTab === "feedback" && (
            <div className="space-y-6">
              {/* Add Feedback Form (ACTIVE & EDITABLE FOR COUNSELLOR) */}
              {isCounsellor && (
                <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                    <PlusCircle className="text-blue-600" size={20} />
                    <div>
                      <h3 className="text-base font-bold text-slate-800">Add Status & Feedback Entry</h3>
                      <p className="text-xs text-slate-500">Record dynamic feedback and update lead status</p>
                    </div>
                  </div>

                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
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
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* DYNAMIC FIELDS PER STATUS */}
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

                    {(selectedStatus === "QUALIFIED" || selectedStatus === "INTERESTED") && (
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

              {/* Feedback History Timeline (Shared for both roles) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                    Feedback History Timeline ({feedbackHistory.length})
                  </h3>
                  {isAdmin && (
                    <span className="text-xs text-slate-500 bg-slate-200 px-2.5 py-1 rounded font-medium">
                      Admin Monitoring (Read-Only)
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

          {/* ADMIN ONLY TABS */}
          {isAdmin && activeTab === "timeline" && (
            <div className="py-12 text-center text-slate-500">
              <Clock className="mx-auto mb-2 text-slate-400" size={32} />
              <p className="text-sm font-medium">Full lead system activity timeline.</p>
            </div>
          )}

          {isAdmin && activeTab === "notes" && (
            <div className="py-12 text-center text-slate-500">
              <FileText className="mx-auto mb-2 text-slate-400" size={32} />
              <p className="text-sm font-medium">Lead notes archive.</p>
            </div>
          )}

          {isAdmin && activeTab === "followups" && (
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