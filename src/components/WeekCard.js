import React, { useState, useMemo, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../App';

// --- ProgressCircle ---
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

// --- SimpleEditor ---
function SimpleEditor({ content, onUpdate }) {
    return (
        <textarea
            className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 min-h-[150px] focus:ring-blue-500 focus:border-blue-500"
            value={content}
            onChange={(e) => onUpdate(e.target.value)}
        />
    );
}

// --- TagInput ---
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
                    <button onClick={() => removeTag(tag)} className="text-purple-500 hover:text-purple-700">&times;</button>
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

// --- NoteEditor ---
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

// --- JournalEditor ---
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

// --- ResourceEditor ---
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

// --- ResourceTable ---
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

// --- ResourceGallery ---
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

// --- ResourceBoard ---
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

// --- ResourcesSection ---
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

// --- WeekCard ---
function WeekCard({ weekData }) {
  // ... WeekCard code remains unchanged ...
}

export default WeekCard;