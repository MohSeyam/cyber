import React, { useState, useEffect, useMemo, createContext, useContext, useRef } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Transition } from '@headlessui/react';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

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
            ], resources: [{ type: "video", title: "Cybersecurity Full Course for Beginners (freeCodeCamp)", url: "https://www.youtube.com/watch?v=f_S_7_mVO_4" }, { type: "article", title: "What is the CIA Triad - Fortinet", url: "https://www.fortinet.com/resources/cyberglossary/cia-triad" }], notes_prompt: { title: {en:"Evening Journaling Task", ar:"مهمة التدوين المسائية"}, points: [{en:"The Core Concept: Answer 'What is Cybersecurity?' in your own paragraph.", ar:"المفهوم الأساسي: أجب عن سؤال \"ما هو الأمن السيبراني؟\" بفقرة من صياغتك الخاصة."}, {en:"CIA Triad Table: Create a table (Confidentiality, Integrity, Availability) with a definition, a technical example, and a violation example for each.", ar:"جدول CIA Triad: أنشئ جدولاً (السرية، النزاهة، التوفر) مع تعريف ومثال تقني ومثال لانتهاك كل مبدأ."}, {en:"New Terms: Define Asset, Threat, Vulnerability, Risk.", ar:"مصطلحات جديدة: عرّف Asset, Threat, Vulnerability, Risk."}]}},
            { key: "sun", day: {en:"Sunday", ar:"الأحد"}, topic: {en:"Threat Types and Threat Actors", ar:"أنواع التهديدات والجهات الفاعلة"}, tasks: [
                { id: "w1d2t1", type: "Blue Team", duration: 60, description: {en:"Study threat types (Malware, Phishing).", ar:"ادرس أنواع التهديدات (Malware, Phishing)."} },
                { id: "w1d2t2", type: "Red Team", duration: 45, description: {en:"Study threat actors (Script Kiddies, APTs).", ar:"ادرس الجهات الفاعلة (Script Kiddies, APTs)."} },
                { id: "w1d2t3", type: "Practical", duration: 15, description: {en:"Read a summary of the 'Stuxnet' attack.", ar:"اقرأ ملخصا عن هجوم \"Stuxnet\"."} }
            ], resources: [{ type: "article", title: "Common cyber attack types - IBM", url: "https://www.ibm.com/topics/cyber-attacks" }, { type: "article", title: "Who are the threat actors? - CrowdStrike", url: "https://www.crowdstrike.com/cybersecurity-101/threat-actors/" }], notes_prompt: { title: {en:"Evening Journaling Task", ar:"مهمة التدوين المسائية"}, points: [{en:"Threat Classification: Create a list of threats with a brief definition and an example.", ar:"تصنيف التهديدات: أنشئ قائمة بالتهديدات مع تعريف موجز ومثال."}, {en:"Threat Actor Profile: Create a comparison table for threat actors (Category, Motive, Skill).", ar:"ملف الجهات الفاعلة: أنشئ جدولاً للمقارنة بين الجهات الفاعلة (الفئة، الدافع، المهارة)."}, {en:"Connecting Concepts: Link the 'Stuxnet' attack to a potential 'threat actor' and 'motive'.", ar:"ربط المفاهيم: اربط هجوم \"Stuxnet\" بـ \"الجهة الفاعلة\" المحتملة\" و \"الدافع\"."}]}},
        ]
    },
];

const phases = {
    1: { title: {en:"Foundation", ar:"مرحلة التأسيس"}, range: {en:"Weeks 1-17", ar:"الأسابيع 1-17"}, color: "text-blue-500", bg: "bg-blue-500" },
    2: { title: {en:"Technical Skills", ar:"مرحلة المهارات التقنية العميقة"}, range: {en:"Weeks 18-36", ar:"الأسابيع 18-36"}, color: "text-green-500", bg: "bg-green-500" },
    3: { title: {en:"Professional Projects", ar:"مرحلة المشاريع الاحترافية"}, range: {en:"Weeks 37-50", ar:"الأسابيع 37-50"}, color: "text-purple-500", bg: "bg-purple-500" }
};

const translations = {
    en: { home: "Home", week: "Week", planTitle: "Cybersecurity Plan", notebook: "Notebook", taskNotes: "Task Notes", journalEntries: "Journal Entries", achievements: "Achievements", skillsMatrix: "Skills Matrix", toggleTheme: "Toggle Theme", weeklyProgress: "Weekly Progress", goToWeek: "Go to Week", planOverview: "Plan Overview", allTasksCompleted: "All tasks completed!", noNotesInNotebook: "No notes yet. Click on a task's edit icon to start.", addFirstNote: "Add First Note", activeTasks: "Active Tasks", suggestedResources: "Suggested Resources", dayNotes: "Day's Notes", eveningJournaling: "Evening Journaling Task", addNote: "Add Note", editNote: "Edit Note", deleteNote: "Delete Note", noteOnTask: "Note on:", lastUpdated: "Last updated:", weekTitle: "Week", phaseWeeksTitle: "Phase Weeks", achievementsTitle: "Achievements", minutes: "min", tasksCompleted: "tasks completed", overview: "Overview", phaseAnalysis: "Phase Analysis", skillsAnalysis: "Skills Analysis", totalPlanProgress: "Overall Progress", completedTasks: "Completed Tasks", learningHours: "Learning Hours", totalNotes: "Total Notes", newNote: "New Note", saveNote: "Save Note", cancel: "Cancel", noteTitle: "Note Title", noteContent: "Content", day: "Day", addResource: "+ Add Resource", editResource: "Edit Resource", resourceTitleLabel: "Title", resourceUrlLabel: "URL", resourceTypeLabel: "Type", save: "Save", delete: "Delete", edit: "Edit", confirmDeleteResource: "Are you sure you want to delete this resource?", confirmDeleteNote: "Are you sure you want to delete this note?", resourceTypes: { article: "Article", video: "Video", tool: "Tool", book: "Book", course: "Course", program: "Program", system: "System", guide: "Guide", reference: "Reference", search: "Search", website: "Website", policy: "Policy" }, keywords: "Keywords (Tags)", taskDistribution: "Task Distribution for the Week", validationError: "Validation Error", fieldRequired: "This field is required.", titleRequired: "Title is required.", contentRequired: "Content is required." },
    ar: { home: "الرئيسية", week: "الأسبوع", planTitle: "خطة الأمن السيبراني", notebook: "دفتر الملاحظات", taskNotes: "ملاحظات المهام", journalEntries: "التدوينات المسائية", achievements: "الإنجازات", skillsMatrix: "مصفوفة المهارات", toggleTheme: "تبديل الوضع", weeklyProgress: "التقدم الأسبوعي", goToWeek: "اذهب للأسبوع", planOverview: "نظرة عامة على الخطة", allTasksCompleted: "جميع المهام مكتملة!", noNotesInNotebook: "لا توجد ملاحظات بعد. انقر على أيقونة التعديل بجانب أي مهمة للبدء.", addFirstNote: "أضف أول ملاحظة", activeTasks: "المهام النشطة", suggestedResources: "مراجع مقترحة", dayNotes: "ملاحظات اليوم", eveningJournaling: "مهمة التدوين المسائية", addNote: "إضافة ملاحظة", editNote: "تعديل الملاحظة", deleteNote: "حذف الملاحظة", noteOnTask: "ملاحظة على:", lastUpdated: "آخر تحديث:", weekTitle: "الأسبوع", phaseWeeksTitle: "أسابيع المرحلة", achievementsTitle: "الإنجازات", minutes: "دقيقة", tasksCompleted: "مهام مكتملة", overview: "نظرة عامة", phaseAnalysis: "تحليل المراحل", skillsAnalysis: "تحليل المهارات", totalPlanProgress: "التقدم الإجمالي", completedTasks: "مهام مكتملة", learningHours: "ساعات التعلم", totalNotes: "إجمالي الملاحظات", newNote: "ملاحظة جديدة", saveNote: "حفظ الملاحظة", cancel: "إلغاء", noteTitle: "عنوان الملاحظة", noteContent: "المحتوى", day: "اليوم", addResource: "+ إضافة مرجع", editResource: "تعديل المرجع", resourceTitleLabel: "العنوان", resourceUrlLabel: "الرابط", resourceTypeLabel: "النوع", save: "حفظ", delete: "حذف", edit: "تعديل", confirmDeleteResource: "هل أنت متأكد من حذف هذا المرجع؟", confirmDeleteNote: "هل أنت متأكد من حذف هذه الملاحظة؟", resourceTypes: { article: "مقال", video: "فيديو", tool: "أداة", book: "كتاب", course: "دورة", program: "برنامج", system: "نظام", guide: "دليل", reference: "مرجع", search: "بحث", website: "موقع ويب", policy: "سياسة" }, keywords: "الكلمات المفتاحية (وسوم)", taskDistribution: "توزيع المهام للأسبوع", validationError: "خطأ في التحقق", fieldRequired: "هذا الحقل مطلوب.", titleRequired: "العنوان مطلوب.", contentRequired: "المحتوى مطلوب." }
};

// --- Animation Variants ---
const cardVariants = {
  hover: {
    y: -5,
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
  }
};

// --- CONTEXT & UTILITIES ---
const AppContext = createContext(null);
const findDayIndexByKey = (weekId, dayKey) => planData.find(w => w.week === parseInt(weekId))?.days.findIndex(d => d.key === dayKey) ?? -1;

// --- ICONS ---
const Icons = {
    home: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    notebook: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h4"/><path d="M2 12h4"/><path d="M2 18h4"/><path d="M6 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2Z"/></svg>,
    achievements: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>,
    sun: (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>,
    moon: (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>,
    clock: (props) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    noteIcon: (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 6.5l4 4"/><path d="M21 12.5v4.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5Z"/></svg>,
    resource: (type) => {
        const iconMap = { video: '🎬', article: '📄', tool: '🛠️', program: '💻', system: '⚙️', guide: '🗺️', reference: '🔗', search: '🔍', website: '🌐', policy: '📜', course: '🎓', book: '📚' };
        return <span className="text-xl" role="img" aria-label={type}>{iconMap[type] || '📎'}</span>;
    },
};

// --- HELPER & LAYOUT COMPONENTS (DEFINED FIRST) ---

function SimpleEditor({ content, onUpdate }) {
    return (
        <textarea
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 min-h-[150px] focus:ring-blue-500 focus:border-blue-500"
            value={content}
            onChange={(e) => onUpdate(e.target.value)}
        />
    );
}

function TagInput({ tags, setTags }) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setInputValue('');
        }
    };
    
    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
            {tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs font-medium px-2 py-1 rounded-full">
                    <span>{tag}</span>
                    <button onClick={() => removeTag(tag)} className="text-purple-500 hover:text-purple-700">
                        &times;
                    </button>
                </div>
            ))}
            <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a tag..."
                className="flex-grow bg-transparent p-1 focus:outline-none"
            />
        </div>
    );
}

function NoteEditor({ note, taskDescription, onSave, onDelete }) {
    const { lang, translations, setModal, showToast } = useContext(AppContext);
    const t = translations[lang];
    const [title, setTitle] = useState(note.title || '');
    const [tags, setTags] = useState(note.keywords || []);
    const [content, setContent] = useState(note.content || '');
    const [template, setTemplate] = useState('');

    useEffect(() => {
        if (!note.title && template) {
            if (template === 'video') {
                setTitle('ملخص فيديو');
                setContent('النقاط الرئيسية:\n- \nمصطلحات جديدة:\n- \nأسئلة للمتابعة:\n- ');
            } else if (template === 'tool') {
                setTitle('تحليل أداة');
                setContent('الغرض من الأداة:\n\nأهم الأوامر:\n\nبدائل:');
            }
        }
    }, [template]);

    const handleSave = () => {
        if (!title.trim()) {
            showToast(t.titleRequired, 'error');
            return;
        }
        if (!content.trim()) {
            showToast(t.contentRequired, 'error');
            return;
        }
        onSave({ title, content, keywords: tags });
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{t.editNote}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.noteOnTask} "{taskDescription}"</p>
            </div>
            <div className="px-4 sm:px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                    <label htmlFor="note-title-editor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.noteTitle}</label>
                    <input id="note-title-editor" type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.keywords}</label>
                    <TagInput tags={tags} setTags={setTags} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.noteContent}</label>
                    <SimpleEditor content={content} onUpdate={setContent} />
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:px-6 flex flex-row-reverse">
                <button onClick={handleSave} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                    {t.saveNote}
                </button>
                <button onClick={() => setModal({isOpen: false, content: null})} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
                    {t.cancel}
                </button>
                 <button onClick={onDelete} type="button" className="mr-auto px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800">
                    {t.deleteNote}
                </button>
            </div>
            {!note.title && (
                <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">اختر قالب:</label>
                    <select value={template} onChange={e => setTemplate(e.target.value)} className="mt-1 w-full p-2 border rounded">
                        <option value="">بدون قالب</option>
                        <option value="video">ملخص فيديو</option>
                        <option value="tool">تحليل أداة</option>
                    </select>
                </div>
            )}
        </>
    );
}

function JournalEditor({ weekId, dayIndex, prompt }) {
    const { lang, appState, setAppState, translations } = useContext(AppContext);
    const journalEntry = appState.journal[weekId]?.days[dayIndex];
    
    const handleContentChange = (newContent) => {
        setAppState(prev => {
            const newState = JSON.parse(JSON.stringify(prev));
            newState.journal[weekId].days[dayIndex] = {
                content: newContent,
                updatedAt: new Date().toISOString()
            };
            return newState;
        });
    };

    return (
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-200">{prompt.title[lang]}</h3>
            <ul className="list-disc pl-5 rtl:pr-5 space-y-2 text-gray-700 dark:text-gray-300">
                {prompt.points.map((point, i) => <li key={i}>{point[lang]}</li>)}
            </ul>
            <div className="mt-4">
                <SimpleEditor 
                    content={journalEntry?.content || ''}
                    onUpdate={handleContentChange}
                />
            </div>
        </div>
    );
}

function ResourceEditor({ resource, onSave, onDelete }) {
    const { lang, translations, setModal, showToast } = useContext(AppContext);
    const t = translations[lang];
    const [title, setTitle] = useState(resource?.title || '');
    const [url, setUrl] = useState(resource?.url || '');
    const [type, setType] = useState(resource?.type || 'article');
    const [status, setStatus] = useState(resource?.status || 'لم أبدأ');
    const [rating, setRating] = useState(resource?.rating || 0);
    const [tags, setTags] = useState(resource?.tags || []);
    const isEditing = resource !== null;

    const handleSave = (e) => {
        e.preventDefault();
        if (!title.trim() || !url.trim()) {
            showToast(t.fieldRequired, 'error');
            return;
        }
        onSave({ title, url, type, status, rating, tags });
    };

    return (
         <>
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{isEditing ? t.editResource : t.addResource}</h3>
            </div>
            <form onSubmit={handleSave} className="px-4 sm:px-6 py-4 space-y-4">
                <div>
                    <label htmlFor="res-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.resourceTitleLabel}</label>
                    <input id="res-title" type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                </div>
                 <div>
                    <label htmlFor="res-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.resourceUrlLabel}</label>
                    <input id="res-url" type="url" value={url} onChange={e => setUrl(e.target.value)} required className="mt-1 w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" />
                </div>
                 <div>
                    <label htmlFor="res-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.resourceTypeLabel}</label>
                    <select id="res-type" value={type} onChange={e => setType(e.target.value)} className="mt-1 w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                        {Object.entries(t.resourceTypes).map(([key, value]) => <option key={key} value={key}>{value}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">الحالة</label>
                    <select value={status} onChange={e => setStatus(e.target.value)} className="mt-1 w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                        <option>لم أبدأ</option><option>قيد التنفيذ</option><option>مكتملة</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">التقييم</label>
                    <select value={rating} onChange={e => setRating(Number(e.target.value))} className="mt-1 w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md">
                        <option value={0}>بدون</option>
                        <option value={1}>⭐</option>
                        <option value={2}>⭐⭐</option>
                        <option value={3}>⭐⭐⭐</option>
                        <option value={4}>⭐⭐⭐⭐</option>
                        <option value={5}>⭐⭐⭐⭐⭐</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">وسوم</label>
                    <TagInput tags={tags} setTags={setTags} />
                </div>
            </form>
            <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:px-6 flex flex-row-reverse">
                <button type="button" onClick={handleSave} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm">
                    {t.save}
                </button>
                <button type="button" onClick={() => setModal({isOpen: false, content: null})} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto sm:text-sm">
                    {t.cancel}
                </button>
                {isEditing && (
                    <button onClick={onDelete} type="button" className="mr-auto px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800">
                        {t.delete}
                    </button>
                )}
            </div>
        </>
    );
}

function ResourcesSection({ weekId, dayIndex }) {
    const { lang, appState, setAppState, setModal, showToast, translations, Icons } = useContext(AppContext);
    const t = translations[lang];
    const resources = appState.resources[weekId]?.days[dayIndex] || [];
    const [view, setView] = useState('table');
    
    const openResourceModal = (resource, index) => {
        setModal({
            isOpen: true,
            content: <ResourceEditor 
                        resource={resource}
                        onSave={(newResource) => {
                            setAppState(prev => {
                                const newState = JSON.parse(JSON.stringify(prev));
                                const dayResources = newState.resources[weekId].days[dayIndex];
                                if (index !== null && index !== undefined) {
                                    dayResources[index] = newResource;
                                } else {
                                    dayResources.push(newResource);
                                }
                                return newState;
                            });
                            setModal({ isOpen: false, content: null });
                        }}
                        onDelete={() => {
                             setAppState(prev => {
                                const newState = JSON.parse(JSON.stringify(prev));
                                newState.resources[weekId].days[dayIndex].splice(index, 1);
                                return newState;
                            });
                            setModal({ isOpen: false, content: null });
                        }}
                    />
        });
    };
    
    // خصائص متقدمة للموارد
    const advancedResources = resources.map(r => ({
        ...r,
        status: r.status || 'لم أبدأ',
        rating: r.rating || 0,
        tags: r.tags || [],
    }));
    
    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-semibold">{t.suggestedResources}</h4>
                <div className="flex gap-2">
                    <button onClick={() => setView('table')} className={`px-2 py-1 rounded ${view==='table'?'bg-blue-200 dark:bg-blue-700':''}`}>جدول</button>
                    <button onClick={() => setView('gallery')} className={`px-2 py-1 rounded ${view==='gallery'?'bg-blue-200 dark:bg-blue-700':''}`}>بطاقات</button>
                    <button onClick={() => setView('board')} className={`px-2 py-1 rounded ${view==='board'?'bg-blue-200 dark:bg-blue-700':''}`}>لوحة</button>
                    <button onClick={() => openResourceModal(null, null)} className="text-sm font-medium text-blue-600 hover:underline">{t.addResource}</button>
                </div>
            </div>
            <div className="my-2">
                {view==='table' && <ResourceTable resources={advancedResources} onEdit={openResourceModal} />}
                {view==='gallery' && <ResourceGallery resources={advancedResources} onEdit={openResourceModal} />}
                {view==='board' && <ResourceBoard resources={advancedResources} onEdit={openResourceModal} />}
            </div>
        </div>
    );
}

function ProgressCircle({ percentage }) {
  const circumference = 2 * Math.PI * 30;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full" viewBox="0 0 80 80">
        <circle className="text-gray-200 dark:text-gray-600" strokeWidth="8" stroke="currentColor" fill="transparent" r="30" cx="40" cy="40"/>
        <motion.circle
          className="text-blue-600 dark:text-blue-400"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="30"
          cx="40"
          cy="40"
          transform="rotate(-90 40 40)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}

function WeekCard({ weekData }) {
  const { lang, appState, setAppState, translations, Icons, setModal, showToast } = useContext(AppContext);
  const t = translations[lang];
  
  const [activeDayKey, setActiveDayKey] = useState(weekData.days[0].key);
  const [timerSettings, setTimerSettings] = useState({ work: 25, break: 5 });
  const [activeTimer, setActiveTimer] = useState(null);
  const [isWorkSession, setIsWorkSession] = useState(true);
  const [remainingTime, setRemainingTime] = useState(timerSettings.work * 60);

  const activeDayIndex = useMemo(() => findDayIndexByKey(weekData.week, activeDayKey), [weekData, activeDayKey]);
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

function SkillMatrix() {
  const { lang, planData, translations } = useContext(AppContext);
  const t = translations[lang];
  
  const skillLevels = [
    { id: 1, name: "مبتدئ", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    { id: 2, name: "متوسط", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
    { id: 3, name: "متقدم", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" }
  ];

  const cyberSecuritySkills = [
    { id: 1, name: "تحليل الشبكات", category: "التقنيات الأساسية" },
    { id: 2, name: "تحليل السجلات", category: "التقنيات الأساسية" },
    { id: 3, name: "التحقيق في الحوادث", category: "الاستجابة للحوادث" },
    { id: 4, name: "تحليل البرمجيات الخبيثة", category: "الاستجابة للحوادث" },
    { id: 5, name: "أمن الأنظمة", category: "التقنيات الأساسية" },
    { id: 6, name: "استخبارات التهديدات", category: "الدفاع المتقدم" },
    { id: 7, name: "اختبار الاختراق", category: "الهجوم والدفاع" },
    { id: 8, name: "تأمين السحابة", category: "التقنيات المتقدمة" }
  ];

  const [skills, setSkills] = useState(() => {
    const savedSkills = localStorage.getItem('cyberSkillsMatrix_v2');
    return savedSkills ? JSON.parse(savedSkills) : 
      cyberSecuritySkills.map(skill => ({
        ...skill,
        level: 1,
        weeks: [],
        notes: ""
      }));
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
      localStorage.setItem('cyberSkillsMatrix_v2', JSON.stringify(skills));
  }, [skills]);

  const updateSkillLevel = (skillId, newLevel) => {
    setSkills(skills.map(skill => skill.id === skillId ? { ...skill, level: newLevel } : skill));
  };

  const updateSkillNotes = (skillId, notes) => {
    setSkills(skills.map(skill => skill.id === skillId ? { ...skill, notes } : skill));
  };
  
  const calculateCategoryProgress = (category) => {
    const categorySkills = skills.filter(skill => skill.category === category);
    if (categorySkills.length === 0) return 0;
    const totalLevels = categorySkills.reduce((sum, skill) => sum + skill.level, 0);
    const maxPossible = categorySkills.length * 3;
    return Math.round((totalLevels / maxPossible) * 100);
  };

  const filteredSkills = skills.filter(skill => 
      (skill.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (categoryFilter === "" || skill.category === categoryFilter)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">مصفوفة المهارات التفاعلية</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">تتبع تطور مهاراتك في الأمن السيبراني</p>
      </div>

      <div className="p-6">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">بحث بالاسم</label>
            <input type="text" placeholder="ابحث عن مهارة..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">تصفية حسب الفئة</label>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full p-2 border rounded-md dark:bg-gray-700">
              <option value="">كل الفئات</option>
              {Array.from(new Set(skills.map(s => s.category))).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from(new Set(skills.map(s => s.category))).map(category => (
            <div key={category} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <h3 className="font-medium text-sm mb-1">{category}</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${calculateCategoryProgress(category)}%` }}></div></div>
              <p className="text-xs mt-1 text-right">{calculateCategoryProgress(category)}% إتمام</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">المهارة</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">المستوى الحالي</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ملاحظات</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSkills.map((skill) => (
                  <tr key={skill.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{skill.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{skill.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-1 rtl:space-x-reverse">
                        {skillLevels.map(level => (
                          <button key={level.id} onClick={() => updateSkillLevel(skill.id, level.id)} className={`px-3 py-1 text-xs rounded-full ${skill.level === level.id ? level.color : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-200'}`}>
                            {level.name}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="text" value={skill.notes} onChange={(e) => updateSkillNotes(skill.id, e.target.value)} placeholder="أضف ملاحظات..." className="w-full p-2 border rounded-md text-sm dark:bg-gray-700"/>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AchievementsView() {
    const { lang, setView, appState, planData, phases, translations } = useContext(AppContext);
    const t = translations[lang];
    const theme = useContext(AppContext).theme;

    const stats = useMemo(() => {
        if (!appState) return { totalTasks: 0, completedTasks: 0, learningHours: 0, skillStats: {}, totalNotes: 0 };
        let totalTasks = 0, completedTasks = 0, learningHours = 0, totalNotes = 0;
        const skillStats = {};
        planData.forEach(week => {
            week.days.forEach((day, dayIndex) => {
                day.tasks.forEach((task, taskIndex) => {
                    totalTasks++;
                    if (!skillStats[task.type]) skillStats[task.type] = { total: 0, completed: 0 };
                    skillStats[task.type].total++;
                    const dayState = appState.progress[week.week]?.days[dayIndex];
                    if (dayState?.tasks[taskIndex] === 'completed') {
                        completedTasks++;
                        learningHours += task.duration / 60;
                        skillStats[task.type].completed++;
                    }
                });
                const dayNotes = appState.notes[week.week]?.days[dayIndex];
                if(dayNotes) totalNotes += Object.keys(dayNotes).length;
            });
        });
        return { totalTasks, completedTasks, learningHours, skillStats, totalNotes };
    }, [appState, planData]);

    const overallProgress = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;
    
    const chartData = {
        labels: Object.keys(stats.skillStats),
        datasets: [
            { 
                label: t.completedTasks, 
                data: Object.values(stats.skillStats).map(s => s.completed), 
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const doughnutData = {
        labels: Object.keys(phases).map(p => phases[p].title[lang]),
        datasets: [{
            data: Object.keys(phases).map(p => {
                const phaseWeeks = planData.filter(w => w.phase == p);
                let total = 0, completed = 0;
                phaseWeeks.forEach(week => {
                    week.days.forEach((day, dayIndex) => {
                        total += day.tasks.length;
                        if (appState.progress[week.week]?.days[dayIndex]?.tasks) {
                            completed += appState.progress[week.week].days[dayIndex].tasks.filter(s => s === 'completed').length;
                        }
                    });
                });
                return total > 0 ? (completed/total) * 100 : 0;
            }),
            backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6'],
            hoverBackgroundColor: ['#2563EB', '#059669', '#7C3AED'],
            borderColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            borderWidth: 2,
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: t.skillsAnalysis, color: theme === 'dark' ? '#e5e7eb' : '#374151', font: { size: 16, family: 'Inter' } },
        },
        scales: {
            x: { ticks: { color: theme === 'dark' ? '#9ca3af' : '#6b7280', fontFamily: 'Inter' }, grid: { color: 'rgba(128,128,128,0.1)' } },
            y: { grid: { color: 'rgba(128,128,128,0.1)' }, ticks: { color: theme === 'dark' ? '#9ca3af' : '#6b7280', fontFamily: 'Inter' } },
        },
    };
    
     const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { color: theme === 'dark' ? '#e5e7eb' : '#374151', fontFamily: 'Inter' } },
            title: { display: true, text: t.phaseAnalysis, color: theme === 'dark' ? '#e5e7eb' : '#374151', font: { size: 16, family: 'Inter' } },
        },
        cutout: '60%',
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-4 sm:p-8 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 space-y-8">
            <div className="flex justify-between items-center">
                 <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">{t.achievementsTitle}</h1>
                 <button onClick={() => setView({page: 'skill-matrix', params: {}})} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800`}>{t.skillsMatrix}</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg"><p className="text-2xl font-bold">{overallProgress.toFixed(0)}%</p><p className="text-sm text-gray-500 dark:text-gray-400">{t.totalPlanProgress}</p></div>
                <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg"><p className="text-2xl font-bold">{stats.completedTasks}</p><p className="text-sm text-gray-500 dark:text-gray-400">{t.completedTasks}</p></div>
                <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg"><p className="text-2xl font-bold">{stats.learningHours.toFixed(1)}</p><p className="text-sm text-gray-500 dark:text-gray-400">{t.learningHours}</p></div>
                <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-lg"><p className="text-2xl font-bold">{stats.totalNotes}</p><p className="text-sm text-gray-500 dark:text-gray-400">{t.totalNotes}</p></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                    <Bar options={chartOptions} data={chartData} />
                </div>
                <div className="lg:col-span-2 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg h-80">
                    <Doughnut options={doughnutOptions} data={doughnutData} />
                </div>
            </div>
        </div>
    );
}

// --- NOTE CARD WITH BACKLINKS & LINKED NOTES ---
function NoteCard({ note, lang, onClick, allNotes }) {
    // استخراج جميع عناوين الملاحظات
    const allTitles = allNotes ? allNotes.map(n => n.title) : [];
    // استخراج الروابط من محتوى الملاحظة ([[اسم الملاحظة]])
    const extractLinks = (content) => {
        const regex = /\[\[([^\]]+)\]\]/g;
        const links = [];
        let match;
        while ((match = regex.exec(content)) !== null) {
            links.push(match[1]);
        }
        return links;
    };
    // تحويل [[اسم الملاحظة]] إلى رابط تفاعلي
    const renderContentWithLinks = (content) => {
        return content.split(/(\[\[[^\]]+\]\])/g).map((part, i) => {
            const match = part.match(/^\[\[([^\]]+)\]\]$/);
            if (match) {
                const linkedTitle = match[1];
                const linkedNote = allNotes?.find(n => n.title === linkedTitle);
                return linkedNote ? (
                    <span key={i} className="text-blue-600 underline cursor-pointer hover:text-blue-800" onClick={() => onClick(linkedNote)}>
                        [[{linkedTitle}]]
                    </span>
                ) : (
                    <span key={i} className="text-gray-400">[[{linkedTitle}]]</span>
                );
            }
            return <span key={i}>{part}</span>;
        });
    };
    // روابط من هذه الملاحظة
    const outgoingLinks = extractLinks(note.content);
    // روابط إلى هذه الملاحظة (Backlinks)
    const backlinks = allNotes ? allNotes.filter(n => extractLinks(n.content).includes(note.title) && n.title !== note.title) : [];
    return (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition" onClick={() => onClick(note)}>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{note.title}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(note.updatedAt).toLocaleDateString()}</span>
            </div>
            <div className="prose prose-sm dark:prose-invert line-clamp-4 mb-2">
                {renderContentWithLinks(note.content)}
            </div>
            {outgoingLinks.length > 0 && (
                <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                    <b>روابط من هذه الملاحظة:</b> {outgoingLinks.map((l, i) => <span key={i} className="mx-1">[[{l}]]</span>)}
                </div>
            )}
            {backlinks.length > 0 && (
                <div className="mt-2 text-xs text-purple-700 dark:text-purple-300">
                    <b>روابط إلى هذه الملاحظة:</b> {backlinks.map((n, i) => <span key={i} className="mx-1">[[{n.title}]]</span>)}
                </div>
            )}
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{note.taskData?.description?.[lang]}</div>
        </div>
    );
}

// --- GRAPH VIEW COMPONENT ---
function NotesGraphView({ notes, onClose }) {
    // بناء العقد (nodes) والروابط (edges)
    const nodes = notes.map((n, i) => ({ id: i, label: n.title, color: '#3B82F6' }));
    const titleToId = Object.fromEntries(notes.map((n, i) => [n.title, i]));
    const extractLinks = (content) => {
        const regex = /\[\[([^\]]+)\]\]/g;
        const links = [];
        let match;
        while ((match = regex.exec(content)) !== null) {
            links.push(match[1]);
        }
        return links;
    };
    const edges = [];
    notes.forEach((n, i) => {
        extractLinks(n.content).forEach(linkedTitle => {
            if (titleToId[linkedTitle] !== undefined) {
                edges.push({ from: i, to: titleToId[linkedTitle] });
            }
        });
    });
    // رسم SVG بسيط للعقد والروابط (دائري)
    const R = 120;
    const center = 150;
    const nodePos = nodes.map((n, i) => {
        const angle = (2 * Math.PI * i) / nodes.length;
        return {
            ...n,
            x: center + R * Math.cos(angle),
            y: center + R * Math.sin(angle)
        };
    });
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 relative w-[340px] h-[340px]">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-600">✕</button>
                <h3 className="text-lg font-bold mb-2 text-center">العرض البياني للعلاقات</h3>
                <svg width={center*2} height={center*2}>
                    {/* الروابط */}
                    {edges.map((e, i) => (
                        <line key={i} x1={nodePos[e.from].x} y1={nodePos[e.from].y} x2={nodePos[e.to].x} y2={nodePos[e.to].y} stroke="#8884" strokeWidth={2} />
                    ))}
                    {/* العقد */}
                    {nodePos.map((n, i) => (
                        <g key={i}>
                            <circle cx={n.x} cy={n.y} r={22} fill={n.color} />
                            <text x={n.x} y={n.y} textAnchor="middle" alignmentBaseline="middle" fill="#fff" fontSize={12}>{n.label.length > 10 ? n.label.slice(0,10)+'…' : n.label}</text>
                        </g>
                    ))}
                </svg>
                <div className="text-xs text-center mt-2 text-gray-500">كل دائرة تمثل ملاحظة، والخطوط تمثل الروابط بينها</div>
            </div>
        </div>
    );
}

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
                                const dayIndex = findDayIndexByKey(note.weekData.week, note.dayData.key);
                                newState.notes[note.weekData.week].days[dayIndex][note.taskData.id] = { ...newNoteData, updatedAt: new Date().toISOString() };
                                return newState;
                            });
                            setModal({ isOpen: false, content: null });
                        }}
                        onDelete={() => {
                             setAppState(prev => {
                                const newState = JSON.parse(JSON.stringify(prev));
                                const dayIndex = findDayIndexByKey(note.weekData.week, note.dayData.key);
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
            {showGraph && <NotesGraphView notes={allTaskNotes} onClose={()=>setShowGraph(false)} />}
            <div className="overflow-y-auto flex-grow mt-6">
                {activeTab === 'tasks' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allTaskNotes.map(note => (
                            <NoteCard
                                key={note.updatedAt}
                                note={note}
                                lang={lang}
                                onClick={(n) => {
                                    const target = n || note;
                                    setModal({
                                        isOpen: true,
                                        content: <NoteEditor
                                            note={target}
                                            taskDescription={target.taskData.description[lang]}
                                            onSave={(newNoteData) => {
                                                setAppState(prev => {
                                                    const newState = JSON.parse(JSON.stringify(prev));
                                                    const dayIndex = findDayIndexByKey(target.weekData.week, target.dayData.key);
                                                    newState.notes[target.weekData.week].days[dayIndex][target.taskData.id] = { ...newNoteData, updatedAt: new Date().toISOString() };
                                                    return newState;
                                                });
                                                setModal({ isOpen: false, content: null });
                                            }}
                                            onDelete={() => {
                                                setAppState(prev => {
                                                    const newState = JSON.parse(JSON.stringify(prev));
                                                    const dayIndex = findDayIndexByKey(target.weekData.week, target.dayData.key);
                                                    delete newState.notes[target.weekData.week].days[dayIndex][target.taskData.id];
                                                    return newState;
                                                });
                                                setModal({ isOpen: false, content: null });
                                            }}
                                        />
                                    });
                                }}
                                allNotes={allTaskNotes}
                            />
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

// --- RESOURCE BOARD & VIEWS ---
function ResourceBoard({ resources, onEdit }) {
    // عرض لوحة (Board) حسب الحالة
    const states = ['لم أبدأ', 'قيد التنفيذ', 'مكتملة'];
    return (
        <div className="flex gap-4 overflow-x-auto">
            {states.map(state => (
                <div key={state} className="min-w-[220px] bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 flex-1">
                    <h4 className="font-bold text-sm mb-2">{state}</h4>
                    {resources.filter(r => r.status === state).map((res, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-900 rounded p-2 mb-2 shadow cursor-pointer" onClick={() => onEdit(res, idx)}>
                            <div className="font-semibold text-blue-700 dark:text-blue-300">{res.title}</div>
                            <div className="text-xs text-gray-500">{res.type} | {res.rating ? '⭐'.repeat(res.rating) : ''}</div>
                            <div className="text-xs text-gray-400">{res.tags?.join(', ')}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
function ResourceGallery({ resources, onEdit }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((res, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow cursor-pointer" onClick={() => onEdit(res, idx)}>
                    <div className="font-bold text-blue-700 dark:text-blue-300">{res.title}</div>
                    <div className="text-xs text-gray-500">{res.type} | {res.status}</div>
                    <div className="text-xs text-yellow-500">{res.rating ? '⭐'.repeat(res.rating) : ''}</div>
                    <div className="text-xs text-gray-400">{res.tags?.join(', ')}</div>
                </div>
            ))}
        </div>
    );
}
function ResourceTable({ resources, onEdit }) {
    return (
        <table className="min-w-full text-xs">
            <thead><tr><th>العنوان</th><th>النوع</th><th>الحالة</th><th>تقييم</th><th>وسوم</th><th></th></tr></thead>
            <tbody>
                {resources.map((res, idx) => (
                    <tr key={idx} className="border-b">
                        <td>{res.title}</td>
                        <td>{res.type}</td>
                        <td>{res.status}</td>
                        <td>{res.rating ? '⭐'.repeat(res.rating) : ''}</td>
                        <td>{res.tags?.join(', ')}</td>
                        <td><button onClick={() => onEdit(res, idx)} className="text-blue-600">تعديل</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

// --- MAIN APP COMPONENT ---
function App() {
    const [lang, setLang] = useState('ar');
    const [theme, setTheme] = useState('dark');
    const [view, setView] = useState({ page: 'dashboard', params: {} });
    const [appState, setAppState] = useState(null);
    const [modal, setModal] = useState({ isOpen: false, content: null });
    const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

    useEffect(() => {
        // Load settings and data from localStorage
        const savedLang = localStorage.getItem('cyberPlanLang_v15') || 'ar';
        const savedTheme = localStorage.getItem('cyberPlanTheme_v15') || 'dark';
        
        setLang(savedLang);
        setTheme(savedTheme);
        document.documentElement.lang = savedLang;
        document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.className = savedTheme;
        document.body.style.fontFamily = "'Inter', sans-serif";

        const savedState = JSON.parse(localStorage.getItem('cyberPlanProgress_v15') || '{}');
        const initialState = { progress: {}, notes: {}, resources: {}, journal: {} };
        planData.forEach(week => {
            initialState.progress[week.week] = { days: {} };
            initialState.notes[week.week] = { days: {} };
            initialState.journal[week.week] = { days: {} };
            initialState.resources[week.week] = { days: {} };
            week.days.forEach((day, dayIndex) => {
                initialState.progress[week.week].days[dayIndex] = {
                    tasks: savedState.progress?.[week.week]?.days?.[dayIndex]?.tasks || day.tasks.map(() => 'pending'),
                };
                initialState.notes[week.week].days[dayIndex] = savedState.notes?.[week.week]?.days?.[dayIndex] || {};
                initialState.journal[week.week].days[dayIndex] = savedState.journal?.[week.week]?.days?.[dayIndex] || null;
                initialState.resources[week.week].days[dayIndex] = savedState.resources?.[week.week]?.days?.[dayIndex] || day.resources;
            });
        });
        setAppState(initialState);
        
        // Request notification permission for Pomodoro timer
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        if (appState) {
            localStorage.setItem('cyberPlanProgress_v15', JSON.stringify(appState));
        }
    }, [appState]);
    
    const showToast = (message, type = 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'info' }), 3000);
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('cyberPlanTheme_v15', newTheme);
        document.documentElement.className = newTheme;
    };

    const toggleLang = () => {
        const newLang = lang === 'ar' ? 'en' : 'ar';
        setLang(newLang);
        localStorage.setItem('cyberPlanLang_v15', newLang);
        document.documentElement.lang = newLang;
        document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    };
    
    function Layout({ children }) {
        const { lang, theme, toggleTheme, toggleLang, setView, translations, Icons } = useContext(AppContext);
        const t = translations[lang];

        return (
            <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex">
                <aside className="w-20 lg:w-64 bg-white dark:bg-gray-800 p-4 flex flex-col items-center lg:items-start shadow-md">
                    <h1 className="text-xl font-bold mb-8 hidden lg:block">{t.planTitle}</h1>
                    <nav className="space-y-4 w-full">
                        <button onClick={() => setView({page: 'dashboard'})} className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 w-full">
                            <Icons.home className="w-6 h-6 text-gray-600 dark:text-gray-300"/>
                            <span className="hidden lg:inline">{t.home}</span>
                        </button>
                        <button onClick={() => setView({page: 'notebook'})} className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 w-full">
                            <Icons.notebook className="w-6 h-6 text-gray-600 dark:text-gray-300"/>
                            <span className="hidden lg:inline">{t.notebook}</span>
                        </button>
                        <button onClick={() => setView({page: 'achievements'})} className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 w-full">
                            <Icons.achievements className="w-6 h-6 text-gray-600 dark:text-gray-300"/>
                             <span className="hidden lg:inline">{t.achievements}</span>
                        </button>
                    </nav>
                    <div className="mt-auto flex flex-col items-center lg:items-start space-y-4 w-full">
                        <button onClick={toggleTheme} className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 w-full">
                            {theme === 'light' ? <Icons.moon className="w-6 h-6"/> : <Icons.sun className="w-6 h-6"/>}
                            <span className="hidden lg:inline">{t.toggleTheme}</span>
                        </button>
                        <button onClick={toggleLang} className="flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 w-full">
                            <span className="text-xl">🌐</span>
                            <span className="hidden lg:inline">{lang === 'ar' ? 'English' : 'العربية'}</span>
                        </button>
                    </div>
                </aside>
                <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        );
    }
    
    function Dashboard() {
        const { lang, setView, planData, phases, translations } = useContext(AppContext);
        const t = translations[lang];

        return (
            <div className="space-y-12">
                <div>
                    <h1 className="text-4xl font-bold mb-4">{t.planOverview}</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">خطة شاملة لمدة 50 أسبوعًا لتصبح محترفًا في الأمن السيبراني.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Object.entries(phases).map(([id, phase]) => (
                        <motion.div key={id} variants={cardVariants} whileHover="hover"
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg cursor-pointer border border-gray-200 dark:border-gray-700"
                            onClick={() => setView({ page: 'phase', params: { phaseId: id } })}>
                            <div className={`w-12 h-12 rounded-lg ${phase.bg} flex items-center justify-center mb-4`}>
                                <span className="text-2xl font-bold text-white">{id}</span>
                            </div>
                            <h2 className={`text-xl font-bold ${phase.color}`}>{phase.title[lang]}</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">{phase.range[lang]}</p>
                        </motion.div>
                    ))}
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">{t.goToWeek}</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2">
                        {planData.map(week => (
                            <button key={week.week} onClick={() => setView({ page: 'week', params: { weekId: week.week } })}
                                className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-gray-200 dark:border-gray-700">
                                <span className="font-mono font-bold">{week.week}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    function PhaseView({ phaseId }) {
        const { lang, setView, planData, phases, translations } = useContext(AppContext);
        const t = translations[lang];
        const phase = phases[phaseId];
        const weeksInPhase = planData.filter(w => w.phase == phaseId);

        return (
            <div>
                <button onClick={() => setView({page: 'dashboard'})} className="mb-4 text-blue-600 hover:underline">&larr; {t.home}</button>
                <h1 className={`text-3xl font-bold ${phase.color}`}>{phase.title[lang]}</h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">{phase.range[lang]}</p>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {weeksInPhase.map(week => (
                        <motion.div key={week.week} variants={cardVariants} whileHover="hover"
                            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg cursor-pointer border border-gray-200 dark:border-gray-700"
                            onClick={() => setView({ page: 'week', params: { weekId: week.week } })}>
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">{t.weekTitle} {week.week}: {week.title[lang]}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{week.objective[lang]}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }
    
    function Modal() {
        const { modal, setModal } = useContext(AppContext);
        return (
            <AnimatePresence>
                {modal.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                        onClick={() => setModal({isOpen: false, content: null})}
                    >
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden max-w-2xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {modal.content}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }
    
    function Toast({ message, show, type }) {
        const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';
        return (
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className={`fixed bottom-5 right-5 p-4 rounded-lg text-white ${bgColor} shadow-lg z-50`}
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    const contextValue = {
        lang, theme, toggleTheme, toggleLang, 
        view, setView, 
        appState, setAppState,
        modal, setModal,
        showToast,
        planData, phases, translations, Icons,
    };

    if (!appState) {
        return <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">Loading Plan...</div>;
    }
    
    function CurrentView() {
        const { view, planData } = useContext(AppContext);
        switch (view.page) {
            case 'dashboard': return <Dashboard />;
            case 'phase': return <PhaseView phaseId={view.params.phaseId} />;
            case 'week': {
                const weekData = planData.find(w => w.week === view.params.weekId);
                return weekData ? <WeekCard weekData={weekData} /> : <div>Week not found</div>;
            }
            case 'notebook': return <NotebookView />;
            case 'achievements': return <AchievementsView />;
            case 'skill-matrix': return <SkillMatrix />;
            default: return <Dashboard />;
        }
    }

    return (
        <AppContext.Provider value={contextValue}>
            <Layout>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={view.page + (view.params?.weekId || '')}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <CurrentView />
                    </motion.div>
                </AnimatePresence>
            </Layout>
            <Modal />
            <Toast message={toast.message} show={toast.show} type={toast.type} />
        </AppContext.Provider>
    );
}

export default App;
