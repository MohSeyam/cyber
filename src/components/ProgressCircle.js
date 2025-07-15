import React from 'react';
import { motion } from 'framer-motion';

function ProgressCircle({ percentage }) {
  const circumference = 2 * Math.PI * 30;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full" viewBox="0 0 80 80">
        <circle className="text-gray-200 dark:text-gray-600" strokeWidth="8" stroke="currentColor" fill="transparent" r="30" cx="40" cy="40"/>
        <motion.circle
          className="text-blue-600 dark:text-blue-400"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="30"
          cx="40"
          cy="40"
          transform="rotate(-90 40 40)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}

export default ProgressCircle;