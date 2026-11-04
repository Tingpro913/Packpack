import type { ChecklistItem } from '../types';

interface RecommendedItem {
  name: string;
  icon: string;
  category: string;
  frequency: number; // 0-1 score
  source: 'user';
}

/**
 * Get recommended items based on user's historical packing data.
 * Only returns recommendations when there's real user history.
 * Returns empty array when user has no historical data (first checklist).
 */
export function getRecommendedItems(
  allHistoryItems: ChecklistItem[],
  currentItemNames: string[],
  limit: number = 8
): RecommendedItem[] {
  // No history data — return empty (no recommendations for first-time users)
  if (allHistoryItems.length === 0) {
    return [];
  }

  // Count frequency across all user's historical items
  const frequencyMap = new Map<string, { count: number; category: string }>();
  
  allHistoryItems.forEach(item => {
    const existing = frequencyMap.get(item.name.toLowerCase());
    if (existing) {
      existing.count += 1;
    } else {
      frequencyMap.set(item.name.toLowerCase(), {
        count: 1,
        category: item.categoryId,
      });
    }
  });
  
  // Convert to array, filter out items already in current list, sort by frequency
  const userFrequent: RecommendedItem[] = Array.from(frequencyMap.entries())
    .filter(([name]) => !currentItemNames.some(n => n.toLowerCase() === name.toLowerCase()))
    .map(([name, data]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      icon: getIconForCategory(data.category),
      category: data.category,
      frequency: Math.min(1, data.count / 3), // normalize, 3+ times = 1.0
      source: 'user' as const,
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, limit);
  
  // Only return if we have actual user-derived recommendations
  return userFrequent;
}

function getIconForCategory(category: string): string {
  const iconMap: Record<string, string> = {
    'Documents': '📄',
    'Electronics': '📱',
    'Clothing': '👕',
    'Toiletries': '🧴',
    'Essentials': '🎒',
    'Health': '💊',
    'Accessories': '🕶️',
    'Shoes': '👟',
    'Bags': '🎒',
  };
  return iconMap[category] || '📦';
}
