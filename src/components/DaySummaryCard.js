import React from 'react';

function DaySummaryCard({ day, progress, totalTime, t }) {
  return (
    <div className="bg-gradient-to-r from-blue-100 via-green-100 to-purple-100 dark:from-blue-900 dark:via-green-900 dark:to-purple-900 rounded-xl shadow flex flex-col md:flex-row items-center justify-between p-4 mb-4 border border-blue-200 dark:border-blue-800 animate-fade-in">
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-blue-700 dark:text-blue-300">{day.day[t.lang]}</span>
          <span className="text-xs bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">{day.topic[t.lang]}</span>
        </div>
        <div className="flex gap-4 mt-2">
          <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-300 font-semibold"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>{progress.completed}/{progress.total} {t.tasks}</span>
          <span className="inline-flex items-center gap-1 text-purple-700 dark:text-purple-300 font-semibold"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" /></svg>{totalTime} {t.min}</span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center mt-4 md:mt-0">
        <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{progress.percentage}%</span>
        <span className="text-xs text-gray-500 dark:text-gray-300">{t.completion}</span>
      </div>
    </div>
  );
}

export default DaySummaryCard;