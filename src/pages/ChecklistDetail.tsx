import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChecklist } from '../hooks/useChecklists';
import { calculateProgress, groupItemsByCategory, calculateBagProgress } from '../services/checklistService';
import { extractCategories } from '../services/categoryService';
import { getRecommendedItems } from '../services/recommendationService';
import { useNotificationSettings, showNotification, getReminderTimestamp } from '../hooks/useNotificationSettings';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { useI18n } from '../contexts/I18nContext';
import { getTranslatedCategory, getTranslatedItemName, getTranslatedTemplateName } from '../i18n/contentTranslations';
import type { ChecklistItem, Bag } from '../types';

function ChecklistDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { checklist, items, bags, loading, addItem, updateItem, deleteItem, togglePacked, addBag, updateBag, deleteBag, assignItemToBag, updateChecklist } = useChecklist(id);
  const { t, lang } = useI18n();
  
  const [showAddItem, setShowAddItem] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<ChecklistItem | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const hasTriggeredCelebration = useRef(false);
  const prevPackedRef = useRef(0);

  // Bag states
  const [showAddBag, setShowAddBag] = useState(false);
  const [editingBag, setEditingBag] = useState<Bag | null>(null);
  const [newBagName, setNewBagName] = useState('');
  const [newBagIcon, setNewBagIcon] = useState('🧳');
  const [assigningItem, setAssigningItem] = useState<ChecklistItem | null>(null);
  const [confirmDeleteBag, setConfirmDeleteBag] = useState<Bag | null>(null);
  // Edit date state
  const [editingDate, setEditingDate] = useState(false);
  const [editDateValue, setEditDateValue] = useState('');
  // Edit title state
  const [editingTitle, setEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);
  // Notification settings (shared global state)
  const { settings, requestPermission, markFired, hasFired } = useNotificationSettings();
  // Drag & Drop states
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverBagId, setDragOverBagId] = useState<string | null>(null);
  // Share sheet
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [copied, setCopied] = useState(false);
  // Recommendations visibility (dismissible via "Not now")
  const [showRecommendations, setShowRecommendations] = useState(true);
  // Active category filter for item list
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const BAG_ICONS = ['🧳', '🎒', '👜', '💼', '👝', '🧺', '📦', '🛍️'];

  const progress = calculateProgress(items);
  const categories = extractCategories(items);
  const groupedItems = groupItemsByCategory(items, categories);
  const isAllPacked = progress.percentage === 100 && items.length > 0;

  // Category color palette - assigns a consistent color per category
  const getCategoryColor = (categoryName: string): { bg: string; text: string; border: string } => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      'Documents': { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      'Clothing': { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' },
      'Toiletries': { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      'Essentials': { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      'Electronics': { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
      'Health': { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      'Entertainment': { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      'Shoes': { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
      'Accessories': { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200' },
      'Food': { bg: 'bg-lime-100', text: 'text-lime-600', border: 'border-lime-200' },
      'Tools': { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
      'Swimwear': { bg: 'bg-sky-100', text: 'text-sky-600', border: 'border-sky-200' },
      'Sun Protection': { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
      'Beach Gear': { bg: 'bg-teal-100', text: 'text-teal-600', border: 'border-teal-200' },
      'Cooking': { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      'Work Gear': { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
      'Formal Wear': { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
      'Ski Gear': { bg: 'bg-sky-100', text: 'text-sky-600', border: 'border-sky-200' },
      'Thermal Wear': { bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-200' },
      'Goggles & Gloves': { bg: 'bg-violet-100', text: 'text-violet-600', border: 'border-violet-200' },
      'Kids Items': { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' },
      'Baby Essentials': { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
      'Backpack Gear': { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
      'Navigation': { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      'Quick-dry Clothes': { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200' },
      'Festival Gear': { bg: 'bg-fuchsia-100', text: 'text-fuchsia-600', border: 'border-fuchsia-200' },
      'Comfort Items': { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      'Pet Supplies': { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
      'Pet Health': { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      'Race Gear': { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      'Nutrition': { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      'Recovery': { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      'Car Essentials': { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
      'Road Snacks': { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      'Hospital Stay': { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      'Packing Supplies': { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
      'Essentials Box': { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      'Cleaning': { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200' },
      'Furniture': { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      'Appearance': { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' },
      'Mental Prep': { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      'Water': { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      'Light & Power': { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
      'First Aid': { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
      'Shelter': { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      'Hygiene': { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
    };
    if (colorMap[categoryName]) return colorMap[categoryName];
    // Fallback: generate a consistent color based on name hash
    const fallbackColors = [
      { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
      { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' },
      { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
      { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
      { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
      { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200' },
      { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
      { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
    ];
    let hash = 0;
    for (let i = 0; i < categoryName.length; i++) {
      hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return fallbackColors[Math.abs(hash) % fallbackColors.length];
  };

  // Get category icon (similar to recommendation service)
  const getCategoryIcon = (categoryName: string): string => {
    const iconMap: Record<string, string> = {
      'Documents': '📄',
      'Electronics': '📱',
      'Clothing': '👕',
      'Toiletries': '🧴',
      'Essentials': '🎒',
      'Health': '💊',
      'Accessories': '🕶️',
      'Shoes': '👟',
      'Entertainment': '🎮',
      'Food': '🍎',
      'Tools': '🔧',
      'Swimwear': '👙',
      'Sun Protection': '☀️',
      'Beach Gear': '🏖️',
      'Cooking': '🍳',
      'Work Gear': '💼',
      'Formal Wear': '👔',
      'Ski Gear': '⛷️',
      'Thermal Wear': '🧥',
      'Goggles & Gloves': '🥽',
      'Kids Items': '👶',
      'Baby Essentials': '🍼',
      'Backpack Gear': '🎒',
      'Navigation': '🧭',
      'Quick-dry Clothes': '👕',
      'Festival Gear': '🎪',
      'Comfort Items': '😌',
      'Pet Supplies': '🐾',
      'Pet Health': '🐕',
      'Race Gear': '🏃',
      'Nutrition': '🥗',
      'Recovery': '💆',
      'Car Essentials': '🚗',
      'Road Snacks': '🍿',
      'Hospital Stay': '🏥',
      'Packing Supplies': '📦',
      'Essentials Box': '📋',
      'Cleaning': '🧹',
      'Furniture': '🛋️',
      'Appearance': '💄',
      'Mental Prep': '🧘',
      'Water': '💧',
      'Light & Power': '💡',
      'First Aid': '🩹',
      'Shelter': '⛺',
      'Hygiene': '🧼',
    };
    return iconMap[categoryName] || '📦';
  };

  // Flat items list based on active category filter
  const filteredItems = activeCategory === 'all'
    ? groupedItems.flatMap(group => group.items)
    : groupedItems.find(g => g.name === activeCategory)?.items || [];

  // Trigger celebration when all items become packed (edge detection)
  // Only triggers when going from "not all packed" to "all packed" via user action
  useEffect(() => {
    const totalItems = items.length;
    const packedCount = progress.packed;
    const prevPacked = prevPackedRef.current;
    
    // Skip during initial load or empty list
    if (loading || totalItems === 0) {
      prevPackedRef.current = packedCount;
      return;
    }
    
    // Trigger only when:
    // - All items are packed now
    // - Previously not all were packed
    // - We haven't already triggered for this state
    if (packedCount === totalItems && prevPacked < totalItems && prevPacked > 0) {
      if (!hasTriggeredCelebration.current) {
        setShowCelebration(true);
        hasTriggeredCelebration.current = true;
      }
    } else if (packedCount < totalItems) {
      // Reset when user unchecks something
      hasTriggeredCelebration.current = false;
    }
    
    prevPackedRef.current = packedCount;
  }, [progress.packed, items.length, loading]);

  // Auto-close celebration after 3 seconds
  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  // Toggle reminders for this checklist
  const toggleReminders = async () => {
    if (!('Notification' in window)) {
      alert('Notifications are not supported in this browser');
      return;
    }
    
    if (settings.enabled) {
      // Just toggle off reminders (use global settings control in Settings page for full disable)
      // For now, tapping the bell in detail page takes you to reminder settings conceptually
      // We'll use it as a quick on/off for this checklist
      return;
    }
    
    const granted = await requestPermission();
    if (granted) {
      showNotification(
        'PackPack Reminders On 🎒',
        `We'll remind you to finish packing for ${checklist?.title || 'your trip'}.`
      );
    }
  };

  // Check for due reminders periodically
  useEffect(() => {
    if (!settings.enabled || !checklist?.departureDate) return;
    
    const checkReminders = () => {
      if (!checklist?.departureDate) return;
      
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      const progress = calculateProgress(items);
      
      const reminderConfigs = [
        { id: '7days', daysBefore: 7, settingKey: 'reminders7day' as const, label: '1 week before' },
        { id: '3days', daysBefore: 3, settingKey: 'reminders3day' as const, label: '3 days before' },
        { id: '1day', daysBefore: 1, settingKey: 'reminders1day' as const, label: '1 day before' },
        { id: 'sameday', daysBefore: 0, settingKey: 'remindersSameDay' as const, label: 'Departure day' },
      ];
      
      reminderConfigs.forEach(config => {
        if (!settings[config.settingKey]) return;
        
        const key = `${checklist.id}-${config.id}`;
        const timestamp = getReminderTimestamp(checklist.departureDate!, config.daysBefore);
        
        // Fire if time has passed within last 12 hours and not yet fired
        if (timestamp <= now && now - timestamp < 12 * oneHour && !hasFired(key)) {
          markFired(key);
          
          const displayTitle = checklist.titleUserModified === false && checklist.templateOriginName
            ? getTranslatedTemplateName(checklist.templateOriginName, lang)
            : checklist.title;
          const title = `🎒 ${displayTitle}`;
          const percent = Math.round(progress.percentage);
          let body = '';
          
          if (config.daysBefore === 0) {
            body = `Today's the day! ${percent}% packed — you got this! Safe travels ✈️`;
          } else if (config.daysBefore === 1) {
            body = `Tomorrow's your trip! Only ${percent}% packed — time to finish up!`;
          } else {
            body = `${config.label} — ${percent}% packed so far. Keep going!`;
          }
          
          showNotification(title, body, key);
        }
      });
    };
    
    // Check immediately
    checkReminders();
    
    // Check every 30 minutes
    const interval = setInterval(checkReminders, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [settings.enabled, checklist?.departureDate, checklist?.id, checklist?.title, items, settings.reminders7day, settings.reminders3day, settings.reminders1day, settings.remindersSameDay, hasFired, markFired]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysUntil = (dateStr?: string): number | null => {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getCountdownText = (days: number | null): string => {
    if (days === null) return '';
    if (days < 0) return t.detail.alreadyDeparted;
    if (days === 0) return t.detail.today;
    if (days === 1) return t.detail.dayLeft;
    if (days <= 7) return t.detail.daysLeft.replace('{n}', String(days));
    const weeks = Math.ceil(days / 7);
    if (days <= 30) return weeks === 1 ? t.detail.weekLeft : t.detail.weeksLeft.replace('{n}', String(weeks));
    const months = Math.ceil(days / 30);
    return months === 1 ? t.detail.monthLeft : t.detail.monthsLeft.replace('{n}', String(months));
  };

  const startEditDate = () => {
    setEditDateValue(checklist?.departureDate || '');
    setEditingDate(true);
  };

  // Final check items (last-minute essentials)
  const finalCheckItems = [
    { id: 'passport', label: t.detail.fcPassport, icon: '📄' },
    { id: 'phone', label: t.detail.fcPhone, icon: '📱' },
    { id: 'wallet', label: t.detail.fcWallet, icon: '💳' },
    { id: 'keys', label: t.detail.fcKeys, icon: '🔑' },
    { id: 'tickets', label: t.detail.fcTickets, icon: '✈️' },
    { id: 'meds', label: t.detail.fcMeds, icon: '💊' },
  ];

  const [finalCheckState, setFinalCheckState] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`finalcheck_${id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleFinalCheck = (itemId: string) => {
    setFinalCheckState(prev => {
      const next = { ...prev, [itemId]: !prev[itemId] };
      try {
        localStorage.setItem(`finalcheck_${id}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const daysUntil = checklist?.departureDate ? getDaysUntil(checklist.departureDate) : null;
  const showFinalCheck = daysUntil !== null && daysUntil <= 1 && daysUntil >= 0;
  const finalCheckProgress = {
    checked: Object.values(finalCheckState).filter(Boolean).length,
    total: finalCheckItems.length,
  };

  // Recommended items (mixed: user frequency + preset)
  const currentItemNames = items.map(i => i.name);
  const recommendedItems = getRecommendedItems([], currentItemNames, 8);

  const handleQuickAddItem = async (name: string, category: string) => {
    await addItem(name, category, 1);
  };

  const handleSaveDate = async () => {
    await updateChecklist({ departureDate: editDateValue || undefined });
    setEditingDate(false);
  };

  const startEditTitle = () => {
    setEditTitleValue(checklist?.title || '');
    setEditingTitle(true);
    setTimeout(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }, 0);
  };

  const handleSaveTitle = async () => {
    const trimmed = editTitleValue.trim();
    if (trimmed && trimmed !== checklist?.title) {
      await updateChecklist({ title: trimmed, titleUserModified: true });
    }
    setEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setEditingTitle(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim() || !newItemCategory.trim()) return;
    
    await addItem(newItemName.trim(), newItemCategory.trim(), newItemQuantity);
    setNewItemName('');
    setNewItemQuantity(1);
    setShowAddItem(false);
  };

  const handleEditItem = async () => {
    if (!editingItem || !editingItem.name.trim()) return;
    
    await updateItem({
      ...editingItem,
      name: editingItem.name.trim(),
      updatedAt: Date.now(),
    });
    setEditingItem(null);
  };

  const handleDeleteItem = async (item: ChecklistItem) => {
    await deleteItem(item.id);
    setConfirmDelete(null);
  };

  // ============================================
  // Bag handlers
  // ============================================

  const openAddBag = () => {
    setNewBagName('');
    setNewBagIcon('🧳');
    setShowAddBag(true);
  };

  const handleAddBag = async () => {
    if (!newBagName.trim()) return;
    await addBag(newBagName.trim(), newBagIcon);
    setNewBagName('');
    setNewBagIcon('🧳');
    setShowAddBag(false);
  };

  const openEditBag = (bag: Bag) => {
    setEditingBag(bag);
    setNewBagName(bag.name);
    setNewBagIcon(bag.icon);
  };

  const handleEditBag = async () => {
    if (!editingBag || !newBagName.trim()) return;
    await updateBag({
      ...editingBag,
      name: newBagName.trim(),
      icon: newBagIcon,
      updatedAt: Date.now(),
    });
    setEditingBag(null);
  };

  const handleDeleteBag = async (bag: Bag) => {
    await deleteBag(bag.id);
    setConfirmDeleteBag(null);
  };

  const openAssignBag = (item: ChecklistItem) => {
    setAssigningItem(item);
  };

  const handleAssignBag = async (bagId: string | null) => {
    if (!assigningItem) return;
    await assignItemToBag(assigningItem, bagId);
    setAssigningItem(null);
  };

  const getBagById = (bagId: string | null): Bag | undefined => {
    if (!bagId) return undefined;
    return bags.find(b => b.id === bagId);
  };

  // ============================================
  // Drag & Drop handlers
  // ============================================

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItemId(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverBagId(null);
  };

  const handleDragOver = (e: React.DragEvent, bagId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverBagId !== bagId) {
      setDragOverBagId(bagId);
    }
  };

  const handleDragLeave = () => {
    setDragOverBagId(null);
  };

  const handleDrop = async (e: React.DragEvent, bagId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    const item = items.find(i => i.id === itemId);
    
    if (item) {
      await assignItemToBag(item, bagId);
    }
    
    setDraggedItemId(null);
    setDragOverBagId(null);
  };

  const handleDropUnassigned = async (e: React.DragEvent) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    const item = items.find(i => i.id === itemId);
    
    if (item) {
      await assignItemToBag(item, null);
    }
    
    setDraggedItemId(null);
    setDragOverBagId(null);
  };
  // Keep for future use (drop zone for unassigned items)
  void handleDropUnassigned;

  const openAddItem = () => {
    if (categories.length > 0) {
      setNewItemCategory(categories[0].name);
    }
    setShowAddItem(true);
  };

  // ============================================
  // Share handlers
  // ============================================

  const generateShareText = (): string => {
    const lines: string[] = [];
    lines.push(`🎒 ${checklist?.title || 'Packing List'}`);
    lines.push('');
    
    if (checklist?.destination) {
      lines.push(`📍 ${checklist.destination}`);
    }
    if (checklist?.departureDate) {
      lines.push(`📅 ${formatDate(checklist.departureDate)}`);
    }
    if (checklist?.destination || checklist?.departureDate) {
      lines.push('');
    }
    
    lines.push(`Progress: ${progress.percentage}% (${progress.packed}/${progress.total} items)`);
    lines.push('');
    
    for (const group of groupedItems) {
      const packedCount = group.items.filter(i => i.packed).length;
      lines.push(`--- ${getTranslatedCategory(group.name, lang)} (${packedCount}/${group.items.length}) ---`);
      for (const item of group.items) {
        const checkbox = item.packed ? '[x]' : '[ ]';
        const qty = item.quantity > 1 ? ` ×${item.quantity}` : '';
        const bag = item.bagId ? ` (${getBagById(item.bagId)?.icon || ''} ${getBagById(item.bagId)?.name || ''})` : '';
        lines.push(`${checkbox} ${item.isTemplateItem ? getTranslatedItemName(item.name, lang) : item.name}${qty}${bag}`);
      }
      lines.push('');
    }
    
    lines.push('---');
    lines.push('Shared via PackPack 🎒');
    
    return lines.join('\n');
  };

  const handleCopyText = async () => {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportJSON = () => {
    const exportData = {
      checklist: {
        title: checklist?.title,
        icon: checklist?.icon,
        destination: checklist?.destination,
        departureDate: checklist?.departureDate,
        createdAt: checklist?.createdAt,
      },
      items: items.map(item => ({
        name: item.name,
        category: item.categoryId,
        quantity: item.quantity,
        packed: item.packed,
        bagId: item.bagId,
      })),
      bags: bags.map(bag => ({
        name: bag.name,
        icon: bag.icon,
      })),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${checklist?.title || 'packing-list'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowShareSheet(false);
  };

  const handleShareNative = async () => {
    if (!navigator.share) {
      handleCopyText();
      return;
    }
    try {
      await navigator.share({
        title: checklist?.title || 'Packing List',
        text: generateShareText(),
      });
      setShowShareSheet(false);
    } catch {
      // User cancelled or not supported
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!checklist) {
    return (
      <div className="px-4 pt-12 text-center">
        <p className="text-gray-500">Checklist not found</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-primary-600 font-medium"
        >
          Go home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50 pb-10">
      {/* Celebration Overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-sm animate-fade-in">
          {/* Close button */}
          <button
            onClick={() => setShowCelebration(false)}
            className="absolute top-6 right-6 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-white transition-all shadow-lg z-10"
            aria-label="Close celebration"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          
          <div className="animate-celebration text-center relative">
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <div className="bg-white rounded-3xl px-10 py-8 shadow-2xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">All Packed!</h2>
              <p className="text-gray-500 text-lg">You're ready to go ✨</p>
              <button
                onClick={() => setShowCelebration(false)}
                className="mt-6 text-primary-500 font-semibold hover:text-primary-600 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
          {/* Confetti dots */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-confetti pointer-events-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px',
                backgroundColor: ['#4F6EF5', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6'][i % 5],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Header - Sticky */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-surface-100 shadow-sm safe-area-top">
        <div className="max-w-lg mx-auto">
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Go back"
              >
                ←
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-2xl flex-shrink-0">{checklist.icon}</span>
                  {editingTitle ? (
                    <input
                      ref={titleInputRef}
                      type="text"
                      value={editTitleValue}
                      onChange={(e) => setEditTitleValue(e.target.value)}
                      onBlur={handleSaveTitle}
                      onKeyDown={handleTitleKeyDown}
                      className="text-lg font-bold text-gray-900 bg-surface-50 border-2 border-primary-300 rounded-lg px-2 py-0.5 w-full max-w-[200px] focus:outline-none focus:ring-2 focus:ring-primary-300"
                    />
                  ) : (
                    <button
                      onClick={startEditTitle}
                      className="text-lg font-bold text-gray-900 truncate text-left hover:text-primary-600 transition-colors group"
                    >
                      {checklist.titleUserModified === false && checklist.templateOriginName
                        ? getTranslatedTemplateName(checklist.templateOriginName, lang)
                        : checklist.title}
                      <span className="ml-1.5 text-gray-300 group-hover:text-primary-400 transition-colors text-sm">✏️</span>
                    </button>
                  )}
                  {checklist.departureDate && getDaysUntil(checklist.departureDate) !== null && (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      getDaysUntil(checklist.departureDate)! <= 3
                        ? 'bg-red-100 text-red-600'
                        : getDaysUntil(checklist.departureDate)! <= 7
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-primary-100 text-primary-600'
                    }`}>
                      ⏰ {getCountdownText(getDaysUntil(checklist.departureDate))}
                    </span>
                  )}
                </div>
                {(checklist.departureDate || checklist.destination || editingDate) && (
                  <div className="mt-0.5">
                    {editingDate ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={editDateValue}
                          onChange={(e) => setEditDateValue(e.target.value)}
                          className="px-2 py-1 text-sm bg-white border border-primary-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveDate}
                          className="px-2 py-1 text-xs font-semibold text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
                        >
                          {t.detail.save}
                        </button>
                        <button
                          onClick={() => setEditingDate(false)}
                          className="px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {t.detail.cancel}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={startEditDate}
                        className="text-sm text-gray-500 hover:text-primary-500 transition-colors flex items-center gap-1"
                      >
                        {checklist.destination && <span>{checklist.destination}</span>}
                        {checklist.destination && checklist.departureDate && ' · '}
                        {checklist.departureDate && (
                          <span>{formatDate(checklist.departureDate)}</span>
                        )}
                        {!checklist.departureDate && (
                          <span className="text-primary-500">+ {t.detail.addDateShort}</span>
                        )}
                        <span className="text-xs">✏️</span>
                      </button>
                    )}
                  </div>
                )}
                {!checklist.departureDate && !checklist.destination && (
                  <button
                    onClick={startEditDate}
                    className="text-sm text-primary-500 hover:text-primary-600 font-medium mt-0.5 flex items-center gap-1"
                  >
                    📅 {t.detail.addDate}
                  </button>
                )}
              </div>
              {/* Reminder bell */}
              {checklist.departureDate && (
                <button
                  onClick={toggleReminders}
                  className={`p-2 rounded-full transition-all relative ${
                    settings.enabled
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                  title={settings.enabled ? 'Reminders on' : 'Turn on reminders'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {settings.enabled && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
                  )}
                </button>
              )}
              {/* Share button */}
              <button
                onClick={() => setShowShareSheet(true)}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                title={t.common.share}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>

            {/* Progress bar in header */}
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <ProgressBar
                  percentage={progress.percentage}
                  color={progress.percentage === 100 ? 'success' : 'primary'}
                />
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{progress.percentage}%</p>
                <p className="text-xs text-gray-500">{progress.packed}/{progress.total}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - natural flow, page scrolls overall */}
      <div className="max-w-lg mx-auto w-full px-4 pt-4">
          
          {/* Region 1: Recommendation Card (top, no scroll) */}
          {showRecommendations && recommendedItems.length > 0 && items.length > 0 && (
            <div className="flex-shrink-0 mb-2">
              <div className="bg-white rounded-xl shadow-sm border border-surface-200 p-3">
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">
                  ✨ {t.detail.youUsuallyPack}
                </h3>
                <p className="text-xs text-gray-500 mb-2">
                  <span className="font-medium text-gray-700">
                    {getTranslatedItemName(recommendedItems[0].name, lang)}
                  </span>
                  {' '}{t.detail.appearsInTrips}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleQuickAddItem(recommendedItems[0].name, recommendedItems[0].category)}
                    className="flex-1 px-3 py-2 bg-primary-500 text-white rounded-lg font-semibold text-xs hover:bg-primary-600 transition-colors shadow-sm"
                  >
                    + {t.detail.addItemShort} {getTranslatedItemName(recommendedItems[0].name, lang)}
                  </button>
                  <button
                    onClick={() => setShowRecommendations(false)}
                    className="px-3 py-2 bg-white text-gray-600 rounded-lg font-medium text-xs border border-surface-200 hover:bg-surface-50 transition-colors"
                  >
                    {t.detail.notNow}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Completion banner */}
          {isAllPacked && (
            <div className="flex-shrink-0 mb-3">
              <div className="bg-success-50 border border-success-100 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-1">🎉</div>
                <h2 className="text-base font-bold text-gray-900">You're all packed!</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Everything on your checklist has been prepared.
                </p>
              </div>
            </div>
          )}

          {/* Final Check - shown 1 day before and on departure day */}
          {showFinalCheck && (
            <div className="flex-shrink-0 mb-3">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xl">
                    ⚡
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-sm">{t.detail.finalCheck}</h3>
                    <p className="text-xs text-gray-500">
                      {daysUntil === 0 ? t.detail.fcDepartureDay : t.detail.fcLeavingTomorrow}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-amber-600">
                      {finalCheckProgress.checked}/{finalCheckProgress.total}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {finalCheckItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleFinalCheck(item.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-left transition-all ${
                        finalCheckState[item.id]
                          ? 'bg-success-100 border border-success-200'
                          : 'bg-white/80 border border-amber-100 hover:border-amber-300'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className={`text-xs font-medium flex-1 ${
                        finalCheckState[item.id] ? 'text-success-700 line-through opacity-70' : 'text-gray-700'
                      }`}>
                        {item.label}
                      </span>
                      {finalCheckState[item.id] && (
                        <span className="text-success-500 text-sm">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                
                {finalCheckProgress.checked === finalCheckProgress.total && (
                  <div className="mt-3 text-center text-success-600 text-xs font-medium">
                    ✅ All set! Have an amazing trip!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Region 2: Category Tabs + Item List (middle, list scrolls internally) */}
          {items.length > 0 && (
            <div className="mt-2">
              {/* Category Tabs - horizontal scroll */}
              <div className="mb-2 -mx-4 px-4">
                <div className="flex gap-1.5 overflow-x-auto pb-1 bags-scrollbar">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center justify-center ${
                      activeCategory === 'all'
                        ? 'bg-primary-500 text-white font-bold shadow-sm'
                        : 'bg-white text-gray-500 border border-surface-200 hover:border-primary-300'
                    }`}
                  >
                    {t.detail.allCategory}
                  </button>
                  {categories.map(cat => {
                    const isActive = activeCategory === cat.name;
                    const catColor = getCategoryColor(cat.name);
                    const catItemCount = groupedItems.find(g => g.name === cat.name)?.items.length || 0;
                    if (catItemCount === 0) return null;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.name)}
                        className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center justify-center relative ${
                          isActive
                            ? 'bg-primary-500 text-white font-bold shadow-sm'
                            : 'bg-white text-gray-500 border border-surface-200 hover:border-primary-300'
                        }`}
                      >
                        {!isActive && <span className={`w-1.5 h-1.5 rounded-full absolute left-2 ${catColor.bg.replace('100', '400')}`}></span>}
                        {getTranslatedCategory(cat.name, lang)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Item List - vertical scroll (about 6-8 items visible) */}
              <div className="max-h-[360px] overflow-y-auto -mx-4 px-4 pb-2">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">No items in this category</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {filteredItems.map(item => {
                      const bag = getBagById(item.bagId);
                      const catColor = getCategoryColor(item.categoryId);
                      const catIcon = getCategoryIcon(item.categoryId);
                      return (
                        <div
                          key={item.id}
                          className={`bg-white rounded-lg shadow-sm border border-surface-100 flex items-center gap-2.5 px-2.5 py-2 transition-all ${
                            draggedItemId === item.id ? 'opacity-50 bg-primary-50 scale-[0.98]' : 'hover:shadow-md hover:border-primary-200'
                          }`}
                          draggable={bags.length > 0 ? true : undefined}
                          onDragStart={(e) => handleDragStart(e, item.id)}
                          onDragEnd={handleDragEnd}
                        >
                          {/* Category Icon */}
                          <div className={`w-9 h-9 rounded-lg ${catColor.bg} ${catColor.border} border flex items-center justify-center text-base flex-shrink-0`}>
                            {catIcon}
                          </div>

                          {/* Item Info */}
                          <div className="flex-1 min-w-0" onClick={() => openAssignBag(item)}>
                            <p className={`font-medium text-sm truncate ${
                              item.packed ? 'text-gray-400 line-through' : 'text-gray-900'
                            }`}>
                              {item.isTemplateItem ? getTranslatedItemName(item.name, lang) : item.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`text-xs ${catColor.text} font-medium`}>
                                {getTranslatedCategory(item.categoryId, lang)}
                              </span>
                              <span className="text-gray-300">·</span>
                              <span className="text-xs text-gray-400">
                                {item.quantity > 1 ? `x${item.quantity}` : '1 pc'}
                              </span>
                              {bag && (
                                <>
                                  <span className="text-gray-300">·</span>
                                  <span className="text-xs text-primary-500 font-medium flex items-center gap-0.5">
                                    <span>{bag.icon}</span>
                                    <span>{bag.name}</span>
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-1 text-gray-300 hover:text-gray-500 transition-colors text-sm"
                              aria-label="Edit item"
                            >
                              ✏️
                            </button>
                            {/* Circular Checkbox */}
                            <button
                              onClick={() => togglePacked(item)}
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ml-1 ${
                                item.packed
                                  ? 'bg-primary-500 border-primary-500 text-white shadow-sm'
                                  : 'border-surface-300 hover:border-primary-400 bg-white'
                              }`}
                              aria-label={item.packed ? 'Unmark as packed' : 'Mark as packed'}
                            >
                              {item.packed && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Empty state */}
          {items.length === 0 && (
            <div className="py-12 text-center">
              <div className="text-center">
                <div className="text-5xl mb-4">📋</div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">No items yet</h2>
                <p className="text-gray-500 mb-6">
                  Start adding items to your checklist
                </p>
                <Button onClick={openAddItem}>+ Add First Item</Button>
              </div>
            </div>
          )}

          {/* Empty bags state - only show when there are items but no bags */}
          {items.length > 0 && bags.length === 0 && (
            <div className="flex-shrink-0 mt-2">
              <div className="bg-white rounded-lg border border-dashed border-gray-200 p-2.5 text-center">
                <div className="text-xl mb-0.5">🧳</div>
                <p className="text-[11px] text-gray-500 mb-1">
                  {t.detail.organizePacking}
                </p>
                <button
                  onClick={openAddBag}
                  className="text-primary-500 text-[11px] font-medium hover:text-primary-600"
                >
                  {t.detail.addFirstBag}
                </button>
              </div>
            </div>
          )}

          {/* Region 3: Bags - Horizontal Cards (bottom, no scroll) */}
          {bags.length > 0 && items.length > 0 && (
            <div className="flex-shrink-0 mt-2">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] text-gray-400 font-medium">
                  {t.detail.dragToPack}
                </p>
                <button
                  onClick={openAddBag}
                  className="text-[11px] text-primary-500 font-medium hover:text-primary-600 flex items-center gap-1"
                >
                  <span className="text-sm leading-none">+</span>
                  {t.detail.addBag}
                </button>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-1.5 -mx-4 px-4 bags-scrollbar">
                {bags.map(bag => {
                  const bagProgress = calculateBagProgress(bag.id, items);
                  const isDragOver = dragOverBagId === bag.id;
                  const isDraggingAny = !!draggedItemId;
                  const bagItemCount = items.filter(i => i.bagId === bag.id).length;
                  return (
                    <div
                      key={bag.id}
                      className={`flex-shrink-0 w-28 rounded-xl transition-all duration-200 cursor-pointer overflow-hidden ${
                        isDragOver
                          ? 'bg-primary-500 text-white scale-105 shadow-xl ring-2 ring-primary-300'
                          : isDraggingAny
                            ? 'bg-white shadow-lg border-2 border-primary-300 scale-[1.02]'
                            : 'bg-white shadow-md border border-surface-200 hover:shadow-lg hover:border-primary-200'
                      }`}
                      onClick={() => openEditBag(bag)}
                      onDragOver={(e) => handleDragOver(e, bag.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, bag.id)}
                    >
                      {/* Bag Visual */}
                      <div className={`pt-2.5 pb-1 flex items-center justify-center ${
                        isDragOver ? 'bg-primary-400/30' : 'bg-surface-50'
                      }`}>
                        <div className="relative">
                          <span className={`text-3xl transition-transform ${isDragOver ? 'scale-110 animate-bounce' : ''}`}>
                            {bag.icon}
                          </span>
                          {/* 3D effect shadow */}
                          <div className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-1 rounded-full blur-sm ${
                            isDragOver ? 'bg-primary-700/20' : 'bg-gray-300/40'
                          }`}></div>
                        </div>
                      </div>
                      
                      {/* Bag Info */}
                      <div className="px-2.5 py-2">
                        <p className={`text-xs font-semibold truncate ${
                          isDragOver ? 'text-white' : 'text-gray-900'
                        }`}>
                          {bag.name}
                        </p>
                        <p className={`text-[10px] mt-0.5 ${
                          isDragOver ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {bagItemCount} {bagItemCount === 1 ? 'item' : 'items'}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="mt-1.5 h-1 rounded-full overflow-hidden bg-surface-100">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              isDragOver ? 'bg-white' : bagProgress.percentage === 100 ? 'bg-success-500' : 'bg-primary-500'
                            }`}
                            style={{ width: `${bagProgress.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {draggedItemId && (
                <p className="text-center text-xs text-primary-500 font-medium mt-1 animate-pulse">
                  👆 Drop on a bag to pack
                </p>
              )}
            </div>
          )}
        </div>

      {/* Floating add button */}
      {items.length > 0 && (
        <button
          onClick={openAddItem}
          className="fixed bottom-24 right-4 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 hover:shadow-xl transition-all flex items-center justify-center text-2xl z-40"
          aria-label={t.detail.addItem}
        >
          +
        </button>
      )}

      {/* Add Bag Bottom Sheet */}
      {showAddBag && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-[60] animate-fade-in" onClick={() => setShowAddBag(false)}>
          <div className="w-full max-w-md bg-white rounded-t-3xl animate-slide-up flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <div className="px-6 pt-5 pb-4 border-b border-surface-100">
              <h3 className="text-lg font-bold text-gray-900">{t.detail.addBagTitle}</h3>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.detail.bagName}
                </label>
                <input
                  type="text"
                  value={newBagName}
                  onChange={e => setNewBagName(e.target.value)}
                  placeholder={t.detail.bagNamePlaceholder}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Icon
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {BAG_ICONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewBagIcon(icon)}
                      className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all ${
                        newBagIcon === icon
                          ? 'bg-primary-50 border-2 border-primary-400 scale-105'
                          : 'bg-surface-50 border-2 border-transparent hover:bg-surface-100'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-surface-100 flex-shrink-0 safe-area-bottom">
              <Button
                variant="primary"
                fullWidth
                onClick={handleAddBag}
                disabled={!newBagName.trim()}
              >
                Add Bag
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Bag Bottom Sheet */}
      {editingBag && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-[60] animate-fade-in" onClick={() => setEditingBag(null)}>
          <div className="w-full max-w-md bg-white rounded-t-3xl animate-slide-up flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <div className="px-6 pt-5 pb-4 border-b border-surface-100">
              <h3 className="text-lg font-bold text-gray-900">Edit Bag</h3>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bag Name
                </label>
                <input
                  type="text"
                  value={newBagName}
                  onChange={e => setNewBagName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Icon
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {BAG_ICONS.map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewBagIcon(icon)}
                      className={`aspect-square rounded-xl text-2xl flex items-center justify-center transition-all ${
                        newBagIcon === icon
                          ? 'bg-primary-50 border-2 border-primary-400 scale-105'
                          : 'bg-surface-50 border-2 border-transparent hover:bg-surface-100'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setConfirmDeleteBag(editingBag)}
                className="w-full py-3 text-red-500 font-medium hover:bg-red-50 rounded-xl transition-colors"
              >
                🗑️ Delete Bag
              </button>
            </div>
            <div className="px-6 py-4 border-t border-surface-100 flex-shrink-0 safe-area-bottom flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setEditingBag(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={handleEditBag}
                disabled={!newBagName.trim()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Bag Confirmation */}
      {confirmDeleteBag && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Bag?</h3>
            <p className="text-gray-500 mb-6">
              The bag "{confirmDeleteBag.name}" will be removed. Items in this bag will be unassigned (but not deleted).
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setConfirmDeleteBag(null)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteBag(confirmDeleteBag)}
                fullWidth
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Bag Bottom Sheet */}
      {assigningItem && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-[60] animate-fade-in" onClick={() => setAssigningItem(null)}>
          <div className="w-full max-w-md bg-white rounded-t-3xl animate-slide-up flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <div className="px-6 pt-5 pb-4 border-b border-surface-100">
              <h3 className="text-lg font-bold text-gray-900">Assign to Bag</h3>
              <p className="text-sm text-gray-500 mt-1">"{assigningItem.name}"</p>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
              {/* No bag option */}
              <button
                onClick={() => handleAssignBag(null)}
                className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                  !assigningItem.bagId
                    ? 'bg-primary-50 border-2 border-primary-400'
                    : 'bg-surface-50 border-2 border-transparent hover:bg-surface-100'
                }`}
              >
                <div className="text-2xl">📋</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Not packed yet</p>
                  <p className="text-sm text-gray-500">Keep in checklist</p>
                </div>
                {!assigningItem.bagId && (
                  <span className="text-primary-500 text-xl">✓</span>
                )}
              </button>

              {bags.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-400 mb-3">No bags yet</p>
                  <button
                    onClick={() => {
                      setAssigningItem(null);
                      openAddBag();
                    }}
                    className="text-primary-500 text-sm font-medium"
                  >
                    + Create a bag first
                  </button>
                </div>
              )}

              {bags.map(bag => {
                const isSelected = assigningItem.bagId === bag.id;
                return (
                  <button
                    key={bag.id}
                    onClick={() => handleAssignBag(bag.id)}
                    className={`w-full p-4 rounded-xl text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-primary-50 border-2 border-primary-400'
                        : 'bg-surface-50 border-2 border-transparent hover:bg-surface-100'
                    }`}
                  >
                    <div className="text-2xl">{bag.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{bag.name}</p>
                      <p className="text-sm text-gray-500">
                        {items.filter(i => i.bagId === bag.id).length} items
                      </p>
                    </div>
                    {isSelected && (
                      <span className="text-primary-500 text-xl">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="px-6 py-4 border-t border-surface-100 flex-shrink-0 safe-area-bottom">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setAssigningItem(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Bottom Sheet */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-[60] animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-t-3xl animate-slide-up flex flex-col max-h-[85vh] mb-0">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-surface-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">{t.detail.addItem}</h2>
              <button
                onClick={() => setShowAddItem(false)}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600"
                aria-label={t.detail.close}
              >
                ✕
              </button>
            </div>

            {/* Scrollable content */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <div className="space-y-5">
                {/* Item name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.detail.itemName}
                  </label>
                  <input
                    type="text"
                    placeholder={t.detail.itemNamePlaceholder}
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full px-4 py-3.5 bg-surface-50 border border-surface-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 focus:bg-white transition-all"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddItem();
                    }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.detail.category}
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-4 py-3.5 bg-surface-50 border border-surface-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 focus:bg-white transition-all appearance-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {getTranslatedCategory(cat.name, lang)}
                      </option>
                    ))}
                    <option value="__new__">{t.detail.newCategory}</option>
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.detail.quantity}
                  </label>
                  <div className="flex items-center gap-4 bg-surface-50 rounded-2xl p-2 border border-surface-200">
                    <button
                      onClick={() => setNewItemQuantity(Math.max(1, newItemQuantity - 1))}
                      className="w-12 h-12 rounded-xl bg-white text-gray-600 font-bold text-xl hover:bg-surface-100 transition-colors shadow-sm"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center font-bold text-xl text-gray-900">
                      {newItemQuantity}
                    </span>
                    <button
                      onClick={() => setNewItemQuantity(newItemQuantity + 1)}
                      className="w-12 h-12 rounded-xl bg-white text-gray-600 font-bold text-xl hover:bg-surface-100 transition-colors shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Save Button */}
            <div className="px-6 pt-4 pb-6 border-t border-surface-100 flex-shrink-0 safe-area-bottom">
              <Button
                size="lg"
                fullWidth
                onClick={handleAddItem}
                disabled={!newItemName.trim() || !newItemCategory.trim()}
              >
                {t.detail.saveItem}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Bottom Sheet */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-[60] animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-t-3xl animate-slide-up flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-surface-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">{t.detail.editItemTitle}</h2>
              <button
                onClick={() => setEditingItem(null)}
                className="p-2 -mr-2 text-gray-400 hover:text-gray-600"
                aria-label={t.detail.close}
              >
                ✕
              </button>
            </div>

            {/* Scrollable content */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <div className="space-y-5">
                {/* Item name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.detail.itemName}
                  </label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full px-4 py-3.5 bg-surface-50 border border-surface-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 focus:bg-white transition-all"
                    autoFocus
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.detail.quantity}
                  </label>
                  <div className="flex items-center gap-4 bg-surface-50 rounded-2xl p-2 border border-surface-200">
                    <button
                      onClick={() => setEditingItem({
                        ...editingItem,
                        quantity: Math.max(1, editingItem.quantity - 1),
                      })}
                      className="w-12 h-12 rounded-xl bg-white text-gray-600 font-bold text-xl hover:bg-surface-100 transition-colors shadow-sm"
                    >
                      −
                    </button>
                    <span className="flex-1 text-center font-bold text-xl text-gray-900">
                      {editingItem.quantity}
                    </span>
                    <button
                      onClick={() => setEditingItem({
                        ...editingItem,
                        quantity: editingItem.quantity + 1,
                      })}
                      className="w-12 h-12 rounded-xl bg-white text-gray-600 font-bold text-xl hover:bg-surface-100 transition-colors shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.detail.category}
                  </label>
                  <select
                    value={editingItem.categoryId}
                    onChange={(e) => setEditingItem({ ...editingItem, categoryId: e.target.value })}
                    className="w-full px-4 py-3.5 bg-surface-50 border border-surface-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300 focus:bg-white transition-all appearance-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {getTranslatedCategory(cat.name, lang)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Sticky Action Buttons */}
            <div className="px-6 pt-4 pb-6 border-t border-surface-100 flex-shrink-0 safe-area-bottom">
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    setConfirmDelete(editingItem);
                    setEditingItem(null);
                  }}
                >
                  {t.detail.delete}
                </Button>
                <Button
                  size="lg"
                  fullWidth
                  onClick={handleEditItem}
                  disabled={!editingItem.name.trim()}
                >
                  {t.detail.saveChanges}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
          <Card className="p-6 w-full max-w-sm animate-bounce-in">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete "{confirmDelete.name}"?
            </h3>
            <p className="text-gray-500 mb-6">
              This item will be removed from your checklist.
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={() => handleDeleteItem(confirmDelete)}
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Share Sheet Bottom Sheet */}
      {showShareSheet && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-[60] animate-fade-in" onClick={() => setShowShareSheet(false)}>
          <div className="w-full max-w-md bg-white rounded-t-3xl animate-slide-up flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <div className="px-6 pb-2">
              <h3 className="text-lg font-bold text-gray-900 text-center">{t.share.title}</h3>
              <p className="text-sm text-gray-500 text-center mt-1">
                {checklist?.title}
              </p>
            </div>

            {/* Share options */}
            <div className="px-6 py-5 space-y-2">
              {/* Native share */}
              <button
                onClick={handleShareNative}
                className="w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 bg-surface-50 border-2 border-transparent hover:bg-primary-50 hover:border-primary-200"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-2xl">
                  📤
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{t.share.shareVia}</p>
                  <p className="text-sm text-gray-500">{t.share.shareViaDesc}</p>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              {/* Copy text */}
              <button
                onClick={handleCopyText}
                className="w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 bg-surface-50 border-2 border-transparent hover:bg-success-50 hover:border-success-200"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all ${
                  copied ? 'bg-success-100' : 'bg-gray-100'
                }`}>
                  {copied ? '✅' : '📋'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {copied ? t.share.copied : t.share.copyText}
                  </p>
                  <p className="text-sm text-gray-500">
                    {copied ? t.share.copiedDesc : t.share.copyTextDesc}
                  </p>
                </div>
                <span className="text-gray-400">›</span>
              </button>

              {/* Export JSON */}
              <button
                onClick={handleExportJSON}
                className="w-full p-4 rounded-xl text-left transition-all flex items-center gap-4 bg-surface-50 border-2 border-transparent hover:bg-amber-50 hover:border-amber-200"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl">
                  📄
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{t.share.exportJson}</p>
                  <p className="text-sm text-gray-500">{t.share.exportJsonDesc}</p>
                </div>
                <span className="text-gray-400">›</span>
              </button>
            </div>

            {/* Preview */}
            <div className="px-6 pb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t.share.preview}</p>
              <div className="bg-surface-50 rounded-xl p-4 max-h-40 overflow-y-auto border border-surface-200">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed">
                  {generateShareText().slice(0, 300)}
                  {generateShareText().length > 300 && '\n...'}
                </pre>
              </div>
            </div>

            {/* Cancel button */}
            <div className="px-6 py-4 border-t border-surface-100 flex-shrink-0 safe-area-bottom">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowShareSheet(false)}
              >
                {t.share.cancel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Checklist Item Row
// ============================================

interface ChecklistItemRowProps {
  item: ChecklistItem;
  bagName?: string;
  bagIcon?: string;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAssignBag: () => void;
  draggable?: boolean;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

function ChecklistItemRow({ item, bagName, bagIcon, onToggle, onEdit, onDelete, onAssignBag, draggable, isDragging, onDragStart, onDragEnd }: ChecklistItemRowProps) {
  const { t, lang } = useI18n();
  return (
    <div 
      className={`flex items-center gap-3 px-4 py-3.5 hover:bg-surface-50 transition-all ${
        isDragging ? 'opacity-50 bg-primary-50' : ''
      }`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      {/* Drag handle */}
      {draggable !== false && (
        <div 
          className={`cursor-grab active:cursor-grabbing flex-shrink-0 p-1.5 rounded-md transition-all ${
            draggable 
              ? 'text-gray-500 hover:text-primary-500 hover:bg-primary-50 hover:scale-110' 
              : 'text-gray-300'
          }`}
          title={draggable ? "Drag to pack into a bag" : "Add a bag first to use drag & drop"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="2" />
            <circle cx="15" cy="6" r="2" />
            <circle cx="9" cy="12" r="2" />
            <circle cx="15" cy="12" r="2" />
            <circle cx="9" cy="18" r="2" />
            <circle cx="15" cy="18" r="2" />
          </svg>
        </div>
      )}

      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          item.packed
            ? 'bg-success-500 border-success-500 text-white'
            : 'border-surface-300 hover:border-primary-400'
        }`}
        aria-label={item.packed ? 'Unmark as packed' : 'Mark as packed'}
      >
        {item.packed && <span className="text-sm">✓</span>}
      </button>

      {/* Item info */}
      <div className="flex-1 min-w-0" onClick={onAssignBag}>
        <p className={`font-medium truncate ${
          item.packed ? 'text-gray-400 line-through' : 'text-gray-900'
        }`}>
          {item.isTemplateItem ? getTranslatedItemName(item.name, lang) : item.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          {item.quantity > 1 && (
            <span className="text-sm text-gray-400">× {item.quantity}</span>
          )}
          {bagName && (
            <>
              {item.quantity > 1 && <span className="text-gray-300">·</span>}
              <span className="text-xs text-primary-500 font-medium flex items-center gap-1">
                <span>{bagIcon}</span>
                <span>{bagName}</span>
              </span>
            </>
          )}
          {!bagName && !item.packed && (
            <span className="text-xs text-gray-400">{t.detail.tapOrDrag}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onAssignBag}
          className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
          aria-label="Assign to bag"
          title="Assign to bag"
        >
          🧳
        </button>
        <button
          onClick={onEdit}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Edit item"
        >
          ✏️
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete item"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default ChecklistDetail;

// Keep ChecklistItemRow exported for reuse / backward compatibility
export { ChecklistItemRow };
