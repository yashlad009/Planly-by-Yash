export type ProblemStatus =
  | "not_started"
  | "in_progress"
  | "completed"
  | "revision_needed";

export interface ProblemProgress {
  status: ProblemStatus;
  confidence?: number;
  notes?: string;
  understanding?: string;
  struggle?: string;
  revisionNotes?: string;
  lastStudied?: string;
  revisionCount?: number;
  codeLink?: string;
  resourceLink?: string;
}

export type ProgressData = Record<string, ProblemProgress>;
