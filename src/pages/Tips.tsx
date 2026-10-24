import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useI18n } from '../contexts/I18nContext';
import { getTranslatedTip } from '../i18n/contentTranslations';

// Tips data
const tips = [
  {
    id: '1',
    title: 'How to Pack a Suitcase',
    description: 'Maximize space and minimize wrinkles',
    image: '🧳',
    category: 'Packing',
    readTime: '3 min',
    steps: [
      { step: 1, title: 'Heavy items first', description: 'Put heavier items like shoes and books near the bottom of your suitcase (wheel side). This keeps the suitcase stable and prevents lighter items from getting crushed.', image: '⬇️' },
      { step: 2, title: 'Roll your clothes', description: 'Roll clothes tightly instead of folding. This saves up to 30% more space and reduces wrinkles. Start with larger items like pants, then shirts, then smaller items.', image: '👕' },
      { step: 3, title: 'Shoes in bags', description: 'Put each pair of shoes into a separate shoe bag or shower cap. This keeps dirty shoe soles from touching your clean clothes.', image: '👟' },
      { step: 4, title: 'Easy access docs', description: 'Keep important documents (passport, ID, tickets) in an easily accessible pocket — never pack them in checked luggage.', image: '📄' },
      { step: 5, title: 'Use packing cubes', description: 'Packing cubes help organize your clothes and make it easy to find things without unpacking everything.', image: '📦' },
    ],
  },
  {
    id: '2',
    title: 'Carry-On Essentials',
    description: 'Never be without the basics',
    image: '🎒',
    category: 'Carry-On',
    readTime: '2 min',
    steps: [
      { step: 1, title: 'Documents & money', description: 'Keep passport, ID, tickets, credit cards, and some cash in your carry-on. Use a travel wallet for easy access.', image: '📋' },
      { step: 2, title: 'Chargers & power bank', description: 'Always pack your phone charger and a portable power bank. Flight delays happen, and you don\'t want a dead phone.', image: '🔌' },
      { step: 3, title: 'Change of clothes', description: 'Pack underwear, a shirt, socks, and a light layer. In case your checked luggage is delayed, you\'ll have the basics.', image: '👔' },
      { step: 4, title: 'Basic toiletries', description: 'Travel-sized toothbrush, toothpaste, deodorant, and face wipes. Perfect for freshening up on long flights.', image: '🧴' },
      { step: 5, title: 'Entertainment & comfort', description: 'Headphones, a book or tablet, neck pillow, eye mask, and earplugs. Long flights are much more bearable when you can rest.', image: '🎧' },
    ],
  },
  {
    id: '3',
    title: 'Space-Saving Hacks',
    description: 'Fit more in less space',
    image: '📦',
    category: 'Tips',
    readTime: '4 min',
    steps: [
      { step: 1, title: 'Use packing cubes', description: 'Packing cubes compress clothes and keep them organized. You can fit significantly more by compressing soft items.', image: '📦' },
      { step: 2, title: 'Stuff your shoes', description: 'Fill the empty space inside shoes with socks, underwear, chargers, or other small items. Every inch counts!', image: '🧦' },
      { step: 3, title: 'Wear bulky items', description: 'Wear your bulkiest clothes (jackets, boots, sweaters) while traveling instead of packing them. This frees up lots of space.', image: '🧥' },
      { step: 4, title: 'Travel-sized everything', description: 'Use travel-sized toiletries or refillable silicone bottles. Most hotels provide shampoo and soap.', image: '🧴' },
      { step: 5, title: 'Bundle wrapping', description: 'Wrap all your clothes around a core bundle. This method minimizes wrinkles and maximizes space!', image: '🎁' },
      { step: 6, title: 'Vacuum seal bags', description: 'For bulky items like sweaters and coats, vacuum seal bags can reduce volume by 50%. Great for cold weather trips.', image: '🫁' },
    ],
  },
  {
    id: '4',
    title: 'Carry On Liquids 101',
    description: 'Master the 3-1-1 rule',
    image: '🧴',
    category: 'Air Travel',
    readTime: '2 min',
    steps: [
      { step: 1, title: 'The 3-1-1 rule', description: 'Each liquid container must be 3.4 oz (100ml) or less. All containers fit in 1 clear quart-sized bag. 1 bag per passenger.', image: '📏' },
      { step: 2, title: 'What counts as liquid?', description: 'Liquids, gels, aerosols, creams, and pastes all count. This includes toothpaste, shampoo, lotion, and lip gloss!', image: '💧' },
      { step: 3, title: 'Exceptions', description: 'Medications, baby formula/food, and breast milk are allowed in reasonable quantities. Declare them at security.', image: '💊' },
      { step: 4, title: 'Duty-free liquids', description: 'Liquids bought at duty-free shops after security are allowed, as long as they\'re in the sealed tamper-evident bag.', image: '🛍️' },
    ],
  },
];

function Tips() {
  const [selectedTip, setSelectedTip] = useState<typeof tips[0] | null>(null);
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState(t.tips.all);
  
  const categories = [t.tips.all, ...Array.from(new Set(tips.map(tip => getTranslatedTip(tip, lang).category)))];
  const filteredTips = filter === t.tips.all 
    ? tips 
    : tips.filter(tip => getTranslatedTip(tip, lang).category === filter);

  // Detail view
  if (selectedTip) {
    const tip = getTranslatedTip(selectedTip, lang);
    return (
      <div className="min-h-screen bg-surface-50">
        {/* Header */}
        <div className="bg-white sticky top-0 z-20 border-b border-surface-100 safe-area-top">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
            <button
              onClick={() => setSelectedTip(null)}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ←
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-primary-600 uppercase">{tip.category}</p>
              <h1 className="text-lg font-bold text-gray-900 truncate">{tip.title}</h1>
            </div>
            <span className="text-xs text-gray-400">{tip.readTime}</span>
          </div>
        </div>

        {/* Hero */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 px-4 py-10 text-center">
          <div className="text-7xl mb-4">{tip.image}</div>
          <p className="text-gray-600 max-w-sm mx-auto">{tip.description}</p>
        </div>

        {/* Steps */}
        <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
          {tip.steps.map((step, index) => (
            <div key={step.step} className="bg-white rounded-2xl p-5 shadow-sm border border-surface-100 relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-2xl">
                  {step.image}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center">
                      {step.step}
                    </span>
                    <h3 className="font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
              {index < tip.steps.length - 1 && (
                <div className="absolute left-9 bottom-0 translate-y-full w-0.5 h-4 bg-primary-200"></div>
              )}
            </div>
          ))}

          {/* CTA */}
          <div className="mt-8">
            <Button variant="primary" fullWidth onClick={() => setSelectedTip(null)}>
              {t.tips.back}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="px-4 pt-6 pb-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{t.tips.title}</h1>
      <p className="text-gray-500 text-sm mb-6">{t.tips.subtitle}</p>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar -mx-4 px-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === cat
                ? 'bg-primary-500 text-white shadow-md shadow-primary-200'
                : 'bg-white text-gray-600 border border-surface-200 hover:border-primary-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        {filteredTips.map(originalTip => {
          const tip = getTranslatedTip(originalTip, lang);
          return (
          <Card key={tip.id} hover className="overflow-hidden cursor-pointer" onClick={() => setSelectedTip(originalTip)}>
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{tip.image}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary-600 uppercase">
                      {tip.category}
                    </span>
                    <span className="text-xs text-gray-400">· {tip.readTime}</span>
                  </div>
                  <h3 className="font-bold text-gray-900">{tip.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{tip.description}</p>
                </div>
                <span className="text-gray-300 text-xl self-center">→</span>
              </div>
            </div>
            
            {/* Steps preview */}
            <div className="bg-surface-50 px-4 py-3 border-t border-surface-100">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {tip.steps.slice(0, 3).map(step => (
                  <div
                    key={step.step}
                    className="flex-shrink-0 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full text-xs shadow-sm"
                  >
                    <span>{step.image}</span>
                    <span className="text-gray-600">{step.title}</span>
                  </div>
                ))}
                {tip.steps.length > 3 && (
                  <div className="flex-shrink-0 flex items-center text-xs text-gray-400 px-2">
                    +{tip.steps.length - 3} {lang === 'zh' ? '更多' : 'more'}
                  </div>
                )}
              </div>
            </div>
          </Card>
          );
        })}
      </div>
      
      <p className="text-center text-sm text-gray-400 mt-8">
        {lang === 'zh' ? '更多技巧即将推出！✨' : 'More tips coming soon! ✨'}
      </p>
    </div>
  );
}

export default Tips;
