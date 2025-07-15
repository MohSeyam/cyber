import React, { useState, useEffect, useContext } from 'react';
import ProgressCircle from './ProgressCircle';
import NoteEditor from './NoteEditor';
import JournalEditor from './JournalEditor';
import { useTranslation } from 'react-i18next';

function DayView({
  weekId,
  dayIndex,
  dayData,
  appState,
  setAppState,
  Icons,
  setModal,
  rtl,
  showToast
}) {
  const { t, i18n } = useTranslation();
  const [timerSettings, setTimerSettings] = useState({ work: 25, break: 5 });
  const [activeTimer, setActiveTimer] = useState(null);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [remainingTime, setRemainingTime] = useState(timerSettings.work * 60);
  const [expandedTask, setExpandedTask] = useState(null);

  // حساب التقدم اليومي
  const totalTasks = dayData.tasks.length;
  const completedTasks = appState.progress[weekId]?.days[dayIndex]?.tasks?.filter(t => t === 'completed').length || 0;
  const progress = {
    completed: completedTasks,
    total: totalTasks,
    percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  };

  useEffect(() => {
    return () => {
      if (activeTimer) clearInterval(activeTimer);
    };
  }, [activeTimer]);

  // مؤقت Pomodoro
  const startTimer = () => {
    if (activeTimer) clearInterval(activeTimer);
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          const nextIsWork = !isWorkSession;
          setIsWorkSession(nextIsWork);
          if (isWorkSession) {
            showToast(t('Time for a break!'));
            setRemainingTime(timerSettings.break * 60);
          } else {
            showToast(t('Back to work!'));
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
    if (activeTimer) clearInterval(activeTimer);
    setActiveTimer(null);
  };

  const resetTimer = () => {
    stopTimer();
    setRemainingTime(isWorkSession ? timerSettings.work * 60 : timerSettings.break * 60);
  };

  // تبديل حالة المهمة
  const toggleTask = (taskIndex) => {
    setAppState(prev => {
      const newState = JSON.parse(JSON.stringify(prev));
      const currentStatus = newState.progress[weekId].days[dayIndex].tasks[taskIndex];
      newState.progress[weekId].days[dayIndex].tasks[taskIndex] =
        currentStatus === 'completed' ? 'pending' : 'completed';
      return newState;
    });
  };

  // فتح محرر الملاحظات
  const openNoteModal = (taskId, taskDescription) => {
    const note = appState.notes[weekId]?.days[dayIndex]?.[taskId] || { title: '', content: '', keywords: [] };
    setModal({
      isOpen: true,
      content: <NoteEditor
        note={note}
        taskDescription={taskDescription}
        onSave={(newNoteData) => {
          setAppState(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            if (!newState.notes[weekId].days[dayIndex]) {
              newState.notes[weekId].days[dayIndex] = {};
            }
            newState.notes[weekId].days[dayIndex][taskId] = { ...newNoteData, updatedAt: new Date().toISOString() };
            return newState;
          });
          setModal({ isOpen: false, content: null });
        }}
        onDelete={() => {
          setAppState(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            delete newState.notes[weekId].days[dayIndex][taskId];
            return newState;
          });
          setModal({ isOpen: false, content: null });
        }}
      />
    });
  };

  // إضافة إلى التقويم
  const addToCalendar = (task) => {
    const title = encodeURIComponent(task.description[i18n.language]);
    const details = encodeURIComponent(t('From Cybersecurity Plan App'));
    const start = new Date().toISOString().replace(/[-:]|\.\d{3}/g, '');
    const end = new Date(Date.now() + task.duration * 60000).toISOString().replace(/[-:]|\.\d{3}/g, '');
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${start}/${end}`;
    window.open(url, '_blank');
  };

  // تنسيق الوقت
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-blue-700 mb-1">{dayData.day[i18n.language]}</h3>
          <div className="text-gray-600 dark:text-gray-300 text-base">{dayData.topic[i18n.language]}</div>
        </div>
        <ProgressCircle percentage={progress.percentage} />
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-500">{t('Tasks Progress')}:</span>
          <span className="font-semibold text-blue-600">{progress.completed}/{progress.total}</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all" style={{width: `${progress.percentage}%`}}></div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {dayData.tasks.map((task, idx) => {
          const completed = appState.progress[weekId]?.days[dayIndex]?.tasks[idx] === 'completed';
          return (
            <div key={task.id} className={`relative group bg-white dark:bg-gray-900 border-2 rounded-xl p-4 shadow transition-all duration-200 hover:scale-[1.02] ${completed ? 'border-green-400' : 'border-gray-200 dark:border-gray-700'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${task.type==='Blue Team' ? 'bg-blue-100 text-blue-700' : task.type==='Red Team' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{task.type}</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"><Icons.clock className="w-3 h-3 me-1" />{task.duration} {t('min')}</span>
                {completed && <span className="ml-2 text-green-600 font-bold">✓ {t('Completed')}</span>}
              </div>
              <div className={`text-gray-800 dark:text-gray-100 text-base font-medium ${completed ? 'line-through text-gray-400' : ''}`}>{task.description[i18n.language]}</div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => toggleTask(idx)} className={`flex-1 py-1 rounded-lg font-semibold transition-colors ${completed ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>{completed ? t('Mark as Pending') : t('Mark as Done')}</button>
                <button onClick={() => openNoteModal(task.id, task.description[i18n.language])} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"><Icons.noteIcon className="w-4 h-4" />{t('Note')}</button>
                <button onClick={() => addToCalendar(task)} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-100 hover:bg-green-200 text-green-700"><Icons.calendar className="w-4 h-4" />{t('Calendar')}</button>
                <button onClick={() => setExpandedTask(expandedTask === idx ? null : idx)} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500"><Icons.chevronDown className={`w-4 h-4 transform transition-transform ${expandedTask === idx ? 'rotate-180' : ''}`} /></button>
              </div>
              {expandedTask === idx && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 animate-fade-in">
                  <div>{t('Task Details')}:</div>
                  <ul className="list-disc rtl:list-decimal ms-5 mt-1">
                    <li>{t('Type')}: {task.type}</li>
                    <li>{t('Duration')}: {task.duration} {t('min')}</li>
                    <li>{t('Description')}: {task.description[i18n.language]}</li>
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-8">
        {/* عرض الموارد اليومية */}
        {dayData.resources && dayData.resources.length > 0 && (
          <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-700 animate-fade-in">
            <h4 className="font-semibold mb-3 text-blue-700 flex items-center gap-2">
              <Icons.link className="w-5 h-5 text-blue-400" />
              {t('Resources')}
            </h4>
            <ul className="space-y-2">
              {dayData.resources.map((res, i) => (
                <li key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-800/30 transition">
                  {res.type === 'video' ? (
                    <Icons.video className="w-5 h-5 text-red-500" />
                  ) : (
                    <Icons.article className="w-5 h-5 text-green-600" />
                  )}
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-700 hover:text-blue-900 font-medium">{res.title}</a>
                  <span className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">{res.type === 'video' ? t('Video') : t('Article')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* عرض مهمة التدوين اليومية */}
        {dayData.notes_prompt && (
          <JournalEditor
            weekId={weekId}
            dayIndex={dayIndex}
            prompt={dayData.notes_prompt}
          />
        )}
      </div>
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/40 rounded-xl">
        <h4 className="font-semibold mb-2 text-blue-700">{t('Pomodoro Timer')}</h4>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="text-4xl font-mono text-blue-600 dark:text-blue-300">{formatTime(remainingTime)}</div>
          <div className="flex gap-2">
            {!activeTimer ? (
              <button onClick={startTimer} className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">{t('Start')}</button>
            ) : (
              <button onClick={stopTimer} className="px-4 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700">{t('Stop')}</button>
            )}
            <button onClick={resetTimer} className="px-4 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">{t('Reset')}</button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <label className="text-gray-700 dark:text-gray-300">{t('Work')}:</label>
            <input type="number" value={timerSettings.work} onChange={e => setTimerSettings({...timerSettings, work: parseInt(e.target.value) || 0})} className="w-14 px-2 py-1 border rounded bg-white dark:bg-gray-600" min="1" />
            <label className="text-gray-700 dark:text-gray-300">{t('Break')}:</label>
            <input type="number" value={timerSettings.break} onChange={e => setTimerSettings({...timerSettings, break: parseInt(e.target.value) || 0})} className="w-14 px-2 py-1 border rounded bg-white dark:bg-gray-600" min="1" />
            <span className="text-gray-700 dark:text-gray-300">{t('min')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DayView;