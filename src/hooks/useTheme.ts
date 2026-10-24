import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'auto';

const STORAGE_KEY = 'packly_theme';

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    return saved || 'light';
  });

  const [isDark, setIsDark] = useState(false);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    
    const updateDark = () => {
      let dark = false;
      if (mode === 'dark') {
        dark = true;
      } else if (mode === 'auto') {
        dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      setIsDark(dark);
      if (dark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    updateDark();
    localStorage.setItem(STORAGE_KEY, mode);

    // Listen for system changes when in auto mode
    if (mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => updateDark();
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [mode]);

  return {
    mode,
    isDark,
    setMode,
  };
}
