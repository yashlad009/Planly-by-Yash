import React, { useState } from 'react';
import { useProgressManager } from './hooks/useProgress';
import Dashboard from './pages/Dashboard';
import Sprints from './pages/Sprints';
import Revision from './pages/Revision';
import { LayoutDashboard, List, RefreshCw, Download, Upload, Trash2 } from 'lucide-react';
import type { ProgressData, ProblemProgress } from './types/progress';

export const ProgressContext = React.createContext<{
  progress: ProgressData;
  updateProgress: (id: string, data: Partial<ProblemProgress>) => void;
} | null>(null);

function App() {
  const { progress, updateProgress, resetProgress, exportProgress, importProgress } = useProgressManager();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sprints' | 'revision'>('dashboard');

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          importProgress(data);
          alert('Progress imported successfully!');
        } catch (err) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <ProgressContext.Provider value={{ progress, updateProgress }}>
      <div className="min-h-screen flex flex-col md:flex-row bg-[#0f172a] text-slate-200 font-sans">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-[#1e293b] p-6 flex flex-col border-b md:border-b-0 md:border-r border-slate-700 md:min-h-screen overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-blue-400 tracking-wider">PLANLY_BY_YASH</h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Study Tracker</p>
          </div>
          
          <nav className="flex-1 space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}
            >
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </button>
            <button 
              onClick={() => setActiveTab('sprints')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'sprints' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}
            >
              <List size={20} />
              <span className="font-medium">Sprints</span>
            </button>
            <button 
              onClick={() => setActiveTab('revision')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'revision' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'}`}
            >
              <RefreshCw size={20} />
              <span className="font-medium">Revision</span>
            </button>
          </nav>

          <div className="mt-8 space-y-2 pt-6 border-t border-slate-700">
            <button 
              onClick={exportProgress}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
            >
              <Download size={16} />
              Export Progress
            </button>
            <label className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors cursor-pointer">
              <Upload size={16} />
              Import Progress
              <input type="file" accept=".json" className="hidden" onChange={handleImport} />
            </label>
            <button 
              onClick={resetProgress}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-slate-700 rounded transition-colors"
            >
              <Trash2 size={16} />
              Reset Progress
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#0f172a] relative">
          <div className="p-6 md:p-8 max-w-5xl mx-auto pb-24">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'sprints' && <Sprints />}
            {activeTab === 'revision' && <Revision />}
          </div>
        </main>
      </div>
    </ProgressContext.Provider>
  );
}

export default App;
