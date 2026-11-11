// Application Statuses (Kanban columns)
export type ApplicationStatus =
  | "NEW"
  | "SCREENING"
  | "INTERVIEW"
  | "HIRED"
  | "REJECTED";

// User Roles (RBAC)
export type UserRole =
  | "ADMIN"
  | "HR_MANAGER"
  | "RECRUITER"
  | "HIRING_MANAGER"
  | "INTERVIEWER";

// Job Status
export type JobStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

// Structured JSON returned by Gemini CV Parser (BRL-03)
export interface ParsedCVData {
  full_name: string;
  email: string;
  phone: string;
  years_of_experience: number;
  skills: string[];
  education: {
    institution: string;
    degree: string;
    grad_year?: number | string;
  }[];
  experience: {
    company: string;
    position: string;
    duration: string;
    summary?: string;
  }[];
  summary?: string;
}

// AI Match result (BRL-04)
export interface MatchScoreResult {
  match_score: number; // 0 - 100
  rationale: string;
  matched_skills: string[];
  missing_skills: string[];
}

// Scorecard Evaluation (BRL-08)
export interface ScorecardInput {
  technical_score: number; // 1 - 5
  soft_skills_score: number; // 1 - 5
  problem_solving_score: number; // 1 - 5
  comments: string;
  recommendation: "STRONG_HIRE" | "HIRE" | "NO_HIRE" | "STRONG_NO_HIRE";
}
