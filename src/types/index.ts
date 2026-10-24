// ============================================
// Core Data Models for PackReady App
// ============================================

// Checklist scenario types
export type ChecklistCategory = 'travel' | 'hospital' | 'moving' | 'personal' | 'emergency' | 'custom';

// Travel-specific types
export type TripDuration = '1day' | '2-3days' | '4-7days' | '1-2weeks' | '2+weeks';
export type TripType = 'city' | 'business' | 'family' | 'beach' | 'hiking' | 'camping' | 'ski' | 'other';
export type ClimateType = 'normal' | 'hot' | 'cold' | 'extremely-cold' | 'rainy' | 'mixed';
export type CompanionType = 'alone' | 'couple' | 'family' | 'children' | 'senior';

// Category of items within a checklist
export interface Category {
  id: string;
  name: string;
  order: number;
}

// Individual item in a checklist
export interface ChecklistItem {
  id: string;
  checklistId: string;
  name: string;
  categoryId: string;
  quantity: number;
  packed: boolean;
  bagId: string | null;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  /** Whether this item comes from a system template (true = translatable, false = user-added, keep as-is) */
  isTemplateItem?: boolean;
}

// Bag / Luggage
export interface Bag {
  id: string;
  checklistId: string;
  name: string;
  icon: string; // emoji like 🧳, 🎒, 👜
  order: number;
  color?: string;
  createdAt: number;
  updatedAt: number;
}

// Reminder for departure
export interface Reminder {
  id: string;
  checklistId: string;
  daysBefore: number; // e.g., 7 for 7 days before, 0.5 for 12 hours
  label: string;
  enabled: boolean;
  triggered: boolean;
  createdAt: number;
}

// Main Checklist entity
export interface Checklist {
  id: string;
  title: string;
  category: ChecklistCategory;
  icon: string; // emoji
  // Travel-specific fields (optional for non-travel)
  destination?: string;
  tripDuration?: TripDuration;
  tripType?: TripType;
  climate?: ClimateType;
  companions?: CompanionType;
  // Departure info
  departureDate?: string; // ISO date string
  departureTime?: string; // HH:mm format
  // Status
  createdAt: number;
  updatedAt: number;
  isArchived: boolean;
  /** Original template name for translation (only set when created from a template) */
  templateOriginName?: string;
  /** Whether the title was modified by user (if true, don't translate) */
  titleUserModified?: boolean;
}

// Template types
export interface TemplateItem {
  name: string;
  category: string;
  quantity: number;
}

export interface Template {
  id: string;
  name: string;
  category: ChecklistCategory;
  icon: string;
  description?: string;
  items: TemplateItem[];
  isDefault: boolean;
}

// Tip content
export interface Tip {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  steps: TipStep[];
}

export interface TipStep {
  step: number;
  title: string;
  description: string;
  imageUrl: string;
}

// User profile (for future use)
export interface UserProfile {
  id: string;
  name?: string;
  createdAt: number;
  lastVisitedAt: number;
}

// Helper: Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}
