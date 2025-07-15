import React from 'react';
import { useTranslation } from 'react-i18next';

function Logo({ className = '', size = '2xl' }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  return (
    <div className={`flex items-center gap-2 select-none ${className}`} dir={isAr ? 'rtl' : 'ltr'}>
      {isAr ? (
        <>
          <span className={`text-${size} font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 bg-clip-text text-transparent drop-shadow`}>أبو العبد محمد</span>
          <ShieldIcon />
          <span className="text-lg font-bold text-gray-700 dark:text-gray-200 tracking-wide">Cybersecurity</span>
        </>
      ) : (
        <>
          <span className="text-lg font-bold text-gray-700 dark:text-gray-200 tracking-wide">Cybersecurity</span>
          <ShieldIcon />
          <span className={`text-${size} font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 bg-clip-text text-transparent drop-shadow`}>Abu Al-Abed Mohamed</span>
        </>
      )}
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-7 h-7 text-blue-500 drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 3l7 4v5c0 5.25-3.5 9.75-7 11-3.5-1.25-7-5.75-7-11V7l7-4z" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default Logo;