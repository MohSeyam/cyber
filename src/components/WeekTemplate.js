import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import LogoArabic from './LogoArabic';
import Logo from './Logo';
import { Bar, Doughnut } from 'react-chartjs-2';

function WeekTemplate({ week, progress, totalTime, notesCount, journalCount, resourcesCount, tags, completedTasks, allTasks, sectionStats }) {
  const { i18n, t } = useTranslation();
  const isAr = i18n.language === 'ar';
  const now = new Date();
  const canExport = progress.completed === progress.total && progress.total > 0;
  const templateRef = useRef();

  // بيانات الرسم البياني لتوزيع المهام حسب القسم
  const sectionColors = {
    'Blue Team': '#2563eb',
    'Red Team': '#ef4444',
    'Policies': '#a21caf',
    'Practical': '#22c55e',
    'Soft Skills': '#f59e42',
  };
  const sectionLabels = Object.keys(sectionStats);
  const sectionData = sectionLabels.map(l => sectionStats[l]);
  const sectionBg = sectionLabels.map(l => sectionColors[l] || '#64748b');

  const sectionChart = {
    labels: sectionLabels,
    datasets: [{
      label: isAr ? 'عدد المهام المنجزة' : 'Completed Tasks',
      data: sectionData,
      backgroundColor: sectionBg,
      borderRadius: 6,
    }],
  };

  // بيانات الرسم البياني الدائري للوسوم
  const tagLabels = tags.map(t => t.name);
  const tagData = tags.map(t => t.count);
  const tagChart = {
    labels: tagLabels,
    datasets: [{
      data: tagData,
      backgroundColor: ['#2563eb','#a21caf','#22c55e','#f59e42','#7c3aed','#06b6d4','#f43f5e'],
    }],
  };

  return (
    <div ref={templateRef} className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-blue-200 dark:border-blue-800 p-6 print:p-2 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        {isAr ? <LogoArabic size="2xl" /> : <Logo size="2xl" />}
        <div className="text-right">
          <div className="font-bold text-blue-700 dark:text-blue-300">{isAr ? 'محمد أبو العبد' : 'Mohamed Abu Al-Abed'}</div>
          <div className="text-xs text-gray-500 dark:text-gray-300">{now.toLocaleDateString(i18n.language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          <div className="text-xs text-gray-500 dark:text-gray-300">{now.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-100 via-green-100 to-purple-100 dark:from-blue-900 dark:via-green-900 dark:to-purple-900 rounded-xl shadow p-4 mb-6 border border-blue-200 dark:border-blue-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-1">{week.title[i18n.language]}</div>
            <div className="text-xs bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200 px-2 py-0.5 rounded inline-block mb-2">{week.objective[i18n.language]}</div>
            <div className="flex gap-4 mt-2 flex-wrap">
              <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-300 font-semibold"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>{progress.completed}/{progress.total} {t('tasks')}</span>
              <span className="inline-flex items-center gap-1 text-purple-700 dark:text-purple-300 font-semibold"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" /></svg>{totalTime} {t('min')}</span>
              <span className="inline-flex items-center gap-1 text-blue-700 dark:text-blue-300 font-semibold"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4" /></svg>{week.days.length} {t('days')}</span>
              <span className="inline-flex items-center gap-1 text-pink-700 dark:text-pink-300 font-semibold"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>{notesCount} {t('notes')}</span>
              <span className="inline-flex items-center gap-1 text-yellow-700 dark:text-yellow-300 font-semibold"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 16h.01M16 12h.01" /></svg>{journalCount} {t('journalEntries')}</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center mt-4 md:mt-0">
            <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">{progress.percentage}%</span>
            <span className="text-xs text-gray-500 dark:text-gray-300">{t('completion')}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">{t('Completed Tasks by Section')}</h3>
          <Bar data={sectionChart} options={{responsive:true, plugins:{legend:{display:false}}, scales:{x:{grid:{color:'#e0e7ef'}},y:{grid:{color:'#e0e7ef'}}}}} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">{t('Tags Usage')}</h3>
          <Doughnut data={tagChart} options={{responsive:true, plugins:{legend:{position:'bottom'}}}} />
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">{t('Completed Tasks')}</h3>
        <ul className="list-disc rtl:list-decimal ms-5 space-y-1">
          {completedTasks.map((task, i) => (
            <li key={i} className="text-gray-800 dark:text-gray-100 font-medium flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full" style={{background: sectionColors[task.type] || '#64748b'}}></span>
              {task.description[i18n.language]} <span className="text-xs text-gray-400">({task.type})</span>
            </li>
          ))}
        </ul>
      </div>
      {!canExport && (
        <div className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded p-3 text-center font-bold mb-2">
          {t('You must complete all tasks to export or print the template.')}
        </div>
      )}
      {canExport && (
        <div className="flex justify-end gap-2 print:hidden">
          <button onClick={()=>window.print()} className="px-4 py-2 rounded bg-blue-600 text-white font-bold shadow hover:bg-blue-700">{t('Print')}</button>
          {/* زر تصدير PDF/صورة يمكن إضافته هنا */}
        </div>
      )}
    </div>
  );
}

export default WeekTemplate;