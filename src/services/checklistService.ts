// ============================================
// Checklist Service
// Business logic for checklist operations
// ============================================

import {
  addChecklist,
  getChecklist,
  getAllChecklists,
  updateChecklist,
  deleteChecklist,
  getChecklistItems,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  bulkAddItems,
  addBag,
  getBags,
  updateBag,
  deleteBag,
} from '../storage/db';
import type {
  Checklist,
  ChecklistItem,
  Category,
  TemplateItem,
  ChecklistCategory,
  Bag,
} from '../types';
import { generateId } from '../types';

// ============================================
// Checklist operations
// ============================================

export async function createChecklist(
  title: string,
  category: ChecklistCategory,
  icon: string,
  meta: Partial<Checklist> = {}
): Promise<Checklist> {
  const now = Date.now();
  const checklist: Checklist = {
    id: generateId(),
    title,
    category,
    icon,
    createdAt: now,
    updatedAt: now,
    isArchived: false,
    ...meta,
  };
  
  await addChecklist(checklist);
  return checklist;
}

export async function fetchChecklist(id: string): Promise<Checklist | undefined> {
  return getChecklist(id);
}

export async function fetchAllChecklists(): Promise<Checklist[]> {
  return getAllChecklists();
}

export async function modifyChecklist(checklist: Checklist): Promise<void> {
  await updateChecklist(checklist);
}

export async function removeChecklist(id: string): Promise<void> {
  await deleteChecklist(id);
}

export async function copyChecklist(id: string, newTitle?: string): Promise<Checklist | undefined> {
  const original = await getChecklist(id);
  if (!original) return undefined;
  
  const items = await getChecklistItems(id);
  
  // Create new checklist
  const now = Date.now();
  const newChecklist: Checklist = {
    ...original,
    id: generateId(),
    title: newTitle || `${original.title} (Copy)`,
    createdAt: now,
    updatedAt: now,
    isArchived: false,
  };
  
  await addChecklist(newChecklist);
  
  // Copy items
  if (items.length > 0) {
    const newItems: ChecklistItem[] = items.map(item => ({
      ...item,
      id: generateId(),
      checklistId: newChecklist.id,
      bagId: null, // Bags are not copied in Phase 1
      packed: false, // Reset packed status
      createdAt: now,
      updatedAt: now,
    }));
    await bulkAddItems(newItems);
  }
  
  return newChecklist;
}

// ============================================
// Item operations
// ============================================

export async function createItem(
  checklistId: string,
  name: string,
  categoryId: string,
  quantity: number = 1
): Promise<ChecklistItem> {
  const now = Date.now();
  const item: ChecklistItem = {
    id: generateId(),
    checklistId,
    name,
    categoryId,
    quantity,
    packed: false,
    bagId: null,
    createdAt: now,
    updatedAt: now,
  };
  
  await addChecklistItem(item);
  return item;
}

export async function fetchItems(checklistId: string): Promise<ChecklistItem[]> {
  return getChecklistItems(checklistId);
}

export async function modifyItem(item: ChecklistItem): Promise<void> {
  await updateChecklistItem(item);
}

export async function removeItem(id: string): Promise<void> {
  await deleteChecklistItem(id);
}

export async function toggleItemPacked(item: ChecklistItem): Promise<void> {
  await updateChecklistItem({
    ...item,
    packed: !item.packed,
    updatedAt: Date.now(),
  });
}

// ============================================
// Template → Checklist conversion
// ============================================

export async function createChecklistFromTemplateItems(
  title: string,
  category: ChecklistCategory,
  icon: string,
  templateItems: TemplateItem[],
  meta: Partial<Checklist> = {}
): Promise<{ checklist: Checklist; items: ChecklistItem[]; categories: Category[] }> {
  // Create the checklist first — store original template name for translation
  const checklist = await createChecklist(title, category, icon, {
    templateOriginName: meta.templateOriginName || title,
    titleUserModified: false,
    ...meta,
  });
  
  // Extract unique categories from template items
  // Use category name as the ID for simplicity (categories are derived from items)
  const categoryNames = [...new Set(templateItems.map(item => item.category))];
  const categories: Category[] = categoryNames.map((name, index) => ({
    id: name,
    name,
    order: index,
  }));
  
  // Convert template items to checklist items — mark as template items for translation
  const now = Date.now();
  const items: ChecklistItem[] = templateItems.map(templateItem => ({
    id: generateId(),
    checklistId: checklist.id,
    name: templateItem.name,
    categoryId: templateItem.category,
    quantity: templateItem.quantity,
    packed: false,
    bagId: null,
    createdAt: now,
    updatedAt: now,
    isTemplateItem: true,
  }));
  
  // Bulk add items
  if (items.length > 0) {
    await bulkAddItems(items);
  }
  
  return { checklist, items, categories };
}

// ============================================
// Progress calculation
// ============================================

export interface PackingProgress {
  total: number;
  packed: number;
  percentage: number;
}

export function calculateProgress(items: ChecklistItem[]): PackingProgress {
  const total = items.length;
  const packed = items.filter(item => item.packed).length;
  const percentage = total === 0 ? 0 : Math.round((packed / total) * 100);
  
  return { total, packed, percentage };
}

// ============================================
// Category grouping
// ============================================

export interface CategoryWithItems {
  id: string;
  name: string;
  items: ChecklistItem[];
}

export function groupItemsByCategory(
  items: ChecklistItem[],
  categories: Category[]
): CategoryWithItems[] {
  // Sort categories by order
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
  
  return sortedCategories.map(category => ({
    id: category.id,
    name: category.name,
    items: items
      .filter(item => item.categoryId === category.id)
      .sort((a, b) => a.createdAt - b.createdAt),
  })).filter(group => group.items.length > 0);
}

// ============================================
// Bag operations
// ============================================

export async function createBag(
  checklistId: string,
  name: string,
  icon: string = '🧳',
  color?: string
): Promise<Bag> {
  const existingBags = await getBags(checklistId);
  const now = Date.now();
  const bag: Bag = {
    id: generateId(),
    checklistId,
    name,
    icon,
    order: existingBags.length,
    color,
    createdAt: now,
    updatedAt: now,
  };
  
  await addBag(bag);
  return bag;
}

export async function fetchBags(checklistId: string): Promise<Bag[]> {
  return getBags(checklistId);
}

export async function modifyBag(bag: Bag): Promise<void> {
  await updateBag(bag);
}

export async function removeBag(bagId: string): Promise<void> {
  await deleteBag(bagId);
}

export async function assignItemToBag(item: ChecklistItem, bagId: string | null): Promise<ChecklistItem> {
  const updatedItem = {
    ...item,
    bagId,
    // Auto-pack when assigning to a bag
    packed: bagId ? true : item.packed,
    updatedAt: Date.now(),
  };
  await updateChecklistItem(updatedItem);
  return updatedItem;
}

export async function reorderBags(checklistId: string, bagIds: string[]): Promise<void> {
  const bags = await getBags(checklistId);
  for (let i = 0; i < bagIds.length; i++) {
    const bag = bags.find(b => b.id === bagIds[i]);
    if (bag) {
      await updateBag({ ...bag, order: i, updatedAt: Date.now() });
    }
  }
}

// ============================================
// Bag progress calculation
// ============================================

export interface BagProgress {
  bagId: string;
  total: number;
  packed: number;
  percentage: number;
}

export function calculateBagProgress(
  bagId: string,
  items: ChecklistItem[]
): BagProgress {
  const bagItems = items.filter(item => item.bagId === bagId);
  const total = bagItems.length;
  const packed = bagItems.filter(item => item.packed).length;
  const percentage = total === 0 ? 0 : Math.round((packed / total) * 100);
  
  return { bagId, total, packed, percentage };
}

// ============================================
// Unpacked items (not assigned to any bag)
// ============================================

export function getUnpackedItems(items: ChecklistItem[]): ChecklistItem[] {
  return items.filter(item => !item.bagId);
}
