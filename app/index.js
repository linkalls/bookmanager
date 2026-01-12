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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomeScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var useBooks_1 = require("../src/hooks/useBooks");
var BookItem_1 = require("../src/components/BookItem");
var Scanner_1 = require("../src/components/Scanner");
var lucide_react_native_1 = require("lucide-react-native");
var AppContext_1 = require("../src/context/AppContext");
function HomeScreen() {
    var _this = this;
    var _a = (0, useBooks_1.useBooks)(), saveBook = _a.saveBook, isSaved = _a.isSaved, searchBooks = _a.searchBooks, loading = _a.loading, error = _a.error;
    var _b = (0, react_1.useState)(''), query = _b[0], setQuery = _b[1];
    var _c = (0, react_1.useState)([]), searchResults = _c[0], setSearchResults = _c[1];
    var _d = (0, react_1.useState)(false), isScannerVisible = _d[0], setIsScannerVisible = _d[1];
    var _e = (0, react_1.useState)(0), startIndex = _e[0], setStartIndex = _e[1];
    var _f = (0, AppContext_1.useApp)(), theme = _f.theme, isDark = _f.isDark, t = _f.t;
    var handleSearch = function () { return __awaiter(_this, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!query.trim())
                        return [2 /*return*/];
                    setStartIndex(0);
                    return [4 /*yield*/, searchBooks(query, 0)];
                case 1:
                    results = _a.sent();
                    setSearchResults(results);
                    return [2 /*return*/];
            }
        });
    }); };
    var loadMore = function () { return __awaiter(_this, void 0, void 0, function () {
        var nextIndex, newResults;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    nextIndex = startIndex + 10;
                    return [4 /*yield*/, searchBooks(query, nextIndex)];
                case 1:
                    newResults = _a.sent();
                    if (newResults.length > 0) {
                        setSearchResults(function (prev) { return __spreadArray(__spreadArray([], prev, true), newResults, true); });
                        setStartIndex(nextIndex);
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var handleScan = function (isbn) { return __awaiter(_this, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsScannerVisible(false);
                    setQuery(isbn);
                    setStartIndex(0);
                    return [4 /*yield*/, searchBooks(isbn, 0)];
                case 1:
                    results = _a.sent();
                    setSearchResults(results);
                    return [2 /*return*/];
            }
        });
    }); };
    var clearResults = function () {
        setSearchResults([]);
        setQuery('');
        setStartIndex(0);
    };
    return (<react_native_safe_area_context_1.SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <react_native_1.StatusBar barStyle={isDark ? 'light-content' : 'dark-content'}/>

      {/* Header */}
      <react_native_1.View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.cardBorder }]}>
        <react_native_1.Text style={[styles.headerTitle, { color: theme.headerText }]}>{t('appName')}</react_native_1.Text>
      </react_native_1.View>

      <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Search Section */}
        <react_native_1.View style={[styles.searchCard, { backgroundColor: theme.searchCard, borderColor: theme.searchCardBorder }]}>
          <react_native_1.View style={styles.searchInputContainer}>
            <react_native_1.View style={styles.searchIconContainer}>
              <lucide_react_native_1.Search color={theme.textMuted} size={20}/>
            </react_native_1.View>
            <react_native_1.TextInput style={[styles.searchInput, {
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
                color: theme.text
            }]} placeholder={t('searchPlaceholder')} placeholderTextColor={theme.textMuted} value={query} onChangeText={setQuery} onSubmitEditing={handleSearch} returnKeyType="search"/>
          </react_native_1.View>

          <react_native_1.View style={styles.buttonRow}>
            <react_native_1.TouchableOpacity onPress={function () { return setIsScannerVisible(true); }} style={[styles.scanButton, { backgroundColor: isDark ? '#475569' : '#1e293b' }]}>
              <lucide_react_native_1.Camera color="white" size={20}/>
              <react_native_1.Text style={styles.buttonText}>{t('scan')}</react_native_1.Text>
            </react_native_1.TouchableOpacity>

            <react_native_1.TouchableOpacity onPress={handleSearch} disabled={loading} style={[styles.searchButton, { backgroundColor: theme.primary }]}>
              {loading && startIndex === 0 ? (<react_native_1.ActivityIndicator color="white"/>) : (<react_native_1.Text style={styles.buttonText}>{t('search')}</react_native_1.Text>)}
            </react_native_1.TouchableOpacity>
          </react_native_1.View>

          {error && (<react_native_1.Text style={styles.errorText}>{t('searchFailed')}</react_native_1.Text>)}
        </react_native_1.View>

        {/* Results Section */}
        {(searchResults.length > 0 || (loading && startIndex === 0)) && (<react_native_1.View style={styles.section}>
            <react_native_1.View style={styles.sectionHeaderRow}>
              <react_native_1.View style={styles.sectionHeader}>
                <lucide_react_native_1.Search size={20} color={theme.primary}/>
                <react_native_1.Text style={[styles.sectionTitle, { color: theme.text }]}>{t('results')}</react_native_1.Text>
                <react_native_1.View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
                  <react_native_1.Text style={[styles.badgeText, { color: theme.primary }]}>{searchResults.length}</react_native_1.Text>
                </react_native_1.View>
              </react_native_1.View>
              <react_native_1.TouchableOpacity onPress={clearResults} style={styles.clearButton}>
                <lucide_react_native_1.X size={20} color={theme.textMuted}/>
                <react_native_1.Text style={[styles.clearButtonText, { color: theme.textMuted }]}>{t('clear')}</react_native_1.Text>
              </react_native_1.TouchableOpacity>
            </react_native_1.View>

            {searchResults.map(function (book, index) { return (<BookItem_1.BookItem key={"".concat(book.id, "-").concat(index)} book={book} isSaved={isSaved(book.id)} onToggleSave={saveBook}/>); })}

            {/* Next Button */}
            {searchResults.length > 0 && (<react_native_1.TouchableOpacity onPress={loadMore} disabled={loading} style={[styles.loadMoreButton, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                {loading ? (<react_native_1.ActivityIndicator color={theme.primary}/>) : (<>
                    <react_native_1.Text style={[styles.loadMoreText, { color: theme.text }]}>{t('next') || 'Next'}</react_native_1.Text>
                    <lucide_react_native_1.ChevronDown size={20} color={theme.text}/>
                  </>)}
              </react_native_1.TouchableOpacity>)}
          </react_native_1.View>)}

        {/* Empty state */}
        {searchResults.length === 0 && !loading && (<react_native_1.View style={styles.section}>
            <react_native_1.View style={styles.sectionHeader}>
              <lucide_react_native_1.Search size={20} color={theme.primary}/>
              <react_native_1.Text style={[styles.sectionTitle, { color: theme.text }]}>{t('search')}</react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={[styles.emptyState, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
              <react_native_1.Text style={[styles.emptyStateText, { color: theme.textMuted }]}>
                {t('searchHint')}
              </react_native_1.Text>
            </react_native_1.View>
          </react_native_1.View>)}
      </react_native_1.ScrollView>

      <Scanner_1.Scanner isVisible={isScannerVisible} onClose={function () { return setIsScannerVisible(false); }} onScan={handleScan}/>
    </react_native_safe_area_context_1.SafeAreaView>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
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
        paddingBottom: 20,
    },
    searchCard: {
        borderRadius: 16,
        borderWidth: 2,
        padding: 16,
        marginBottom: 24,
    },
    searchInputContainer: {
        position: 'relative',
        marginBottom: 8,
    },
    searchIconContainer: {
        position: 'absolute',
        left: 12,
        top: 14,
        zIndex: 1,
    },
    searchInput: {
        width: '100%',
        paddingLeft: 40,
        paddingRight: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderRadius: 12,
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 8,
    },
    scanButton: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    searchButton: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    errorText: {
        color: '#ef4444',
        marginTop: 8,
        fontSize: 14,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 8,
    },
    clearButtonText: {
        fontSize: 14,
    },
    emptyState: {
        padding: 32,
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 2,
        borderStyle: 'dashed',
    },
    emptyStateText: {
        textAlign: 'center',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    loadMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        marginTop: 16,
        gap: 8,
    },
    loadMoreText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});
