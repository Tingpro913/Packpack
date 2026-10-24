// ============================================
// Custom React Hooks
// ============================================

import { useState, useEffect, useCallback } from 'react';
import type { Checklist, ChecklistItem, Bag } from '../types';
import {
  fetchAllChecklists,
  fetchChecklist,
  fetchItems,
  createChecklistFromTemplateItems as serviceCreateFromTemplate,
  removeChecklist,
  createItem,
  modifyItem,
  removeItem,
  copyChecklist as serviceCopyChecklist,
  createBag as serviceCreateBag,
  fetchBags,
  modifyBag,
  removeBag,
  assignItemToBag as serviceAssignItemToBag,
  modifyChecklist as serviceModifyChecklist,
} from '../services/checklistService';
import type { TemplateItem, ChecklistCategory } from '../types';

// ============================================
// useChecklists - fetch all checklists
// ============================================

export function useChecklists() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChecklists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllChecklists();
      setChecklists(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load checklists');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChecklists();
  }, [loadChecklists]);

  const deleteChecklist = useCallback(async (id: string) => {
    await removeChecklist(id);
    setChecklists(prev => prev.filter(c => c.id !== id));
  }, []);

  const copyChecklist = useCallback(async (id: string, newTitle?: string) => {
    const copied = await serviceCopyChecklist(id, newTitle);
    if (copied) {
      setChecklists(prev => [copied, ...prev]);
    }
    return copied;
  }, []);

  return {
    checklists,
    loading,
    error,
    refresh: loadChecklists,
    deleteChecklist,
    copyChecklist,
  };
}

// ============================================
// useChecklist - fetch a single checklist
// ============================================

export function useChecklist(id: string | undefined) {
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [bags, setBags] = useState<Bag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChecklist = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [checklistData, itemsData, bagsData] = await Promise.all([
        fetchChecklist(id),
        fetchItems(id),
        fetchBags(id),
      ]);
      
      setChecklist(checklistData || null);
      setItems(itemsData);
      setBags(bagsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load checklist');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadChecklist();
  }, [loadChecklist]);

  const addItem = useCallback(async (name: string, categoryId: string, quantity: number = 1) => {
    if (!id) return;
    const newItem = await createItem(id, name, categoryId, quantity);
    setItems(prev => [...prev, newItem]);
    return newItem;
  }, [id]);

  const updateItem = useCallback(async (item: ChecklistItem) => {
    await modifyItem(item);
    setItems(prev => prev.map(i => i.id === item.id ? item : i));
  }, []);

  const deleteItem = useCallback(async (itemId: string) => {
    await removeItem(itemId);
    setItems(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const togglePacked = useCallback(async (item: ChecklistItem) => {
    const updatedItem = { ...item, packed: !item.packed, updatedAt: Date.now() };
    await modifyItem(updatedItem);
    setItems(prev => prev.map(i => i.id === item.id ? updatedItem : i));
  }, []);

  // ============================================
  // Bag operations
  // ============================================

  const addBag = useCallback(async (name: string, icon: string = '🧳', color?: string) => {
    if (!id) return;
    const newBag = await serviceCreateBag(id, name, icon, color);
    setBags(prev => [...prev, newBag]);
    return newBag;
  }, [id]);

  const updateBag = useCallback(async (bag: Bag) => {
    await modifyBag(bag);
    setBags(prev => prev.map(b => b.id === bag.id ? bag : b));
  }, []);

  const deleteBag = useCallback(async (bagId: string) => {
    await removeBag(bagId);
    setBags(prev => prev.filter(b => b.id !== bagId));
    // Unassign items from this bag in local state
    setItems(prev => prev.map(i => 
      i.bagId === bagId ? { ...i, bagId: null } : i
    ));
  }, []);

  const assignItemToBag = useCallback(async (item: ChecklistItem, bagId: string | null) => {
    const updatedItem = await serviceAssignItemToBag(item, bagId);
    setItems(prev => prev.map(i => i.id === item.id ? updatedItem : i));
    return updatedItem;
  }, []);

  const updateChecklist = useCallback(async (updates: Partial<Checklist>) => {
    if (!checklist) return;
    const updated = { ...checklist, ...updates, updatedAt: Date.now() };
    await serviceModifyChecklist(updated);
    setChecklist(updated);
    return updated;
  }, [checklist]);

  return {
    checklist,
    items,
    bags,
    loading,
    error,
    refresh: loadChecklist,
    addItem,
    updateItem,
    deleteItem,
    togglePacked,
    updateChecklist,
    // Bag operations
    addBag,
    updateBag,
    deleteBag,
    assignItemToBag,
  };
}

// ============================================
// useCreateChecklist - create a new checklist from templates
// ============================================

export function useCreateChecklist() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFromTemplate = useCallback(async (
    title: string,
    category: ChecklistCategory,
    icon: string,
    templateItems: TemplateItem[],
    meta: Partial<Checklist> = {}
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await serviceCreateFromTemplate(
        title,
        category,
        icon,
        templateItems,
        meta
      );
      return result.checklist;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create checklist';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const copy = useCallback(async (id: string, newTitle?: string) => {
    try {
      setLoading(true);
      setError(null);
      return await serviceCopyChecklist(id, newTitle);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to copy checklist';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createFromTemplate,
    copy,
  };
}
