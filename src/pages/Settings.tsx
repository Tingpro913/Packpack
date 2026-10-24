import { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useNotificationSettings, showNotification } from '../hooks/useNotificationSettings';
import { useThemeContext } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';

function Settings() {
  const { settings, updateSettings } = useNotificationSettings();
  const { mode, setMode } = useThemeContext();
  const { lang, setLang, t } = useI18n();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showReminderSettings, setShowReminderSettings] = useState(false);

  const handleClearData = () => {
    setShowClearConfirm(false);
    alert(lang === 'zh' ? '所有数据已清除！（演示用）' : 'All data cleared! (This is a demo)');
  };

  const handleToggleNotifications = async () => {
    if (!('Notification' in window)) {
      alert(lang === 'zh' ? '此浏览器不支持通知' : 'Notifications not supported in this browser');
      return;
    }
    
    if (settings.enabled) {
      updateSettings({ enabled: false });
      return;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      updateSettings({ enabled: true });
      showNotification(
        lang === 'zh' ? 'PackPack 通知已开启 🔔' : 'PackPack Notifications On 🔔',
        lang === 'zh' ? '你将收到打包提醒！' : "You'll now get packing reminders!"
      );
    } else if (permission === 'denied') {
      alert(lang === 'zh' ? '通知被阻止，请在浏览器设置中启用。' : 'Notifications are blocked. Please enable them in your browser settings.');
    }
  };

  return (
    <div className="px-4 pt-6 pb-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t.settings.title}</h1>
      
      {/* App info */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200">
          <span className="text-4xl">🎒</span>
        </div>
        <h2 className="font-bold text-gray-900 text-lg">PackPack</h2>
        <p className="text-sm text-gray-500">{t.settings.version} 1.0.0</p>
      </div>
      
      {/* Settings groups */}
      <div className="space-y-6">
        {/* General */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            {t.settings.general}
          </h3>
          <Card className="divide-y divide-surface-100 overflow-hidden">
            <SettingItem 
              icon="🔔" 
              label={t.settings.notifications} 
              rightContent={
                <button
                  onClick={handleToggleNotifications}
                  className="toggle-switch"
                  role="switch"
                  aria-checked={settings.enabled}
                >
                  <span className={`toggle-thumb ${settings.enabled ? 'on' : ''}`} />
                </button>
              }
            />
            {settings.enabled && (
              <>
                <SettingItem 
                  icon="⏰" 
                  label={t.settings.reminderTimes} 
                  rightContent={<span className="text-gray-300 text-lg">›</span>}
                  onClick={() => setShowReminderSettings(true)}
                />
              </>
            )}
            <SettingItem 
              icon="🌙" 
              label={t.settings.darkMode} 
              rightContent={
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as 'light' | 'dark' | 'auto')}
                  className="bg-surface-50 dark:bg-gray-700 dark:text-gray-200 text-sm text-gray-600 px-3 py-1.5 rounded-lg border-0 focus:ring-2 focus:ring-primary-300 cursor-pointer"
                >
                  <option value="light">{t.settings.off}</option>
                  <option value="dark">{t.settings.on}</option>
                  <option value="auto">{t.settings.auto}</option>
                </select>
              }
            />
            <SettingItem 
              icon="🌐" 
              label={t.settings.language} 
              rightContent={
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as 'en' | 'zh')}
                  className="bg-surface-50 dark:bg-gray-700 dark:text-gray-200 text-sm text-gray-600 px-3 py-1.5 rounded-lg border-0 focus:ring-2 focus:ring-primary-300 cursor-pointer"
                >
                  <option value="en">{t.common.english}</option>
                  <option value="zh">{t.common.chinese}</option>
                </select>
              }
            />
            <SettingItem icon="📐" label={t.settings.units} value="Imperial" />
          </Card>
        </div>
        
        {/* Data */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            {t.settings.data}
          </h3>
          <Card className="divide-y divide-surface-100 overflow-hidden">
            <SettingItem icon="💾" label={t.settings.storage} value={t.settings.localOnly} />
            <SettingItem icon="📤" label={t.settings.exportData} />
            <SettingItem icon="📥" label={t.settings.importData} />
            <SettingItem 
              icon="🗑️" 
              label={t.settings.clearAllData} 
              rightContent={<span className="text-red-500 text-sm">›</span>}
              onClick={() => setShowClearConfirm(true)}
            />
          </Card>
        </div>
        
        {/* About */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 px-1">
            {t.settings.about}
          </h3>
          <Card className="divide-y divide-surface-100 overflow-hidden">
            <SettingItem icon="⭐" label={t.settings.rateApp} />
            <SettingItem icon="📖" label={t.settings.whatsNew} />
            <SettingItem icon="❓" label={t.settings.helpFaq} />
            <SettingItem icon="📧" label={t.settings.contactUs} />
            <SettingItem icon="📜" label={t.settings.privacyPolicy} />
            <SettingItem icon="📋" label={t.settings.termsOfService} />
          </Card>
        </div>
      </div>
      
      <p className="text-center text-xs text-gray-400 mt-8">
        {t.settings.madeWith}
      </p>

      {/* Reminder settings dialog */}
      {showReminderSettings && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowReminderSettings(false)}
          />
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl sm:mx-4 animate-slide-up">
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">⏰</div>
              <h3 className="text-lg font-bold text-gray-900">{t.settings.reminderTimes}</h3>
              <p className="text-sm text-gray-500 mt-1">{t.settings.reminderDesc}</p>
            </div>
            
            <div className="space-y-2 mb-6">
              <ReminderToggle
                label={t.settings.reminder1week}
                description={t.settings.reminder1weekDesc}
                checked={settings.reminders7day}
                onChange={(v) => updateSettings({ reminders7day: v })}
              />
              <ReminderToggle
                label={t.settings.reminder3days}
                description={t.settings.reminder3daysDesc}
                checked={settings.reminders3day}
                onChange={(v) => updateSettings({ reminders3day: v })}
              />
              <ReminderToggle
                label={t.settings.reminder1day}
                description={t.settings.reminder1dayDesc}
                checked={settings.reminders1day}
                onChange={(v) => updateSettings({ reminders1day: v })}
              />
              <ReminderToggle
                label={t.settings.reminderSameDay}
                description={t.settings.reminderSameDayDesc}
                checked={settings.remindersSameDay}
                onChange={(v) => updateSettings({ remindersSameDay: v })}
              />
            </div>
            
            <Button variant="primary" fullWidth onClick={() => setShowReminderSettings(false)}>
              {t.settings.done}
            </Button>
          </div>
        </div>
      )}

      {/* Clear data confirmation dialog */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowClearConfirm(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-bounce-in">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{t.settings.clearConfirm}</h3>
              <p className="text-sm text-gray-500">
                {t.settings.clearConfirmDesc}
              </p>
            </div>
            <div className="space-y-3">
              <Button variant="danger" fullWidth onClick={handleClearData}>
                {t.settings.confirmDelete}
              </Button>
              <Button variant="ghost" fullWidth onClick={() => setShowClearConfirm(false)}>
                {t.common.cancel}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ReminderToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ReminderToggle({ label, description, checked, onChange }: ReminderToggleProps) {
  return (
    <div 
      className="flex items-center justify-between py-3 px-4 bg-surface-50 rounded-xl cursor-pointer hover:bg-surface-100 transition-colors"
      onClick={() => onChange(!checked)}
    >
      <div>
        <p className="font-medium text-gray-900 text-sm">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        className="toggle-switch toggle-switch-sm"
        role="switch"
        aria-checked={checked}
      >
        <span className={`toggle-thumb toggle-thumb-sm ${checked ? 'on' : ''}`} />
      </button>
    </div>
  );
}

interface SettingItemProps {
  icon: string;
  label: string;
  value?: string;
  rightContent?: React.ReactNode;
  onClick?: () => void;
}

function SettingItem({ icon, label, value, rightContent, onClick }: SettingItemProps) {
  return (
    <div 
      className={`flex items-center px-4 py-3.5 ${onClick ? 'cursor-pointer hover:bg-surface-50 transition-colors' : ''}`}
      onClick={onClick}
    >
      <span className="text-xl mr-3">{icon}</span>
      <span className="flex-1 text-gray-900 text-sm">{label}</span>
      {rightContent || (value && <span className="text-sm text-gray-400">{value}</span>)}
      {!rightContent && <span className="text-gray-300 ml-2 text-lg">›</span>}
    </div>
  );
}

export default Settings;
