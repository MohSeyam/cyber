import React, { useState, useMemo, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import ProgressCircle from './ProgressCircle';
import NoteEditor from './NoteEditor';
import JournalEditor from './JournalEditor';
import ResourcesSection from './ResourcesSection';

function WeekCard({ weekData }) {
  const { lang, appState, setAppState, translations, Icons, setModal, showToast } = useContext(AppContext);
  const t = translations[lang];
  
  const [activeDayKey, setActiveDayKey] = useState(weekData.days[0].key);
  const [timerSettings, setTimerSettings] = useState({ work: 25, break: 5 });
  const [activeTimer, setActiveTimer] = useState(null);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [remainingTime, setRemainingTime] = useState(timerSettings.work * 60);

  const activeDayIndex = useMemo(() => weekData.days.findIndex(d => d.key === activeDayKey), [weekData, activeDayKey]);
  const activeDayData = weekData.days[activeDayIndex];

  useEffect(() => {
      return () => {
          if(activeTimer) clearInterval(activeTimer);
      }
  }, [activeTimer]);

  if (!weekData) return <div>{t.week} not found.</div>;

  const calculateProgress = () => {
    let totalTasks = 0;
    let completedTasks = 0;
    weekData.days.forEach((day, dayIndex) => {
      totalTasks += day.tasks.length;
      const dayState = appState.progress[weekData.week]?.days[dayIndex];
      completedTasks += dayState?.tasks?.filter(t => t === 'completed').length || 0;
    });
    return {
      completed: completedTasks,
      total: totalTasks,
      percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  const progress = calculateProgress();

  const startTimer = () => {
    if (activeTimer) clearInterval(activeTimer);
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          const nextIsWork = !isWorkSession;
          setIsWorkSession(nextIsWork);
          if (isWorkSession) {
            new Notification(t.planTitle, { body: 'حان وقت الراحة! خذ 5 دقائق استراحة' });
            setRemainingTime(timerSettings.break * 60);
          } else {
            new Notification(t.planTitle, { body: 'انتهت الاستراحة! استعد للعمل' });
            setRemainingTime(timerSettings.work * 60);
          }
          return nextIsWork ? timerSettings.work * 60 : timerSettings.break * 60;
        }
        return prev - 1;
      });
    }, 1000);
    setActiveTimer(timer);
  };

  const stopTimer = () => {
    if(activeTimer) clearInterval(activeTimer);
    setActiveTimer(null);
  };

  const resetTimer = () => {
    stopTimer();
    setRemainingTime(isWorkSession ? timerSettings.work * 60 : timerSettings.break * 60);
  };

  const toggleTask = (dayIndex, taskIndex) => {
    setAppState(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      const currentStatus = newState.progress[weekData.week].days[dayIndex].tasks[taskIndex];
      newState.progress[weekData.week].days[dayIndex].tasks[taskIndex] = 
        currentStatus === 'completed' ? 'pending' : 'completed';
      return newState;
    });
  };
  
  const openNoteModal = (taskId, taskDescription) => {
    const dayIndex = activeDayIndex;
    const note = appState.notes[weekData.week]?.days[dayIndex]?.[taskId] || { title: '', content: '', keywords: [] };
    setModal({
        isOpen: true,
        content: <NoteEditor 
                    note={note} 
                    taskDescription={taskDescription}
                    onSave={(newNoteData) => {
                        setAppState(prev => {
                            const newState = JSON.parse(JSON.stringify(prev));
                            if (!newState.notes[weekData.week].days[dayIndex]) {
                                newState.notes[weekData.week].days[dayIndex] = {};
                            }
                            newState.notes[weekData.week].days[dayIndex][taskId] = { ...newNoteData, updatedAt: new Date().toISOString() };
                            return newState;
                        });
                        setModal({ isOpen: false, content: null });
                    }}
                    onDelete={() => {
                         setAppState(prev => {
                            const newState = JSON.parse(JSON.stringify(prev));
                            delete newState.notes[weekData.week].days[dayIndex][taskId];
                            return newState;
                        });
                        setModal({ isOpen: false, content: null });
                    }}
                />
    });
};

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // إضافة زر "أضف إلى التقويم" بجانب كل مهمة
  const addToCalendar = (task, day) => {
      const title = encodeURIComponent(task.description[lang]);
      const details = encodeURIComponent('من تطبيق خطة الأمن السيبراني');
      const start = new Date().toISOString().replace(/[-:]|\.\d{3}/g, '');
      const end = new Date(Date.now() + task.duration*60000).toISOString().replace(/[-:]|\.\d{3}/g, '');
      const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${start}/${end}`;
      window.open(url, '_blank');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{weekData.title[lang]}</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{weekData.objective[lang]}</p>
          </div>
          <ProgressCircle percentage={progress.percentage} />
        </div>
      </div>

      <div className="md:flex">
        <nav className="md:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-4">
            <ul className="space-y-1">
                {weekData.days.map((day) => (
                    <li key={day.key}>
                        <button
                            onClick={() => setActiveDayKey(day.key)}
                            className={`w-full text-right rtl:text-left p-3 rounded-lg font-medium text-sm transition-colors ${activeDayKey === day.key 
                                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
                        >
                            {day.day[lang]}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>

        <div className="flex-1 p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{activeDayData.topic[lang]}</h3>
            <div className="space-y-3 mb-8">
              {activeDayData.tasks.map((task, taskIndex) => (
                <div key={task.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id={`task-${task.id}`}
                      checked={appState.progress[weekData.week]?.days[activeDayIndex]?.tasks[taskIndex] === 'completed'}
                      onChange={() => toggleTask(activeDayIndex, taskIndex)}
                      className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="mx-3 flex-1">
                      <label htmlFor={`task-${task.id}`} className={`text-gray-800 dark:text-gray-200 cursor-pointer ${appState.progress[weekData.week]?.days[activeDayIndex]?.tasks[taskIndex] === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                        {task.description[lang]}
                      </label>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {task.type}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            <Icons.clock className="w-3 h-3 me-1" />
                            {task.duration} {t.minutes}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => openNoteModal(task.id, task.description[lang])} className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                         <Icons.noteIcon className="w-5 h-5 text-gray-500" />
                    </button>
                    <button onClick={() => addToCalendar(task, activeDayData)} className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200">أضف إلى التقويم</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">مؤقت المهام (Pomodoro)</h3>
              <div className="flex flex-col items-center">
                <div className="text-5xl font-mono mb-4 text-blue-600 dark:text-blue-400">
                  {formatTime(remainingTime)}
                </div>
                <div className="flex gap-3">
                  {!activeTimer ? (
                    <button onClick={startTimer} className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">بدء</button>
                  ) : (
                    <button onClick={stopTimer} className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">إيقاف</button>
                  )}
                  <button onClick={resetTimer} className="px-5 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">إعادة ضبط</button>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <label className="mx-2 text-gray-700 dark:text-gray-300">العمل:</label>
                  <input type="number" value={timerSettings.work} onChange={(e) => setTimerSettings({...timerSettings, work: parseInt(e.target.value) || 0})} className="w-16 px-2 py-1 border rounded bg-white dark:bg-gray-600" min="1"/>
                  <label className="mx-2 text-gray-700 dark:text-gray-300">الراحة:</label>
                  <input type="number" value={timerSettings.break} onChange={(e) => setTimerSettings({...timerSettings, break: parseInt(e.target.value) || 0})} className="w-16 px-2 py-1 border rounded bg-white dark:bg-gray-600" min="1"/>
                  <span className="mx-2 text-gray-700 dark:text-gray-300">دقائق</span>
                </div>
              </div>
            </div>

            <ResourcesSection weekId={weekData.week} dayIndex={activeDayIndex} />

            {activeDayData.notes_prompt && (
              <JournalEditor 
                weekId={weekData.week} 
                dayIndex={activeDayIndex}
                prompt={activeDayData.notes_prompt}
              />
            )}
        </div>
      </div>
    </div>
  );
}

export default WeekCard;