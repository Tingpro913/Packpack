// ============================================
// All Templates Index
// Default templates for all scenarios
// ============================================

import type { Template } from '../../types';

// Hospital stay template
export const hospitalTemplate: Template = {
  id: 'template-hospital',
  name: 'Hospital Stay',
  category: 'hospital',
  icon: '🏥',
  description: 'Prepare for a hospital visit or stay',
  isDefault: true,
  items: [
    // Documents
    { name: 'ID Card', category: 'Documents', quantity: 1 },
    { name: 'Insurance Card', category: 'Documents', quantity: 1 },
    { name: 'Medical Records', category: 'Documents', quantity: 1 },
    { name: 'Medication List', category: 'Documents', quantity: 1 },
    { name: 'Emergency Contact', category: 'Documents', quantity: 1 },
    // Clothing
    { name: 'Comfortable Clothes', category: 'Clothing', quantity: 3 },
    { name: 'Underwear', category: 'Clothing', quantity: 5 },
    { name: 'Socks', category: 'Clothing', quantity: 5 },
    { name: 'Slippers / Non-slip Shoes', category: 'Clothing', quantity: 1 },
    { name: 'Robe', category: 'Clothing', quantity: 1 },
    // Toiletries
    { name: 'Toothbrush', category: 'Toiletries', quantity: 1 },
    { name: 'Toothpaste', category: 'Toiletries', quantity: 1 },
    { name: 'Shampoo', category: 'Toiletries', quantity: 1 },
    { name: 'Soap / Body Wash', category: 'Toiletries', quantity: 1 },
    { name: 'Towel', category: 'Toiletries', quantity: 2 },
    { name: 'Tissues', category: 'Toiletries', quantity: 2 },
    // Essentials
    { name: 'Phone', category: 'Essentials', quantity: 1 },
    { name: 'Phone Charger', category: 'Essentials', quantity: 1 },
    { name: 'Water Bottle', category: 'Essentials', quantity: 1 },
    { name: 'Snacks', category: 'Essentials', quantity: 3 },
    { name: 'Book / Magazine', category: 'Entertainment', quantity: 2 },
    { name: 'Headphones', category: 'Entertainment', quantity: 1 },
    // Health
    { name: 'Current Medications', category: 'Health', quantity: 7 },
    { name: 'Glasses / Contacts', category: 'Health', quantity: 1 },
  ],
};

// Moving template
export const movingTemplate: Template = {
  id: 'template-moving',
  name: 'Moving House',
  category: 'moving',
  icon: '🏠',
  description: 'Everything you need for moving day',
  isDefault: true,
  items: [
    // Packing Supplies
    { name: 'Moving Boxes', category: 'Packing Supplies', quantity: 20 },
    { name: 'Packing Tape', category: 'Packing Supplies', quantity: 3 },
    { name: 'Bubble Wrap', category: 'Packing Supplies', quantity: 2 },
    { name: 'Packing Paper', category: 'Packing Supplies', quantity: 5 },
    { name: 'Marker Pens', category: 'Packing Supplies', quantity: 3 },
    { name: 'Labels', category: 'Packing Supplies', quantity: 1 },
    { name: 'Plastic Bags', category: 'Packing Supplies', quantity: 10 },
    // Essentials Box (open first)
    { name: 'Toiletries Bag', category: 'Essentials Box', quantity: 1 },
    { name: 'Change of Clothes', category: 'Essentials Box', quantity: 2 },
    { name: 'Phone Charger', category: 'Essentials Box', quantity: 1 },
    { name: 'Important Documents', category: 'Essentials Box', quantity: 1 },
    { name: 'Basic Tools', category: 'Essentials Box', quantity: 1 },
    { name: 'Snacks & Water', category: 'Essentials Box', quantity: 3 },
    // Cleaning
    { name: 'Cleaning Supplies', category: 'Cleaning', quantity: 1 },
    { name: 'Trash Bags', category: 'Cleaning', quantity: 10 },
    { name: 'Paper Towels', category: 'Cleaning', quantity: 3 },
    // Tools
    { name: 'Screwdriver Set', category: 'Tools', quantity: 1 },
    { name: 'Hammer', category: 'Tools', quantity: 1 },
    { name: 'Measuring Tape', category: 'Tools', quantity: 1 },
    { name: 'Scissors / Box Cutter', category: 'Tools', quantity: 2 },
    // Furniture
    { name: 'Furniture Covers', category: 'Furniture', quantity: 5 },
    { name: 'Mattress Bag', category: 'Furniture', quantity: 2 },
  ],
};

// Personal template
export const personalTemplate: Template = {
  id: 'template-personal',
  name: 'Personal Preparation',
  category: 'personal',
  icon: '🧘',
  description: 'For personal events and special days',
  isDefault: true,
  items: [
    { name: 'Outfit Planned', category: 'Appearance', quantity: 1 },
    { name: 'Shoes', category: 'Appearance', quantity: 1 },
    { name: 'Accessories', category: 'Appearance', quantity: 1 },
    { name: 'Phone Charged', category: 'Essentials', quantity: 1 },
    { name: 'Wallet / Purse', category: 'Essentials', quantity: 1 },
    { name: 'Keys', category: 'Essentials', quantity: 1 },
    { name: 'Water Bottle', category: 'Essentials', quantity: 1 },
    { name: 'Snacks', category: 'Essentials', quantity: 2 },
    { name: 'Breathing Exercises', category: 'Mental Prep', quantity: 1 },
    { name: 'Positive Affirmations', category: 'Mental Prep', quantity: 1 },
  ],
};

// Emergency template
export const emergencyTemplate: Template = {
  id: 'template-emergency',
  name: '72-Hour Emergency Kit',
  category: 'emergency',
  icon: '🔥',
  description: 'Be prepared for emergencies',
  isDefault: true,
  items: [
    // Water
    { name: 'Water (3-day supply)', category: 'Water', quantity: 9 },
    { name: 'Water Purification Tablets', category: 'Water', quantity: 1 },
    { name: 'Reusable Water Bottle', category: 'Water', quantity: 2 },
    // Food
    { name: 'Non-perishable Food (3 days)', category: 'Food', quantity: 9 },
    { name: 'Energy Bars', category: 'Food', quantity: 6 },
    { name: 'Can Opener', category: 'Food', quantity: 1 },
    // Light & Power
    { name: 'Flashlight', category: 'Light & Power', quantity: 2 },
    { name: 'Batteries', category: 'Light & Power', quantity: 8 },
    { name: 'Portable Charger / Power Bank', category: 'Light & Power', quantity: 1 },
    { name: 'Candles & Matches', category: 'Light & Power', quantity: 1 },
    // First Aid
    { name: 'First Aid Kit', category: 'First Aid', quantity: 1 },
    { name: 'Prescription Medications', category: 'First Aid', quantity: 7 },
    { name: 'Pain Relievers', category: 'First Aid', quantity: 1 },
    { name: 'Antiseptic Wipes', category: 'First Aid', quantity: 10 },
    { name: 'Bandages', category: 'First Aid', quantity: 20 },
    // Shelter & Warmth
    { name: 'Emergency Blanket', category: 'Shelter', quantity: 2 },
    { name: 'Rain Poncho', category: 'Shelter', quantity: 2 },
    { name: 'Warm Clothes', category: 'Shelter', quantity: 2 },
    { name: 'Sleeping Bag', category: 'Shelter', quantity: 1 },
    // Tools
    { name: 'Multi-tool', category: 'Tools', quantity: 1 },
    { name: 'Duct Tape', category: 'Tools', quantity: 1 },
    { name: 'Whistle', category: 'Tools', quantity: 1 },
    { name: 'Work Gloves', category: 'Tools', quantity: 1 },
    // Documents
    { name: 'Important Documents (copies)', category: 'Documents', quantity: 1 },
    { name: 'ID Copies', category: 'Documents', quantity: 2 },
    { name: 'Emergency Contact List', category: 'Documents', quantity: 1 },
    { name: 'Cash (small bills)', category: 'Documents', quantity: 1 },
    // Hygiene
    { name: 'Hand Sanitizer', category: 'Hygiene', quantity: 2 },
    { name: 'Wet Wipes', category: 'Hygiene', quantity: 5 },
    { name: 'Toilet Paper', category: 'Hygiene', quantity: 3 },
    { name: 'Garbage Bags', category: 'Hygiene', quantity: 5 },
  ],
};

// All default templates
export const defaultTemplates: Template[] = [
  hospitalTemplate,
  movingTemplate,
  personalTemplate,
  emergencyTemplate,
];
