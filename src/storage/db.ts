// ============================================
// IndexedDB Storage Layer
// Uses the 'idb' library for promise-based IndexedDB access
// ============================================

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type {
  Checklist,
  ChecklistItem,
  Bag,
  Reminder,
  Template,
  UserProfile,
  Tip,
} from '../types';

// Database schema
interface PackReadyDB extends DBSchema {
  checklists: {
    key: string;
    value: Checklist;
    indexes: {
      'by-createdAt': number;
      'by-category': string;
    };
  };
  checklistItems: {
    key: string;
    value: ChecklistItem;
    indexes: {
      'by-checklistId': string;
      'by-categoryId': string;
    };
  };
  bags: {
    key: string;
    value: Bag;
    indexes: {
      'by-checklistId': string;
    };
  };
  reminders: {
    key: string;
    value: Reminder;
    indexes: {
      'by-checklistId': string;
    };
  };
  templates: {
    key: string;
    value: Template;
    indexes: {
      'by-category': string;
    };
  };
  userProfile: {
    key: string;
    value: UserProfile;
  };
  tips: {
    key: string;
    value: Tip;
  };
}

const DB_NAME = 'packready-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<PackReadyDB> | null = null;

// Initialize database
export async function initDB(): Promise<IDBPDatabase<PackReadyDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<PackReadyDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Checklists store
      if (!db.objectStoreNames.contains('checklists')) {
        const checklistStore = db.createObjectStore('checklists', { keyPath: 'id' });
        checklistStore.createIndex('by-createdAt', 'createdAt');
        checklistStore.createIndex('by-category', 'category');
      }

      // Checklist items store
      if (!db.objectStoreNames.contains('checklistItems')) {
        const itemsStore = db.createObjectStore('checklistItems', { keyPath: 'id' });
        itemsStore.createIndex('by-checklistId', 'checklistId');
        itemsStore.createIndex('by-categoryId', 'categoryId');
      }

      // Bags store
      if (!db.objectStoreNames.contains('bags')) {
        const bagsStore = db.createObjectStore('bags', { keyPath: 'id' });
        bagsStore.createIndex('by-checklistId', 'checklistId');
      }

      // Reminders store
      if (!db.objectStoreNames.contains('reminders')) {
        const remindersStore = db.createObjectStore('reminders', { keyPath: 'id' });
        remindersStore.createIndex('by-checklistId', 'checklistId');
      }

      // Templates store
      if (!db.objectStoreNames.contains('templates')) {
        const templatesStore = db.createObjectStore('templates', { keyPath: 'id' });
        templatesStore.createIndex('by-category', 'category');
      }

      // User profile store
      if (!db.objectStoreNames.contains('userProfile')) {
        db.createObjectStore('userProfile', { keyPath: 'id' });
      }

      // Tips store
      if (!db.objectStoreNames.contains('tips')) {
        db.createObjectStore('tips', { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}

// Get database instance
export async function getDB(): Promise<IDBPDatabase<PackReadyDB>> {
  if (!dbInstance) {
    return initDB();
  }
  return dbInstance;
}

// Close database (useful for cleanup)
export function closeDB(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

// ============================================
// Checklist CRUD
// ============================================

export async function addChecklist(checklist: Checklist): Promise<string> {
  const db = await getDB();
  return db.add('checklists', checklist);
}

export async function getChecklist(id: string): Promise<Checklist | undefined> {
  const db = await getDB();
  return db.get('checklists', id);
}

export async function getAllChecklists(): Promise<Checklist[]> {
  const db = await getDB();
  const all = await db.getAll('checklists');
  return all.sort((a, b) => b.createdAt - a.createdAt);
}

export async function updateChecklist(checklist: Checklist): Promise<string> {
  const db = await getDB();
  return db.put('checklists', { ...checklist, updatedAt: Date.now() });
}

export async function deleteChecklist(id: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['checklists', 'checklistItems', 'bags', 'reminders'], 'readwrite');
  
  // Delete checklist
  await tx.objectStore('checklists').delete(id);
  
  // Delete all related items
  const items = await tx.objectStore('checklistItems').index('by-checklistId').getAll(id);
  for (const item of items) {
    await tx.objectStore('checklistItems').delete(item.id);
  }
  
  // Delete all related bags
  const bags = await tx.objectStore('bags').index('by-checklistId').getAll(id);
  for (const bag of bags) {
    await tx.objectStore('bags').delete(bag.id);
  }
  
  // Delete all related reminders
  const reminders = await tx.objectStore('reminders').index('by-checklistId').getAll(id);
  for (const reminder of reminders) {
    await tx.objectStore('reminders').delete(reminder.id);
  }
  
  await tx.done;
}

// ============================================
// ChecklistItem CRUD
// ============================================

export async function addChecklistItem(item: ChecklistItem): Promise<string> {
  const db = await getDB();
  return db.add('checklistItems', item);
}

export async function getChecklistItems(checklistId: string): Promise<ChecklistItem[]> {
  const db = await getDB();
  return db.getAllFromIndex('checklistItems', 'by-checklistId', checklistId);
}

export async function updateChecklistItem(item: ChecklistItem): Promise<string> {
  const db = await getDB();
  return db.put('checklistItems', { ...item, updatedAt: Date.now() });
}

export async function deleteChecklistItem(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('checklistItems', id);
}

export async function bulkAddItems(items: ChecklistItem[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('checklistItems', 'readwrite');
  for (const item of items) {
    tx.store.add(item);
  }
  await tx.done;
}

// ============================================
// Bag CRUD
// ============================================

export async function addBag(bag: Bag): Promise<string> {
  const db = await getDB();
  return db.add('bags', bag);
}

export async function getBags(checklistId: string): Promise<Bag[]> {
  const db = await getDB();
  const bags = await db.getAllFromIndex('bags', 'by-checklistId', checklistId);
  return bags.sort((a, b) => a.order - b.order);
}

export async function updateBag(bag: Bag): Promise<string> {
  const db = await getDB();
  return db.put('bags', { ...bag, updatedAt: Date.now() });
}

export async function deleteBag(bagId: string): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['bags', 'checklistItems'], 'readwrite');
  
  // Get the bag to find its checklist
  const bag = await tx.objectStore('bags').get(bagId);
  
  // Delete the bag
  await tx.objectStore('bags').delete(bagId);
  
  // Unassign all items from this bag
  if (bag) {
    const items = await tx.objectStore('checklistItems').index('by-checklistId').getAll(bag.checklistId);
    for (const item of items) {
      if (item.bagId === bagId) {
        await tx.objectStore('checklistItems').put({
          ...item,
          bagId: null,
          updatedAt: Date.now(),
        });
      }
    }
  }
  
  await tx.done;
}

// ============================================
// Reminder CRUD
// ============================================

export async function addReminder(reminder: Reminder): Promise<string> {
  const db = await getDB();
  return db.add('reminders', reminder);
}

export async function getReminders(checklistId: string): Promise<Reminder[]> {
  const db = await getDB();
  return db.getAllFromIndex('reminders', 'by-checklistId', checklistId);
}

export async function updateReminder(reminder: Reminder): Promise<string> {
  const db = await getDB();
  return db.put('reminders', reminder);
}

export async function deleteReminder(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('reminders', id);
}

// ============================================
// Template CRUD
// ============================================

export async function addTemplate(template: Template): Promise<string> {
  const db = await getDB();
  return db.add('templates', template);
}

export async function getAllTemplates(): Promise<Template[]> {
  const db = await getDB();
  return db.getAll('templates');
}

export async function getTemplate(id: string): Promise<Template | undefined> {
  const db = await getDB();
  return db.get('templates', id);
}

// ============================================
// User Profile CRUD
// ============================================

export async function getUserProfile(): Promise<UserProfile | undefined> {
  const db = await getDB();
  const profiles = await db.getAll('userProfile');
  return profiles[0];
}

export async function saveUserProfile(profile: UserProfile): Promise<string> {
  const db = await getDB();
  return db.put('userProfile', profile);
}

// ============================================
// Tip CRUD
// ============================================

export async function getAllTips(): Promise<Tip[]> {
  const db = await getDB();
  return db.getAll('tips');
}

export async function addTip(tip: Tip): Promise<string> {
  const db = await getDB();
  return db.add('tips', tip);
}
