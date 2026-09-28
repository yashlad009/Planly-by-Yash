import { useState, useEffect, useCallback } from 'react';
import type { ProgressData, ProblemProgress } from '../types/progress';


const PROGRESS_KEY = 'planly_by_yash_progress_v1';

export function useProgressManager() {
  const [progress, setProgress] = useState<ProgressData>(() => {
    try {
      const stored = localStorage.getItem(PROGRESS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error('Failed to parse progress', e);
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  const updateProgress = useCallback((problemId: string, data: Partial<ProblemProgress>) => {
    setProgress((prev) => {
      const existing = prev[problemId] || { status: 'not_started' };
      return {
        ...prev,
        [problemId]: { ...existing, ...data }
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    if (window.confirm("Are you sure you want to reset all progress? This cannot be undone.")) {
      setProgress({});
    }
  }, []);

  const exportProgress = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(progress, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "planly_progress.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }, [progress]);

  const importProgress = useCallback((importedData: any) => {
    if (typeof importedData === 'object' && importedData !== null) {
      // Basic validation, just apply matching IDs
      setProgress(importedData);
    }
  }, []);

  return {
    progress,
    updateProgress,
    resetProgress,
    exportProgress,
    importProgress
  };
}
