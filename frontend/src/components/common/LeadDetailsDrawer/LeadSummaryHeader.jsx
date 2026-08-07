import React from "react";
import { Phone, Mail, MapPin, AlertCircle, Tag, X } from "lucide-react";

/**
 * LeadSummaryHeader Component
 * Compact top header showing Avatar, Full Name, Lead ID, Phone, Email, Location, Priority badge, Status badge, and Close X button.
 */
const LeadSummaryHeader = ({ lead, role = "counsellor", onClose }) => {
  if (!lead) return null;

  const initials = lead.full_name
    ? lead.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "LD";

  const priority = (lead.priority || "MEDIUM").toLowerCase();
  const priorityBadgeStyle =
    priority === "high"
      ? "bg-red-50 text-red-700 border-red-200"
      : priority === "medium"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  const locationText = [lead.city, lead.state].filter(Boolean).join(", ");

  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white px-6 py-4 shadow-2xs">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Avatar & Key Contact Info */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg font-extrabold text-white uppercase shadow-2xs">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {lead.full_name || "Lead Details"}
              </h2>
              <span className="text-xs font-mono font-bold text-slate-500">
                Lead ID: <strong className="text-blue-700 font-extrabold">{lead.lead_code || "--"}</strong>
              </span>
            </div>

            <div className="mt-1 flex items-center gap-4 text-xs text-slate-600 font-medium flex-wrap">
              {lead.mobile && (
                <span className="flex items-center gap-1">
                  <Phone size={13} className="text-slate-400" />
                  {lead.mobile}
                </span>
              )}
              {lead.email && (
                <span className="flex items-center gap-1">
                  <Mail size={13} className="text-slate-400" />
                  {lead.email}
                </span>
              )}
              {locationText && (
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-slate-400" />
                  {locationText}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Badges & Close X Button */}
        <div className="flex items-center gap-3">
          <span
            className={`hidden sm:inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider border ${priorityBadgeStyle}`}
          >
            <AlertCircle size={12} />
            {lead.priority || "MEDIUM"} PRIORITY
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close lead details drawer"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadSummaryHeader;
