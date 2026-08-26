/**
 * Lead Module Constants
 * Core Lead Statuses: Interested, Follow-up, Visited, Enrolled, Not Interested (plus New)
 */

export const LEAD_STATUS = Object.freeze({
  NEW: "new",
  INTERESTED: "interested",
  FOLLOW_UP: "follow_up",
  VISITED: "visited",
  ENROLLED: "enrolled",
  NOT_INTERESTED: "not_interested",
});

export const LEAD_SOURCE = Object.freeze({
  META_ADS: "meta_ads",
  GOOGLE_ADS: "google_ads",
  WEBSITE: "website",
  WALK_IN: "walk_in",
  REFERRAL: "referral",
  PHONE_CALL: "phone_call",
  OTHER: "other",
});

export const LEAD_PRIORITY = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
});

export const ASSIGNMENT_TYPE = Object.freeze({
  NEW_ASSIGNMENT: "new_assignment",
  REASSIGNMENT: "reassignment",
  AUTO_ASSIGNMENT: "auto_assignment",
});