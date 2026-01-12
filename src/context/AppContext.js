"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppProvider = AppProvider;
exports.useApp = useApp;
var react_1 = require("react");
var react_native_1 = require("react-native");
var async_storage_1 = require("@react-native-async-storage/async-storage");
var i18n_1 = require("../i18n");
var colors = {
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
var AppContext = (0, react_1.createContext)(undefined);
var LANGUAGE_KEY = '@bookmanager_language';
var THEME_KEY = '@bookmanager_theme';
function AppProvider(_a) {
    var children = _a.children;
    var systemColorScheme = (0, react_native_1.useColorScheme)();
    var _b = (0, react_1.useState)('ja'), language = _b[0], setLanguageState = _b[1];
    var _c = (0, react_1.useState)('system'), themeMode = _c[0], setThemeModeState = _c[1];
    var _d = (0, react_1.useState)(false), loaded = _d[0], setLoaded = _d[1];
    // Load saved preferences
    (0, react_1.useEffect)(function () {
        Promise.all([
            async_storage_1.default.getItem(LANGUAGE_KEY),
            async_storage_1.default.getItem(THEME_KEY),
        ]).then(function (_a) {
            var savedLang = _a[0], savedTheme = _a[1];
            if (savedLang === 'en' || savedLang === 'ja') {
                setLanguageState(savedLang);
            }
            if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
                setThemeModeState(savedTheme);
            }
            setLoaded(true);
        });
    }, []);
    var setLanguage = function (lang) {
        setLanguageState(lang);
        async_storage_1.default.setItem(LANGUAGE_KEY, lang);
    };
    var setThemeMode = function (mode) {
        setThemeModeState(mode);
        async_storage_1.default.setItem(THEME_KEY, mode);
    };
    var t = function (key) {
        return i18n_1.translations[language][key] || key;
    };
    var isDark = themeMode === 'system'
        ? systemColorScheme === 'dark'
        : themeMode === 'dark';
    var theme = isDark ? colors.dark : colors.light;
    if (!loaded) {
        return null;
    }
    return (<AppContext.Provider value={{
            language: language,
            setLanguage: setLanguage,
            t: t,
            themeMode: themeMode,
            setThemeMode: setThemeMode,
            isDark: isDark,
            theme: theme,
        }}>
      {children}
    </AppContext.Provider>);
}
function useApp() {
    var context = (0, react_1.useContext)(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}
