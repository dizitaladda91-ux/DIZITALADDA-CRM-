import React from "react";
import { User, Phone, Mail, MapPin } from "lucide-react";

/**
 * PersonalInformationTab Component
 * Modern 2-column editable form utilizing full drawer width for clean, spacious personal details.
 */
const PersonalInformationTab = ({
  formData,
  onFormChange,
  isEditable = true,
}) => {
  const handleChange = (field, value) => {
    onFormChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <User className="text-blue-600" size={18} />
            Personal Information
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Basic contact and location details collected from the student/parent
          </p>
        </div>

        {/* Full-width 2-column grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                disabled={!isEditable}
                value={formData.full_name || ""}
                onChange={(e) => handleChange("full_name", e.target.value)}
                placeholder="Enter student full name"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-700"
                required
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                disabled={!isEditable}
                value={formData.mobile || ""}
                onChange={(e) => handleChange("mobile", e.target.value)}
                placeholder="Enter 10-digit mobile number"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-700"
                required
              />
            </div>
          </div>

          {/* Alternate Mobile */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Alternate Mobile
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                disabled={!isEditable}
                value={formData.alternate_mobile || ""}
                onChange={(e) => handleChange("alternate_mobile", e.target.value)}
                placeholder="Parent / Guardian mobile number"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-700"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                disabled={!isEditable}
                value={formData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="student@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-700"
                required
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              City <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                disabled={!isEditable}
                value={formData.city || ""}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Enter city"
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-700"
                required
              />
            </div>
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              State <span className="text-red-500">*</span>
            </label>
            <select
              disabled={!isEditable}
              value={formData.state || ""}
              onChange={(e) => handleChange("state", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-700 cursor-pointer"
              required
            >
              <option value="">-- Select State --</option>
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
  );
};

export default PersonalInformationTab;
