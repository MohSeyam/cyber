import React from 'react';

function StatsSummary({ overallProgress, stats, t }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
      <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg">
        <p className="text-2xl font-bold">{overallProgress.toFixed(0)}%</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.totalPlanProgress}</p>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg">
        <p className="text-2xl font-bold">{stats.completedTasks}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.completedTasks}</p>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg">
        <p className="text-2xl font-bold">{stats.learningHours.toFixed(1)}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.learningHours}</p>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg">
        <p className="text-2xl font-bold">{stats.totalNotes}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.totalNotes}</p>
      </div>
    </div>
  );
}

export default StatsSummary;