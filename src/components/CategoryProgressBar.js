import React from 'react';

function CategoryProgressBar({ category, progress }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
      <h3 className="font-medium text-sm mb-1">{category}</h3>
      <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full">
        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="text-xs mt-1 text-right">{progress}% إتمام</p>
    </div>
  );
}

export default CategoryProgressBar;