import React from 'react';

function SkillSearchBar({ searchQuery, setSearchQuery, categoryFilter, setCategoryFilter, categories }) {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1">بحث بالاسم</label>
        <input
          type="text"
          placeholder="ابحث عن مهارة..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md dark:bg-gray-700"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">تصفية حسب الفئة</label>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="w-full p-2 border rounded-md dark:bg-gray-700"
        >
          <option value="">كل الفئات</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SkillSearchBar;