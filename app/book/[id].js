"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.default = BookDetailScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var expo_router_1 = require("expo-router");
var useBooks_1 = require("../../src/hooks/useBooks");
var lucide_react_native_1 = require("lucide-react-native");
var Linking = require("expo-linking");
var AppContext_1 = require("../../src/context/AppContext");
var isbn_1 = require("../../src/utils/isbn");
function BookDetailScreen() {
    var _this = this;
    var router = (0, expo_router_1.useRouter)();
    var params = (0, expo_router_1.useLocalSearchParams)();
    var _a = (0, useBooks_1.useBooks)(), saveBook = _a.saveBook, removeBook = _a.removeBook, getSavedBook = _a.getSavedBook, checkIsSaved = _a.isSaved, updateBook = _a.updateBook;
    var _b = (0, AppContext_1.useApp)(), theme = _b.theme, isDark = _b.isDark, t = _b.t;
    var _c = (0, react_1.useState)(null), book = _c[0], setBook = _c[1];
    var _d = (0, react_1.useState)(''), tagsInput = _d[0], setTagsInput = _d[1];
    var _e = (0, react_1.useState)(''), comment = _e[0], setComment = _e[1];
    // New fields state
    var _f = (0, react_1.useState)('want_to_read'), status = _f[0], setStatus = _f[1];
    var _g = (0, react_1.useState)(''), currentPage = _g[0], setCurrentPage = _g[1];
    var _h = (0, react_1.useState)(''), totalPages = _h[0], setTotalPages = _h[1];
    var _j = (0, react_1.useState)(''), startDate = _j[0], setStartDate = _j[1];
    var _k = (0, react_1.useState)(''), finishDate = _k[0], setFinishDate = _k[1];
    var _l = (0, react_1.useState)(false), isEditing = _l[0], setIsEditing = _l[1];
    var amazonUrl = (book === null || book === void 0 ? void 0 : book.isbn) ? (0, isbn_1.getAmazonUrl)(book.isbn) : null;
    (0, react_1.useEffect)(function () {
        var _a, _b, _c;
        if (params.bookData) {
            var parsedBook = JSON.parse(params.bookData);
            var savedVersion = getSavedBook(parsedBook.id);
            if (savedVersion) {
                setBook(savedVersion);
                setTagsInput(((_a = savedVersion.tags) === null || _a === void 0 ? void 0 : _a.join(', ')) || '');
                setComment(savedVersion.comment || '');
                setStatus(savedVersion.status || 'want_to_read');
                setCurrentPage(((_b = savedVersion.currentPage) === null || _b === void 0 ? void 0 : _b.toString()) || '');
                setTotalPages(((_c = savedVersion.totalPages) === null || _c === void 0 ? void 0 : _c.toString()) || '');
                setStartDate(savedVersion.startDate || '');
                setFinishDate(savedVersion.finishDate || '');
                setIsEditing(true);
            }
            else {
                setBook(parsedBook);
                setTagsInput('');
                setComment('');
                setStatus('want_to_read');
                setCurrentPage('');
                setTotalPages('');
                setStartDate('');
                setFinishDate('');
                setIsEditing(false);
            }
        }
    }, [params.bookData, getSavedBook]);
    var handleSave = function () { return __awaiter(_this, void 0, void 0, function () {
        var tags, newStatus, today, updatedBook;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!book)
                        return [2 /*return*/];
                    tags = tagsInput.split(',').map(function (tag) { return tag.trim(); }).filter(Boolean);
                    newStatus = status;
                    if (status === 'want_to_read' && currentPage && parseInt(currentPage) > 0) {
                        newStatus = 'reading';
                        setStatus('reading');
                    }
                    if (status === 'reading' && currentPage && totalPages && currentPage === totalPages) {
                        newStatus = 'completed';
                        setStatus('completed');
                        if (!finishDate) {
                            today = new Date().toISOString().split('T')[0];
                            setFinishDate(today);
                        }
                    }
                    updatedBook = __assign(__assign({}, book), { tags: tags, comment: comment, status: newStatus, currentPage: currentPage ? parseInt(currentPage) : undefined, totalPages: totalPages ? parseInt(totalPages) : undefined, startDate: startDate || undefined, finishDate: finishDate || undefined });
                    if (!checkIsSaved(book.id)) return [3 /*break*/, 2];
                    return [4 /*yield*/, updateBook(updatedBook)];
                case 1:
                    _a.sent();
                    react_native_1.Alert.alert(t('updated'), t('updatedMessage'));
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, saveBook(updatedBook)];
                case 3:
                    _a.sent();
                    react_native_1.Alert.alert(t('saved'), t('savedMessage'));
                    setIsEditing(true);
                    _a.label = 4;
                case 4:
                    setBook(updatedBook);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDelete = function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            if (!book)
                return [2 /*return*/];
            react_native_1.Alert.alert(t('deleteBook'), t('deleteConfirm'), [
                { text: t('cancel'), style: "cancel" },
                {
                    text: t('delete'),
                    style: "destructive",
                    onPress: function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, removeBook(book.id)];
                                case 1:
                                    _a.sent();
                                    router.back();
                                    return [2 /*return*/];
                            }
                        });
                    }); }
                }
            ]);
            return [2 /*return*/];
        });
    }); };
    var setToday = function (setter) {
        var today = new Date().toISOString().split('T')[0];
        setter(today);
    };
    if (!book)
        return <react_native_safe_area_context_1.SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}/>;
    var isSaved = checkIsSaved(book.id);
    var statusOptions = [
        { value: 'want_to_read', label: t('wantToRead') || 'Want to Read', color: theme.textMuted },
        { value: 'reading', label: t('reading') || 'Reading', color: theme.primary },
        { value: 'completed', label: t('completed') || 'Completed', color: '#22c55e' },
        { value: 'dropped', label: t('dropped') || 'Dropped', color: theme.danger },
    ];
    return (<react_native_safe_area_context_1.SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <expo_router_1.Stack.Screen options={{ headerShown: false }}/>

      {/* Header */}
      <react_native_1.View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.cardBorder }]}>
        <react_native_1.TouchableOpacity onPress={function () { return router.back(); }} style={styles.backButton}>
          <lucide_react_native_1.ArrowLeft size={24} color={theme.text}/>
        </react_native_1.TouchableOpacity>
        <react_native_1.Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>{t('bookDetails')}</react_native_1.Text>
        <react_native_1.View style={styles.headerSpacer}/>
      </react_native_1.View>

      <react_native_1.KeyboardAvoidingView behavior={react_native_1.Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <react_native_1.View style={styles.bookHeader}>
            <react_native_1.View style={[styles.thumbnailContainer, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
              {book.thumbnail ? (<react_native_1.Image source={{ uri: book.thumbnail }} style={styles.thumbnail} resizeMode="cover"/>) : (<react_native_1.View style={styles.noImage}>
                  <react_native_1.Text style={[styles.noImageText, { color: theme.textMuted }]}>No Image</react_native_1.Text>
                </react_native_1.View>)}
            </react_native_1.View>
            <react_native_1.View style={styles.bookInfo}>
              <react_native_1.Text style={[styles.bookTitle, { color: theme.text }]}>{book.title}</react_native_1.Text>
              <react_native_1.Text style={[styles.bookAuthor, { color: theme.textSecondary }]}>{book.authors.join(', ')}</react_native_1.Text>
              {book.publishedDate && (<react_native_1.Text style={[styles.bookMeta, { color: theme.textMuted }]}>{t('published')}: {book.publishedDate}</react_native_1.Text>)}
              {book.isbn && (<react_native_1.Text style={[styles.bookMeta, { color: theme.textMuted }]}>ISBN: {book.isbn}</react_native_1.Text>)}

              <react_native_1.View style={styles.linkRow}>
                <react_native_1.TouchableOpacity onPress={function () { return Linking.openURL(book.link); }} style={[styles.linkButton, { backgroundColor: theme.inputBg }]}>
                  <lucide_react_native_1.ExternalLink size={14} color="#3b82f6"/>
                  <react_native_1.Text style={styles.googleLinkText}>Google</react_native_1.Text>
                </react_native_1.TouchableOpacity>

                {amazonUrl && (<react_native_1.TouchableOpacity onPress={function () { return Linking.openURL(amazonUrl); }} style={[styles.linkButton, { backgroundColor: '#ff9900' }]}>
                    <lucide_react_native_1.ShoppingCart size={14} color="white"/>
                    <react_native_1.Text style={styles.amazonLinkText}>Amazon</react_native_1.Text>
                  </react_native_1.TouchableOpacity>)}
              </react_native_1.View>
            </react_native_1.View>
          </react_native_1.View>

          <react_native_1.View style={[styles.formCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>

            {/* Status Section */}
            <react_native_1.View style={styles.formSection}>
              <react_native_1.View style={styles.formLabel}>
                <lucide_react_native_1.CheckCircle size={16} color={theme.primary}/>
                <react_native_1.Text style={[styles.formLabelText, { color: theme.text }]}>{t('status') || 'Status'}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.statusContainer}>
                {statusOptions.map(function (opt) { return (<react_native_1.TouchableOpacity key={opt.value} onPress={function () { return setStatus(opt.value); }} style={[
                styles.statusButton,
                { borderColor: theme.inputBorder, backgroundColor: theme.inputBg },
                status === opt.value && { backgroundColor: opt.color, borderColor: opt.color }
            ]}>
                    <react_native_1.Text style={[
                styles.statusButtonText,
                { color: theme.text },
                status === opt.value && { color: '#fff', fontWeight: 'bold' }
            ]}>{opt.label}</react_native_1.Text>
                  </react_native_1.TouchableOpacity>); })}
              </react_native_1.View>
            </react_native_1.View>

            {/* Progress Section */}
             <react_native_1.View style={styles.formSection}>
              <react_native_1.View style={styles.formLabel}>
                <lucide_react_native_1.BookOpen size={16} color={theme.primary}/>
                <react_native_1.Text style={[styles.formLabelText, { color: theme.text }]}>{t('progress') || 'Progress'}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.rowInputs}>
                <react_native_1.View style={styles.inputWrapper}>
                  <react_native_1.Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{t('current') || 'Current'}</react_native_1.Text>
                  <react_native_1.TextInput style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]} placeholder="0" placeholderTextColor={theme.textMuted} value={currentPage} onChangeText={setCurrentPage} keyboardType="number-pad"/>
                </react_native_1.View>
                <react_native_1.Text style={[styles.slash, { color: theme.textMuted }]}>/</react_native_1.Text>
                <react_native_1.View style={styles.inputWrapper}>
                  <react_native_1.Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{t('total') || 'Total'}</react_native_1.Text>
                  <react_native_1.TextInput style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]} placeholder="0" placeholderTextColor={theme.textMuted} value={totalPages} onChangeText={setTotalPages} keyboardType="number-pad"/>
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.View>

            {/* Dates Section */}
            <react_native_1.View style={styles.formSection}>
              <react_native_1.View style={styles.formLabel}>
                <lucide_react_native_1.Calendar size={16} color={theme.primary}/>
                <react_native_1.Text style={[styles.formLabelText, { color: theme.text }]}>{t('dates') || 'Dates'}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.View style={styles.dateInputs}>
                <react_native_1.View style={styles.dateInputWrapper}>
                  <react_native_1.Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{t('started') || 'Started'}</react_native_1.Text>
                  <react_native_1.View style={styles.dateRow}>
                    <react_native_1.TextInput style={[styles.input, styles.dateInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]} placeholder="YYYY-MM-DD" placeholderTextColor={theme.textMuted} value={startDate} onChangeText={setStartDate}/>
                    <react_native_1.TouchableOpacity onPress={function () { return setToday(setStartDate); }} style={styles.todayButton}>
                      <react_native_1.Text style={[styles.todayButtonText, { color: theme.primary }]}>{t('today') || 'Today'}</react_native_1.Text>
                    </react_native_1.TouchableOpacity>
                  </react_native_1.View>
                </react_native_1.View>
                <react_native_1.View style={styles.dateInputWrapper}>
                  <react_native_1.Text style={[styles.inputLabel, { color: theme.textSecondary }]}>{t('finished') || 'Finished'}</react_native_1.Text>
                   <react_native_1.View style={styles.dateRow}>
                    <react_native_1.TextInput style={[styles.input, styles.dateInput, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]} placeholder="YYYY-MM-DD" placeholderTextColor={theme.textMuted} value={finishDate} onChangeText={setFinishDate}/>
                    <react_native_1.TouchableOpacity onPress={function () { return setToday(setFinishDate); }} style={styles.todayButton}>
                      <react_native_1.Text style={[styles.todayButtonText, { color: theme.primary }]}>{t('today') || 'Today'}</react_native_1.Text>
                    </react_native_1.TouchableOpacity>
                  </react_native_1.View>
                </react_native_1.View>
              </react_native_1.View>
            </react_native_1.View>

            <react_native_1.View style={styles.formSection}>
              <react_native_1.View style={styles.formLabel}>
                <lucide_react_native_1.Tag size={16} color={theme.primary}/>
                <react_native_1.Text style={[styles.formLabelText, { color: theme.text }]}>{t('tags')}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.TextInput style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]} placeholder={t('tagsPlaceholder')} placeholderTextColor={theme.textMuted} value={tagsInput} onChangeText={setTagsInput}/>
            </react_native_1.View>

            <react_native_1.View style={styles.formSection}>
              <react_native_1.View style={styles.formLabel}>
                <lucide_react_native_1.MessageSquare size={16} color={theme.primary}/>
                <react_native_1.Text style={[styles.formLabelText, { color: theme.text }]}>{t('myThoughts')}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.TextInput style={[styles.input, styles.textArea, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]} placeholder={t('thoughtsPlaceholder')} placeholderTextColor={theme.textMuted} value={comment} onChangeText={setComment} multiline textAlignVertical="top"/>
            </react_native_1.View>
          </react_native_1.View>

          <react_native_1.View style={styles.actions}>
            <react_native_1.TouchableOpacity onPress={handleSave} style={[styles.saveButton, { backgroundColor: theme.primary }]}>
              <lucide_react_native_1.Save color="white" size={20}/>
              <react_native_1.Text style={styles.saveButtonText}>{isSaved ? t('updateLibrary') : t('saveToLibrary')}</react_native_1.Text>
            </react_native_1.TouchableOpacity>

            {isSaved && (<react_native_1.TouchableOpacity onPress={handleDelete} style={[styles.deleteButton, { backgroundColor: theme.card, borderColor: theme.dangerLight }]}>
                <lucide_react_native_1.Trash2 color={theme.danger} size={20}/>
                <react_native_1.Text style={[styles.deleteButtonText, { color: theme.danger }]}>{t('removeFromLibrary')}</react_native_1.Text>
              </react_native_1.TouchableOpacity>)}
          </react_native_1.View>
        </react_native_1.ScrollView>
      </react_native_1.KeyboardAvoidingView>
    </react_native_safe_area_context_1.SafeAreaView>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
    flex: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSpacer: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    bookHeader: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    thumbnailContainer: {
        width: 120,
        height: 180,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    noImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noImageText: {},
    bookInfo: {
        flex: 1,
        gap: 6,
    },
    bookTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        lineHeight: 24,
    },
    bookAuthor: {
        fontSize: 14,
        fontWeight: '500',
    },
    bookMeta: {
        fontSize: 12,
    },
    linkRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
        flexWrap: 'wrap',
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        gap: 4,
    },
    googleLinkText: {
        color: '#3b82f6',
        fontSize: 12,
        fontWeight: 'bold',
    },
    amazonLinkText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    formCard: {
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 24,
        gap: 20,
    },
    formSection: {
        gap: 8,
    },
    formLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    formLabelText: {
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
    },
    textArea: {
        minHeight: 100,
    },
    statusContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 4,
    },
    statusButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
    },
    statusButtonText: {
        fontSize: 13,
    },
    rowInputs: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    inputWrapper: {
        flex: 1,
        gap: 4,
    },
    inputLabel: {
        fontSize: 12,
    },
    slash: {
        fontSize: 20,
        marginTop: 18,
    },
    dateInputs: {
        gap: 12,
    },
    dateInputWrapper: {
        gap: 4,
    },
    dateRow: {
        flexDirection: 'row',
        gap: 8,
    },
    dateInput: {
        flex: 1,
    },
    todayButton: {
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    todayButtonText: {
        fontWeight: '600',
        fontSize: 13,
    },
    actions: {
        gap: 12,
        marginBottom: 40,
    },
    saveButton: {
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    saveButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    deleteButton: {
        borderWidth: 1,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    deleteButtonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});
