import type { Template } from '../../types';

// ============================================
// Travel Scenario Templates
// ============================================

export const beachTemplate: Template = {
  id: 'template-beach',
  name: 'Beach Vacation',
  category: 'travel',
  icon: '🏖️',
  description: 'Sun, sand, and everything you need',
  isDefault: true,
  items: [
    // Swimwear
    { name: 'Swimsuit', category: 'Swimwear', quantity: 2 },
    { name: 'Beach Cover-up', category: 'Swimwear', quantity: 1 },
    { name: 'Flip Flops', category: 'Swimwear', quantity: 1 },
    // Sun Protection
    { name: 'Sunscreen (SPF 50+)', category: 'Sun Protection', quantity: 1 },
    { name: 'Sunglasses', category: 'Sun Protection', quantity: 1 },
    { name: 'Wide-brim Hat', category: 'Sun Protection', quantity: 1 },
    { name: 'After-sun Lotion', category: 'Sun Protection', quantity: 1 },
    { name: 'Lip Balm with SPF', category: 'Sun Protection', quantity: 1 },
    // Beach Gear
    { name: 'Beach Towel', category: 'Beach Gear', quantity: 2 },
    { name: 'Beach Bag', category: 'Beach Gear', quantity: 1 },
    { name: 'Snorkel Mask', category: 'Beach Gear', quantity: 1 },
    { name: 'Waterproof Phone Case', category: 'Beach Gear', quantity: 1 },
    { name: 'Insulated Water Bottle', category: 'Beach Gear', quantity: 1 },
    // Clothing
    { name: 'Light T-shirts', category: 'Clothing', quantity: 5 },
    { name: 'Shorts', category: 'Clothing', quantity: 3 },
    { name: 'Summer Dress', category: 'Clothing', quantity: 2 },
    { name: 'Sandals', category: 'Shoes', quantity: 1 },
    // Documents
    { name: 'Passport', category: 'Documents', quantity: 1 },
    { name: 'Hotel Confirmation', category: 'Documents', quantity: 1 },
    { name: 'Travel Insurance', category: 'Documents', quantity: 1 },
  ],
};

export const campingTemplate: Template = {
  id: 'template-camping',
  name: 'Camping Trip',
  category: 'travel',
  icon: '🏕️',
  description: 'Gear for your outdoor adventure',
  isDefault: true,
  items: [
    // Shelter
    { name: 'Tent', category: 'Shelter', quantity: 1 },
    { name: 'Sleeping Bag', category: 'Shelter', quantity: 1 },
    { name: 'Sleeping Pad', category: 'Shelter', quantity: 1 },
    { name: 'Pillow', category: 'Shelter', quantity: 1 },
    { name: 'Tarp / Groundsheet', category: 'Shelter', quantity: 1 },
    // Cooking
    { name: 'Camping Stove', category: 'Cooking', quantity: 1 },
    { name: 'Fuel Canister', category: 'Cooking', quantity: 2 },
    { name: 'Cooking Pot', category: 'Cooking', quantity: 1 },
    { name: 'Cup / Mug', category: 'Cooking', quantity: 1 },
    { name: 'Spork / Utensils', category: 'Cooking', quantity: 1 },
    { name: 'Water Bottle', category: 'Cooking', quantity: 2 },
    { name: 'Food (meals + snacks)', category: 'Food', quantity: 6 },
    // Tools
    { name: 'Headlamp', category: 'Tools', quantity: 1 },
    { name: 'Extra Batteries', category: 'Tools', quantity: 4 },
    { name: 'Multi-tool / Knife', category: 'Tools', quantity: 1 },
    { name: 'Lighter / Matches', category: 'Tools', quantity: 2 },
    { name: 'Duct Tape', category: 'Tools', quantity: 1 },
    // Clothing
    { name: 'Warm Jacket', category: 'Clothing', quantity: 1 },
    { name: 'Hiking Boots', category: 'Shoes', quantity: 1 },
    { name: 'Extra Socks', category: 'Clothing', quantity: 4 },
    { name: 'Rain Jacket', category: 'Clothing', quantity: 1 },
    // Essentials
    { name: 'First Aid Kit', category: 'Health', quantity: 1 },
    { name: 'Insect Repellent', category: 'Health', quantity: 1 },
    { name: 'Sunscreen', category: 'Health', quantity: 1 },
    { name: 'Toilet Paper', category: 'Essentials', quantity: 1 },
  ],
};

export const businessTemplate: Template = {
  id: 'template-business',
  name: 'Business Trip',
  category: 'travel',
  icon: '💼',
  description: 'Look sharp, stay organized',
  isDefault: true,
  items: [
    // Work Essentials
    { name: 'Laptop', category: 'Work', quantity: 1 },
    { name: 'Laptop Charger', category: 'Work', quantity: 1 },
    { name: 'Phone Charger', category: 'Work', quantity: 1 },
    { name: 'Portable Charger', category: 'Work', quantity: 1 },
    { name: 'Headphones', category: 'Work', quantity: 1 },
    { name: 'USB Drive / Backup', category: 'Work', quantity: 1 },
    // Business Attire
    { name: 'Suits / Blazers', category: 'Business Wear', quantity: 2 },
    { name: 'Dress Shirts', category: 'Business Wear', quantity: 4 },
    { name: 'Ties / Scarves', category: 'Business Wear', quantity: 3 },
    { name: 'Dress Shoes', category: 'Shoes', quantity: 1 },
    { name: 'Belt', category: 'Accessories', quantity: 1 },
    // Documents
    { name: 'Business Cards', category: 'Documents', quantity: 20 },
    { name: 'Passport / ID', category: 'Documents', quantity: 1 },
    { name: 'Itinerary', category: 'Documents', quantity: 1 },
    { name: 'Meeting Materials', category: 'Documents', quantity: 1 },
    // Toiletries
    { name: 'Travel-sized Toiletries', category: 'Toiletries', quantity: 1 },
    { name: 'Razor', category: 'Toiletries', quantity: 1 },
    { name: 'Deodorant', category: 'Toiletries', quantity: 1 },
    // Comfort
    { name: 'Neck Pillow', category: 'Travel Comfort', quantity: 1 },
    { name: 'Eye Mask', category: 'Travel Comfort', quantity: 1 },
    { name: 'Earplugs', category: 'Travel Comfort', quantity: 1 },
  ],
};

export const skiTemplate: Template = {
  id: 'template-ski',
  name: 'Ski / Snowboard Trip',
  category: 'travel',
  icon: '🎿',
  description: 'Hit the slopes fully prepared',
  isDefault: true,
  items: [
    // Gear
    { name: 'Skis / Snowboard', category: 'Gear', quantity: 1 },
    { name: 'Boots', category: 'Gear', quantity: 1 },
    { name: 'Bindings', category: 'Gear', quantity: 1 },
    { name: 'Helmet', category: 'Gear', quantity: 1 },
    { name: 'Goggles', category: 'Gear', quantity: 1 },
    { name: 'Gloves / Mittens', category: 'Gear', quantity: 2 },
    // Base Layers
    { name: 'Thermal Top', category: 'Base Layers', quantity: 2 },
    { name: 'Thermal Bottoms', category: 'Base Layers', quantity: 2 },
    { name: 'Wool Socks', category: 'Base Layers', quantity: 4 },
    // Mid & Outer Layers
    { name: 'Ski Jacket', category: 'Outer Layers', quantity: 1 },
    { name: 'Ski Pants', category: 'Outer Layers', quantity: 1 },
    { name: 'Fleece Jacket', category: 'Mid Layers', quantity: 1 },
    { name: 'Neck Gaiter / Buff', category: 'Accessories', quantity: 1 },
    { name: 'Beanie / Hat', category: 'Accessories', quantity: 1 },
    // Safety & Essentials
    { name: 'Sunscreen (face)', category: 'Essentials', quantity: 1 },
    { name: 'Lip Balm with SPF', category: 'Essentials', quantity: 1 },
    { name: 'Hand Warmers', category: 'Essentials', quantity: 4 },
    { name: 'Ski Pass / Lift Ticket', category: 'Documents', quantity: 1 },
    { name: 'Insurance Info', category: 'Documents', quantity: 1 },
    // Après Ski
    { name: 'Sunglasses', category: 'Accessories', quantity: 1 },
    { name: 'Comfy Clothes', category: 'Casual', quantity: 1 },
  ],
};

export const familyTemplate: Template = {
  id: 'template-family',
  name: 'Family Trip with Kids',
  category: 'travel',
  icon: '👶',
  description: 'Travel essentials for the whole family',
  isDefault: true,
  items: [
    // Kids Essentials
    { name: 'Diapers', category: 'Baby', quantity: 20 },
    { name: 'Baby Wipes', category: 'Baby', quantity: 3 },
    { name: 'Changing Pad', category: 'Baby', quantity: 1 },
    { name: 'Baby Food / Snacks', category: 'Baby', quantity: 6 },
    { name: 'Sippy Cups / Bottles', category: 'Baby', quantity: 2 },
    { name: 'Pacifier', category: 'Baby', quantity: 2 },
    // Entertainment
    { name: 'Tablet / Device', category: 'Entertainment', quantity: 1 },
    { name: 'Headphones (kids)', category: 'Entertainment', quantity: 2 },
    { name: 'Stuffed Animal', category: 'Entertainment', quantity: 2 },
    { name: 'Books', category: 'Entertainment', quantity: 3 },
    { name: 'Coloring + Crayons', category: 'Entertainment', quantity: 1 },
    // Health & Safety
    { name: 'Children\'s Tylenol', category: 'Health', quantity: 1 },
    { name: 'Thermometer', category: 'Health', quantity: 1 },
    { name: 'Band-aids (fun designs)', category: 'Health', quantity: 20 },
    { name: 'Hand Sanitizer', category: 'Health', quantity: 2 },
    { name: 'Sunscreen (kids)', category: 'Health', quantity: 1 },
    // Clothing
    { name: 'Extra Outfits per kid', category: 'Clothing', quantity: 3 },
    { name: 'Comfortable Shoes', category: 'Shoes', quantity: 2 },
    { name: 'Jacket / Sweater', category: 'Clothing', quantity: 2 },
    { name: 'Pajamas', category: 'Clothing', quantity: 2 },
    // Gear
    { name: 'Stroller', category: 'Gear', quantity: 1 },
    { name: 'Car Seat', category: 'Gear', quantity: 1 },
    { name: 'Baby Carrier', category: 'Gear', quantity: 1 },
    // Documents
    { name: 'Birth Certificates', category: 'Documents', quantity: 1 },
    { name: 'Passports', category: 'Documents', quantity: 1 },
    { name: 'Insurance Cards', category: 'Documents', quantity: 1 },
  ],
};

export const backpackingTemplate: Template = {
  id: 'template-backpacking',
  name: 'Backpacking',
  category: 'travel',
  icon: '🎒',
  description: 'Lightweight travel essentials',
  isDefault: true,
  items: [
    // Backpack
    { name: 'Travel Backpack (40L+)', category: 'Gear', quantity: 1 },
    { name: 'Packing Cubes', category: 'Gear', quantity: 4 },
    { name: 'Daypack', category: 'Gear', quantity: 1 },
    { name: 'Luggage Lock', category: 'Gear', quantity: 2 },
    // Clothing (minimal)
    { name: 'T-shirts', category: 'Clothing', quantity: 4 },
    { name: 'Pants / Shorts', category: 'Clothing', quantity: 2 },
    { name: 'Underwear', category: 'Clothing', quantity: 5 },
    { name: 'Socks', category: 'Clothing', quantity: 4 },
    { name: 'Versatile Jacket', category: 'Clothing', quantity: 1 },
    { name: 'Walking Shoes', category: 'Shoes', quantity: 1 },
    { name: 'Flip Flops', category: 'Shoes', quantity: 1 },
    // Toiletries
    { name: 'Microfiber Towel', category: 'Toiletries', quantity: 1 },
    { name: 'Travel-sized Toiletries', category: 'Toiletries', quantity: 1 },
    { name: 'Laundry Soap', category: 'Toiletries', quantity: 1 },
    // Documents & Money
    { name: 'Passport', category: 'Documents', quantity: 1 },
    { name: 'Visa (if needed)', category: 'Documents', quantity: 1 },
    { name: 'Travel Insurance', category: 'Documents', quantity: 1 },
    { name: 'Credit Cards', category: 'Documents', quantity: 2 },
    { name: 'Cash (local currency)', category: 'Documents', quantity: 1 },
    // Tech
    { name: 'Phone + Charger', category: 'Electronics', quantity: 1 },
    { name: 'Universal Adapter', category: 'Electronics', quantity: 1 },
    { name: 'Power Bank', category: 'Electronics', quantity: 1 },
    { name: 'Headphones', category: 'Electronics', quantity: 1 },
    // Health
    { name: 'First Aid Kit', category: 'Health', quantity: 1 },
    { name: 'Prescription Meds', category: 'Health', quantity: 1 },
    { name: 'Reusable Water Bottle', category: 'Essentials', quantity: 1 },
  ],
};

export const festivalTemplate: Template = {
  id: 'template-festival',
  name: 'Music Festival',
  category: 'travel',
  icon: '🎸',
  description: 'Festival-ready packing list',
  isDefault: true,
  items: [
    // Tickets & ID
    { name: 'Festival Tickets', category: 'Tickets', quantity: 1 },
    { name: 'ID / Cash', category: 'Tickets', quantity: 1 },
    { name: 'Wristband (if mailed)', category: 'Tickets', quantity: 1 },
    // Outfits
    { name: 'Festival Outfits', category: 'Outfits', quantity: 3 },
    { name: 'Comfortable Shoes', category: 'Shoes', quantity: 1 },
    { name: 'Hat / Bandana', category: 'Accessories', quantity: 1 },
    { name: 'Sunglasses', category: 'Accessories', quantity: 1 },
    { name: 'Fanny Pack / Crossbody', category: 'Accessories', quantity: 1 },
    // Essentials
    { name: 'Reusable Water Bottle', category: 'Essentials', quantity: 1 },
    { name: 'Ear Plugs', category: 'Essentials', quantity: 2 },
    { name: 'Portable Charger', category: 'Essentials', quantity: 1 },
    { name: 'Sunscreen', category: 'Essentials', quantity: 1 },
    { name: 'Hand Sanitizer', category: 'Essentials', quantity: 1 },
    { name: 'Wet Wipes', category: 'Essentials', quantity: 2 },
    // Camping (if festival camping)
    { name: 'Tent', category: 'Camping', quantity: 1 },
    { name: 'Sleeping Bag', category: 'Camping', quantity: 1 },
    { name: 'Air Mattress', category: 'Camping', quantity: 1 },
    { name: 'Headlamp', category: 'Camping', quantity: 1 },
    // Extras
    { name: 'Glitter / Face Gems', category: 'Fun Stuff', quantity: 1 },
    { name: 'Rain Poncho', category: 'Essentials', quantity: 1 },
    { name: 'Snacks', category: 'Food', quantity: 5 },
  ],
};

export const petTemplate: Template = {
  id: 'template-pet',
  name: 'Travel with Pet',
  category: 'travel',
  icon: '🐶',
  description: 'Everything your furry friend needs',
  isDefault: true,
  items: [
    // Pet Documents
    { name: 'Vaccination Records', category: 'Pet Documents', quantity: 1 },
    { name: 'Pet Health Certificate', category: 'Pet Documents', quantity: 1 },
    { name: 'Microchip Info', category: 'Pet Documents', quantity: 1 },
    { name: 'Pet Passport (intl)', category: 'Pet Documents', quantity: 1 },
    // Carrier & Travel
    { name: 'Pet Carrier', category: 'Travel Gear', quantity: 1 },
    { name: 'Seat Belt Harness', category: 'Travel Gear', quantity: 1 },
    { name: 'Pet Travel Bowl', category: 'Travel Gear', quantity: 2 },
    { name: 'Water Bottle for Pet', category: 'Travel Gear', quantity: 1 },
    // Food & Medication
    { name: 'Pet Food (enough + extra)', category: 'Food', quantity: 1 },
    { name: 'Treats', category: 'Food', quantity: 1 },
    { name: 'Medications', category: 'Health', quantity: 1 },
    { name: 'Flea/Tick Prevention', category: 'Health', quantity: 1 },
    // Comfort Items
    { name: 'Favorite Toy', category: 'Comfort', quantity: 2 },
    { name: 'Blanket / Bed', category: 'Comfort', quantity: 1 },
    { name: 'Collar + ID Tag', category: 'Essentials', quantity: 1 },
    { name: 'Leash', category: 'Essentials', quantity: 2 },
    // Cleanup
    { name: 'Poop Bags', category: 'Cleanup', quantity: 2 },
    { name: 'Pet Wipes', category: 'Cleanup', quantity: 1 },
    { name: 'Litter & Tray (cats)', category: 'Cleanup', quantity: 1 },
  ],
};

export const marathonTemplate: Template = {
  id: 'template-marathon',
  name: 'Marathon / Race',
  category: 'travel',
  icon: '🏃',
  description: 'Race day essentials you can\'t forget',
  isDefault: true,
  items: [
    // Race Gear
    { name: 'Running Shoes', category: 'Race Gear', quantity: 1 },
    { name: 'Race Outfit (shirt + shorts)', category: 'Race Gear', quantity: 1 },
    { name: 'Socks (race-day pair)', category: 'Race Gear', quantity: 2 },
    { name: 'Sports Bra (if needed)', category: 'Race Gear', quantity: 1 },
    { name: 'Race Bib', category: 'Race Gear', quantity: 1 },
    { name: 'Timing Chip', category: 'Race Gear', quantity: 1 },
    // Nutrition
    { name: 'Energy Gels', category: 'Nutrition', quantity: 4 },
    { name: 'Chews / Blocks', category: 'Nutrition', quantity: 2 },
    { name: 'Electrolyte Tablets', category: 'Nutrition', quantity: 1 },
    { name: 'Water Bottle', category: 'Nutrition', quantity: 1 },
    { name: 'Pre-race Breakfast', category: 'Nutrition', quantity: 1 },
    // Recovery
    { name: 'Recovery Slides / Sandals', category: 'Recovery', quantity: 1 },
    { name: 'Compression Socks', category: 'Recovery', quantity: 1 },
    { name: 'Protein Bar / Shake', category: 'Recovery', quantity: 1 },
    { name: 'Foam Roller', category: 'Recovery', quantity: 1 },
    // Extras
    { name: 'Hat / Visor', category: 'Accessories', quantity: 1 },
    { name: 'Sunglasses', category: 'Accessories', quantity: 1 },
    { name: 'Sunscreen', category: 'Accessories', quantity: 1 },
    { name: 'Vaseline / Body Glide', category: 'Accessories', quantity: 1 },
    { name: 'Watch / GPS', category: 'Accessories', quantity: 1 },
  ],
};

export const roadTripTemplate: Template = {
  id: 'template-roadtrip',
  name: 'Road Trip',
  category: 'travel',
  icon: '🚗',
  description: 'Hit the road fully prepared',
  isDefault: true,
  items: [
    // Car Essentials
    { name: 'Driver\'s License', category: 'Documents', quantity: 1 },
    { name: 'Car Insurance', category: 'Documents', quantity: 1 },
    { name: 'Car Registration', category: 'Documents', quantity: 1 },
    { name: 'Roadside Assistance Info', category: 'Documents', quantity: 1 },
    { name: 'Spare Key', category: 'Car Essentials', quantity: 1 },
    { name: 'Jumper Cables', category: 'Car Essentials', quantity: 1 },
    { name: 'First Aid Kit', category: 'Car Essentials', quantity: 1 },
    { name: 'Flashlight', category: 'Car Essentials', quantity: 1 },
    // Navigation & Tech
    { name: 'Phone Mount', category: 'Tech', quantity: 1 },
    { name: 'Car Charger', category: 'Tech', quantity: 1 },
    { name: 'Aux Cable / Bluetooth Adapter', category: 'Tech', quantity: 1 },
    { name: 'GPS / Maps Offline', category: 'Tech', quantity: 1 },
    // Comfort & Snacks
    { name: 'Water Bottles', category: 'Food & Drink', quantity: 4 },
    { name: 'Snacks (non-perishable)', category: 'Food & Drink', quantity: 6 },
    { name: 'Cooler', category: 'Food & Drink', quantity: 1 },
    { name: 'Pillows / Blankets', category: 'Comfort', quantity: 2 },
    { name: 'Sunglasses', category: 'Comfort', quantity: 1 },
    // Hygiene
    { name: 'Wet Wipes', category: 'Hygiene', quantity: 2 },
    { name: 'Hand Sanitizer', category: 'Hygiene', quantity: 1 },
    { name: 'Tissues', category: 'Hygiene', quantity: 2 },
    { name: 'Trash Bags', category: 'Hygiene', quantity: 3 },
    // Luggage
    { name: 'Suitcases / Bags', category: 'Luggage', quantity: 2 },
    { name: 'Overnight Bag', category: 'Luggage', quantity: 1 },
  ],
};

// All travel templates
export const travelTemplates: Template[] = [
  beachTemplate,
  campingTemplate,
  businessTemplate,
  skiTemplate,
  familyTemplate,
  backpackingTemplate,
  festivalTemplate,
  petTemplate,
  marathonTemplate,
  roadTripTemplate,
];
