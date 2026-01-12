"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SettingsScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var lucide_react_native_1 = require("lucide-react-native");
var AppContext_1 = require("../src/context/AppContext");
var async_storage_1 = require("@react-native-async-storage/async-storage");
var expo_file_system_1 = require("expo-file-system");
var Sharing = require("expo-sharing");
var DocumentPicker = require("expo-document-picker");
var STORAGE_KEY = '@bookmanager_books';
function SettingsScreen() {
    var _this = this;
    var _a = (0, AppContext_1.useApp)(), theme = _a.theme, isDark = _a.isDark, t = _a.t, language = _a.language, setLanguage = _a.setLanguage, themeMode = _a.themeMode, setThemeMode = _a.setThemeMode;
    var handleExport = function () { return __awaiter(_this, void 0, void 0, function () {
        var data, fileName, file, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, async_storage_1.default.getItem(STORAGE_KEY)];
                case 1:
                    data = _a.sent();
                    if (!data) {
                        react_native_1.Alert.alert('Info', 'No data to export');
                        return [2 /*return*/];
                    }
                    fileName = "bookshelf_backup_".concat(new Date().toISOString().split('T')[0], ".json");
                    file = new expo_file_system_1.File(expo_file_system_1.Paths.document, fileName);
                    return [4 /*yield*/, file.write(data)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Sharing.isAvailableAsync()];
                case 3:
                    if (!_a.sent()) return [3 /*break*/, 5];
                    return [4 /*yield*/, Sharing.shareAsync(file.uri)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, react_native_1.Share.share({ message: data })];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    react_native_1.Alert.alert(t('exportSuccess'));
                    return [3 /*break*/, 9];
                case 8:
                    e_1 = _a.sent();
                    console.error('Export error:', e_1);
                    react_native_1.Alert.alert('Error', 'Export failed');
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var handleImport = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, asset, file, content_1, e_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, DocumentPicker.getDocumentAsync({
                            type: 'application/json',
                            copyToCacheDirectory: true,
                        })];
                case 1:
                    result = _a.sent();
                    if (result.canceled)
                        return [2 /*return*/];
                    asset = result.assets[0];
                    file = new expo_file_system_1.File(asset.uri);
                    return [4 /*yield*/, file.text()];
                case 2:
                    content_1 = _a.sent();
                    // Validate JSON
                    JSON.parse(content_1);
                    react_native_1.Alert.alert(t('importData'), t('importConfirm'), [
                        { text: t('cancel'), style: 'cancel' },
                        {
                            text: 'OK',
                            onPress: function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, async_storage_1.default.setItem(STORAGE_KEY, content_1)];
                                        case 1:
                                            _a.sent();
                                            react_native_1.Alert.alert(t('importSuccess'));
                                            return [2 /*return*/];
                                    }
                                });
                            }); }
                        }
                    ]);
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    console.error('Import error:', e_2);
                    react_native_1.Alert.alert('Error', 'Invalid file format');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<react_native_safe_area_context_1.SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <react_native_1.StatusBar barStyle={isDark ? 'light-content' : 'dark-content'}/>

      <react_native_1.View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.cardBorder }]}>
        <react_native_1.View style={styles.headerLeft}>
          <lucide_react_native_1.Settings color={theme.headerText} size={24}/>
          <react_native_1.Text style={[styles.headerTitle, { color: theme.headerText }]}>{t('settings')}</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Language */}
        <react_native_1.View style={styles.section}>
          <react_native_1.View style={styles.sectionHeader}>
            <lucide_react_native_1.Globe size={18} color={theme.primary}/>
            <react_native_1.Text style={[styles.sectionTitle, { color: theme.text }]}>{t('language')}</react_native_1.Text>
          </react_native_1.View>

          <react_native_1.View style={[styles.optionsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <react_native_1.TouchableOpacity onPress={function () { return setLanguage('ja'); }} style={[styles.optionRow, { borderBottomColor: theme.cardBorder }]}>
              <react_native_1.Text style={[styles.optionText, { color: theme.text }]}>日本語</react_native_1.Text>
              {language === 'ja' && <lucide_react_native_1.Check size={18} color={theme.success}/>}
            </react_native_1.TouchableOpacity>

            <react_native_1.TouchableOpacity onPress={function () { return setLanguage('en'); }} style={[styles.optionRow, { borderBottomWidth: 0 }]}>
              <react_native_1.Text style={[styles.optionText, { color: theme.text }]}>English</react_native_1.Text>
              {language === 'en' && <lucide_react_native_1.Check size={18} color={theme.success}/>}
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
        </react_native_1.View>

        {/* Theme */}
        <react_native_1.View style={styles.section}>
          <react_native_1.View style={styles.sectionHeader}>
            <lucide_react_native_1.Moon size={18} color={theme.primary}/>
            <react_native_1.Text style={[styles.sectionTitle, { color: theme.text }]}>{t('theme')}</react_native_1.Text>
          </react_native_1.View>

          <react_native_1.View style={[styles.optionsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <react_native_1.TouchableOpacity onPress={function () { return setThemeMode('light'); }} style={[styles.optionRow, { borderBottomColor: theme.cardBorder }]}>
              <react_native_1.View style={styles.optionLeft}>
                <lucide_react_native_1.Sun size={16} color={theme.textSecondary}/>
                <react_native_1.Text style={[styles.optionText, { color: theme.text }]}>{t('lightMode')}</react_native_1.Text>
              </react_native_1.View>
              {themeMode === 'light' && <lucide_react_native_1.Check size={18} color={theme.success}/>}
            </react_native_1.TouchableOpacity>

            <react_native_1.TouchableOpacity onPress={function () { return setThemeMode('dark'); }} style={[styles.optionRow, { borderBottomColor: theme.cardBorder }]}>
              <react_native_1.View style={styles.optionLeft}>
                <lucide_react_native_1.Moon size={16} color={theme.textSecondary}/>
                <react_native_1.Text style={[styles.optionText, { color: theme.text }]}>{t('darkMode')}</react_native_1.Text>
              </react_native_1.View>
              {themeMode === 'dark' && <lucide_react_native_1.Check size={18} color={theme.success}/>}
            </react_native_1.TouchableOpacity>

            <react_native_1.TouchableOpacity onPress={function () { return setThemeMode('system'); }} style={[styles.optionRow, { borderBottomWidth: 0 }]}>
              <react_native_1.View style={styles.optionLeft}>
                <lucide_react_native_1.Monitor size={16} color={theme.textSecondary}/>
                <react_native_1.Text style={[styles.optionText, { color: theme.text }]}>{t('systemMode')}</react_native_1.Text>
              </react_native_1.View>
              {themeMode === 'system' && <lucide_react_native_1.Check size={18} color={theme.success}/>}
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
        </react_native_1.View>

        {/* Data Management */}
        <react_native_1.View style={styles.section}>
          <react_native_1.View style={styles.sectionHeader}>
            <lucide_react_native_1.Download size={18} color={theme.primary}/>
            <react_native_1.Text style={[styles.sectionTitle, { color: theme.text }]}>{t('dataManagement')}</react_native_1.Text>
          </react_native_1.View>

          <react_native_1.View style={[styles.optionsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <react_native_1.TouchableOpacity onPress={handleExport} style={[styles.optionRow, { borderBottomColor: theme.cardBorder }]}>
              <react_native_1.View style={styles.optionLeft}>
                <lucide_react_native_1.Upload size={16} color={theme.textSecondary}/>
                <react_native_1.Text style={[styles.optionText, { color: theme.text }]}>{t('exportData')}</react_native_1.Text>
              </react_native_1.View>
            </react_native_1.TouchableOpacity>

            <react_native_1.TouchableOpacity onPress={handleImport} style={[styles.optionRow, { borderBottomWidth: 0 }]}>
              <react_native_1.View style={styles.optionLeft}>
                <lucide_react_native_1.Download size={16} color={theme.textSecondary}/>
                <react_native_1.Text style={[styles.optionText, { color: theme.text }]}>{t('importData')}</react_native_1.Text>
              </react_native_1.View>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
        </react_native_1.View>

        {/* App Info */}
        <react_native_1.View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <react_native_1.Text style={[styles.appName, { color: theme.text }]}>{t('appName')}</react_native_1.Text>
          <react_native_1.Text style={[styles.version, { color: theme.textMuted }]}>{t('version')} 1.0.0</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.ScrollView>
    </react_native_safe_area_context_1.SafeAreaView>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    optionsCard: {
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    optionText: {
        fontSize: 15,
        flex: 1,
    },
    infoCard: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 20,
        alignItems: 'center',
        marginTop: 10,
    },
    appName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    version: {
        fontSize: 13,
    },
});
