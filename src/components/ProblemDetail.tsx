import { useContext, useEffect, useState } from 'react';
import type { Problem, StudyDay, Sprint } from '../types/schedule';
import { ProgressContext } from '../App';
import { X } from 'lucide-react';

interface Props {
  problem: Problem;
  day: StudyDay;
  sprint: Sprint;
  onClose: () => void;
}

export default function ProblemDetail({ problem, day, sprint, onClose }: Props) {
  const ctx = useContext(ProgressContext);
  if (!ctx) return null;
  const { progress, updateProgress } = ctx;
  const data = progress[problem.id] || { status: 'not_started' };

  const [notes, setNotes] = useState(data.notes || '');
  const [understanding, setUnderstanding] = useState(data.understanding || '');
  const [struggle, setStruggle] = useState(data.struggle || '');
  const [confidence, setConfidence] = useState(data.confidence || 0);

  // Sync state back to context on unmount or specific actions
  useEffect(() => {
    return () => {
      updateProgress(problem.id, {
        notes,
        understanding,
        struggle,
        confidence,
        lastStudied: new Date().toISOString()
      });
    };
  }, [problem.id, notes, understanding, struggle, confidence, updateProgress]);

  const handleStatusChange = (status: any) => {
    updateProgress(problem.id, { status, lastStudied: new Date().toISOString() });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full md:w-[500px] h-full bg-[#1e293b] border-l border-slate-700 shadow-2xl flex flex-col transform transition-transform duration-300">
        <div className="p-6 border-b border-slate-700 flex justify-between items-start bg-slate-800/50">
          <div>
            <p className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">
              Sprint {sprint.sprintNumber} • Day {day.dayNumber}
            </p>
            <h2 className="text-xl font-bold text-white">{problem.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Section */}
          <section>
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Status</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'not_started', label: '○ Not Started' },
                { value: 'in_progress', label: '◐ In Progress' },
                { value: 'completed', label: '✓ Completed' },
                { value: 'revision_needed', label: '↻ Revision Needed' }
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                    data.status === opt.value
                      ? 'bg-blue-600 border-blue-500 text-white font-medium'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Confidence */}
          <section>
            <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Confidence Level</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  onClick={() => setConfidence(level)}
                  className={`flex-1 py-2 rounded-lg border transition-all ${
                    confidence >= level
                      ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </section>

          {/* Text Areas */}
          <section className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">General Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full h-24 bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-shadow"
                placeholder="Key takeaways..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">What I understood</label>
              <textarea
                value={understanding}
                onChange={e => setUnderstanding(e.target.value)}
                className="w-full h-24 bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-shadow"
                placeholder="Core logic, algorithms used..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider">What I found difficult</label>
              <textarea
                value={struggle}
                onChange={e => setStruggle(e.target.value)}
                className="w-full h-24 bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-shadow"
                placeholder="Edge cases, implementation details..."
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
