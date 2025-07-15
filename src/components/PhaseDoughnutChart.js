import React from 'react';
import { Doughnut } from 'react-chartjs-2';

function PhaseDoughnutChart({ doughnutData, doughnutOptions }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg h-80">
      <Doughnut options={doughnutOptions} data={doughnutData} />
    </div>
  );
}

export default PhaseDoughnutChart;