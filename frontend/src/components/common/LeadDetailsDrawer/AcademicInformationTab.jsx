import React from "react";
import { GraduationCap, School, Target, Share2, Layers } from "lucide-react";
import "./LeadDetailsDrawer.css";

/**
 * AcademicInformationTab Component (Tab 2)
 * Guided Step 2: Academic Profile & Preferences
 */
const AcademicInformationTab = ({
  formData,
  onFormChange,
  lead,
  isEditable = true,
}) => {
  const educationType = formData.education_type || "school";

  const handleChange = (field, value) => {
    onFormChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      {/* Target Program & Centre Preferences Card */}
      <div className="crm-card">
        <div className="crm-card-header">
          <Target className="text-blue-600" size={20} />
          <div>
            <h3 className="crm-card-title">🎯 Target Program & Centre Preferences</h3>
            <p className="crm-card-subtitle">Interested course and campus preference</p>
          </div>
        </div>

        <div className="crm-grid crm-grid-2">
          {/* Interested Course */}
          <div className="crm-field">
            <label className="crm-label">
              Interested Program / Course <span className="crm-required">*</span>
            </label>
            <select
              disabled={!isEditable}
              value={formData.interested_course || lead?.interested_course || "BCA"}
              onChange={(e) => handleChange("interested_course", e.target.value)}
              className="crm-select"
            >
              <option value="BCA">BCA - Bachelor of Computer Applications</option>
              <option value="BBA">BBA - Bachelor of Business Administration</option>
              <option value="B.Tech">B.Tech - Computer Science & Engineering</option>
              <option value="Event Management">Diploma in Event Management</option>
              <option value="Data Science">Post Graduate Data Science</option>
              <option value="MBA">MBA - Master of Business Administration</option>
            </select>
          </div>

          {/* Preferred Campus Centre */}
          <div className="crm-field">
            <label className="crm-label">Preferred Campus Centre</label>
            <input
              type="text"
              disabled={!isEditable}
              value={formData.preferred_centre || lead?.preferred_centre || ""}
              onChange={(e) => handleChange("preferred_centre", e.target.value)}
              placeholder="e.g. Main Campus / Lucknow"
              className="crm-input"
            />
          </div>

          {/* Lead Source */}
          <div className="crm-field">
            <label className="crm-label">Lead Source</label>
            <div className="crm-input-wrapper">
              <Share2 size={16} className="crm-input-icon" />
              <input
                type="text"
                disabled
                value={lead?.source || "WEBSITE"}
                className="crm-input has-icon"
              />
            </div>
          </div>

          {/* Campaign */}
          <div className="crm-field">
            <label className="crm-label">Campaign</label>
            <div className="crm-input-wrapper">
              <Layers size={16} className="crm-input-icon" />
              <input
                type="text"
                disabled
                value={lead?.course_name || lead?.campaign_name || "IEM Admissions 2026"}
                className="crm-input has-icon"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Academic Background Card */}
      <div className="crm-card">
        <div className="crm-card-header">
          <GraduationCap className="text-blue-600" size={20} />
          <div>
            <h3 className="crm-card-title">🎓 Student Academic Background</h3>
            <p className="crm-card-subtitle">Choose education mode (School vs College)</p>
          </div>
        </div>

        {/* Educational Mode Switcher */}
        <div className="crm-radio-group">
          <label className="crm-radio-label">
            <input
              type="radio"
              name="education_type"
              value="school"
              checked={educationType === "school"}
              onChange={() => handleChange("education_type", "school")}
              disabled={!isEditable}
              className="crm-radio-input"
            />
            <School size={16} style={{ color: "#2563EB" }} />
            <span>School Mode (10th / 12th)</span>
          </label>

          <label className="crm-radio-label">
            <input
              type="radio"
              name="education_type"
              value="college"
              checked={educationType === "college"}
              onChange={() => handleChange("education_type", "college")}
              disabled={!isEditable}
              className="crm-radio-input"
            />
            <GraduationCap size={16} style={{ color: "#2563EB" }} />
            <span>College Mode (Degree / Diploma)</span>
          </label>
        </div>

        {/* SCHOOL MODE */}
        {educationType === "school" && (
          <div className="crm-grid crm-grid-3">
            <div className="crm-field" style={{ gridColumn: "1 / -1" }}>
              <label className="crm-label">
                School Name <span className="crm-required">*</span>
              </label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.school_name || ""}
                onChange={(e) => handleChange("school_name", e.target.value)}
                placeholder="e.g. St. Xavier School / City Public School"
                className="crm-input"
                required
              />
            </div>

            <div className="crm-field">
              <label className="crm-label">10th Board & Percentage</label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.tenth_board_percent || ""}
                onChange={(e) => handleChange("tenth_board_percent", e.target.value)}
                placeholder="e.g. CBSE - 88%"
                className="crm-input"
              />
            </div>

            <div className="crm-field">
              <label className="crm-label">12th Board</label>
              <select
                disabled={!isEditable}
                value={formData.board || "CBSE"}
                onChange={(e) => handleChange("board", e.target.value)}
                className="crm-select"
              >
                <option value="CBSE">CBSE Board</option>
                <option value="ICSE">ICSE / ISC Board</option>
                <option value="State Board">State Board</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="crm-field">
              <label className="crm-label">12th Stream</label>
              <select
                disabled={!isEditable}
                value={formData.stream || "Science"}
                onChange={(e) => handleChange("stream", e.target.value)}
                className="crm-select"
              >
                <option value="Science">Science (PCM/PCB)</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts">Arts / Humanities</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="crm-field">
              <label className="crm-label">12th Percentage / CGPA</label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.percentage_cgpa || ""}
                onChange={(e) => handleChange("percentage_cgpa", e.target.value)}
                placeholder="e.g. 85.6%"
                className="crm-input"
              />
            </div>
          </div>
        )}

        {/* COLLEGE MODE */}
        {educationType === "college" && (
          <div className="crm-grid crm-grid-3">
            <div className="crm-field" style={{ gridColumn: "span 2" }}>
              <label className="crm-label">
                University / College Name <span className="crm-required">*</span>
              </label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.college_name || ""}
                onChange={(e) => handleChange("college_name", e.target.value)}
                placeholder="e.g. Delhi University / IEM Institute"
                className="crm-input"
                required
              />
            </div>

            <div className="crm-field">
              <label className="crm-label">Degree Program</label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.degree_program || ""}
                onChange={(e) => handleChange("degree_program", e.target.value)}
                placeholder="e.g. B.Sc / BCA / B.Com"
                className="crm-input"
              />
            </div>

            <div className="crm-field">
              <label className="crm-label">Branch / Specialization</label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.specialization || ""}
                onChange={(e) => handleChange("specialization", e.target.value)}
                placeholder="e.g. Computer Science / Finance"
                className="crm-input"
              />
            </div>

            <div className="crm-field">
              <label className="crm-label">Passing / Graduation Year</label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.graduation_year || "2026"}
                onChange={(e) => handleChange("graduation_year", e.target.value)}
                placeholder="2026"
                className="crm-input"
              />
            </div>

            <div className="crm-field">
              <label className="crm-label">CGPA / Percentage</label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.college_cgpa || ""}
                onChange={(e) => handleChange("college_cgpa", e.target.value)}
                placeholder="e.g. 8.4 CGPA"
                className="crm-input"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AcademicInformationTab;
