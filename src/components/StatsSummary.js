import React from 'react';

function StatsSummary({ overallProgress, stats, t }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 text-center">
      <div className="bg-gradient-to-br from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-700 p-4 rounded-lg shadow">
        <p className="text-2xl font-bold">{overallProgress.toFixed(0)}%</p>
        <p className="text-sm text-blue-800 dark:text-blue-200">{t.totalPlanProgress}</p>
      </div>
      <div className="bg-gradient-to-br from-green-100 to-green-300 dark:from-green-900 dark:to-green-700 p-4 rounded-lg shadow">
        <p className="text-2xl font-bold">{stats.completedTasks}</p>
        <p className="text-sm text-green-800 dark:text-green-200">{t.completedTasks}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-100 to-purple-300 dark:from-purple-900 dark:to-purple-700 p-4 rounded-lg shadow">
        <p className="text-2xl font-bold">{stats.learningHours.toFixed(1)}</p>
        <p className="text-sm text-purple-800 dark:text-purple-200">{t.learningHours}</p>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-blue-200 dark:from-blue-800 dark:to-blue-600 p-4 rounded-lg shadow">
        <p className="text-2xl font-bold">{stats.totalNotes}</p>
        <p className="text-sm text-blue-700 dark:text-blue-200">{t.totalNotes}</p>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-green-200 dark:from-green-800 dark:to-green-600 p-4 rounded-lg shadow">
        <p className="text-2xl font-bold">{stats.totalJournal}</p>
        <p className="text-sm text-green-700 dark:text-green-200">{t.journalEntries}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-purple-200 dark:from-purple-800 dark:to-purple-600 p-4 rounded-lg shadow">
        <p className="text-2xl font-bold">{stats.totalResources}</p>
        <p className="text-sm text-purple-700 dark:text-purple-200">{t.resources}</p>
      </div>
    </div>
  );
}

export default StatsSummary;