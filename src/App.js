import React, { useState } from 'react';
import SkillMatrix from './components/SkillMatrix';
import WeekCard from './components/WeekCard';
import AchievementsView from './components/AchievementsView';
import NotebookView from './components/NotebookView';
import LocalClock from './components/LocalClock';
import LocalCalendar from './components/LocalCalendar';
import Logo from './components/Logo';
import LogoArabic from './components/LogoArabic';
import { useTranslation } from 'react-i18next';
import './index.css';

// --- DATA & CONFIGURATION (FULL 50 WEEKS) ---
const planData = [
    {
        week: 1, phase: 1, 
        title: {en: "Introduction to Cybersecurity", ar: "مقدمة إلى عالم الأمن السيبراني"},
        objective: {en: "Build a solid understanding of the fundamental concepts and principles, get to know the security teams, and set up the practical work environment.", ar: "بناء فهم صلب للمفاهيم والمبادئ الأساسية التي يقوم عليها المجال، والتعرف على الفرق الأمنية، وإعداد بيئة العمل العملية."},
        days: [
            { key: "sat", day: {en:"Saturday", ar:"السبت"}, topic: {en:"What is Cybersecurity & the CIA Triad", ar:"ما هو الأمن السيبراني ومبدأ الـ CIA Triad"}, tasks: [
                { id: "w1d1t1", type: "Blue Team", duration: 75, description: {en:"Watch a comprehensive intro video and read a detailed article on the CIA Triad.", ar:"شاهد فيديو مقدمة شاملة واقرأ مقالاً مفصلاً عن مبدأ CIA Triad."} },
                { id: "w1d1t2", type: "Soft Skills", duration: 45, description: {en:"Analyze how 3 services you use daily (Gmail, WhatsApp) apply the CIA principles.", ar:"حلل كيف تطبق 3 خدمات تستخدمها يوميًا (Gmail, WhatsApp) مبادئ CIA."} }
            ], resources: [{ type: "video", title: "Cybersecurity Full Course for Beginners (freeCodeCamp)", url: "https://www.youtube.com/watch?v=f_S_7_mVO_4" }, { type: "article", title: "What is the CIA Triad - Fortinet", url: "https://www.fortinet.com/resources/cyberglossary/cia-triad" }], notes_prompt: { title: {en:"Evening Journaling Task", ar:"مهمة التدوين المسائية"}, points: [{en:"The Core Concept: Answer 'What is Cybersecurity?' in your own paragraph.", ar:"المفهوم الأساسي: أجب عن سؤال \"ما هو الأمن السيبراني؟\" بفقرة من صياغتك الخاصة."}, {en:"CIA Triad Table: Create a table (Confidentiality, Integrity, Availability) with a definition, a technical example, and a violation example for each.", ar:"جدول CIA Triad: أنشئ جدولاً (السرية، النزاهة، التوفر) مع تعريف ومثال تقني ومثال لانتهاك كل مبدأ."}, {en:"New Terms: Define Asset, Threat, Vulnerability, Risk.", ar:"مصطلحات جديدة: عرّف Asset, Threat, Vulnerability, Risk."}]}}},
            { key: "sun", day: {en:"Sunday", ar:"الأحد"}, topic: {en:"Threat Types and Threat Actors", ar:"أنواع التهديدات والجهات الفاعلة"}, tasks: [
                { id: "w1d2t1", type: "Blue Team", duration: 60, description: {en:"Study threat types (Malware, Phishing).", ar:"ادرس أنواع التهديدات (Malware, Phishing)."} },
                { id: "w1d2t2", type: "Red Team", duration: 45, description: {en:"Study threat actors (Script Kiddies, APTs).", ar:"ادرس الجهات الفاعلة (Script Kiddies, APTs)."} },
                { id: "w1d2t3", type: "Practical", duration: 15, description: {en:"Read a summary of the 'Stuxnet' attack.", ar:"اقرأ ملخصا عن هجوم \"Stuxnet\"."} }
            ], resources: [{ type: "article", title: "Common cyber attack types - IBM", url: "https://www.ibm.com/topics/cyber-attacks" }, { type: "article", title: "Who are the threat actors? - CrowdStrike", url: "https://www.crowdstrike.com/cybersecurity-101/threat-actors/" }], notes_prompt: { title: {en:"Evening Journaling Task", ar:"مهمة التدوين المسائية"}, points: [{en:"Threat Classification: Create a list of threats with a brief definition and an example.", ar:"تصنيف التهديدات: أنشئ قائمة بالتهديدات مع تعريف موجز ومثال."}, {en:"Threat Actor Profile: Create a comparison table for threat actors (Category, Motive, Skill).", ar:"ملف الجهات الفاعلة: أنشئ جدولاً للمقارنة بين الجهات الفاعلة (الفئة، الدافع، المهارة)."}, {en:"Connecting Concepts: Link the 'Stuxnet' attack to a potential 'threat actor' and 'motive'.", ar:"ربط المفاهيم: اربط هجوم \"Stuxnet\" بـ \"الجهة الفاعلة\" المحتملة\" و \"الدافع\"."}]}}
        ]
    },
];

function App() {
  const { t, i18n } = useTranslation();
  const [rtl, setRtl] = useState(i18n.language === 'ar');
  const [view, setView] = useState('plan'); // plan | achievements | notebook

  // تغيير اتجاه الصفحة عند تغيير اللغة
  React.useEffect(() => {
    setRtl(i18n.language === 'ar');
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-gray-900 ${rtl ? 'font-arabic' : ''}`}>
      <header className="flex flex-col md:flex-row items-center justify-between px-4 py-4 bg-white shadow">
        <div className={`flex flex-col md:flex-row items-center gap-4 w-full ${i18n.language === 'ar' ? 'justify-end' : 'justify-start'}`}>
          {i18n.language === 'ar' ? <LogoArabic size="2xl" /> : <Logo size="2xl" />}
          <div className="flex-1 flex flex-col md:flex-row gap-2 items-center justify-end">
            <LocalClock />
            <LocalCalendar />
          </div>
        </div>
        <div className="flex gap-2 items-center mt-2 md:mt-0">
          <button onClick={() => i18n.changeLanguage('en')} className={`px-3 py-1 rounded ${i18n.language==='en'?'bg-blue-600 text-white':'bg-gray-200'}`}>EN</button>
          <button onClick={() => i18n.changeLanguage('ar')} className={`px-3 py-1 rounded ${i18n.language==='ar'?'bg-blue-600 text-white':'bg-gray-200'}`}>العربية</button>
        </div>
      </header>
      <nav className="flex justify-center gap-4 py-4">
        <button onClick={()=>setView('plan')} className={`px-4 py-2 rounded ${view==='plan'?'bg-blue-500 text-white':'bg-gray-100'}`}>{t('Plan')}</button>
        <button onClick={()=>setView('achievements')} className={`px-4 py-2 rounded ${view==='achievements'?'bg-blue-500 text-white':'bg-gray-100'}`}>{t('Achievements')}</button>
        <button onClick={()=>setView('notebook')} className={`px-4 py-2 rounded ${view==='notebook'?'bg-blue-500 text-white':'bg-gray-100'}`}>{t('Notebook')}</button>
      </nav>
      <main className="max-w-5xl mx-auto px-2 py-6">
        {view === 'plan' && (
          <div className="space-y-6">
            <SkillMatrix planData={planData} />
            {planData.map(week => (
              <WeekCard key={week.week} week={week} rtl={rtl} />
            ))}
          </div>
        )}
        {view === 'achievements' && <AchievementsView />}
        {view === 'notebook' && <NotebookView rtl={rtl} />}
      </main>
    </div>
  );
}

export default App;