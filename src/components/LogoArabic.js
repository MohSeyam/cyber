import React from 'react';

function LogoArabic({ className = '', size = '3xl', showCyber = true }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`} dir="rtl">
      <span className={`text-${size} font-extrabold bg-gradient-to-r from-blue-700 via-purple-600 to-green-500 bg-clip-text text-transparent drop-shadow`}>أبو العبد محمد</span>
      <span className="relative flex flex-col items-center">
        <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
          <defs>
            <linearGradient id="shield-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563eb"/>
              <stop offset="0.5" stopColor="#7c3aed"/>
              <stop offset="1" stopColor="#22c55e"/>
            </linearGradient>
          </defs>
          <path d="M24 6L40 14V24C40 36 24 42 24 42C24 42 8 36 8 24V14L24 6Z" fill="url(#shield-grad)" stroke="#2563eb" strokeWidth="2"/>
          <circle cx="24" cy="24" r="6" fill="#fff" stroke="#7c3aed" strokeWidth="2"/>
          <path d="M24 21v3l2 2" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        {showCyber && (
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-700 whitespace-nowrap">الأمن السيبراني</span>
        )}
      </span>
    </div>
  );
}

export default LogoArabic;