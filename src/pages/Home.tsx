import { Link } from 'react-router-dom';
import { useChecklists } from '../hooks/useChecklists';
import { calculateProgress } from '../services/checklistService';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { useI18n } from '../contexts/I18nContext';
import { getTranslatedTemplateName } from '../i18n/contentTranslations';

function Home() {
  const { checklists, loading } = useChecklists();
  const { t, lang } = useI18n();
  
  const activeChecklists = checklists.filter(c => !c.isArchived);
  const hasChecklists = activeChecklists.length > 0;
  
  // Get the most recently updated checklist as "upcoming"
  const upcomingChecklist = activeChecklists[0];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400">{lang === 'zh' ? '加载中...' : 'Loading...'}</div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-8">
      {/* Header with Logo and Bell */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Pack<span className="text-primary-500">Pack</span>
        </div>
        <button className="w-11 h-11 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-600 hover:bg-surface-50 transition-colors">
          <BellIcon />
        </button>
      </div>

      {/* Greeting */}
      <div className="mb-8 animate-slide-up animate-fill-forwards" style={{ animationDelay: '50ms' }}>
        <h1 className="text-4xl font-bold text-gray-900 mb-2 leading-tight">
          {t.home.greeting}
        </h1>
        <p className="text-gray-500 text-lg">
          {t.home.subtitle}
        </p>
      </div>

      {/* Upcoming trip card */}
      {upcomingChecklist && (
        <div className="mb-8 animate-slide-up animate-fill-forwards" style={{ animationDelay: '100ms' }}>
          <UpcomingTripCard checklist={upcomingChecklist} formatDate={formatDate} />
        </div>
      )}

      {/* Quick Start */}
      <div className="mb-8 animate-slide-up animate-fill-forwards" style={{ animationDelay: '150ms' }}>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t.home.quickStart}</h2>
        <Link to="/create" className="block">
          <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all active:scale-[0.99]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary-50 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                ✈️
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900">
                  {t.home.createNew}
                </h3>
                <p className="text-gray-500 mt-0.5">
                  {lang === 'zh' ? '旅行 · 住院 · 搬家 · 自定义' : 'Travel · Hospital · Moving · Custom'}
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Lists */}
      <div className="animate-slide-up animate-fill-forwards" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{t.home.recent}</h2>
          {hasChecklists && (
            <Link to="/lists" className="text-primary-500 font-semibold text-sm hover:text-primary-600">
              {t.home.viewAll}
            </Link>
          )}
        </div>

        {/* Empty state */}
        {!hasChecklists && (
          <div className="bg-white rounded-3xl p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <div className="text-5xl mb-4">🧳</div>
            <p className="text-gray-500 mb-4">{t.home.empty}</p>
            <Link to="/create">
              <Button size="sm">{lang === 'zh' ? '创建你的第一个' : 'Create your first'}</Button>
            </Link>
          </div>
        )}

        {/* Recent list items */}
        <div className="space-y-4">
          {activeChecklists.slice(0, 3).map((checklist, index) => (
            <div
              key={checklist.id}
              className="animate-slide-up animate-fill-forwards"
              style={{ animationDelay: `${250 + index * 100}ms` }}
            >
              <RecentListItem checklist={checklist} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Upcoming Trip Card (with circular progress)
// ============================================

function UpcomingTripCard({ checklist, formatDate }: { checklist: any; formatDate: (d?: string) => string | null }) {
  const { items } = useChecklistsProgress(checklist.id);
  const progress = calculateProgress(items);
  const { t, lang } = useI18n();

  const subtitleParts = [];
  if (checklist.tripDuration) subtitleParts.push(`${checklist.tripDuration} ${lang === 'zh' ? '天' : 'days'}`);
  if (checklist.tripType) subtitleParts.push(checklist.tripType.charAt(0).toUpperCase() + checklist.tripType.slice(1));
  if (checklist.climate) subtitleParts.push(checklist.climate.charAt(0).toUpperCase() + checklist.climate.slice(1));
  if (subtitleParts.length === 0 && checklist.destination) subtitleParts.push(checklist.destination);

  return (
    <Link to={`/checklist/${checklist.id}`} className="block">
      <div className="bg-gradient-to-br from-primary-50 to-white rounded-3xl p-6 shadow-[0_8px_30px_rgba(79,110,245,0.15)] hover:shadow-[0_12px_40px_rgba(79,110,245,0.2)] transition-all active:scale-[0.99] border border-primary-100/50">
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xl">{checklist.icon}</span>
              <h3 className="text-2xl font-bold text-gray-900 truncate">
                {checklist.titleUserModified === false && checklist.templateOriginName
                  ? getTranslatedTemplateName(checklist.templateOriginName, lang)
                  : checklist.title}
              </h3>
            </div>
            <p className="text-gray-500 text-base">
              {subtitleParts.join(' · ')}
            </p>
          </div>
          {/* Circular Progress */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="#E0E7FF"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="#4F6EF5"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - progress.percentage / 100)}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">{progress.percentage}%</span>
            </div>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="mb-3">
          <ProgressBar percentage={progress.percentage} size="sm" />
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-gray-500 text-sm">
            {progress.packed} / {progress.total} {lang === 'zh' ? '件已打包' : 'items packed'}
          </p>
          {checklist.departureDate && (
            <p className="text-gray-500 text-sm">
              {formatDate(checklist.departureDate)}
            </p>
          )}
        </div>

        {/* Continue Packing Button */}
        <Button size="lg" fullWidth>
          {t.home.continuePacking}
        </Button>
      </div>
    </Link>
  );
}

// ============================================
// Recent List Item
// ============================================

function RecentListItem({ checklist }: { checklist: any }) {
  const { items } = useChecklistsProgress(checklist.id);
  const progress = calculateProgress(items);
  const { lang } = useI18n();

  return (
    <Link to={`/checklist/${checklist.id}`} className="block">
      <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all active:scale-[0.99]">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="text-xl font-bold text-gray-900 truncate">
              {checklist.titleUserModified === false && checklist.templateOriginName
                ? getTranslatedTemplateName(checklist.templateOriginName, lang)
                : checklist.title}
            </h3>
            <p className="text-gray-500 mt-1">
              {progress.packed} / {progress.total} {lang === 'zh' ? '已打包' : 'packed'} · {progress.percentage}%
            </p>
          </div>
          <div className="flex-shrink-0">
            {checklist.destination ? (
              <span className="text-xl">{checklist.icon}</span>
            ) : (
              <span className="text-xl">{checklist.icon}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================
// Bell Icon
// ============================================

function BellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// ============================================
// Helper hook for progress data
// ============================================

import { useChecklist } from '../hooks/useChecklists';

function useChecklistsProgress(id: string) {
  const { items } = useChecklist(id);
  return { items };
}

export default Home;
