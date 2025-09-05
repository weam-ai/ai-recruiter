/**
 * MongoDB Collection Names
 * Centralized collection name constants for easy maintenance
 */

export const COLLECTIONS = {
  ORGANIZATION: "solution_foloup_organization",
  USER: "solution_foloup_user", 
  INTERVIEWER: "solution_foloup_interviewer",
  INTERVIEW: "solution_foloup_interview",
  RESPONSE: "solution_foloup_response",
  FEEDBACK: "solution_foloup_feedback"
} as const;

export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
