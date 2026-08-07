import React from "react";
import { User, Phone, Mail, MapPin } from "lucide-react";
import "./LeadDetailsDrawer.css";

/**
 * PersonalInformationTab Component
 * Shared Personal Information card view (editable for employee, read-only for admin).
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
    <div className="crm-card">
      <div className="crm-card-header">
        <User className="text-blue-600" size={20} />
        <div>
          <h3 className="crm-card-title">Personal Information</h3>
          <p className="crm-card-subtitle">Basic contact and location details about the student</p>
        </div>
      </div>

      <div className="crm-grid crm-grid-2">
        {/* Full Name */}
        <div className="crm-field">
          <label className="crm-label">
            Full Name <span className="crm-required">*</span>
          </label>
          <div className="crm-input-wrapper">
            <User size={16} className="crm-input-icon" />
            <input
              type="text"
              disabled={!isEditable}
              value={formData.full_name || ""}
              onChange={(e) => handleChange("full_name", e.target.value)}
              placeholder="Enter full name"
              className="crm-input has-icon"
              required
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div className="crm-field">
          <label className="crm-label">
            Mobile Number <span className="crm-required">*</span>
          </label>
          <div className="crm-input-wrapper">
            <Phone size={16} className="crm-input-icon" />
            <input
              type="text"
              disabled={!isEditable}
              value={formData.mobile || ""}
              onChange={(e) => handleChange("mobile", e.target.value)}
              placeholder="Enter mobile number"
              className="crm-input has-icon"
              required
            />
          </div>
        </div>

        {/* Alternate Mobile */}
        <div className="crm-field">
          <label className="crm-label">Alternate Mobile</label>
          <div className="crm-input-wrapper">
            <Phone size={16} className="crm-input-icon" />
            <input
              type="text"
              disabled={!isEditable}
              value={formData.alternate_mobile || ""}
              onChange={(e) => handleChange("alternate_mobile", e.target.value)}
              placeholder="Enter alternate mobile"
              className="crm-input has-icon"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="crm-field">
          <label className="crm-label">
            Email Address <span className="crm-required">*</span>
          </label>
          <div className="crm-input-wrapper">
            <Mail size={16} className="crm-input-icon" />
            <input
              type="email"
              disabled={!isEditable}
              value={formData.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="rohit@gmail.com"
              className="crm-input has-icon"
              required
            />
          </div>
        </div>

        {/* City */}
        <div className="crm-field">
          <label className="crm-label">
            City <span className="crm-required">*</span>
          </label>
          <div className="crm-input-wrapper">
            <MapPin size={16} className="crm-input-icon" />
            <input
              type="text"
              disabled={!isEditable}
              value={formData.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="Enter city"
              className="crm-input has-icon"
              required
            />
          </div>
        </div>

        {/* State */}
        <div className="crm-field">
          <label className="crm-label">
            State <span className="crm-required">*</span>
          </label>
          <select
            disabled={!isEditable}
            value={formData.state || ""}
            onChange={(e) => handleChange("state", e.target.value)}
            className="crm-select"
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
  );
};

export default PersonalInformationTab;
