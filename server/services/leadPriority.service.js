/**
 * Lead Priority Automation Service
 * 
 * Rules:
 * 1. Terminal/Closed statuses (ADMISSION_DONE, ENROLLED, COMPLETED, NOT_INTERESTED, LOST, REJECTED) -> LOW
 * 2. High intent statuses (WALK_IN_SCHEDULED, QUALIFIED, INTERESTED) -> HIGH
 * 3. Follow-up Required (FOLLOW_UP) -> HIGH if overdue or due within 24h, else MEDIUM
 * 4. Uncontacted/Pending (NEW, NOT_CONTACTED, PENDING) -> HIGH if pending >= 2 days, else MEDIUM
 * 5. Default -> MEDIUM
 */

export const calculateLeadPriority = ({ status, createdAt, nextFollowup }) => {
  const normStatus = (status || "").toUpperCase();

  // Closed / Terminal statuses
  if (
    ["ADMISSION_DONE", "ENROLLED", "COMPLETED", "NOT_INTERESTED", "LOST", "REJECTED"].includes(normStatus)
  ) {
    return "LOW";
  }

  // High intent statuses
  if (["WALK_IN_SCHEDULED", "QUALIFIED", "INTERESTED"].includes(normStatus)) {
    return "HIGH";
  }

  const now = new Date();

  // Follow-up status check
  if (normStatus === "FOLLOW_UP" || normStatus === "FOLLOW_UP_REQUIRED") {
    if (nextFollowup) {
      const followupDate = new Date(nextFollowup);
      if (followupDate <= now || (followupDate.getTime() - now.getTime()) <= (24 * 60 * 60 * 1000)) {
        return "HIGH";
      }
    }
    return "MEDIUM";
  }

  // New / Pending / Not Contacted status check
  if (["NEW", "NOT_CONTACTED", "PENDING", "CONTACTED"].includes(normStatus)) {
    if (createdAt) {
      const createdDate = new Date(createdAt);
      const diffDays = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays >= 2) {
        return "HIGH";
      }
    }
    return "MEDIUM";
  }

  return "MEDIUM";
};
