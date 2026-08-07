import React from "react";
import { User, Phone, Mail, MapPin, Tag, AlertCircle, Calendar, Clock, UserCheck } from "lucide-react";

/**
 * PersonalInformationTab Component
 * 2-column editable form for basic personal details + Right-side Lead Summary & Quick Actions widget.
 */
const PersonalInformationTab = ({
  formData,
  onFormChange,
  lead,
  isEditable = true,
  onQuickAction,
}) => {
  const handleChange = (field, value) => {
    onFormChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const priority = (lead?.priority || "MEDIUM").toLowerCase();
  const priorityBadgeStyle =
    priority === "high"
      ? "bg-red-50 text-red-700 border-red-200"
      : priority === "medium"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  const formattedCreated = lead?.created_at
    ? new Date(lead.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  const formattedUpdated = lead?.updated_at
    ? new Date(lead.updated_at).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT 2 COLUMNS: Personal Information Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Personal Information</h3>
            <p className="text-xs text-slate-500 font-medium">Basic details about the lead</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  disabled={!isEditable}
                  value={formData.full_name || ""}
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                  required
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  disabled={!isEditable}
                  value={formData.mobile || ""}
                  onChange={(e) => handleChange("mobile", e.target.value)}
                  placeholder="Enter mobile number"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                  required
                />
              </div>
            </div>

            {/* Alternate Mobile */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Alternate Mobile
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  disabled={!isEditable}
                  value={formData.alternate_mobile || ""}
                  onChange={(e) => handleChange("alternate_mobile", e.target.value)}
                  placeholder="Enter alternate mobile"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  disabled={!isEditable}
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="rohit@gmail.com"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                  required
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  disabled={!isEditable}
                  value={formData.city || ""}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Lucknow"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                  required
                />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                State <span className="text-red-500">*</span>
              </label>
              <select
                disabled={!isEditable}
                value={formData.state || ""}
                onChange={(e) => handleChange("state", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 cursor-pointer"
                required
              >
                <option value="">Select State</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Delhi">Delhi</option>
                <option value="Haryana">Haryana</option>
                <option value="Bihar">Bihar</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Lead Summary & Quick Actions Side Cards */}
      <div className="space-y-6">
        {/* Lead Summary Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3.5">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
            Lead Summary
          </h4>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 font-bold">
                <Tag size={14} className="text-slate-400" />
                Status
              </span>
              <span className="font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                {lead?.status || "Contacted"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 font-bold">
                <AlertCircle size={14} className="text-slate-400" />
                Priority
              </span>
              <span className={`font-extrabold px-2 py-0.5 rounded border uppercase ${priorityBadgeStyle}`}>
                {lead?.priority || "High"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 font-bold">
                <Calendar size={14} className="text-slate-400" />
                Created Date
              </span>
              <span className="font-extrabold text-slate-900">{formattedCreated}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 font-bold">
                <UserCheck size={14} className="text-slate-400" />
                Assigned Counsellor
              </span>
              <span className="font-extrabold text-slate-900">{lead?.assigned_employee || "Rohit Sharma"}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 font-bold">
                <Clock size={14} className="text-slate-400" />
                Last Updated
              </span>
              <span className="font-semibold text-slate-700">{formattedUpdated}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
            Quick Actions
          </h4>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => onQuickAction?.("counselling")}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50/70 py-2.5 text-xs font-extrabold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
            >
              <Calendar size={15} />
              <span>Schedule Follow-up</span>
            </button>

            <button
              type="button"
              onClick={() => onQuickAction?.("counselling")}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <Clock size={15} />
              <span>View History</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationTab;
