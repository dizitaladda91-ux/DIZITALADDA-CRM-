/**
 * Lead Priority Automation Service
 * 
 * Rules:
 * 1. HIGH: High-intent / Actionable statuses (WALK_IN_SCHEDULED, WALKED_IN, QUALIFIED, INTERESTED)
 * 2. MEDIUM: Follow-up statuses (FOLLOW_UP, FOLLOW_UP_REQUIRED)
 * 3. LOW: Contacted, Not Contacted, Lost, Rejected, Closed statuses (CONTACTED, NOT_CONTACTED, NEW, PENDING, LOST, NOT_INTERESTED, REJECTED, ADMISSION_DONE, ENROLLED, COMPLETED)
 */

export const calculateLeadPriority = ({ status }) => {
  const normStatus = (status || "").toUpperCase();

  // HIGH Priority Statuses: Walk-in / Interested / Qualified
  if (
    [
      "WALK_IN_SCHEDULED",
      "WALKED_IN",
      "QUALIFIED",
      "INTERESTED",
    ].includes(normStatus)
  ) {
    return "HIGH";
  }

  // MEDIUM Priority Statuses: Follow-up
  if (
    [
      "FOLLOW_UP",
      "FOLLOW_UP_REQUIRED",
    ].includes(normStatus)
  ) {
    return "MEDIUM";
  }

  // LOW Priority Statuses: Contacted, Not Contacted, Lost, Rejected, Closed, New
  if (
    [
      "CONTACTED",
      "NOT_CONTACTED",
      "NEW",
      "PENDING",
      "LOST",
      "NOT_INTERESTED",
      "REJECTED",
      "ADMISSION_DONE",
      "ENROLLED",
      "COMPLETED",
    ].includes(normStatus)
  ) {
    return "LOW";
  }

  return "LOW";
};
