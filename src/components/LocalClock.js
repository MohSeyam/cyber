import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function LocalClock() {
  const { i18n } = useTranslation();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
  const time = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 w-fit mx-auto">
      <div className="text-4xl font-mono text-blue-700 dark:text-blue-300 mb-1" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>{time}</div>
      <div className="text-base text-gray-600 dark:text-gray-300" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>{date}</div>
    </div>
  );
}

export default LocalClock;