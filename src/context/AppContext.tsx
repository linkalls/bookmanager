import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, Language, TranslationKey } from '../i18n';

type ThemeMode = 'light' | 'dark' | 'system';

const colors = {
  light: {
    background: '#ffffff',
    card: '#ffffff',
    cardBorder: '#f1f5f9',
    text: '#0f172a',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    header: '#78350f',
    headerText: '#fffbeb',
    primary: '#d97706',
    primaryLight: '#fef3c7',
    success: '#22c55e',
    successLight: '#dcfce7',
    danger: '#ef4444',
    dangerLight: '#fecaca',
    inputBg: '#f8fafc',
    inputBorder: '#e2e8f0',
    searchCard: '#ffffff',
    searchCardBorder: '#fef3c7',
    libraryCard: '#fffbeb',
    libraryCardBorder: '#fde68a',
    tagBg: '#e0e7ff',
    tagText: '#3730a3',
  },
  dark: {
    background: '#0f172a',
    card: '#1e293b',
    cardBorder: '#334155',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    header: '#1e293b',
    headerText: '#f59e0b',
    primary: '#f59e0b',
    primaryLight: '#451a03',
    success: '#22c55e',
    successLight: '#14532d',
    danger: '#ef4444',
    dangerLight: '#7f1d1d',
    inputBg: '#334155',
    inputBorder: '#475569',
    searchCard: '#1e293b',
    searchCardBorder: '#475569',
    libraryCard: '#1e293b',
    libraryCardBorder: '#475569',
    tagBg: '#312e81',
    tagText: '#a5b4fc',
  },
};

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
  theme: typeof colors.light;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LANGUAGE_KEY = '@bookmanager_language';
const THEME_KEY = '@bookmanager_theme';

export function AppProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [language, setLanguageState] = useState<Language>('ja');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [loaded, setLoaded] = useState(false);

  // Load saved preferences
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(LANGUAGE_KEY),
      AsyncStorage.getItem(THEME_KEY),
    ]).then(([savedLang, savedTheme]) => {
      if (savedLang === 'en' || savedLang === 'ja') {
        setLanguageState(savedLang);
      }
      if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
        setThemeModeState(savedTheme);
      }
      setLoaded(true);
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(LANGUAGE_KEY, lang);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_KEY, mode);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  const isDark = themeMode === 'system' 
    ? systemColorScheme === 'dark'
    : themeMode === 'dark';

  const theme = isDark ? colors.dark : colors.light;

  if (!loaded) {
    return null;
  }

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      t,
      themeMode,
      setThemeMode,
      isDark,
      theme,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
