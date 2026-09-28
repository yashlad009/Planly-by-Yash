export interface Problem {
  id: string;
  title: string;
}

export interface StudyDay {
  id: string;
  dayNumber: number;
  date: string;
  estimatedMinutes: number;
  problems: Problem[];
}

export interface Sprint {
  id: string;
  sprintNumber: number;
  estimatedMinutes: number;
  days: StudyDay[];
}
