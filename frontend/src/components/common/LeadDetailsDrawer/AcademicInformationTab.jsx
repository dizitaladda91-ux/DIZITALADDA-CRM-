import React from "react";
import { GraduationCap, School, Building, Target, Share2, Layers } from "lucide-react";

/**
 * AcademicInformationTab Component
 * Dynamic education details tab switching between School and College fields + Course Interest section.
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
    <div className="space-y-6">
      {/* Education Type Radio Selection & Academic Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-5">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Academic Information</h3>
          <p className="text-xs text-slate-500 font-medium">Select education type and provide academic details</p>
        </div>

        {/* Education Type Radio Switcher */}
        <div className="flex items-center gap-6 border-b border-slate-100 pb-4">
          <label className="flex items-center gap-2 text-xs font-extrabold text-slate-800 cursor-pointer">
            <input
              type="radio"
              name="education_type"
              value="school"
              checked={educationType === "school"}
              onChange={() => handleChange("education_type", "school")}
              disabled={!isEditable}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <School size={16} className="text-blue-600" />
            <span>School</span>
          </label>

          <label className="flex items-center gap-2 text-xs font-extrabold text-slate-800 cursor-pointer">
            <input
              type="radio"
              name="education_type"
              value="college"
              checked={educationType === "college"}
              onChange={() => handleChange("education_type", "college")}
              disabled={!isEditable}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <GraduationCap size={16} className="text-blue-600" />
            <span>College</span>
          </label>
        </div>

        {/* DYNAMIC FIELDS: IF SCHOOL IS SELECTED */}
        {educationType === "school" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* School Name */}
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                School Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.school_name || ""}
                onChange={(e) => handleChange("school_name", e.target.value)}
                placeholder="e.g. City Public School"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                required
              />
            </div>

            {/* Class / Grade */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Class / Grade <span className="text-red-500">*</span>
              </label>
              <select
                disabled={!isEditable}
                value={formData.class_grade || "12th"}
                onChange={(e) => handleChange("class_grade", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 cursor-pointer"
              >
                <option value="10th">10th Class</option>
                <option value="11th">11th Class</option>
                <option value="12th">12th Class</option>
                <option value="Passed 12th">Passed 12th</option>
              </select>
            </div>

            {/* Stream */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Stream <span className="text-red-500">*</span>
              </label>
              <select
                disabled={!isEditable}
                value={formData.stream || "Science"}
                onChange={(e) => handleChange("stream", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 cursor-pointer"
              >
                <option value="Science">Science (PCM/PCB)</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts">Arts / Humanities</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Board */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Board <span className="text-red-500">*</span>
              </label>
              <select
                disabled={!isEditable}
                value={formData.board || "CBSE"}
                onChange={(e) => handleChange("board", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 cursor-pointer"
              >
                <option value="CBSE">CBSE Board</option>
                <option value="ICSE">ICSE / ISC Board</option>
                <option value="State Board">State Board</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Year of Passing */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Year of Passing / Appearing <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.year_of_passing || "2026"}
                onChange={(e) => handleChange("year_of_passing", e.target.value)}
                placeholder="2026"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>

            {/* Percentage / CGPA */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Percentage / CGPA
              </label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.percentage_cgpa || ""}
                onChange={(e) => handleChange("percentage_cgpa", e.target.value)}
                placeholder="e.g. 85.6%"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>
          </div>
        )}

        {/* DYNAMIC FIELDS: IF COLLEGE IS SELECTED */}
        {educationType === "college" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* College Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                College / Institute Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.college_name || ""}
                onChange={(e) => handleChange("college_name", e.target.value)}
                placeholder="e.g. Lucknow University / IEM Institute"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                required
              />
            </div>

            {/* Current Course */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Current Course <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.current_course || ""}
                onChange={(e) => handleChange("current_course", e.target.value)}
                placeholder="BCA / BBA / B.Tech"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>

            {/* Year / Semester */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Year / Semester <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.semester || ""}
                onChange={(e) => handleChange("semester", e.target.value)}
                placeholder="Final Year / 5th Sem"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>

            {/* Mode of Study */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mode of Study
              </label>
              <select
                disabled={!isEditable}
                value={formData.mode_of_study || "Full Time"}
                onChange={(e) => handleChange("mode_of_study", e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 cursor-pointer"
              >
                <option value="Full Time">Full Time / Regular</option>
                <option value="Part Time">Part Time</option>
                <option value="Distance">Distance Learning</option>
                <option value="Online">Online Degree</option>
              </select>
            </div>

            {/* Expected Graduation Year */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Graduation Year
              </label>
              <input
                type="text"
                disabled={!isEditable}
                value={formData.graduation_year || "2027"}
                onChange={(e) => handleChange("graduation_year", e.target.value)}
                placeholder="2027"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
              />
            </div>
          </div>
        )}
      </div>

      {/* Course Interest & Acquisition Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Target className="text-blue-600" size={18} />
          <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
            🎯 Course Interest & Admission Goals
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Interested Course */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Interested Course <span className="text-red-500">*</span>
            </label>
            <select
              disabled={!isEditable}
              value={formData.interested_course || lead?.interested_course || "BCA"}
              onChange={(e) => handleChange("interested_course", e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50 cursor-pointer"
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
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Preferred Centre
            </label>
            <input
              type="text"
              disabled={!isEditable}
              value={formData.preferred_centre || lead?.preferred_centre || ""}
              onChange={(e) => handleChange("preferred_centre", e.target.value)}
              placeholder="e.g. Main Campus / Lucknow"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
            />
          </div>

          {/* Lead Source (Read-only attribution) */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-slate-500 mb-1">
              <Share2 size={13} />
              Lead Source
            </span>
            <p className="text-sm font-extrabold text-slate-900">{lead?.source || "Website"}</p>
          </div>

          {/* Campaign (Read-only attribution) */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-slate-500 mb-1">
              <Layers size={13} />
              Campaign
            </span>
            <p className="text-sm font-extrabold text-slate-900">{lead?.course_name || lead?.campaign_name || "BCA Admissions Campaign"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicInformationTab;
