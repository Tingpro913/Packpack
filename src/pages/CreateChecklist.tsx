import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateChecklist } from '../hooks/useChecklists';
import { generateTravelChecklist, quickTemplates } from '../data/templates/travel';
import { defaultTemplates } from '../data/templates/defaultTemplates';
import type { TripDuration, TripType, ClimateType, CompanionType, ChecklistCategory } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useI18n } from '../contexts/I18nContext';
import { getTranslatedTemplateName } from '../i18n/contentTranslations';

type CreateStep = 'select-scenario' | 'travel-form' | 'custom-form';

function CreateChecklist() {
  const navigate = useNavigate();
  const { createFromTemplate, loading } = useCreateChecklist();
  const { t, lang } = useI18n();
  
  const [step, setStep] = useState<CreateStep>('select-scenario');
  
  // Travel form state
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState<TripDuration>('4-7days');
  const [tripType, setTripType] = useState<TripType>('city');
  const [climate, setClimate] = useState<ClimateType>('normal');
  const [companions, setCompanions] = useState<CompanionType>('alone');
  const [departureDate, setDepartureDate] = useState('');
  
  // Custom form state
  const [customTitle, setCustomTitle] = useState('');
  const [customIcon, setCustomIcon] = useState('📝');

  // Scenario options (i18n)
  const scenarios = [
    { category: 'travel' as ChecklistCategory, icon: '✈️', label: t.create.travel, description: t.create.travelDesc },
    { category: 'hospital' as ChecklistCategory, icon: '🏥', label: t.create.hospital, description: t.create.hospitalDesc },
    { category: 'moving' as ChecklistCategory, icon: '🏠', label: t.create.moving, description: t.create.movingDesc },
    { category: 'personal' as ChecklistCategory, icon: '🧘', label: t.create.personal, description: t.create.personalDesc },
    { category: 'emergency' as ChecklistCategory, icon: '🔥', label: t.create.emergency, description: t.create.emergencyDesc },
    { category: 'custom' as ChecklistCategory, icon: '➕', label: t.create.custom, description: t.create.customDesc },
  ];

  // Duration options (i18n)
  const durationOptions: { value: TripDuration; label: string }[] = [
    { value: '1day', label: t.create.duration1day },
    { value: '2-3days', label: t.create.duration23days },
    { value: '4-7days', label: t.create.duration47days },
    { value: '1-2weeks', label: t.create.duration12weeks },
    { value: '2+weeks', label: t.create.duration2weeks },
  ];

  // Trip type options (i18n)
  const tripTypeOptions: { value: TripType; label: string; icon: string }[] = [
    { value: 'city', label: t.create.typeCity, icon: '🏙️' },
    { value: 'business', label: t.create.typeBusiness, icon: '💼' },
    { value: 'family', label: t.create.typeFamily, icon: '👨‍👩‍👧' },
    { value: 'beach', label: t.create.typeBeach, icon: '🏖️' },
    { value: 'hiking', label: t.create.typeHiking, icon: '🥾' },
    { value: 'camping', label: t.create.typeCamping, icon: '⛺' },
    { value: 'ski', label: t.create.typeSki, icon: '⛷️' },
    { value: 'other', label: t.create.typeOther, icon: '✨' },
  ];

  // Climate options (i18n)
  const climateOptions: { value: ClimateType; label: string; icon: string }[] = [
    { value: 'normal', label: t.create.climateNormal, icon: '🌤️' },
    { value: 'hot', label: t.create.climateHot, icon: '☀️' },
    { value: 'cold', label: t.create.climateCold, icon: '❄️' },
    { value: 'extremely-cold', label: t.create.climateExtremeCold, icon: '🥶' },
    { value: 'rainy', label: t.create.climateRainy, icon: '🌧️' },
    { value: 'mixed', label: t.create.climateMixed, icon: '⛅' },
  ];

  // Companion options (i18n)
  const companionOptions: { value: CompanionType; label: string; icon: string }[] = [
    { value: 'alone', label: t.create.companionAlone, icon: '🚶' },
    { value: 'couple', label: t.create.companionCouple, icon: '👫' },
    { value: 'family', label: t.create.companionFamily, icon: '👨‍👩‍👧' },
    { value: 'children', label: t.create.companionChildren, icon: '👶' },
    { value: 'senior', label: t.create.companionSenior, icon: '👴' },
  ];

  // Step 1: Select scenario
  const handleSelectScenario = (category: ChecklistCategory) => {
    if (category === 'travel') {
      setStep('travel-form');
    } else if (category === 'custom') {
      setStep('custom-form');
    } else {
      // Direct creation for non-travel, non-custom templates
      createFromDefaultTemplate(category);
    }
  };

  // Create from default template (hospital, moving, personal, emergency)
  const createFromDefaultTemplate = async (category: ChecklistCategory) => {
    const template = defaultTemplates.find(t => t.category === category);
    if (!template) return;
    
    try {
      const checklist = await createFromTemplate(
        template.name,
        category,
        template.icon,
        template.items
      );
      navigate(`/checklist/${checklist.id}`);
    } catch (error) {
      console.error('Failed to create checklist:', error);
    }
  };

  // Create travel checklist
  const handleCreateTravel = async () => {
    const items = generateTravelChecklist({
      duration,
      tripType,
      climate,
      companions,
    });
    
    const title = destination 
      ? (lang === 'zh' ? `${destination}之旅` : `${destination} Trip`)
      : (lang === 'zh' ? '我的旅行' : 'My Trip');
    const icon = getTripIcon(tripType);
    
    try {
      const checklist = await createFromTemplate(
        title,
        'travel',
        icon,
        items,
        {
          destination: destination || undefined,
          tripDuration: duration,
          tripType,
          climate,
          companions,
          departureDate: departureDate || undefined,
          // Travel checklist title contains user input (destination), so don't translate
          titleUserModified: true,
        }
      );
      navigate(`/checklist/${checklist.id}`);
    } catch (error) {
      console.error('Failed to create travel checklist:', error);
    }
  };

  // Create custom checklist
  const handleCreateCustom = async () => {
    if (!customTitle.trim()) return;
    
    try {
      const checklist = await createFromTemplate(
        customTitle.trim(),
        'custom',
        customIcon,
        []
      );
      navigate(`/checklist/${checklist.id}`);
    } catch (error) {
      console.error('Failed to create custom checklist:', error);
    }
  };

  const goBack = () => {
    if (step === 'select-scenario') {
      navigate(-1);
    } else {
      setStep('select-scenario');
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <div className="sticky top-0 bg-surface-50/95 backdrop-blur-sm z-10 px-4 py-4 border-b border-surface-100">
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label={t.create.back}
          >
            ←
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            {step === 'select-scenario' && t.create.title}
            {step === 'travel-form' && t.create.travelTitle}
            {step === 'custom-form' && t.create.customTitle}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-32">
        {step === 'select-scenario' && (
          <ScenarioSelection scenarios={scenarios} onSelect={handleSelectScenario} quickTemplatesHint={t.create.quickTemplates} lang={lang} whatFor={t.create.whatFor} />
        )}
        
        {step === 'travel-form' && (
          <TravelForm
            destination={destination}
            setDestination={setDestination}
            duration={duration}
            setDuration={setDuration}
            tripType={tripType}
            setTripType={setTripType}
            climate={climate}
            setClimate={setClimate}
            companions={companions}
            setCompanions={setCompanions}
            departureDate={departureDate}
            setDepartureDate={setDepartureDate}
            t={t}
            durationOptions={durationOptions}
            tripTypeOptions={tripTypeOptions}
            climateOptions={climateOptions}
            companionOptions={companionOptions}
          />
        )}
        
        {step === 'custom-form' && (
          <CustomForm
            title={customTitle}
            setTitle={setCustomTitle}
            icon={customIcon}
            setIcon={setCustomIcon}
            t={t}
          />
        )}
      </div>

      {/* Bottom CTA for travel and custom forms */}
      {(step === 'travel-form' || step === 'custom-form') && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 p-4 safe-area-bottom">
          <div className="max-w-md mx-auto">
            <Button
              size="lg"
              fullWidth
              onClick={step === 'travel-form' ? handleCreateTravel : handleCreateCustom}
              disabled={loading || (step === 'custom-form' && !customTitle.trim())}
            >
              {loading ? t.create.creating : t.create.createBtn}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Scenario Selection
// ============================================

interface ScenarioSelectionProps {
  scenarios: { category: ChecklistCategory; icon: string; label: string; description: string }[];
  onSelect: (category: ChecklistCategory) => void;
  quickTemplatesHint: string;
  lang: string;
}

function ScenarioSelection({ scenarios, onSelect, quickTemplatesHint, lang, whatFor }: ScenarioSelectionProps & { whatFor: string }) {
  return (
    <div>
      <p className="text-gray-500 mb-6">{whatFor}</p>
      
      <div className="space-y-3">
        {scenarios.map(scenario => (
          <Card
            key={scenario.category}
            hover
            className="p-4"
            onClick={() => onSelect(scenario.category)}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">{scenario.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{scenario.label}</h3>
                <p className="text-sm text-gray-500">{scenario.description}</p>
              </div>
              <span className="text-gray-300 text-xl">›</span>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Quick templates hint */}
      <div className="mt-8">
        <p className="text-sm font-semibold text-gray-500 mb-3 px-1">
          {quickTemplatesHint}
        </p>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {quickTemplates.map(template => (
            <button
              key={template.id}
              onClick={() => onSelect('travel')}
              className="flex-shrink-0 bg-white rounded-xl px-4 py-3 border border-surface-200 hover:border-primary-300 transition-colors"
            >
              <div className="text-2xl mb-1">{template.icon}</div>
              <div className="text-xs font-medium text-gray-700 whitespace-nowrap">
                {getTranslatedTemplateName(template.name, lang)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Travel Form
// ============================================

interface TravelFormProps {
  destination: string;
  setDestination: (v: string) => void;
  duration: TripDuration;
  setDuration: (v: TripDuration) => void;
  tripType: TripType;
  setTripType: (v: TripType) => void;
  climate: ClimateType;
  setClimate: (v: ClimateType) => void;
  companions: CompanionType;
  setCompanions: (v: CompanionType) => void;
  departureDate: string;
  setDepartureDate: (v: string) => void;
  t: any;
  durationOptions: { value: TripDuration; label: string }[];
  tripTypeOptions: { value: TripType; label: string; icon: string }[];
  climateOptions: { value: ClimateType; label: string; icon: string }[];
  companionOptions: { value: CompanionType; label: string; icon: string }[];
}

function TravelForm({
  destination,
  setDestination,
  duration,
  setDuration,
  tripType,
  setTripType,
  climate,
  setClimate,
  companions,
  setCompanions,
  departureDate,
  setDepartureDate,
  t,
  durationOptions,
  tripTypeOptions,
  climateOptions,
  companionOptions,
}: TravelFormProps) {
  return (
    <div className="space-y-8">
      {/* Destination */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {t.create.destination}
        </label>
        <input
          type="text"
          placeholder={t.create.destinationPlaceholder}
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
        />
        <p className="text-xs text-gray-400 mt-1">{t.create.destinationOptional}</p>
      </div>

      {/* Departure Date */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {t.create.departureDate}
        </label>
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
        />
        <p className="text-xs text-gray-400 mt-1">{t.create.dateOptional}</p>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          {t.create.tripDuration}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {durationOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setDuration(option.value)}
              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                duration === option.value
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-surface-200 hover:border-primary-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Trip Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          {t.create.travelType}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {tripTypeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setTripType(option.value)}
              className={`p-3 rounded-xl text-center transition-all ${
                tripType === option.value
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-surface-200 hover:border-primary-300'
              }`}
            >
              <div className="text-2xl mb-1">{option.icon}</div>
              <div className="text-xs">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Climate */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          {t.create.climate}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {climateOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setClimate(option.value)}
              className={`p-3 rounded-xl text-center transition-all ${
                climate === option.value
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-surface-200 hover:border-primary-300'
              }`}
            >
              <div className="text-2xl mb-1">{option.icon}</div>
              <div className="text-xs">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Companions */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          {t.create.companions}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {companionOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setCompanions(option.value)}
              className={`p-3 rounded-xl text-center transition-all ${
                companions === option.value
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-surface-200 hover:border-primary-300'
              }`}
            >
              <div className="text-2xl mb-1">{option.icon}</div>
              <div className="text-xs">{option.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Custom Form
// ============================================

interface CustomFormProps {
  title: string;
  setTitle: (v: string) => void;
  icon: string;
  setIcon: (v: string) => void;
  t: any;
}

function CustomForm({ title, setTitle, icon, setIcon, t }: CustomFormProps) {
  const iconOptions = ['📝', '✅', '🎯', '📦', '🎒', '🏷️', '⭐', '💎', '🌟', '🎪'];
  
  return (
    <div className="space-y-6">
      <p className="text-gray-500">
        {t.create.customIntro}
      </p>
      
      {/* Icon picker */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          {t.create.chooseIcon}
        </label>
        <div className="flex flex-wrap gap-2">
          {iconOptions.map(emoji => (
            <button
              key={emoji}
              onClick={() => setIcon(emoji)}
              className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                icon === emoji
                  ? 'bg-primary-500 shadow-md scale-110'
                  : 'bg-white border border-surface-200 hover:border-primary-300'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
      
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {t.create.checklistName}
        </label>
        <input
          type="text"
          placeholder={t.create.namePlaceholder}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-surface-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-300"
          autoFocus
        />
      </div>
    </div>
  );
}

// Helper function
function getTripIcon(tripType: TripType): string {
  const icons: Record<TripType, string> = {
    city: '🏙️',
    business: '💼',
    family: '👨‍👩‍👧',
    beach: '🏖️',
    hiking: '🥾',
    camping: '⛺',
    ski: '⛷️',
    other: '✈️',
  };
  return icons[tripType] || '✈️';
}

export default CreateChecklist;
