import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function getMonthDays(year, month) {
  const days = [];
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= lastDate; d++) days.push(d);
  return days;
}

function LocalCalendar() {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const monthName = viewDate.toLocaleString(locale, { month: 'long', year: 'numeric' });
  const weekDays = Array.from({length: 7}, (_, i) => new Date(1970, 0, i+4).toLocaleDateString(locale, { weekday: 'short' }));
  const days = getMonthDays(viewDate.getFullYear(), viewDate.getMonth());

  const isToday = (d) => d && d === today.getDate() && viewDate.getMonth() === today.getMonth() && viewDate.getFullYear() === today.getFullYear();

  const changeMonth = (offset) => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-4 w-fit mx-auto">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => changeMonth(-1)} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">&#8592;</button>
        <span className="font-bold text-blue-700 dark:text-blue-300 text-lg" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>{monthName}</span>
        <button onClick={() => changeMonth(1)} className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">&#8594;</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {weekDays.map((wd, i) => (
          <div key={i} className="text-xs font-bold text-gray-500 dark:text-gray-300">{wd}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((d, i) => (
          <div key={i} className={`h-8 w-8 flex items-center justify-center rounded-full text-sm ${isToday(d) ? 'bg-blue-500 text-white font-bold' : 'text-gray-700 dark:text-gray-200'}`}>{d || ''}</div>
        ))}
      </div>
    </div>
  );
}

export default LocalCalendar;