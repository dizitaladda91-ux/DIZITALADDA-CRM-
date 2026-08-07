import React from "react";
import { Save, X } from "lucide-react";

/**
 * LeadDrawerFooter Component
 * Sticky action footer containing left Cancel button and right Save Changes primary button.
 */
const LeadDrawerFooter = ({
  onCancel,
  onSave,
  saving = false,
  isEditable = true,
}) => {
  return (
    <div className="sticky bottom-0 z-30 flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4 shadow-lg">
      {/* LEFT: Cancel Button */}
      <button
        type="button"
        onClick={onCancel}
        className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-xs font-extrabold text-red-600 hover:bg-red-50 hover:border-red-300 transition active:scale-95 cursor-pointer"
      >
        <X size={16} />
        <span>Cancel</span>
      </button>

      {/* RIGHT: Save Changes Primary Button */}
      {isEditable ? (
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-extrabold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition active:scale-95 cursor-pointer"
        >
          {saving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={15} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl bg-slate-100 px-5 py-2.5 text-xs font-extrabold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
        >
          Done Viewing
        </button>
      )}
    </div>
  );
};

export default LeadDrawerFooter;
