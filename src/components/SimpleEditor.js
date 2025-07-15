import React from 'react';

function SimpleEditor({ content, onUpdate }) {
    return (
        <textarea
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 min-h-[150px] focus:ring-blue-500 focus:border-blue-500"
            value={content}
            onChange={(e) => onUpdate(e.target.value)}
        />
    );
}

export default SimpleEditor;