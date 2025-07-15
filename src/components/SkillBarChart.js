import React from 'react';
import { Bar } from 'react-chartjs-2';

function SkillBarChart({ chartData, chartOptions }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
      <Bar options={chartOptions} data={chartData} />
    </div>
  );
}

export default SkillBarChart;