import React from "react";
import { GraduationCap, School, Target, Share2, Layers } from "lucide-react";
import "./LeadDetailsDrawer.css";

/**
 * AcademicInformationTab Component
 * Shared Academic Information card with dynamic education switcher for School vs College.
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
      {/* Education Details Card */}
      <div className="crm-card">
        <div className="crm-card-header">
          <GraduationCap className="text-blue-600" size={20} />
          <div>
            <h3 className="crm-card-title">Academic Details</h3>
            <p className="crm-card-subtitle">Select student's current education type and academic status</p>
          </div>
        </div>

        {/* Radio Switcher */}
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
            <span>School Student</span>
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
            <span>College Student</span>
          </label>
        </div>

        {/* IF SCHOOL IS SELECTED */}
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
                placeholder="e.g. City Public School"
                className="crm-input"
                required
              />
            </div>

            <div className="crm-field">
              <label className="crm-label">
                Class / Grade <span className="crm-required">*</span>
              </label>
              <select
                disabled={!isEditable}
                value={formData.class_grade || "12th"}
                onChange={(e) => handleChange("class_grade", e.target.value)}
                className="crm-select"
              >
                <option value="10th">10th Class</option>
                <option value="11th">11th Class</option>
                <option value="12th">12th Class</option>
                <option value="Passed 12th">Passed 12th</option>
              </select>
            </div>

            <div className="crm-field">
              <label className="crm-label">
                Stream <span className="crm-required">*</span>
              </label>
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
              <label className="crm-label">
                Board <span className="crm-required">*</span>
              </label>
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
              <label className="crm-label">Passing / Expected Year</label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.year_of_passing || "2026"}
                onChange={(e) => handleChange("year_of_passing", e.target.value)}
                placeholder="2026"
                className="crm-input"
              />
            </div>

            <div className="crm-field">
              <label className="crm-label">Percentage / CGPA</label>
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

        {/* IF COLLEGE IS SELECTED */}
        {educationType === "college" && (
          <div className="crm-grid crm-grid-3">
            <div className="crm-field" style={{ gridColumn: "span 2" }}>
              <label className="crm-label">
                College Name <span className="crm-required">*</span>
              </label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.college_name || ""}
                onChange={(e) => handleChange("college_name", e.target.value)}
                placeholder="e.g. Lucknow University / IEM Institute"
                className="crm-input"
                required
              />
            </div>

            <div className="crm-field">
              <label className="crm-label">Current Course</label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.current_course || ""}
                onChange={(e) => handleChange("current_course", e.target.value)}
                placeholder="BCA / BBA / B.Tech"
                className="crm-input"
              />
            </div>

            <div className="crm-field">
              <label className="crm-label">Year / Semester</label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.semester || ""}
                onChange={(e) => handleChange("semester", e.target.value)}
                placeholder="Final Year / 5th Sem"
                className="crm-input"
              />
            </div>

            <div className="crm-field">
              <label className="crm-label">Mode of Study</label>
              <select
                disabled={!isEditable}
                value={formData.mode_of_study || "Full Time"}
                onChange={(e) => handleChange("mode_of_study", e.target.value)}
                className="crm-select"
              >
                <option value="Full Time">Full Time / Regular</option>
                <option value="Part Time">Part Time</option>
                <option value="Distance">Distance Learning</option>
                <option value="Online">Online Degree</option>
              </select>
            </div>

            <div className="crm-field">
              <label className="crm-label">Graduation Year</label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.graduation_year || "2027"}
                onChange={(e) => handleChange("graduation_year", e.target.value)}
                placeholder="2027"
                className="crm-input"
              />
            </div>
          </div>
        )}
      </div>

      {/* Course Interest & Acquisition Card */}
      <div className="crm-card">
        <div className="crm-card-header">
          <Target className="text-blue-600" size={20} />
          <div>
            <h3 className="crm-card-title">🎯 Course Interest & Acquisition</h3>
            <p className="crm-card-subtitle">Target program selection and campaign attribution</p>
          </div>
        </div>

        <div className="crm-grid crm-grid-2">
          {/* Interested Course */}
          <div className="crm-field">
            <label className="crm-label">
              Interested Course <span className="crm-required">*</span>
            </label>
            <select
              disabled={!isEditable}
              value={formData.interested_course || lead?.interested_course || "BCA"}
              onChange={(e) => handleChange("interested_course", e.target.value)}
              className="crm-select"
            >
              <option value="BCA">BCA - Bachelor of Computer Applications</option>
              <option value="BBA">BBA - Bachelor of Business Administration</option>
              <option value="B.Tech">B.Tech - Computer Science</option>
              <option value="Event Management">Diploma in Event Management</option>
              <option value="Data Science">Post Graduate Data Science</option>
              <option value="MBA">MBA - Master of Business Administration</option>
            </select>
          </div>

          {/* Preferred Centre */}
          <div className="crm-field">
            <label className="crm-label">Preferred Centre</label>
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
                value={lead?.source || "Website"}
                className="crm-input has-icon"
              />
            </div>
          </div>

          {/* Campaign Name */}
          <div className="crm-field">
            <label className="crm-label">Campaign Name</label>
            <div className="crm-input-wrapper">
              <Layers size={16} className="crm-input-icon" />
              <input
                type="text"
                disabled
                value={lead?.course_name || lead?.campaign_name || "BCA Admissions Campaign"}
                className="crm-input has-icon"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcademicInformationTab;
