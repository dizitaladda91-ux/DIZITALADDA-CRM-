import React, { useEffect, useState, useCallback } from "react";
import { X, MessageSquareText, User, Clock, FileText, Calendar } from "lucide-react";

import LeadSummaryCard from "./LeadSummaryCard";
import LeadPersonalInfoCard from "./LeadPersonalInfoCard";
import LeadAcademicInfoCard from "./LeadAcademicInfoCard";
import LeadStatusPriorityCard from "./LeadStatusPriorityCard";
import LeadFeedbackFormCard from "./LeadFeedbackFormCard";
import LeadFeedbackHistoryTimeline from "./LeadFeedbackHistoryTimeline";
import LeadDrawerFooter from "./LeadDrawerFooter";

import { getLeadById, updateLeadStatus } from "../../../services/leadService";
import {
  addLeadFeedback,
  getLeadFeedbackHistory,
} from "../../../services/leadFeedbackService";

/**
 * Shared LeadDetailsDrawer Component
 * Redesigned SaaS CRM lead panel with categorized cards, vertical timeline, role-based controls, and sticky footer.
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
  
  // Active tab state
  const [activeTab, setActiveTab] = useState(isCounsellor ? "feedback" : "overview");

  // Feedback & History State
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Dynamic Form State
  const [selectedStatus, setSelectedStatus] = useState("CONTACTED");
  const [feedbackFields, setFeedbackFields] = useState({});
  const [remarks, setRemarks] = useState("");

  const STATUS_OPTIONS = [
    { value: "NEW", label: "New Lead" },
    { value: "CONTACTED", label: "Not Contacted / Attempted" },
    { value: "FOLLOW_UP", label: "Follow-up Required" },
    { value: "QUALIFIED", label: "Walk-in Scheduled / Interested" },
    { value: "ADMISSION_DONE", label: "Admission Done / Enrolled" },
    { value: "NOT_INTERESTED", label: "Not Interested / Lost" },
    { value: "REJECTED", label: "Rejected" },
  ];

  const tabs = isCounsellor
    ? [
        { id: "feedback", label: "Feedback & Status Update", icon: <MessageSquareText size={15} /> },
        { id: "overview", label: "Full Details & Cards", icon: <User size={15} /> },
      ]
    : [
        { id: "overview", label: "Overview", icon: <User size={15} /> },
        { id: "feedback", label: "Feedback History", icon: <MessageSquareText size={15} /> },
        { id: "timeline", label: "System Logs", icon: <Clock size={15} /> },
        { id: "notes", label: "Notes", icon: <FileText size={15} /> },
        { id: "followups", label: "Follow-ups", icon: <Calendar size={15} /> },
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
    if (e) e.preventDefault();
    if (!lead?.id) return;

    try {
      setSubmittingFeedback(true);
      const payload = {
        status: selectedStatus,
        feedback_fields: feedbackFields,
        remarks: remarks.trim(),
      };

      await addLeadFeedback(lead.id, payload);

      setFeedbackFields({});
      setRemarks("");

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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xs">
        <div className="rounded-2xl bg-white p-8 shadow-2xl flex items-center gap-3 border border-slate-200">
          <div className="h-6 w-6 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
          <span className="font-extrabold text-slate-800 text-sm">Loading Lead Details...</span>
        </div>
      </div>
    );
  }

  const currentLead = leadDetails || lead;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Responsive Drawer Container */}
      <aside
        className="
          fixed right-0 top-0 z-50 flex h-screen w-full flex-col bg-slate-50 shadow-2xl transition-all duration-300 sm:w-[540px] lg:w-[600px] xl:w-[660px]
        "
      >
        {/* ================= DRAWER HEADER ================= */}
        <div className="sticky top-0 z-20 border-b border-slate-200 bg-white px-6 py-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Lead Details
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                View and manage complete lead information
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ================= TAB BAR ================= */}
        <div className="border-b border-slate-200 bg-white px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer
                  ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600 bg-blue-50/50 font-extrabold"
                      : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ================= INDEPENDENT SCROLLING CONTENT AREA ================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* LEAD SUMMARY CARD (TOP) */}
          <LeadSummaryCard lead={currentLead} />

          {/* TAB 1: OVERVIEW & CATEGORIZED CARDS */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Personal Information Card */}
              <LeadPersonalInfoCard lead={currentLead} />

              {/* Lead & Academic Information Card */}
              <LeadAcademicInfoCard lead={currentLead} />

              {/* Status & Priority Management Card */}
              <LeadStatusPriorityCard
                lead={currentLead}
                isCounsellor={isCounsellor}
                selectedStatus={selectedStatus}
                onStatusChange={handleDirectStatusChange}
                updatingStatus={updatingStatus}
                statusOptions={STATUS_OPTIONS}
              />
            </div>
          )}

          {/* TAB 2: FEEDBACK & INTERACTION HISTORY */}
          {activeTab === "feedback" && (
            <div className="space-y-6">
              {/* Dynamic Feedback Form (Counsellor View Only) */}
              {isCounsellor && (
                <LeadFeedbackFormCard
                  selectedStatus={selectedStatus}
                  onStatusSelect={(st) => {
                    setSelectedStatus(st);
                    setFeedbackFields({});
                  }}
                  feedbackFields={feedbackFields}
                  onFieldChange={handleFieldChange}
                  remarks={remarks}
                  onRemarksChange={setRemarks}
                  onSubmit={handleFeedbackSubmit}
                  submitting={submittingFeedback}
                  statusOptions={STATUS_OPTIONS}
                />
              )}

              {/* Categorized Info Cards (Also visible in Feedback Tab for quick context) */}
              {isCounsellor && (
                <>
                  <LeadPersonalInfoCard lead={currentLead} />
                  <LeadAcademicInfoCard lead={currentLead} />
                </>
              )}

              {/* Interaction History Timeline */}
              <LeadFeedbackHistoryTimeline
                feedbackHistory={feedbackHistory}
                loading={historyLoading}
                isAdmin={isAdmin}
              />
            </div>
          )}

          {/* ADMIN EXTRA TABS */}
          {isAdmin && activeTab === "timeline" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500 space-y-2">
              <Clock className="mx-auto text-blue-600" size={32} />
              <h4 className="text-sm font-bold text-slate-800">System Activity Logs</h4>
              <p className="text-xs text-slate-500">Automated audit logging of lead events.</p>
            </div>
          )}

          {isAdmin && activeTab === "notes" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500 space-y-2">
              <FileText className="mx-auto text-blue-600" size={32} />
              <h4 className="text-sm font-bold text-slate-800">Lead Notes Archive</h4>
              <p className="text-xs text-slate-500">Notes captured across all counsellor interactions.</p>
            </div>
          )}

          {isAdmin && activeTab === "followups" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-500 space-y-2">
              <Calendar className="mx-auto text-blue-600" size={32} />
              <h4 className="text-sm font-bold text-slate-800">Next Scheduled Follow-up</h4>
              <p className="text-sm font-extrabold text-slate-900">
                {currentLead?.next_followup
                  ? new Date(currentLead.next_followup).toLocaleString("en-IN", { dateStyle: "full", timeStyle: "short" })
                  : "No pending follow-up scheduled"}
              </p>
            </div>
          )}
        </div>

        {/* ================= STICKY FOOTER ACTIONS ================= */}
        <LeadDrawerFooter
          onCancel={onClose}
          onSave={handleFeedbackSubmit}
          saving={submittingFeedback}
          isCounsellor={isCounsellor}
        />
      </aside>
    </>
  );
};

export default LeadDetailsDrawer;