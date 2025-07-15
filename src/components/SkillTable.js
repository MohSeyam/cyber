import React from 'react';

function SkillTable({ skills, skillLevels, updateSkillLevel, updateSkillNotes }) {
  return (
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
          {skills.map((skill) => (
            <tr key={skill.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{skill.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{skill.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center space-x-1 rtl:space-x-reverse">
                  {skillLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => updateSkillLevel(skill.id, level.id)}
                      className={`px-3 py-1 text-xs rounded-full ${skill.level === level.id ? level.color : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-200'}`}
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={skill.notes}
                  onChange={e => updateSkillNotes(skill.id, e.target.value)}
                  placeholder="أضف ملاحظات..."
                  className="w-full p-2 border rounded-md text-sm dark:bg-gray-700"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SkillTable;