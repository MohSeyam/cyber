import React, { useState, useMemo } from 'react';

function JournalEntriesList({ entries, lang }) {
  const [search, setSearch] = useState('');
  const [weekFilter, setWeekFilter] = useState('');
  const allWeeks = useMemo(() => Array.from(new Set(entries.map(e => e.weekData.week))), [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter(entry =>
      (!search || (entry.content && entry.content.toLowerCase().includes(search.toLowerCase()))) &&
      (!weekFilter || entry.weekData.week === parseInt(weekFilter))
    );
  }, [entries, search, weekFilter]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder={lang === 'ar' ? 'بحث في التدوين...' : 'Search journal...'}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="p-2 border rounded-md flex-1 dark:bg-gray-700"
        />
        <select
          value={weekFilter}
          onChange={e => setWeekFilter(e.target.value)}
          className="p-2 border rounded-md min-w-[120px] dark:bg-gray-700"
        >
          <option value="">{lang === 'ar' ? 'كل الأسابيع' : 'All weeks'}</option>
          {allWeeks.map(week => (
            <option key={week} value={week}>{lang === 'ar' ? `الأسبوع ${week}` : `Week ${week}`}</option>
          ))}
        </select>
      </div>
      <div className="space-y-4">
        {filteredEntries.map(entry => (
          <div key={entry.updatedAt} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">{lang === 'ar' ? `الأسبوع ${entry.weekData.week}` : `Week ${entry.weekData.week}`} - {entry.dayData.day[lang]}</p>
            <div className="prose prose-sm dark:prose-invert mt-2" dangerouslySetInnerHTML={{ __html: entry.content }}></div>
          </div>
        ))}
        {filteredEntries.length === 0 && (
          <div className="text-center text-gray-400 py-8">{lang === 'ar' ? 'لا توجد تدوينات مطابقة' : 'No matching journal entries found'}</div>
        )}
      </div>
    </div>
  );
}

export default JournalEntriesList;