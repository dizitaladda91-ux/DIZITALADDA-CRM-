import React from "react";
import { Save, X } from "lucide-react";
import "./LeadDetailsDrawer.css";

/**
 * LeadDrawerFooter Component
 * Shared action footer using enterprise CSS button styles.
 */
const LeadDrawerFooter = ({
  onCancel,
  onSave,
  saving = false,
  isEditable = true,
}) => {
  return (
    <div className="crm-footer">
      {/* LEFT: Cancel Button */}
      <button
        type="button"
        onClick={onCancel}
        className="crm-btn-secondary"
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
          className="crm-btn-primary"
        >
          {saving ? (
            <>
              <div
                style={{
                  height: "16px",
                  width: "16px",
                  borderRadius: "50%",
                  border: "2px solid #FFFFFF",
                  borderTopColor: "transparent",
                  animation: "spin 1s linear infinite",
                }}
              />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onCancel}
          className="crm-btn-primary"
          style={{ backgroundColor: "#64748B" }}
        >
          Done Viewing
        </button>
      )}
    </div>
  );
};

export default LeadDrawerFooter;
