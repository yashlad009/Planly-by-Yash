import { useContext, useMemo } from 'react';
import { ProgressContext } from '../App';
import { calculateStats, formatTime, getNextUnfinishedProblem, getTodaysDay } from '../utils/progressCalculations';
import { CheckCircle2, Clock, BookOpen, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const ctx = useContext(ProgressContext);
  if (!ctx) return null;
  const { progress } = ctx;

  const stats = useMemo(() => calculateStats(progress), [progress]);
  const nextProblem = useMemo(() => getNextUnfinishedProblem(progress), [progress]);
  const todaysDay = useMemo(() => getTodaysDay(), []);

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-slate-400">Overview of your study progress</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <BookOpen size={20} className="text-blue-400" />
            <h3 className="font-semibold">Total Progress</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.overallProgress.toFixed(1)}%
          </div>
          <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${stats.overallProgress}%` }}
            />
          </div>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <CheckCircle2 size={20} className="text-emerald-400" />
            <h3 className="font-semibold">Completed</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.completedProblems} <span className="text-lg text-slate-500">/ {stats.totalProblems}</span>
          </div>
          <p className="text-sm text-slate-400">Problems</p>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <AlertCircle size={20} className="text-amber-400" />
            <h3 className="font-semibold">Revision Needed</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {stats.revisionNeeded}
          </div>
          <p className="text-sm text-slate-400">Problems marked for review</p>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-700">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <Clock size={20} className="text-purple-400" />
            <h3 className="font-semibold">Study Time</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {formatTime(stats.estimatedCompletedMinutes)}
          </div>
          <p className="text-sm text-slate-400">of {formatTime(stats.estimatedTotalMinutes)} estimated</p>
        </div>
      </div>

      {/* Continue Studying Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nextProblem && (
          <section className="bg-gradient-to-br from-blue-900/40 to-slate-800 p-6 rounded-xl border border-blue-500/30">
            <h3 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2">
              <Clock size={18} />
              Continue Studying
            </h3>
            <div className="bg-[#1e293b] p-4 rounded-lg border border-slate-700 flex flex-col gap-2">
              <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                Sprint {nextProblem.sprint.sprintNumber} • Day {nextProblem.day.dayNumber}
              </p>
              <h4 className="text-lg font-medium text-white">{nextProblem.problem.title}</h4>
            </div>
          </section>
        )}

        {todaysDay && (
          <section className="bg-gradient-to-br from-emerald-900/40 to-slate-800 p-6 rounded-xl border border-emerald-500/30">
            <h3 className="text-lg font-bold text-emerald-300 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} />
              Today's Scheduled Day
            </h3>
            <div className="bg-[#1e293b] p-4 rounded-lg border border-slate-700 flex flex-col gap-2">
              <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                Sprint {todaysDay.sprint.sprintNumber} • Day {todaysDay.day.dayNumber}
              </p>
              <h4 className="text-lg font-medium text-white">
                {todaysDay.day.problems.length} problems scheduled for today
              </h4>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
