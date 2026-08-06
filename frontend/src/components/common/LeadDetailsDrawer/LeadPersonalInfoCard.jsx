import React from "react";
import { User, Phone, Mail, MapPin } from "lucide-react";

/**
 * LeadPersonalInfoCard Component
 * Displays personal information in a visually distinct, high-contrast container.
 */
const LeadPersonalInfoCard = ({ lead }) => {
  if (!lead) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <User className="text-blue-600" size={18} />
        <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
          Personal Information
        </h4>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoRow label="Full Name" value={lead.full_name} icon={<User size={15} className="text-slate-400" />} />
        <InfoRow label="Mobile Number" value={lead.mobile} icon={<Phone size={15} className="text-slate-400" />} />
        <InfoRow label="Alternate Mobile" value={lead.alternate_mobile} icon={<Phone size={15} className="text-slate-400" />} />
        <InfoRow label="Email Address" value={lead.email} icon={<Mail size={15} className="text-slate-400" />} />
        <InfoRow label="City" value={lead.city} icon={<MapPin size={15} className="text-slate-400" />} />
        <InfoRow label="State" value={lead.state} icon={<MapPin size={15} className="text-slate-400" />} />
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, icon }) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
    <div className="flex items-center gap-1.5 mb-1">
      {icon}
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </span>
    </div>
    <p className="text-sm font-extrabold text-slate-900 break-words">
      {value || "-"}
    </p>
  </div>
);

export default LeadPersonalInfoCard;
