import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'packpack_notifications';

interface NotificationSettings {
  enabled: boolean;
  reminders1day: boolean;
  reminders3day: boolean;
  reminders7day: boolean;
  remindersSameDay: boolean;
  firedReminders: string[]; // checklistId-reminderId 格式
}

const defaultSettings: NotificationSettings = {
  enabled: false,
  reminders1day: true,
  reminders3day: true,
  reminders7day: true,
  remindersSameDay: true,
  firedReminders: [],
};

function loadSettings(): NotificationSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...defaultSettings, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load notification settings:', e);
  }
  return defaultSettings;
}

function saveSettings(settings: NotificationSettings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save notification settings:', e);
  }
}

export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>(loadSettings);

  // Sync with browser permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'denied' && settings.enabled) {
      // If permission was revoked, disable
      setSettings(s => ({ ...s, enabled: false }));
    }
  }, []);

  const updateSettings = useCallback((updates: Partial<NotificationSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...updates };
      saveSettings(next);
      return next;
    });
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) return false;
    
    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }
    
    if (permission === 'granted') {
      updateSettings({ enabled: true });
      return true;
    }
    return false;
  }, [updateSettings]);

  const toggleEnabled = useCallback(async () => {
    if (settings.enabled) {
      updateSettings({ enabled: false });
    } else {
      await requestPermission();
    }
  }, [settings.enabled, requestPermission, updateSettings]);

  const markFired = useCallback((key: string) => {
    setSettings(prev => {
      if (prev.firedReminders.includes(key)) return prev;
      const next = { ...prev, firedReminders: [...prev.firedReminders, key] };
      saveSettings(next);
      return next;
    });
  }, []);

  const hasFired = useCallback((key: string) => {
    return settings.firedReminders.includes(key);
  }, [settings.firedReminders]);

  return {
    settings,
    updateSettings,
    requestPermission,
    toggleEnabled,
    markFired,
    hasFired,
  };
}

// Show a notification helper
export function showNotification(title: string, body: string, tag?: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(title, {
      body,
      icon: '/icon-192.svg',
      badge: '/icon-192.svg',
      tag,
    });
  } catch (e) {
    console.warn('Notification failed:', e);
  }
}

// Calculate reminder timestamps
export function getReminderTimestamp(departureDateStr: string, daysBefore: number): number {
  const date = new Date(departureDateStr);
  date.setHours(9, 0, 0, 0); // 9 AM local time
  date.setDate(date.getDate() - daysBefore);
  return date.getTime();
}
