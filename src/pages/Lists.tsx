import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useChecklists } from '../hooks/useChecklists';
import { travelTemplates } from '../data/templates/travelScenarios';
import { defaultTemplates } from '../data/templates/defaultTemplates';
import { calculateProgress } from '../services/checklistService';
import Button from '../components/ui/Button';
import { useI18n } from '../contexts/I18nContext';
import { getTranslatedTemplateName } from '../i18n/contentTranslations';

function Lists() {
  const { checklists, loading, deleteChecklist, copyChecklist } = useChecklists();
  const { t, lang } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const activeChecklists = checklists.filter(c => !c.isArchived);
  
  const filteredChecklists = activeChecklists.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = async (id: string) => {
    await deleteChecklist(id);
    setConfirmDelete(null);
  };

  const handleCopy = async (id: string, title: string) => {
    try {
      await copyChecklist(id, `${title} (${lang === 'zh' ? '副本' : 'Copy'})`);
      setCopySuccess(id);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400">{lang === 'zh' ? '加载中...' : 'Loading...'}</div>
      </div>
    );
  }

  // All templates
  const allTemplates = [
    ...travelTemplates,
    ...defaultTemplates,
  ];

  return (
    <div className="px-5 pt-6 pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.lists.title}</h1>
        <p className="text-gray-500 text-lg">
          {t.lists.subtitle}
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder={t.lists.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border-0 rounded-2xl text-gray-900 placeholder-gray-400 shadow-[0_4px_20px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-2 focus:ring-primary-300 focus:shadow-[0_4px_20px_rgba(79,110,245,0.1)] transition-all"
        />
      </div>

      {/* Empty state */}
      {filteredChecklists.length === 0 && !searchQuery && (
        <div className="mb-8">
          <div className="bg-white rounded-3xl p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-500 mb-4">{t.lists.empty}</p>
            <Link to="/create">
              <Button size="sm">{lang === 'zh' ? '创建你的第一个' : 'Create your first'}</Button>
            </Link>
          </div>
        </div>
      )}

      {filteredChecklists.length === 0 && searchQuery && (
        <div className="text-center py-12">
          <p className="text-gray-500">{lang === 'zh' ? '没有找到相关清单' : 'No checklists found'}</p>
        </div>
      )}

      {/* Active Lists */}
      {filteredChecklists.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t.lists.active}</h2>
          <div className="space-y-4">
            {filteredChecklists.map(checklist => (
              <ActiveListItem
                key={checklist.id}
                checklist={checklist}
                formatDate={formatDate}
                onDelete={() => setConfirmDelete(checklist.id)}
                onCopy={() => handleCopy(checklist.id, checklist.title)}
                copySuccess={copySuccess === checklist.id}
                lang={lang}
              />
            ))}
          </div>
        </div>
      )}

      {/* Templates */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t.lists.templates}</h2>
        <div className="grid grid-cols-2 gap-3">
          {allTemplates.map(template => (
            <Link key={template.id} to={`/create?template=${template.id}`} className="block">
              <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all active:scale-[0.98]">
                <div className="text-3xl mb-2">{template.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm truncate">
                  {getTranslatedTemplateName(template.name, lang)}
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  {template.items.length} {lang === 'zh' ? '项' : 'items'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm animate-bounce-in shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {lang === 'zh' ? '删除清单？' : 'Delete Checklist?'}
            </h3>
            <p className="text-gray-500 mb-6">
              {lang === 'zh' 
                ? '这将永久删除该清单及其所有物品，无法恢复。' 
                : 'This will permanently delete the checklist and all its items. This action cannot be undone.'}
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setConfirmDelete(null)}
              >
                {t.common.cancel}
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={() => handleDelete(confirmDelete)}
              >
                {t.common.delete}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Active List Item
// ============================================

interface ListItemProps {
  checklist: any;
  formatDate: (date?: string) => string | null;
  onDelete: () => void;
  onCopy: () => void;
  copySuccess?: boolean;
  lang: string;
}

function ActiveListItem({ checklist, formatDate, onDelete, onCopy, copySuccess, lang }: ListItemProps) {
  const { items } = useChecklistsProgress(checklist.id);
  const progress = calculateProgress(items);
  const isComplete = progress.percentage === 100 && items.length > 0;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all relative">
      <div className="flex items-center justify-between">
        <Link to={`/checklist/${checklist.id}`} className="flex-1 min-w-0 pr-3">
          <h3 className="text-xl font-bold text-gray-900 truncate">
            {checklist.titleUserModified === false && checklist.templateOriginName
              ? getTranslatedTemplateName(checklist.templateOriginName, lang)
              : checklist.title}
          </h3>
          <p className="text-gray-500 mt-1">
            {checklist.departureDate && (
              <span>{formatDate(checklist.departureDate)} · </span>
            )}
            {progress.packed} / {progress.total} {lang === 'zh' ? '已打包' : 'packed'}
          </p>
        </Link>
        <div className="flex items-center gap-1 flex-shrink-0">
          {isComplete ? (
            <div className="w-7 h-7 bg-success-500 rounded-full flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-900 mr-2">{progress.percentage}%</span>
          )}
          {/* Copy button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCopy();
            }}
            className={`p-2 rounded-lg transition-all ${
              copySuccess 
                ? 'bg-success-100 text-success-600' 
                : 'text-gray-300 hover:text-primary-500 hover:bg-primary-50'
            }`}
            title={copySuccess ? (lang === 'zh' ? '已复制！' : 'Copied!') : (lang === 'zh' ? '复制' : 'Duplicate')}
            aria-label="Duplicate checklist"
          >
            {copySuccess ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
          {/* Delete button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
            aria-label="Delete checklist"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
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

export default Lists;
