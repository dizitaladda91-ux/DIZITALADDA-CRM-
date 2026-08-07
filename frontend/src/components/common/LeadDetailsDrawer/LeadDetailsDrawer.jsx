import React, { useEffect, useState, useCallback } from "react";
import LeadSummaryHeader from "./LeadSummaryHeader";
import LeadDetailsTabsNav from "./LeadDetailsTabsNav";
import PersonalInformationTab from "./PersonalInformationTab";
import AcademicInformationTab from "./AcademicInformationTab";
import CounsellorNotesTab from "./CounsellorNotesTab";
import LeadDrawerFooter from "./LeadDrawerFooter";

import { getLeadById } from "../../../services/leadService";
import {
  addLeadFeedback,
  getLeadFeedbackHistory,
} from "../../../services/leadFeedbackService";

/**
 * Shared LeadDetailsDrawer Component
 * Redesigned 3-Tab SaaS CRM lead panel with compact summary header, dynamic academic level switcher, counsellor feedback timeline, and sticky footer.
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
  const isEditable = isCounsellor; // Counsellors have full edit capabilities; Admin views complete audit trail

  const [loading, setLoading] = useState(false);
  const [leadDetails, setLeadDetails] = useState(null);
  
  // 3-Tab State: "personal" | "academic" | "counselling"
  const [activeTab, setActiveTab] = useState("personal");

  // Preserved Form State across all 3 tabs
  const [personalData, setPersonalData] = useState({});
  const [academicData, setAcademicData] = useState({
    education_type: "school",
    class_grade: "12th",
    stream: "Science",
    board: "CBSE",
    year_of_passing: "2026",
    interested_course: "BCA",
  });

  // Feedback & History State
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Dynamic Status & Remarks State
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

  const loadLeadData = useCallback(async () => {
    if (!lead?.id) return;

    try {
      setLoading(true);
      const response = await getLeadById(lead.id);
      const leadData = response.data || response;
      setLeadDetails(leadData);

      // Populate personal info form state
      setPersonalData({
        full_name: leadData.full_name || "",
        mobile: leadData.mobile || "",
        alternate_mobile: leadData.alternate_mobile || "",
        email: leadData.email || "",
        city: leadData.city || "",
        state: leadData.state || "Uttar Pradesh",
      });

      // Populate academic info form state
      setAcademicData((prev) => ({
        ...prev,
        interested_course: leadData.interested_course || leadData.course_name || "BCA",
        preferred_centre: leadData.preferred_centre || "",
      }));

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
      const historyList = res.data || res || [];
      setFeedbackHistory(historyList);

      // If history has recorded academic fields, hydrate academicData form state
      if (historyList.length > 0) {
        const latestFeedback = historyList[0];
        const fields = latestFeedback.feedback_fields || {};
        if (fields.education_type || fields.school_name || fields.college_name) {
          setAcademicData((prev) => ({
            ...prev,
            ...fields,
          }));
        }
      }
    } catch (err) {
      console.error("Error fetching feedback history:", err);
    } finally {
      setHistoryLoading(false);
    }
  }, [lead?.id]);

  useEffect(() => {
    if (open && lead?.id) {
      setActiveTab("personal");
      loadLeadData();
      loadFeedbackHistory();
    }
  }, [open, lead?.id, loadLeadData, loadFeedbackHistory]);

  const handleFeedbackFieldChange = (field, value) => {
    setFeedbackFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!lead?.id) return;

    try {
      setSaving(true);
      const payload = {
        status: selectedStatus,
        personal_info: personalData,
        academic_info: academicData,
        feedback_fields: {
          ...academicData,
          ...feedbackFields,
        },
        remarks: remarks.trim(),
      };

      await addLeadFeedback(lead.id, payload);

      setRemarks("");
      setFeedbackFields({});

      await loadFeedbackHistory();
      await loadLeadData();

      if (typeof onStatusUpdated === "function") {
        onStatusUpdated();
      }

      alert("Lead profile, status & feedback updated successfully!");
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert(error?.response?.data?.message || "Failed to save lead updates");
    } finally {
      setSaving(false);
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

      {/* Responsive Drawer Container (~750px–840px on Desktop, 100% on Mobile) */}
      <aside
        className="
          fixed right-0 top-0 z-50 flex h-screen w-full flex-col bg-slate-50 shadow-2xl transition-all duration-300 sm:w-[680px] lg:w-[780px] xl:w-[840px]
        "
      >
        {/* ================= COMPACT TOP HEADER ================= */}
        <LeadSummaryHeader
          lead={currentLead}
          role={role}
          onClose={onClose}
        />

        {/* ================= 3-TAB HORIZONTAL NAV BAR ================= */}
        <LeadDetailsTabsNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* ================= INDEPENDENT SCROLLING TAB CONTENT AREA ================= */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: PERSONAL INFORMATION */}
          {activeTab === "personal" && (
            <PersonalInformationTab
              formData={personalData}
              onFormChange={setPersonalData}
              lead={currentLead}
              isEditable={isEditable}
              onQuickAction={setActiveTab}
            />
          )}

          {/* TAB 2: ACADEMIC INFORMATION */}
          {activeTab === "academic" && (
            <AcademicInformationTab
              formData={academicData}
              onFormChange={setAcademicData}
              lead={currentLead}
              isEditable={isEditable}
            />
          )}

          {/* TAB 3: COUNSELLOR NOTES & FEEDBACK */}
          {activeTab === "counselling" && (
            <CounsellorNotesTab
              selectedStatus={selectedStatus}
              onStatusSelect={setSelectedStatus}
              feedbackFields={feedbackFields}
              onFieldChange={handleFeedbackFieldChange}
              remarks={remarks}
              onRemarksChange={setRemarks}
              feedbackHistory={feedbackHistory}
              historyLoading={historyLoading}
              lead={currentLead}
              isEditable={isEditable}
              statusOptions={STATUS_OPTIONS}
            />
          )}
        </div>

        {/* ================= STICKY FOOTER ACTIONS ================= */}
        <LeadDrawerFooter
          onCancel={onClose}
          onSave={handleSaveChanges}
          saving={saving}
          isEditable={isEditable}
        />
      </aside>
    </>
  );
};

export default LeadDetailsDrawer;