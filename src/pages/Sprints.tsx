import { useState, useContext, useMemo } from 'react';
import { scheduleData } from '../data/scheduleData';
import type { Sprint, StudyDay, Problem } from '../types/schedule';
import ProblemDetail from '../components/ProblemDetail';
import { ProgressContext } from '../App';
import { formatTime } from '../utils/progressCalculations';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1]} ${y}`;
};

export default function Sprints() {
  const [expandedSprints, setExpandedSprints] = useState<Record<string, boolean>>({});
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [selectedProblem, setSelectedProblem] = useState<{ sprint: Sprint; day: StudyDay; problem: Problem } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const ctx = useContext(ProgressContext);
  if (!ctx) return null;
  const { progress } = ctx;

  const toggleSprint = (id: string) => {
    setExpandedSprints(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDay = (id: string) => {
    setExpandedDays(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed': return <span className="text-emerald-400 font-bold">✓</span>;
      case 'in_progress': return <span className="text-blue-400 font-bold">◐</span>;
      case 'revision_needed': return <span className="text-amber-400 font-bold">↻</span>;
      default: return <span className="text-slate-600 font-bold">○</span>;
    }
  };

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return scheduleData;
    const lowerQuery = searchQuery.toLowerCase();
    
    return scheduleData.map(sprint => {
      const filteredDays = sprint.days.map(day => {
        const filteredProblems = day.problems.filter(p => p.title.toLowerCase().includes(lowerQuery));
        return { ...day, problems: filteredProblems };
      }).filter(d => d.problems.length > 0 || `day ${d.dayNumber}`.includes(lowerQuery));
      
      return { ...sprint, days: filteredDays };
    }).filter(s => s.days.length > 0 || `sprint ${s.sprintNumber}`.includes(lowerQuery));
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Study Schedule</h2>
          <p className="text-slate-400">Track your progress day by day</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search problems..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1e293b] border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
        </div>
      </header>

      <div className="space-y-4">
        {filteredData.map(sprint => {
          const sprintTotalProblems = sprint.days.reduce((acc, d) => acc + d.problems.length, 0);
          const sprintCompleted = sprint.days.reduce((acc, d) => 
            acc + d.problems.filter(p => progress[p.id]?.status === 'completed').length, 0
          );
          const sprintProgressPct = sprintTotalProblems > 0 ? (sprintCompleted / sprintTotalProblems) * 100 : 0;
          const isSprintExpanded = expandedSprints[sprint.id] || searchQuery.trim().length > 0;

          return (
            <div key={sprint.id} className="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden transition-all">
              <button 
                onClick={() => toggleSprint(sprint.id)}
                className="w-full p-5 flex items-center justify-between bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {isSprintExpanded ? <ChevronDown size={20} className="text-slate-400"/> : <ChevronRight size={20} className="text-slate-400"/>}
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white tracking-wide">SPRINT {sprint.sprintNumber}</h3>
                    <p className="text-sm text-slate-400">{formatTime(sprint.estimatedMinutes)} estimated</p>
                  </div>
                </div>
                
                <div className="text-right hidden sm:block">
                  <div className="text-sm text-slate-300 mb-1">{sprintCompleted} / {sprintTotalProblems} problems</div>
                  <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{width: `${sprintProgressPct}%`}} />
                  </div>
                </div>
              </button>

              {isSprintExpanded && (
                <div className="p-2 sm:p-5 pt-0 space-y-3 mt-4">
                  {sprint.days.map(day => {
                    const dayCompleted = day.problems.filter(p => progress[p.id]?.status === 'completed').length;
                    const dayProgressPct = day.problems.length > 0 ? (dayCompleted / day.problems.length) * 100 : 0;
                    const isDayExpanded = expandedDays[day.id] || searchQuery.trim().length > 0;

                    return (
                      <div key={day.id} className="bg-slate-800/30 rounded-lg border border-slate-700/50 overflow-hidden">
                        <button 
                          onClick={() => toggleDay(day.id)}
                          className="w-full p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {isDayExpanded ? <ChevronDown size={18} className="text-slate-400"/> : <ChevronRight size={18} className="text-slate-400"/>}
                            <div className="text-left">
                              <h4 className="font-semibold text-slate-200">
                                Day {day.dayNumber} &middot; {formatDate(day.date)}
                              </h4>
                              <p className="text-xs text-slate-400">{formatTime(day.estimatedMinutes)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded-md">
                              {dayProgressPct.toFixed(0)}%
                            </span>
                          </div>
                        </button>

                        {isDayExpanded && (
                          <div className="p-3 border-t border-slate-700/50 bg-slate-900/20">
                            <ul className="space-y-1">
                              {day.problems.map(problem => {
                                const status = progress[problem.id]?.status;
                                return (
                                  <li key={problem.id}>
                                    <button
                                      onClick={() => setSelectedProblem({ sprint, day, problem })}
                                      className="w-full text-left p-3 rounded-md hover:bg-slate-700/50 flex items-start gap-3 transition-colors group"
                                    >
                                      <div className="mt-0.5 transition-transform group-hover:scale-110">
                                        {getStatusIcon(status)}
                                      </div>
                                      <span className={`text-sm ${status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                        {problem.title}
                                      </span>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

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
