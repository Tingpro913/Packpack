import type { ChecklistItem } from '../types';

// Preset frequently packed items (fallback when there's not enough user data)
const presetFrequentItems = [
  { name: 'Passport', icon: '📄', category: 'Documents' },
  { name: 'Phone Charger', icon: '🔌', category: 'Electronics' },
  { name: 'Sunglasses', icon: '🕶️', category: 'Accessories' },
  { name: 'Toothbrush', icon: '🪥', category: 'Toiletries' },
  { name: 'Headphones', icon: '🎧', category: 'Electronics' },
  { name: 'Wallet', icon: '💳', category: 'Essentials' },
  { name: 'Socks', icon: '🧦', category: 'Clothing' },
  { name: 'Underwear', icon: '🩲', category: 'Clothing' },
  { name: 'T-Shirt', icon: '👕', category: 'Clothing' },
  { name: 'Toothpaste', icon: '🪥', category: 'Toiletries' },
  { name: 'Shampoo', icon: '🧴', category: 'Toiletries' },
  { name: 'Phone', icon: '📱', category: 'Electronics' },
  { name: 'Keys', icon: '🔑', category: 'Essentials' },
  { name: 'Face Mask', icon: '😷', category: 'Health' },
  { name: 'Hand Sanitizer', icon: '🧴', category: 'Health' },
];

interface RecommendedItem {
  name: string;
  icon: string;
  category: string;
  frequency: number; // 0-1 score
  source: 'user' | 'preset';
}

/**
 * Get recommended items based on:
 * 1. User's historical frequency (from all their checklists)
 * 2. Preset common travel items (fallback)
 * 
 * Mixed approach: prioritize user data, fill with presets if needed
 */
export function getRecommendedItems(
  allItems: ChecklistItem[],
  currentItemNames: string[],
  limit: number = 8
): RecommendedItem[] {
  // Count frequency across all user items
  const frequencyMap = new Map<string, { count: number; category: string }>();
  
  allItems.forEach(item => {
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
  
  // Convert to array and sort by frequency
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
  
  // If we have enough user data, return those
  if (userFrequent.length >= limit) {
    return userFrequent.slice(0, limit);
  }
  
  // Fill remaining slots with preset items (excluding what user already has)
  const existingNames = new Set([
    ...currentItemNames.map(n => n.toLowerCase()),
    ...userFrequent.map(i => i.name.toLowerCase()),
  ]);
  
  const presetItems: RecommendedItem[] = presetFrequentItems
    .filter(item => !existingNames.has(item.name.toLowerCase()))
    .map(item => ({
      ...item,
      frequency: 0.3, // preset items have lower priority
      source: 'preset' as const,
    }));
  
  // Mix: user items first, then preset
  const result = [...userFrequent];
  for (const preset of presetItems) {
    if (result.length >= limit) break;
    result.push(preset);
  }
  
  return result;
}

function getIconForCategory(category: string): string {
  const iconMap: Record<string, string> = {
    'Documents': '📄',
    'Electronics': '📱',
    'Clothing': '👕',
    'Toiletries': '🧴',
    'Essentials': '✅',
    'Health': '💊',
    'Accessories': '🕶️',
    'Shoes': '👟',
    'Bags': '🎒',
  };
  return iconMap[category] || '📦';
}
