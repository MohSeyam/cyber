import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AppContext } from '../App';

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

export default SkillMatrix;