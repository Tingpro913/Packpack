// ============================================
// Category Service
// Manages categories within a checklist
// Note: Categories are derived from items for simplicity in Phase 1
// In future phases, categories can become their own stored entities
// ============================================

import type { ChecklistItem, Category } from '../types';
import { generateId } from '../types';

// Extract unique categories from items
export function extractCategories(items: ChecklistItem[]): Category[] {
  const categoryMap = new Map<string, Category>();
  
  items.forEach((item, index) => {
    if (!categoryMap.has(item.categoryId)) {
      categoryMap.set(item.categoryId, {
        id: item.categoryId,
        name: item.categoryId, // In Phase 1, categoryId is the name
        order: index,
      });
    }
  });
  
  return Array.from(categoryMap.values()).sort((a, b) => a.order - b.order);
}

// Create a new category (just returns a Category object,
// actual persistence happens when items with this category are saved)
export function createCategory(name: string, order: number = 0): Category {
  return {
    id: generateId(),
    name,
    order,
  };
}

// Rename a category across all items
export function renameCategoryInItems(
  items: ChecklistItem[],
  categoryId: string,
  newName: string
): ChecklistItem[] {
  return items.map(item => {
    if (item.categoryId === categoryId) {
      return { ...item, categoryId: newName, updatedAt: Date.now() };
    }
    return item;
  });
}

// Move items to a different category
export function moveItemToCategory(
  item: ChecklistItem,
  newCategoryId: string
): ChecklistItem {
  return {
    ...item,
    categoryId: newCategoryId,
    updatedAt: Date.now(),
  };
}
