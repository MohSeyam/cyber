import React from 'react';

const TAG_OPTIONS = [
  'مراجعة',
  'مهم',
  'تجربة عملية',
  'ملاحظة',
  'مصطلح جديد',
  'تطبيق',
  'معلومة',
  'سؤال',
  'مصدر',
  'مراجعة لاحقاً',
  'مشكلة',
  'نجاح',
  'تحدي',
  'ملاحظة شخصية',
  'معلومة مهمة',
  'معلومة ثانوية',
  'معلومة متقدمة',
  'معلومة أساسية',
];

function TagInput({ tags, setTags }) {
  const handleSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setTags(selected);
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
      <select
        multiple
        value={tags}
        onChange={handleSelect}
        className="flex-grow bg-transparent p-1 focus:outline-none min-w-[120px]"
      >
        {TAG_OPTIONS.map(option => (
          <option key={option} value={option} disabled={tags.includes(option)}>{option}</option>
        ))}
      </select>
    </div>
  );
}

export default TagInput;