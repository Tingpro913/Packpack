// ============================================
// Travel Template Data
// Data-driven architecture for checklist generation
// Items are composed from multiple rule sets:
//   BASE + DURATION + CLIMATE + TRIP_TYPE + COMPANIONS
// ============================================

import type { TemplateItem, TripDuration, TripType, ClimateType, CompanionType } from '../../types';

// Base items every trip needs
const baseItems: TemplateItem[] = [
  // Documents
  { name: 'Passport', category: 'Documents', quantity: 1 },
  { name: 'ID Card', category: 'Documents', quantity: 1 },
  { name: 'Travel Insurance Info', category: 'Documents', quantity: 1 },
  { name: 'Emergency Contact', category: 'Documents', quantity: 1 },
  // Electronics
  { name: 'Phone', category: 'Electronics', quantity: 1 },
  { name: 'Phone Charger', category: 'Electronics', quantity: 1 },
  { name: 'Charging Cable', category: 'Electronics', quantity: 1 },
  { name: 'Earphones', category: 'Electronics', quantity: 1 },
  // Clothing
  { name: 'Underwear', category: 'Clothing', quantity: 3 },
  { name: 'Socks', category: 'Clothing', quantity: 3 },
  { name: 'T-shirts', category: 'Clothing', quantity: 2 },
  { name: 'Pants', category: 'Clothing', quantity: 1 },
  { name: 'Sleepwear', category: 'Clothing', quantity: 1 },
  // Toiletries
  { name: 'Toothbrush', category: 'Toiletries', quantity: 1 },
  { name: 'Toothpaste', category: 'Toiletries', quantity: 1 },
  { name: 'Tissues', category: 'Toiletries', quantity: 1 },
  // Health
  { name: 'Basic Medicine', category: 'Health', quantity: 1 },
];

// Duration-based items
const durationItems: Record<TripDuration, TemplateItem[]> = {
  '1day': [
    { name: 'Water Bottle', category: 'Essentials', quantity: 1 },
    { name: 'Snacks', category: 'Essentials', quantity: 1 },
  ],
  '2-3days': [
    { name: 'Underwear', category: 'Clothing', quantity: 2 },
    { name: 'Socks', category: 'Clothing', quantity: 2 },
    { name: 'T-shirts', category: 'Clothing', quantity: 1 },
    { name: 'Shampoo (travel size)', category: 'Toiletries', quantity: 1 },
    { name: 'Skincare (travel size)', category: 'Toiletries', quantity: 1 },
  ],
  '4-7days': [
    { name: 'Underwear', category: 'Clothing', quantity: 4 },
    { name: 'Socks', category: 'Clothing', quantity: 4 },
    { name: 'T-shirts', category: 'Clothing', quantity: 3 },
    { name: 'Pants', category: 'Clothing', quantity: 1 },
    { name: 'Shirt/Blouse', category: 'Clothing', quantity: 1 },
    { name: 'Shampoo', category: 'Toiletries', quantity: 1 },
    { name: 'Skincare', category: 'Toiletries', quantity: 1 },
    { name: 'Power Bank', category: 'Electronics', quantity: 1 },
  ],
  '1-2weeks': [
    { name: 'Underwear', category: 'Clothing', quantity: 7 },
    { name: 'Socks', category: 'Clothing', quantity: 7 },
    { name: 'T-shirts', category: 'Clothing', quantity: 5 },
    { name: 'Pants', category: 'Clothing', quantity: 2 },
    { name: 'Shirts/Blouses', category: 'Clothing', quantity: 3 },
    { name: 'Jacket / Coat', category: 'Clothing', quantity: 1 },
    { name: 'Shampoo', category: 'Toiletries', quantity: 1 },
    { name: 'Skincare', category: 'Toiletries', quantity: 1 },
    { name: 'Laundry Bag', category: 'Essentials', quantity: 1 },
    { name: 'Power Bank', category: 'Electronics', quantity: 1 },
    { name: 'Travel Adapter', category: 'Electronics', quantity: 1 },
  ],
  '2+weeks': [
    { name: 'Underwear', category: 'Clothing', quantity: 10 },
    { name: 'Socks', category: 'Clothing', quantity: 10 },
    { name: 'T-shirts', category: 'Clothing', quantity: 7 },
    { name: 'Pants', category: 'Clothing', quantity: 3 },
    { name: 'Shirts/Blouses', category: 'Clothing', quantity: 5 },
    { name: 'Jacket / Coat', category: 'Clothing', quantity: 1 },
    { name: 'Formal Outfit', category: 'Clothing', quantity: 1 },
    { name: 'Shampoo', category: 'Toiletries', quantity: 2 },
    { name: 'Skincare', category: 'Toiletries', quantity: 1 },
    { name: 'Laundry Bag', category: 'Essentials', quantity: 1 },
    { name: 'Power Bank', category: 'Electronics', quantity: 1 },
    { name: 'Travel Adapter', category: 'Electronics', quantity: 1 },
    { name: 'Portable Speaker', category: 'Electronics', quantity: 1 },
  ],
};

// Climate-based items
const climateItems: Record<ClimateType, TemplateItem[]> = {
  normal: [],
  hot: [
    { name: 'Sunglasses', category: 'Accessories', quantity: 1 },
    { name: 'Sunscreen', category: 'Toiletries', quantity: 1 },
    { name: 'Hat / Cap', category: 'Accessories', quantity: 1 },
    { name: 'Shorts', category: 'Clothing', quantity: 2 },
    { name: 'Sandals / Flip Flops', category: 'Clothing', quantity: 1 },
    { name: 'Water Bottle', category: 'Essentials', quantity: 1 },
  ],
  cold: [
    { name: 'Warm Jacket', category: 'Clothing', quantity: 1 },
    { name: 'Sweater / Hoodie', category: 'Clothing', quantity: 2 },
    { name: 'Thermal Underwear', category: 'Clothing', quantity: 2 },
    { name: 'Warm Socks', category: 'Clothing', quantity: 3 },
    { name: 'Scarf', category: 'Accessories', quantity: 1 },
    { name: 'Gloves', category: 'Accessories', quantity: 1 },
    { name: 'Lip Balm', category: 'Toiletries', quantity: 1 },
  ],
  'extremely-cold': [
    { name: 'Heavy Winter Coat', category: 'Clothing', quantity: 1 },
    { name: 'Sweater / Hoodie', category: 'Clothing', quantity: 3 },
    { name: 'Thermal Underwear (top)', category: 'Clothing', quantity: 3 },
    { name: 'Thermal Underwear (bottom)', category: 'Clothing', quantity: 2 },
    { name: 'Wool Socks', category: 'Clothing', quantity: 4 },
    { name: 'Winter Hat', category: 'Accessories', quantity: 1 },
    { name: 'Scarf', category: 'Accessories', quantity: 1 },
    { name: 'Gloves', category: 'Accessories', quantity: 1 },
    { name: 'Snow Boots', category: 'Clothing', quantity: 1 },
    { name: 'Lip Balm', category: 'Toiletries', quantity: 1 },
    { name: 'Hand Warmers', category: 'Essentials', quantity: 2 },
  ],
  rainy: [
    { name: 'Umbrella', category: 'Accessories', quantity: 1 },
    { name: 'Rain Jacket', category: 'Clothing', quantity: 1 },
    { name: 'Waterproof Shoes', category: 'Clothing', quantity: 1 },
    { name: 'Plastic Bag (for wet items)', category: 'Essentials', quantity: 2 },
  ],
  mixed: [
    { name: 'Light Jacket', category: 'Clothing', quantity: 1 },
    { name: 'Umbrella (compact)', category: 'Accessories', quantity: 1 },
    { name: 'Sunglasses', category: 'Accessories', quantity: 1 },
  ],
};

// Trip type items
const tripTypeItems: Record<TripType, TemplateItem[]> = {
  city: [
    { name: 'Comfortable Walking Shoes', category: 'Clothing', quantity: 1 },
    { name: 'City Map / Guide', category: 'Essentials', quantity: 1 },
    { name: 'Reusable Water Bottle', category: 'Essentials', quantity: 1 },
  ],
  business: [
    { name: 'Business Attire', category: 'Clothing', quantity: 2 },
    { name: 'Dress Shoes', category: 'Clothing', quantity: 1 },
    { name: 'Laptop', category: 'Electronics', quantity: 1 },
    { name: 'Laptop Charger', category: 'Electronics', quantity: 1 },
    { name: 'Notebook & Pen', category: 'Essentials', quantity: 1 },
    { name: 'Business Cards', category: 'Essentials', quantity: 1 },
  ],
  family: [
    { name: 'Snacks', category: 'Essentials', quantity: 3 },
    { name: 'Water Bottle', category: 'Essentials', quantity: 2 },
    { name: 'First Aid Kit', category: 'Health', quantity: 1 },
    { name: 'Wet Wipes', category: 'Toiletries', quantity: 2 },
    { name: 'Entertainment (books/games)', category: 'Essentials', quantity: 1 },
  ],
  beach: [
    { name: 'Swimsuit', category: 'Clothing', quantity: 2 },
    { name: 'Beach Towel', category: 'Essentials', quantity: 1 },
    { name: 'Sunscreen', category: 'Toiletries', quantity: 1 },
    { name: 'Sunglasses', category: 'Accessories', quantity: 1 },
    { name: 'Hat', category: 'Accessories', quantity: 1 },
    { name: 'Flip Flops', category: 'Clothing', quantity: 1 },
    { name: 'Beach Bag', category: 'Essentials', quantity: 1 },
  ],
  hiking: [
    { name: 'Hiking Boots', category: 'Clothing', quantity: 1 },
    { name: 'Hiking Backpack', category: 'Essentials', quantity: 1 },
    { name: 'Water Bottle (large)', category: 'Essentials', quantity: 2 },
    { name: 'Trail Snacks', category: 'Essentials', quantity: 3 },
    { name: 'First Aid Kit', category: 'Health', quantity: 1 },
    { name: 'Hat', category: 'Accessories', quantity: 1 },
    { name: 'Sunscreen', category: 'Toiletries', quantity: 1 },
    { name: 'Flashlight / Headlamp', category: 'Electronics', quantity: 1 },
    { name: 'Multi-tool', category: 'Essentials', quantity: 1 },
  ],
  camping: [
    { name: 'Tent', category: 'Camping Gear', quantity: 1 },
    { name: 'Sleeping Bag', category: 'Camping Gear', quantity: 1 },
    { name: 'Sleeping Pad', category: 'Camping Gear', quantity: 1 },
    { name: 'Camping Chair', category: 'Camping Gear', quantity: 1 },
    { name: 'Cooking Stove', category: 'Camping Gear', quantity: 1 },
    { name: 'Cookware', category: 'Camping Gear', quantity: 1 },
    { name: 'Flashlight / Lantern', category: 'Electronics', quantity: 2 },
    { name: 'Water Bottle', category: 'Essentials', quantity: 2 },
    { name: 'First Aid Kit', category: 'Health', quantity: 1 },
    { name: 'Insect Repellent', category: 'Health', quantity: 1 },
    { name: 'Multi-tool', category: 'Essentials', quantity: 1 },
    { name: 'Hiking Boots', category: 'Clothing', quantity: 1 },
  ],
  ski: [
    { name: 'Ski Jacket', category: 'Clothing', quantity: 1 },
    { name: 'Ski Pants', category: 'Clothing', quantity: 1 },
    { name: 'Thermal Base Layers', category: 'Clothing', quantity: 3 },
    { name: 'Ski Socks', category: 'Clothing', quantity: 3 },
    { name: 'Ski Goggles', category: 'Accessories', quantity: 1 },
    { name: 'Gloves (waterproof)', category: 'Accessories', quantity: 1 },
    { name: 'Neck Gaiter / Balaclava', category: 'Accessories', quantity: 1 },
    { name: 'Helmet', category: 'Essentials', quantity: 1 },
    { name: 'Lip Balm with SPF', category: 'Toiletries', quantity: 1 },
    { name: 'Sunscreen', category: 'Toiletries', quantity: 1 },
    { name: 'Hand Warmers', category: 'Essentials', quantity: 4 },
  ],
  other: [],
};

// Companion-based items
const companionItems: Record<CompanionType, TemplateItem[]> = {
  alone: [
    { name: 'Emergency Contact List', category: 'Documents', quantity: 1 },
  ],
  couple: [
    { name: 'Shared Toiletries Bag', category: 'Essentials', quantity: 1 },
  ],
  family: [
    { name: 'Family First Aid Kit', category: 'Health', quantity: 1 },
    { name: 'Snacks (shared)', category: 'Essentials', quantity: 3 },
  ],
  children: [
    { name: "Children's Clothes", category: 'Children', quantity: 5 },
    { name: "Children's Medicine", category: 'Children', quantity: 1 },
    { name: 'Diapers (if needed)', category: 'Children', quantity: 10 },
    { name: 'Baby Wipes', category: 'Children', quantity: 2 },
    { name: 'Toys / Activities', category: 'Children', quantity: 2 },
    { name: 'Snacks for Kids', category: 'Children', quantity: 3 },
    { name: 'Baby Bottle / Sippy Cup', category: 'Children', quantity: 2 },
    { name: 'Blanket', category: 'Children', quantity: 1 },
  ],
  senior: [
    { name: 'Regular Medication', category: 'Health', quantity: 7 },
    { name: 'Medication List', category: 'Documents', quantity: 1 },
    { name: 'Walking Aid (cane/stick)', category: 'Essentials', quantity: 1 },
    { name: 'Comfortable Shoes', category: 'Clothing', quantity: 1 },
    { name: 'Reading Glasses', category: 'Accessories', quantity: 1 },
  ],
};

// ============================================
// Generate checklist from multiple rule sets
// ============================================

export interface TravelChecklistOptions {
  duration: TripDuration;
  tripType: TripType;
  climate: ClimateType;
  companions: CompanionType;
}

export function generateTravelChecklist(options: TravelChecklistOptions): TemplateItem[] {
  const { duration, tripType, climate, companions } = options;
  
  // Collect all items from different rule sets
  const allItems: TemplateItem[] = [
    ...baseItems,
    ...durationItems[duration],
    ...climateItems[climate],
    ...tripTypeItems[tripType],
    ...companionItems[companions],
  ];
  
  // Merge duplicate items by name and category
  const merged = new Map<string, TemplateItem>();
  
  for (const item of allItems) {
    const key = `${item.category}::${item.name.toLowerCase()}`;
    const existing = merged.get(key);
    
    if (existing) {
      // Add quantities together
      merged.set(key, {
        ...existing,
        quantity: existing.quantity + item.quantity,
      });
    } else {
      merged.set(key, { ...item });
    }
  }
  
  // Sort by category, then name
  return Array.from(merged.values()).sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.name.localeCompare(b.name);
  });
}

// ============================================
// Quick templates (pre-composed for common scenarios)
// ============================================

export interface QuickTemplate {
  id: string;
  name: string;
  icon: string;
  category: 'travel';
  description: string;
  options: TravelChecklistOptions;
}

export const quickTemplates: QuickTemplate[] = [
  {
    id: 'travel-one-day',
    name: 'One Day Trip',
    icon: '☀️',
    category: 'travel',
    description: 'Quick day outing',
    options: {
      duration: '1day',
      tripType: 'city',
      climate: 'normal',
      companions: 'alone',
    },
  },
  {
    id: 'travel-weekend',
    name: 'Weekend Trip',
    icon: '🚗',
    category: 'travel',
    description: '2-3 days getaway',
    options: {
      duration: '2-3days',
      tripType: 'city',
      climate: 'normal',
      companions: 'couple',
    },
  },
  {
    id: 'travel-week',
    name: '4-7 Day Trip',
    icon: '✈️',
    category: 'travel',
    description: 'Week-long vacation',
    options: {
      duration: '4-7days',
      tripType: 'city',
      climate: 'normal',
      companions: 'alone',
    },
  },
  {
    id: 'travel-long',
    name: 'Long Trip',
    icon: '🌍',
    category: 'travel',
    description: '2+ weeks abroad',
    options: {
      duration: '2+weeks',
      tripType: 'city',
      climate: 'mixed',
      companions: 'alone',
    },
  },
  {
    id: 'travel-business',
    name: 'Business Trip',
    icon: '💼',
    category: 'travel',
    description: 'Work travel essentials',
    options: {
      duration: '2-3days',
      tripType: 'business',
      climate: 'normal',
      companions: 'alone',
    },
  },
  {
    id: 'travel-family',
    name: 'Family Trip',
    icon: '👨‍👩‍👧',
    category: 'travel',
    description: 'Travel with family',
    options: {
      duration: '4-7days',
      tripType: 'family',
      climate: 'normal',
      companions: 'family',
    },
  },
  {
    id: 'travel-beach',
    name: 'Beach Holiday',
    icon: '🏖️',
    category: 'travel',
    description: 'Sun, sand, and sea',
    options: {
      duration: '4-7days',
      tripType: 'beach',
      climate: 'hot',
      companions: 'couple',
    },
  },
  {
    id: 'travel-hiking',
    name: 'Hiking Trip',
    icon: '🥾',
    category: 'travel',
    description: 'Trail and adventure gear',
    options: {
      duration: '2-3days',
      tripType: 'hiking',
      climate: 'normal',
      companions: 'alone',
    },
  },
  {
    id: 'travel-camping',
    name: 'Camping Trip',
    icon: '⛺',
    category: 'travel',
    description: 'Outdoor camping essentials',
    options: {
      duration: '2-3days',
      tripType: 'camping',
      climate: 'normal',
      companions: 'family',
    },
  },
  {
    id: 'travel-ski',
    name: 'Ski / Cold Weather',
    icon: '⛷️',
    category: 'travel',
    description: 'Winter sports gear',
    options: {
      duration: '4-7days',
      tripType: 'ski',
      climate: 'extremely-cold',
      companions: 'family',
    },
  },
  {
    id: 'travel-hot',
    name: 'Hot Weather Trip',
    icon: '🌞',
    category: 'travel',
    description: 'Stay cool in the heat',
    options: {
      duration: '4-7days',
      tripType: 'beach',
      climate: 'hot',
      companions: 'alone',
    },
  },
  {
    id: 'travel-rainy',
    name: 'Rainy Destination',
    icon: '🌧️',
    category: 'travel',
    description: 'Stay dry in wet weather',
    options: {
      duration: '4-7days',
      tripType: 'city',
      climate: 'rainy',
      companions: 'alone',
    },
  },
];
