import React, { useState } from "react";
import { X, DollarSign, CreditCard, Calendar, Receipt, Send } from "lucide-react";
import toast from "react-hot-toast";
import { collectFee } from "../../../services/admissionService";

const CollectFeeModal = ({ admission, isOpen, onClose, onSuccess }) => {
  if (!isOpen || !admission) return null;

  const [amountPaid, setAmountPaid] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [nextDueDate, setNextDueDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalFee = Number(admission.total_fee) || 0;
  const currentPaid = Number(admission.paid_fee) || 0;
  const currentPending = Number(admission.pending_fee) || Math.max(0, totalFee - currentPaid);

  const enteredPaid = Number(amountPaid) || 0;
  const newPending = Math.max(0, currentPending - enteredPaid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amountPaid || enteredPaid <= 0) {
      toast.error("Please enter a valid installment amount.");
      return;
    }

    try {
      setSubmitting(true);
      await collectFee(admission.id, {
        amount_paid: enteredPaid,
        receipt_no: receiptNo || `RCP${Date.now().toString().slice(-6)}`,
        payment_mode: paymentMode,
        next_due_date: nextDueDate || null,
        remarks: remarks || "Fee installment collected",
      });

      toast.success(`₹${enteredPaid.toLocaleString("en-IN")} fee installment recorded!`);
      if (typeof onSuccess === "function") onSuccess();
      onClose();
    } catch (error) {
      console.error("Fee payment failed:", error);
      toast.error(error?.response?.data?.message || "Failed to record fee payment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="crm-drawer-backdrop" style={{ zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        className="crm-card"
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ padding: "10px", borderRadius: "10px", backgroundColor: "#DCFCE7", color: "#16A34A" }}>
              <CreditCard size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", margin: 0 }}>
                Collect Fee Installment
              </h3>
              <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>
                Student: <strong>{admission.student_name}</strong> ({admission.admission_code})
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="crm-close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Current Fee Summary Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "8px",
            backgroundColor: "#F8FAFC",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #E2E8F0",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <div>
            <span style={{ fontSize: "11px", color: "#64748B", textTransform: "uppercase" }}>Total Fee</span>
            <strong style={{ display: "block", fontSize: "14px", color: "#0F172A" }}>
              ₹{totalFee.toLocaleString("en-IN")}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: "11px", color: "#16A34A", textTransform: "uppercase" }}>Paid So Far</span>
            <strong style={{ display: "block", fontSize: "14px", color: "#16A34A" }}>
              ₹{currentPaid.toLocaleString("en-IN")}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: "11px", color: "#DC2626", textTransform: "uppercase" }}>Current Due</span>
            <strong style={{ display: "block", fontSize: "14px", color: "#DC2626" }}>
              ₹{currentPending.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="crm-grid" style={{ gap: "16px" }}>
          <div className="crm-field">
            <label className="crm-label">
              Installment Amount (₹) <span className="crm-required">*</span>
            </label>
            <div className="crm-input-wrapper">
              <DollarSign size={16} className="crm-input-icon" />
              <input
                type="number"
                placeholder="Enter paid amount (e.g. 15000)"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="crm-input has-icon"
                required
                max={currentPending}
              />
            </div>
          </div>

          <div className="crm-field">
            <label className="crm-label">Payment Mode</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="crm-select"
            >
              <option value="CASH">Cash</option>
              <option value="UPI">UPI / GPay / PhonePe</option>
              <option value="BANK_TRANSFER">Bank Transfer (NEFT/IMPS)</option>
              <option value="CHEQUE">Cheque</option>
              <option value="CARD">Credit / Debit Card</option>
            </select>
          </div>

          <div className="crm-field">
            <label className="crm-label">Receipt / Transaction Reference No.</label>
            <div className="crm-input-wrapper">
              <Receipt size={16} className="crm-input-icon" />
              <input
                type="text"
                placeholder="e.g. RCP890123"
                value={receiptNo}
                onChange={(e) => setReceiptNo(e.target.value)}
                className="crm-input has-icon"
              />
            </div>
          </div>

          <div className="crm-field">
            <label className="crm-label">Next Installment Due Date (If Pending)</label>
            <div className="crm-input-wrapper">
              <Calendar size={16} className="crm-input-icon" />
              <input
                type="date"
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                className="crm-input has-icon"
              />
            </div>
          </div>

          {/* New Pending Recalculation Badge */}
          <div
            style={{
              padding: "12px",
              backgroundColor: "#EFF6FF",
              borderRadius: "10px",
              border: "1px solid #BFDBFE",
              fontSize: "13px",
              color: "#1E40AF",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>Remaining Balance After Payment:</span>
            <strong style={{ fontSize: "15px", color: newPending === 0 ? "#16A34A" : "#DC2626" }}>
              ₹{newPending.toLocaleString("en-IN")} {newPending === 0 ? "(FULLY PAID)" : ""}
            </strong>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px" }}>
            <button type="button" onClick={onClose} className="crm-btn-secondary" style={{ height: "42px" }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="crm-btn-primary"
              style={{ height: "42px", padding: "0 20px", backgroundColor: "#16A34A" }}
            >
              <Send size={16} />
              <span>{submitting ? "Processing..." : "Confirm Fee Payment"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectFeeModal;
