import { useContext, useState } from 'react';
import { ProgressContext } from '../App';
import { scheduleData } from '../data/scheduleData';
import type { Problem, Sprint, StudyDay } from '../types/schedule';
import ProblemDetail from '../components/ProblemDetail';
import { AlertCircle } from 'lucide-react';

export default function Revision() {
  const ctx = useContext(ProgressContext);
  if (!ctx) return null;
  const { progress } = ctx;

  const [selectedProblem, setSelectedProblem] = useState<{ sprint: Sprint; day: StudyDay; problem: Problem } | null>(null);

  const revisionProblems: { sprint: Sprint; day: StudyDay; problem: Problem }[] = [];

  scheduleData.forEach(sprint => {
    sprint.days.forEach(day => {
      day.problems.forEach(problem => {
        if (progress[problem.id]?.status === 'revision_needed') {
          revisionProblems.push({ sprint, day, problem });
        }
      });
    });
  });

  // Sort by lastStudied descending if available
  revisionProblems.sort((a, b) => {
    const timeA = progress[a.problem.id]?.lastStudied ? new Date(progress[a.problem.id].lastStudied!).getTime() : 0;
    const timeB = progress[b.problem.id]?.lastStudied ? new Date(progress[b.problem.id].lastStudied!).getTime() : 0;
    return timeB - timeA;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <AlertCircle className="text-amber-400" size={28} />
          Revision Needed
        </h2>
        <p className="text-slate-400">Problems you've marked for review</p>
      </header>

      {revisionProblems.length === 0 ? (
        <div className="bg-[#1e293b] rounded-xl p-12 text-center border border-slate-700">
          <p className="text-slate-400">You don't have any problems marked for revision right now.</p>
          <p className="text-sm text-slate-500 mt-2">Great job staying on top of things!</p>
        </div>
      ) : (
        <div className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden divide-y divide-slate-700">
          {revisionProblems.map(({ sprint, day, problem }) => (
            <button
              key={problem.id}
              onClick={() => setSelectedProblem({ sprint, day, problem })}
              className="w-full p-4 flex flex-col sm:flex-row sm:items-center justify-between text-left hover:bg-slate-700/50 transition-colors gap-3"
            >
              <div>
                <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
                  Sprint {sprint.sprintNumber} • Day {day.dayNumber}
                </p>
                <h4 className="text-slate-200 font-medium">{problem.title}</h4>
              </div>
              <div className="text-xs text-slate-500 whitespace-nowrap">
                {progress[problem.id]?.lastStudied ? 
                  `Last studied: ${new Date(progress[problem.id].lastStudied!).toLocaleDateString()}` 
                  : ''}
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedProblem && (
        <ProblemDetail 
          problem={selectedProblem.problem}
          day={selectedProblem.day}
          sprint={selectedProblem.sprint}
          onClose={() => setSelectedProblem(null)}
        />
      )}
    </div>
  );
}
