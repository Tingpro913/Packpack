import { useMemo } from 'react';
import { useChecklists } from '../hooks/useChecklists';
import Card from '../components/ui/Card';
import { useI18n } from '../contexts/I18nContext';
import { getTranslatedTemplateName, getTranslatedCategory } from '../i18n/contentTranslations';
import type { ChecklistItem } from '../types';

function Stats() {
  const { checklists, allItems, loading } = useChecklists();
  const { t, lang } = useI18n();

  // Calculate per-checklist progress from real items
  const checklistProgressMap = useMemo(() => {
    const map: Record<string, { total: number; packed: number; percentage: number }> = {};
    const itemsByChecklist: Record<string, ChecklistItem[]> = {};
    
    allItems.forEach(item => {
      if (!itemsByChecklist[item.checklistId]) {
        itemsByChecklist[item.checklistId] = [];
      }
      itemsByChecklist[item.checklistId].push(item);
    });
    
    Object.entries(itemsByChecklist).forEach(([checklistId, items]) => {
      const packed = items.filter(i => i.packed).length;
      const total = items.length;
      map[checklistId] = {
        total,
        packed,
        percentage: total > 0 ? Math.round((packed / total) * 100) : 0,
      };
    });
    
    return map;
  }, [allItems]);

  // Top stats cards
  const stats = useMemo(() => {
    const activeChecklists = checklists.filter(c => !c.isArchived);
    // Completed = checklists with 100% progress (not necessarily archived)
    const completedChecklists = checklists.filter(c => {
      const progress = checklistProgressMap[c.id];
      return progress && progress.percentage === 100 && progress.total > 0;
    });
    
    // Count unique categories from active checklists
    const categoryIds = new Set<string>();
    allItems.forEach(item => {
      // Only count items in active (non-archived) checklists
      const checklist = checklists.find(c => c.id === item.checklistId);
      if (checklist && !checklist.isArchived) {
        categoryIds.add(item.categoryId);
      }
    });
    
    return {
      totalChecklists: checklists.length,
      activeChecklists: activeChecklists.length,
      completedChecklists: completedChecklists.length,
      totalCategories: categoryIds.size,
    };
  }, [checklists, allItems, checklistProgressMap]);

  // Overall progress across all active checklists
  const overallProgress = useMemo(() => {
    const activeChecklistIds = new Set(
      checklists.filter(c => !c.isArchived).map(c => c.id)
    );
    const activeItems = allItems.filter(i => activeChecklistIds.has(i.checklistId));
    if (activeItems.length === 0) return { percentage: 0, packed: 0, remaining: 0, total: 0 };
    
    const packed = activeItems.filter(i => i.packed).length;
    return {
      percentage: Math.round((packed / activeItems.length) * 100),
      packed,
      remaining: activeItems.length - packed,
      total: activeItems.length,
    };
  }, [checklists, allItems]);

  // Category distribution (count items by category across all active checklists)
  const categoryDistribution = useMemo(() => {
    const activeChecklistIds = new Set(
      checklists.filter(c => !c.isArchived).map(c => c.id)
    );
    const catCount: Record<string, number> = {};
    
    allItems.forEach(item => {
      if (!activeChecklistIds.has(item.checklistId)) return;
      const catId = item.categoryId;
      catCount[catId] = (catCount[catId] || 0) + item.quantity;
    });
    
    // Sort by count descending, take top 6
    const sorted = Object.entries(catCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
    
    const colors = ['#4F6EF5', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
    
    return sorted.map(([catId, count], index) => ({
      id: catId,
      name: getTranslatedCategory(catId, lang),
      count,
      color: colors[index % colors.length],
    }));
  }, [checklists, allItems, lang]);

  const maxCatCount = Math.max(...categoryDistribution.map(c => c.count), 1);

  // Recent checklists with real progress
  const recentChecklists = useMemo(() => {
    return checklists
      .filter(c => !c.isArchived)
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
      .slice(0, 5)
      .map(checklist => {
        const progress = checklistProgressMap[checklist.id] || { percentage: 0, total: 0, packed: 0 };
        return {
          ...checklist,
          progress: progress.percentage,
        };
      });
  }, [checklists, checklistProgressMap]);

  // Achievements based on real data
  const achievements = useMemo(() => {
    const activeChecklistIds = new Set(
      checklists.filter(c => !c.isArchived).map(c => c.id)
    );
    const activeItems = allItems.filter(i => activeChecklistIds.has(i.checklistId));
    const totalItems = activeItems.reduce((sum, i) => sum + i.quantity, 0);
    const packedItems = activeItems.filter(i => i.packed).reduce((sum, i) => sum + i.quantity, 0);
    
    // Find the fastest completed checklist (most items packed in shortest time)
    // For now just check if any checklist is 100% packed
    const hasCompletedList = checklists.some(c => {
      const progress = checklistProgressMap[c.id];
      return progress && progress.percentage === 100 && progress.total > 0;
    });
    
    return [
      { icon: '🌱', label: t.stats.badgeFirstList, unlocked: checklists.length > 0 },
      { icon: '📦', label: t.stats.badge10Items, unlocked: totalItems >= 10 },
      { icon: '🎯', label: t.stats.badge100Packed, unlocked: packedItems >= 100 },
      { icon: '⚡', label: t.stats.badgeSpeed, unlocked: hasCompletedList },
    ];
  }, [checklists, allItems, checklistProgressMap, t.stats]);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (overallProgress.percentage / 100) * circumference;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400">{t.stats.loading}</div>
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
              <span className="text-2xl font-bold text-gray-900">{overallProgress.percentage}%</span>
              <span className="text-xs text-gray-500">{t.stats.complete}</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{t.stats.overallProgress}</h3>
            <p className="text-sm text-gray-500 mb-4">{t.stats.overallDesc}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t.stats.packedItems}</span>
                <span className="font-semibold text-gray-900">{overallProgress.packed}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t.stats.remaining}</span>
                <span className="font-semibold text-gray-900">{overallProgress.remaining}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Category Distribution */}
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t.stats.itemsByCategory}</h3>
        {categoryDistribution.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-400 text-sm">{t.stats.emptyTip}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {categoryDistribution.map((cat, index) => (
              <div key={cat.id} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-sm text-gray-700 w-24 flex-shrink-0 truncate">{cat.name}</span>
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
        )}
      </Card>

      {/* Recent Checklists Progress */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t.stats.recentLists}</h3>
        {recentChecklists.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-gray-500 text-sm">{t.stats.emptyTip}</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentChecklists.map((checklist, index) => (
              <ChecklistProgressRow
                key={checklist.id}
                title={checklist.titleUserModified === false && checklist.templateOriginName
                  ? getTranslatedTemplateName(checklist.templateOriginName, lang)
                  : checklist.title}
                icon={checklist.icon}
                percentage={checklist.progress}
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
          {achievements.map((badge) => (
            <div
              key={badge.label}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                badge.unlocked ? 'bg-white shadow-md' : 'bg-surface-100 opacity-50'
              }`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <span className="text-xs font-medium text-gray-600 text-center px-1">{badge.label}</span>
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
