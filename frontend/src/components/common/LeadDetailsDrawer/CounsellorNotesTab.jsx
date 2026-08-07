import React from "react";
import { Sparkles, Tag, AlertCircle, Clock, User, MessageSquareText, Calendar, Send } from "lucide-react";

/**
 * CounsellorNotesTab Component
 * Houses Status control, Priority badge, dynamic status fields, discussion textarea, and date-wise Interaction History timeline.
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
  const priorityBadgeStyle =
    priority === "high"
      ? "bg-red-50 text-red-700 border-red-200"
      : priority === "medium"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  return (
    <div className="space-y-6">
      {/* STATUS & PRIORITY CARD */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Tag className="text-blue-600" size={18} />
          <h3 className="text-base font-extrabold text-slate-900">📌 Lead Status & Priority</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status Dropdown Selector */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5 tracking-wider">
              Lead Status <span className="text-red-500">*</span>
            </label>
            <select
              disabled={!isEditable}
              value={selectedStatus}
              onChange={(e) => onStatusSelect(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-extrabold text-slate-900 shadow-2xs outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 cursor-pointer disabled:bg-slate-50"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-Calculated Priority Badge Display */}
          <div>
            <span className="block text-xs font-bold uppercase text-slate-700 mb-1.5 tracking-wider">
              Priority (Auto Derived)
            </span>
            <div className="flex items-center h-[42px]">
              <span
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-extrabold uppercase tracking-wider border ${priorityBadgeStyle}`}
              >
                <AlertCircle size={14} />
                {lead?.priority || "MEDIUM"} PRIORITY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* COUNSELLOR NOTES & DYNAMIC FORM CARD */}
      {isEditable && (
        <div className="rounded-2xl border border-blue-200 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Sparkles className="text-blue-600 shrink-0" size={20} />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                💬 Record Today's Discussion & Feedback
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Dynamic fields change according to lead status
              </p>
            </div>
          </div>

          {/* DYNAMIC FIELDS CONTAINER */}
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 space-y-4">
            {/* 1. NOT_CONTACTED / NEW / CONTACTED */}
            {(selectedStatus === "NOT_CONTACTED" || selectedStatus === "NEW" || selectedStatus === "CONTACTED") && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1 tracking-wider">
                  Uncontacted Reason <span className="text-red-500">*</span>
                </label>
                <select
                  value={feedbackFields.reason || ""}
                  onChange={(e) => onFieldChange("reason", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1 tracking-wider">
                    Next Follow-up Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={feedbackFields.next_followup || ""}
                    onChange={(e) => onFieldChange("next_followup", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1 tracking-wider">
                    Follow-up Mode / Action
                  </label>
                  <select
                    value={feedbackFields.followup_type || "CALL"}
                    onChange={(e) => onFieldChange("followup_type", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
                  >
                    <option value="CALL">Phone Call</option>
                    <option value="WHATSAPP">WhatsApp</option>
                    <option value="EMAIL">Email</option>
                    <option value="MEETING">Campus Meeting</option>
                  </select>
                </div>
              </div>
            )}

            {/* 3. QUALIFIED / INTERESTED / WALKED IN */}
            {(selectedStatus === "QUALIFIED" || selectedStatus === "INTERESTED") && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1 tracking-wider">
                    Walk-in Date
                  </label>
                  <input
                    type="date"
                    value={feedbackFields.walkin_date || ""}
                    onChange={(e) => onFieldChange("walkin_date", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1 tracking-wider">
                    Walk-in Time
                  </label>
                  <input
                    type="time"
                    value={feedbackFields.walkin_time || ""}
                    onChange={(e) => onFieldChange("walkin_time", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1 tracking-wider">
                    Preferred Campus
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Main Campus"
                    value={feedbackFields.preferred_centre || ""}
                    onChange={(e) => onFieldChange("preferred_centre", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* 4. ADMISSION_DONE / ENROLLED */}
            {(selectedStatus === "ADMISSION_DONE" || selectedStatus === "ENROLLED") && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1 tracking-wider">
                    Course Enrolled
                  </label>
                  <input
                    type="text"
                    placeholder="Course name"
                    value={feedbackFields.course_name || ""}
                    onChange={(e) => onFieldChange("course_name", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1 tracking-wider">
                    Fee Paid (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={feedbackFields.fee_paid || ""}
                    onChange={(e) => onFieldChange("fee_paid", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1 tracking-wider">
                    Receipt / Ref No
                  </label>
                  <input
                    type="text"
                    placeholder="Receipt #"
                    value={feedbackFields.receipt_no || ""}
                    onChange={(e) => onFieldChange("receipt_no", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* 5. NOT_INTERESTED / REJECTED */}
            {(selectedStatus === "NOT_INTERESTED" || selectedStatus === "LOST" || selectedStatus === "REJECTED") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1 tracking-wider">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={feedbackFields.rejection_reason || ""}
                    onChange={(e) => onFieldChange("rejection_reason", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
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
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1 tracking-wider">
                    Joined Competitor (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Institute name"
                    value={feedbackFields.competitor_name || ""}
                    onChange={(e) => onFieldChange("competitor_name", e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Today's Discussion Notes Textarea */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5 tracking-wider">
              Today's Discussion / Counsellor Notes
            </label>
            <textarea
              rows={4}
              placeholder="Add today's discussion, counselling notes, student concerns, parent discussion, or next action..."
              value={remarks}
              onChange={(e) => onRemarksChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm font-semibold text-slate-900 shadow-2xs outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 leading-relaxed"
              style={{ minHeight: "130px" }}
            />
          </div>
        </div>
      )}

      {/* DATE-WISE INTERACTION HISTORY TIMELINE */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900">
            🕒 Interaction & Feedback History ({feedbackHistory.length})
          </h3>
        </div>

        {historyLoading ? (
          <div className="py-8 text-center text-xs font-semibold text-slate-500">
            Loading history timeline...
          </div>
        ) : feedbackHistory.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-xs font-semibold text-slate-500">
            No feedback entries recorded yet for this lead.
          </div>
        ) : (
          <div className="relative border-l-2 border-blue-500/30 ml-4 space-y-6 pt-1">
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
                <div key={item.id || idx} className="relative pl-6">
                  {/* Timeline node marker */}
                  <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-blue-600 bg-white shadow-2xs" />

                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-700 border border-blue-200 uppercase tracking-wider">
                        {item.status_at_feedback || "STATUS"}
                      </span>

                      <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
                        <span className="flex items-center gap-1 font-bold text-slate-800">
                          <User size={13} className="text-slate-400" />
                          Counsellor: {item.created_by_name || "Rohit Sharma"}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Clock size={13} className="text-slate-400" />
                          {formattedDateTime}
                        </span>
                      </div>
                    </div>

                    {/* Key-Value Details Grid */}
                    {Object.keys(fields).length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-lg bg-slate-50 p-3 text-xs border border-slate-200/60">
                        {Object.entries(fields).map(([k, v]) => {
                          if (!v || typeof v === "object") return null;
                          return (
                            <div key={k} className="flex items-start gap-1">
                              <span className="font-bold text-slate-500 uppercase tracking-wide text-[10px]">
                                {k.replace(/_/g, " ")}:
                              </span>
                              <span className="font-extrabold text-slate-900 break-words">{String(v)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Remarks Discussion Note */}
                    {item.remarks && (
                      <div className="text-xs text-slate-800 bg-amber-50/80 p-3 rounded-lg border border-amber-200/70 font-medium leading-relaxed">
                        <span className="font-extrabold text-amber-900 uppercase text-[10px] tracking-wider block mb-0.5">
                          Discussion Note:
                        </span>
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
    </div>
  );
};

export default CounsellorNotesTab;
