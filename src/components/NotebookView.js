import React, { useState, useMemo, useContext } from 'react';
import { AppContext } from '../App';
import NoteEditor from './NoteEditor';

function NotebookView() {
    const { lang, appState, setModal, planData, translations, showToast } = useContext(AppContext);
    const t = translations[lang];
    const [activeTab, setActiveTab] = useState('tasks');
    const [showGraph, setShowGraph] = useState(false);

    const allTaskNotes = useMemo(() => {
        if (!appState || !appState.notes) return [];
        const notesList = [];
        Object.keys(appState.notes).forEach(weekKey => {
            Object.keys(appState.notes[weekKey].days).forEach(dayIdx => {
                const dayNotes = appState.notes[weekKey].days[dayIdx];
                Object.keys(dayNotes).forEach(taskId => {
                    const note = dayNotes[taskId];
                    const weekData = planData.find(w => w.week === parseInt(weekKey));
                    const dayData = weekData?.days[parseInt(dayIdx)];
                    const taskData = dayData?.tasks.find(t => t.id === taskId);
                    if (weekData && dayData && taskData) {
                        notesList.push({ ...note, weekData, dayData, taskData });
                    }
                });
            });
        });
        return notesList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }, [appState.notes, planData]);
    
    const allJournalEntries = useMemo(() => {
        if (!appState || !appState.journal) return [];
        const entriesList = [];
        Object.keys(appState.journal).forEach(weekKey => {
            Object.keys(appState.journal[weekKey].days).forEach(dayIdx => {
                const entry = appState.journal[weekKey].days[dayIdx];
                if(entry) {
                    const weekData = planData.find(w => w.week === parseInt(weekKey));
                    const dayData = weekData?.days[parseInt(dayIdx)];
                    if (weekData && dayData) {
                        entriesList.push({ ...entry, weekData, dayData });
                    }
                }
            });
        });
        return entriesList.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }, [appState.journal, planData]);

    const openNoteModal = (note) => {
        setModal({
            isOpen: true,
            content: <NoteEditor 
                        note={note} 
                        taskDescription={note.taskData.description[lang]}
                        onSave={(newNoteData) => {
                            setAppState(prev => {
                                const newState = JSON.parse(JSON.stringify(prev));
                                const dayIndex = planData.find(w => w.week === note.weekData.week).days.findIndex(d => d.key === note.dayData.key);
                                newState.notes[note.weekData.week].days[dayIndex][note.taskData.id] = { ...newNoteData, updatedAt: new Date().toISOString() };
                                return newState;
                            });
                            setModal({ isOpen: false, content: null });
                        }}
                        onDelete={() => {
                             setAppState(prev => {
                                const newState = JSON.parse(JSON.stringify(prev));
                                const dayIndex = planData.find(w => w.week === note.weekData.week).days.findIndex(d => d.key === note.dayData.key);
                                delete newState.notes[note.weekData.week].days[dayIndex][note.taskData.id];
                                return newState;
                            });
                            setModal({ isOpen: false, content: null });
                        }}
                    />
        });
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl h-full flex flex-col border border-gray-100 dark:border-gray-800">
            <div className="border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <nav className="-mb-px flex space-x-8 rtl:space-x-reverse" aria-label="Tabs">
                    <button onClick={() => setActiveTab('tasks')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tasks' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        {t.taskNotes}
                    </button>
                    <button onClick={() => setActiveTab('journal')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'journal' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                        {t.journalEntries}
                    </button>
                </nav>
                <button onClick={()=>setShowGraph(true)} className="ml-4 px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-700 text-sm font-medium">العرض البياني</button>
            </div>
            {/* Graph view and notes rendering would go here, omitted for brevity */}
            <div className="overflow-y-auto flex-grow mt-6">
                {activeTab === 'tasks' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allTaskNotes.map(note => (
                            <div key={note.updatedAt} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition" onClick={() => openNoteModal(note)}>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{note.title}</h3>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(note.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <div className="prose prose-sm dark:prose-invert line-clamp-4 mb-2">
                                    {note.content}
                                </div>
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{note.taskData?.description?.[lang]}</div>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'journal' && (
                    <div className="space-y-4">
                        {allJournalEntries.map(entry => (
                            <div key={entry.updatedAt} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                                 <p className="text-xs text-gray-500 dark:text-gray-400">{t.weekTitle} {entry.weekData.week} - {entry.dayData.day[lang]}</p>
                                 <div className="prose prose-sm dark:prose-invert mt-2" dangerouslySetInnerHTML={{ __html: entry.content }}></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default NotebookView;