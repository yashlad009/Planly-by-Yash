import { scheduleData } from '../data/scheduleData';
import type { ProgressData } from '../types/progress';

export function calculateStats(progress: ProgressData) {
  let totalProblems = 0;
  let completedProblems = 0;
  let inProgressProblems = 0;
  let revisionNeeded = 0;
  let estimatedTotalMinutes = 0;
  let estimatedCompletedMinutes = 0;

  scheduleData.forEach(sprint => {
    sprint.days.forEach(day => {
      day.problems.forEach(problem => {
        totalProblems++;
        estimatedTotalMinutes += (day.estimatedMinutes / day.problems.length);
        const status = progress[problem.id]?.status;
        if (status === 'completed') {
          completedProblems++;
          estimatedCompletedMinutes += (day.estimatedMinutes / day.problems.length);
        } else if (status === 'in_progress') {
          inProgressProblems++;
        } else if (status === 'revision_needed') {
          revisionNeeded++;
        }
      });
    });
  });

  const overallProgress = totalProblems > 0 ? (completedProblems / totalProblems) * 100 : 0;

  return {
    totalSprints: scheduleData.length,
    totalDays: scheduleData.reduce((acc, sprint) => acc + sprint.days.length, 0),
    totalProblems,
    completedProblems,
    inProgressProblems,
    revisionNeeded,
    overallProgress,
    estimatedTotalMinutes,
    estimatedCompletedMinutes
  };
}

export function formatTime(minutes: number) {
  const m = Math.round(minutes);
  const h = Math.floor(m / 60);
  const remM = m % 60;
  if (h > 0) return `${h}h ${remM}m`;
  return `${remM}m`;
}

export function getNextUnfinishedProblem(progress: ProgressData) {
  for (const sprint of scheduleData) {
    for (const day of sprint.days) {
      for (const problem of day.problems) {
        if (progress[problem.id]?.status !== 'completed') {
          return { sprint, day, problem };
        }
      }
    }
  }
  return null;
}

export function getTodaysDay() {
  const today = new Date().toISOString().split('T')[0];
  for (const sprint of scheduleData) {
    for (const day of sprint.days) {
      if (day.date === today) {
        return { sprint, day };
      }
    }
  }
  return null;
}
