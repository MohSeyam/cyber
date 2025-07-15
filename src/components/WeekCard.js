import React, { useState, useMemo, useContext } from 'react';
import { AppContext } from '../App';
import DayView from './DayView';

function WeekCard({ week }) {
  const { lang, appState, setAppState, translations, Icons, setModal, showToast, rtl } = useContext(AppContext);
  const t = translations[lang];
  const [activeDayKey, setActiveDayKey] = useState(week.days[0].key);
  const activeDayIndex = useMemo(() => week.days.findIndex(d => d.key === activeDayKey), [week, activeDayKey]);
  const activeDayData = week.days[activeDayIndex];

  if (!week) return <div>{t.week} not found.</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{week.title[lang]}</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{week.objective[lang]}</p>
          </div>
        </div>
      </div>
      <div className="md:flex">
        <nav className="md:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-4">
          <ul className="space-y-1">
            {week.days.map((day) => (
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
          <DayView
            weekId={week.week}
            dayIndex={activeDayIndex}
            dayData={activeDayData}
            appState={appState}
            setAppState={setAppState}
            Icons={Icons}
            setModal={setModal}
            rtl={rtl}
            showToast={showToast}
          />
        </div>
      </div>
    </div>
  );
}

export default WeekCard;