import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AppContext } from '../App';
import SkillSearchBar from './SkillSearchBar';
import CategoryProgressBar from './CategoryProgressBar';
import SkillTable from './SkillTable';

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

  const categories = useMemo(() => Array.from(new Set(skills.map(s => s.category))), [skills]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">مصفوفة المهارات التفاعلية</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">تتبع تطور مهاراتك في الأمن السيبراني</p>
      </div>
      <div className="p-6">
        <SkillSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {categories.map(category => (
            <CategoryProgressBar key={category} category={category} progress={calculateCategoryProgress(category)} />
          ))}
        </div>
        <SkillTable
          skills={filteredSkills}
          skillLevels={skillLevels}
          updateSkillLevel={updateSkillLevel}
          updateSkillNotes={updateSkillNotes}
        />
      </div>
    </div>
  );
}

export default SkillMatrix;