import React, { useContext, useMemo } from 'react';
import { AppContext } from '../App';
import StatsSummary from './StatsSummary';
import SkillBarChart from './SkillBarChart';
import PhaseDoughnutChart from './PhaseDoughnutChart';

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
            <StatsSummary overallProgress={overallProgress} stats={stats} t={t} />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <SkillBarChart chartData={chartData} chartOptions={chartOptions} />
                </div>
                <div className="lg:col-span-2">
                    <PhaseDoughnutChart doughnutData={doughnutData} doughnutOptions={doughnutOptions} />
                </div>
            </div>
        </div>
    );
}

export default AchievementsView;