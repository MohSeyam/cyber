import React, { useContext } from 'react';
import SimpleEditor from './SimpleEditor';
import { AppContext } from '../App';

function JournalEditor({ weekId, dayIndex, prompt }) {
    const { lang, appState, setAppState, translations } = useContext(AppContext);
    const journalEntry = appState.journal[weekId]?.days[dayIndex];
    const handleContentChange = (newContent) => {
        setAppState(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            newState.journal[weekId].days[dayIndex] = {
                content: newContent,
                updatedAt: new Date().toISOString()
            };
            return newState;
        });
    };
    return (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-200">{prompt.title[lang]}</h3>
            <ul className="list-disc pl-5 rtl:pr-5 space-y-2 text-gray-700 dark:text-gray-300">
                {prompt.points.map((point, i) => <li key={i}>{point[lang]}</li>)}
            </ul>
            <div className="mt-4">
                <SimpleEditor 
                    content={journalEntry?.content || ''}
                    onUpdate={handleContentChange}
                />
            </div>
        </div>
    );
}

export default JournalEditor;