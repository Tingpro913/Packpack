import { useMemo } from 'react';
import { useChecklists } from '../hooks/useChecklists';
import Card from '../components/ui/Card';
import { useI18n } from '../contexts/I18nContext';
import { getTranslatedTemplateName } from '../i18n/contentTranslations';

function Stats() {
  const { checklists, loading } = useChecklists();
  const { t, lang } = useI18n();

  const stats = useMemo(() => {
    const activeChecklists = checklists.filter(c => !c.isArchived);
    const completedChecklists = checklists.filter(c => c.isArchived);
    return {
      totalChecklists: checklists.length,
      activeChecklists: activeChecklists.length,
      completedChecklists: completedChecklists.length,
      totalCategories: new Set(checklists.map(c => c.category)).size,
    };
  }, [checklists]);

  const checklistStats = useMemo(() => {
    return checklists
      .filter(c => !c.isArchived)
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      .slice(0, 5);
  }, [checklists]);

  const categoryDistribution = [
    { name: t.stats.complete === '完成度' ? '衣物' : 'Clothing', count: 12, color: '#4F6EF5' },
    { name: t.stats.complete === '完成度' ? '洗漱用品' : 'Toiletries', count: 8, color: '#22c55e' },
    { name: t.stats.complete === '完成度' ? '电子设备' : 'Electronics', count: 6, color: '#f59e0b' },
    { name: t.stats.complete === '完成度' ? '证件' : 'Documents', count: 4, color: '#ec4899' },
    { name: t.stats.complete === '完成度' ? '其他' : 'Other', count: 5, color: '#8b5cf6' },
  ];

  const maxCatCount = Math.max(...categoryDistribution.map(c => c.count), 1);
  const overallProgress = checklists.length > 0 ? 35 : 0;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (overallProgress / 100) * circumference;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400">{t.stats.complete === '完成度' ? '加载中...' : 'Loading stats...'}</div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{t.stats.title}</h1>
        <p className="text-gray-500">{t.stats.subtitle}</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard icon="📋" label={t.stats.totalLists} value={stats.totalChecklists} color="primary" />
        <StatCard icon="✅" label={t.stats.completed} value={stats.completedChecklists} color="success" />
        <StatCard icon="🎒" label={t.stats.active} value={stats.activeChecklists} color="amber" />
        <StatCard icon="📊" label={t.stats.categories} value={stats.totalCategories} color="pink" />
      </div>

      {/* Overall Progress Ring */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <svg width="120" height="120" className="transform -rotate-90">
              <circle cx="60" cy="60" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="45" fill="none" stroke="#4F6EF5"
                strokeWidth="10" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{overallProgress}%</span>
              <span className="text-xs text-gray-500">{t.stats.complete}</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{t.stats.overallProgress}</h3>
            <p className="text-sm text-gray-500 mb-4">{t.stats.overallDesc}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t.stats.packedItems}</span>
                <span className="font-semibold text-gray-900">{Math.round(overallProgress * 0.8)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t.stats.remaining}</span>
                <span className="font-semibold text-gray-900">{Math.round(overallProgress * 0.2)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Category Distribution */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t.stats.itemsByCategory}</h3>
        <div className="space-y-3">
          {categoryDistribution.map((cat, index) => (
            <div key={cat.name} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-sm text-gray-700 w-24 flex-shrink-0">{cat.name}</span>
              <div className="flex-1 h-6 bg-surface-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${(cat.count / maxCatCount) * 100}%`, backgroundColor: cat.color, transitionDelay: `${index * 100}ms` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900 w-8 text-right">{cat.count}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Checklists Progress */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t.stats.recentLists}</h3>
        {checklistStats.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-gray-500 text-sm">{t.stats.emptyTip}</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {checklistStats.map((checklist, index) => (
              <ChecklistProgressRow
                key={checklist.id}
                title={checklist.titleUserModified === false && checklist.templateOriginName
                  ? getTranslatedTemplateName(checklist.templateOriginName, lang)
                  : checklist.title}
                icon={checklist.icon}
                percentage={Math.min(index * 25 + 10, 100)}
                delay={index * 100}
              />
            ))}
          </div>
        )}
      </div>

      {/* Achievements */}
      <Card className="p-6 bg-gradient-to-br from-primary-50 to-surface-50">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-4xl">🏆</div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{t.stats.achievements}</h3>
            <p className="text-sm text-gray-500">{t.stats.achievementsDesc}</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: '🌱', label: t.stats.badgeFirstList, unlocked: checklists.length > 0 },
            { icon: '📦', label: t.stats.badge10Items, unlocked: true },
            { icon: '🎯', label: t.stats.badge100Packed, unlocked: false },
            { icon: '⚡', label: t.stats.badgeSpeed, unlocked: false },
          ].map((badge) => (
            <div
              key={badge.label}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                badge.unlocked ? 'bg-white shadow-md' : 'bg-surface-100 opacity-50'
              }`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-xs font-medium text-gray-600">{badge.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  color: 'primary' | 'success' | 'amber' | 'pink';
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    amber: 'bg-amber-100 text-amber-600',
    pink: 'bg-pink-100 text-pink-600',
  };
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center text-xl mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </Card>
  );
}

interface ChecklistProgressRowProps {
  title: string;
  icon: string;
  percentage: number;
  delay: number;
}

function ChecklistProgressRow({ title, icon, percentage, delay }: ChecklistProgressRowProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center text-xl flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-medium text-gray-900 truncate">{title}</p>
            <span className="text-sm font-semibold text-gray-700 ml-2">{percentage}%</span>
          </div>
          <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percentage}%`, transitionDelay: `${delay}ms` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default Stats;
