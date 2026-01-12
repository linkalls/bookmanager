"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookItem = BookItem;
var react_1 = require("react");
var react_native_1 = require("react-native");
var lucide_react_native_1 = require("lucide-react-native");
var expo_router_1 = require("expo-router");
var Linking = require("expo-linking");
var AppContext_1 = require("../context/AppContext");
var isbn_1 = require("../utils/isbn");
function BookItem(_a) {
    var book = _a.book, isSaved = _a.isSaved, onToggleSave = _a.onToggleSave, onRemove = _a.onRemove, _b = _a.compact, compact = _b === void 0 ? false : _b;
    var router = (0, expo_router_1.useRouter)();
    var _c = (0, AppContext_1.useApp)(), theme = _c.theme, isDark = _c.isDark, t = _c.t;
    var amazonUrl = (0, isbn_1.getAmazonUrl)(book.isbn);
    var handlePress = function () {
        router.push({
            pathname: "/book/[id]",
            params: { id: book.id, bookData: JSON.stringify(book) }
        });
    };
    if (compact) {
        return (<react_native_1.TouchableOpacity onPress={handlePress} style={[styles.compactContainer, { backgroundColor: theme.card, borderBottomColor: theme.cardBorder }]}>
        <react_native_1.View style={[styles.compactThumbnail, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
          {book.thumbnail ? (<react_native_1.Image source={{ uri: book.thumbnail }} style={styles.compactImage} resizeMode="cover"/>) : (<lucide_react_native_1.Book color={theme.textMuted} size={16}/>)}
        </react_native_1.View>
        <react_native_1.View style={styles.compactInfo}>
          <react_native_1.Text style={[styles.compactTitle, { color: theme.text }]} numberOfLines={1} ellipsizeMode="tail">{book.title}</react_native_1.Text>
          <react_native_1.Text style={[styles.compactAuthor, { color: theme.textSecondary }]} numberOfLines={1} ellipsizeMode="tail">{book.authors.join(', ')}</react_native_1.Text>

          {/* Progress Bar for compact view */}
          {book.totalPages && book.currentPage ? (<react_native_1.View style={styles.compactProgressContainer}>
              <react_native_1.View style={[styles.compactProgressBar, { backgroundColor: theme.inputBorder }]}>
                <react_native_1.View style={[
                    styles.compactProgressFill,
                    {
                        backgroundColor: theme.primary,
                        width: "".concat(Math.min(100, (book.currentPage / book.totalPages) * 100), "%")
                    }
                ]}/>
              </react_native_1.View>
              <react_native_1.Text style={[styles.compactProgressText, { color: theme.textSecondary }]}>
                {Math.round((book.currentPage / book.totalPages) * 100)}%
              </react_native_1.Text>
            </react_native_1.View>) : book.status === 'reading' ? (<react_native_1.View style={styles.statusBadge}>
                <react_native_1.Text style={[styles.statusText, { color: theme.primary }]}>Reading</react_native_1.Text>
             </react_native_1.View>) : null}

          {book.tags && book.tags.length > 0 && (<react_native_1.View style={styles.tagsRow}>
              {book.tags.slice(0, 3).map(function (tag, idx) { return (<react_native_1.View key={idx} style={[styles.tagBadge, { backgroundColor: theme.tagBg }]}>
                  <react_native_1.Text style={[styles.tagText, { color: theme.tagText }]}>{tag}</react_native_1.Text>
                </react_native_1.View>); })}
              {book.tags.length > 3 && (<react_native_1.Text style={[styles.moreText, { color: theme.textMuted }]}>+{book.tags.length - 3}</react_native_1.Text>)}
            </react_native_1.View>)}
        </react_native_1.View>
        {onRemove && (<react_native_1.TouchableOpacity onPress={function () { return onRemove(book.id); }} style={styles.removeButton}>
            <lucide_react_native_1.Trash2 size={16} color={theme.danger}/>
          </react_native_1.TouchableOpacity>)}
      </react_native_1.TouchableOpacity>);
    }
    return (<react_native_1.View style={[
            styles.container,
            { backgroundColor: theme.card, borderColor: isSaved ? theme.successLight : theme.cardBorder }
        ]}>
      <react_native_1.TouchableOpacity onPress={handlePress} style={[styles.thumbnail, { backgroundColor: theme.inputBg }]}>
        {book.thumbnail ? (<react_native_1.Image source={{ uri: book.thumbnail }} style={styles.image} resizeMode="cover"/>) : (<react_native_1.View style={styles.noImage}>
            <lucide_react_native_1.Book color={theme.textMuted} size={32}/>
          </react_native_1.View>)}
        {isSaved && (<react_native_1.View style={styles.savedBadge}>
            <lucide_react_native_1.Check size={12} color="white"/>
          </react_native_1.View>)}
      </react_native_1.TouchableOpacity>

      <react_native_1.View style={styles.info}>
        <react_native_1.TouchableOpacity onPress={handlePress}>
          <react_native_1.Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{book.title}</react_native_1.Text>
          <react_native_1.Text style={[styles.author, { color: theme.textSecondary }]} numberOfLines={1}>{book.authors.join(', ')}</react_native_1.Text>
        </react_native_1.TouchableOpacity>

        {book.tags && book.tags.length > 0 && (<react_native_1.View style={styles.tagsRow}>
            {book.tags.slice(0, 2).map(function (tag, idx) { return (<react_native_1.View key={idx} style={[styles.tagBadge, { backgroundColor: theme.tagBg }]}>
                <react_native_1.Text style={[styles.tagText, { color: theme.tagText }]}>{tag}</react_native_1.Text>
              </react_native_1.View>); })}
            {book.tags.length > 2 && (<react_native_1.Text style={[styles.moreText, { color: theme.textMuted }]}>+{book.tags.length - 2}</react_native_1.Text>)}
          </react_native_1.View>)}

        <react_native_1.View style={styles.buttonRow}>
          <react_native_1.TouchableOpacity onPress={function () { return onToggleSave(book); }} style={[styles.saveButton, isSaved ? { backgroundColor: theme.successLight } : { backgroundColor: '#4f46e5' }]}>
            {isSaved ? (<>
                <lucide_react_native_1.Check size={14} color={isDark ? '#4ade80' : '#15803d'}/>
                <react_native_1.Text style={[styles.savedText, { color: isDark ? '#4ade80' : '#15803d' }]}>{t('saved')}</react_native_1.Text>
              </>) : (<react_native_1.Text style={styles.saveText}>{t('save')}</react_native_1.Text>)}
          </react_native_1.TouchableOpacity>

          <react_native_1.TouchableOpacity onPress={function () { return Linking.openURL(book.link); }} style={[styles.linkButton, { backgroundColor: theme.inputBg }]}>
            <react_native_1.Text style={[styles.linkButtonText, { color: '#3b82f6' }]}>G</react_native_1.Text>
          </react_native_1.TouchableOpacity>

          {amazonUrl && (<react_native_1.TouchableOpacity onPress={function () { return Linking.openURL(amazonUrl); }} style={[styles.linkButton, { backgroundColor: '#ff9900' }]}>
              <lucide_react_native_1.ShoppingCart size={14} color="white"/>
            </react_native_1.TouchableOpacity>)}
        </react_native_1.View>
      </react_native_1.View>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    thumbnail: {
        width: 80,
        height: 112,
        borderRadius: 8,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    noImage: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    savedBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#22c55e',
        padding: 4,
        borderBottomLeftRadius: 8,
    },
    info: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 4,
    },
    author: {
        fontSize: 13,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 6,
    },
    tagBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '600',
    },
    moreText: {
        fontSize: 10,
        marginLeft: 2,
        alignSelf: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 8,
    },
    saveButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    savedText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    saveText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    linkButton: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    linkButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    compactContainer: {
        padding: 12,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        borderBottomWidth: 1,
    },
    compactThumbnail: {
        width: 40,
        height: 56,
        borderRadius: 4,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    compactImage: {
        width: '100%',
        height: '100%',
    },
    compactInfo: {
        flex: 1,
        minWidth: 0,
    },
    compactTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: 20,
    },
    compactAuthor: {
        fontSize: 12,
        lineHeight: 18,
    },
    compactProgressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    compactProgressBar: {
        height: 4,
        flex: 1,
        maxWidth: 100,
        borderRadius: 2,
        overflow: 'hidden',
    },
    compactProgressFill: {
        height: '100%',
        borderRadius: 2,
    },
    compactProgressText: {
        fontSize: 10,
    },
    statusBadge: {
        marginTop: 2,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    removeButton: {
        padding: 8,
    },
});
