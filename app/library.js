"use strict";
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
exports.default = LibraryScreen;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var useBooks_1 = require("../src/hooks/useBooks");
var BookItem_1 = require("../src/components/BookItem");
var lucide_react_native_1 = require("lucide-react-native");
var AppContext_1 = require("../src/context/AppContext");
function LibraryScreen() {
    var _a = (0, useBooks_1.useBooks)(), savedBooks = _a.savedBooks, removeBook = _a.removeBook;
    var _b = (0, AppContext_1.useApp)(), theme = _b.theme, isDark = _b.isDark, t = _b.t;
    var _c = (0, react_1.useState)(''), searchQuery = _c[0], setSearchQuery = _c[1];
    var _d = (0, react_1.useState)(null), selectedTag = _d[0], setSelectedTag = _d[1];
    var _e = (0, react_1.useState)('all'), statusFilter = _e[0], setStatusFilter = _e[1];
    var _f = (0, react_1.useState)(false), showAllTags = _f[0], setShowAllTags = _f[1];
    var _g = (0, react_1.useState)('date'), sortField = _g[0], setSortField = _g[1];
    var _h = (0, react_1.useState)('desc'), sortOrder = _h[0], setSortOrder = _h[1];
    var _j = (0, react_1.useState)(false), showSortMenu = _j[0], setShowSortMenu = _j[1];
    // Get all unique tags
    var allTags = (0, react_1.useMemo)(function () {
        var tags = new Set();
        savedBooks.forEach(function (book) {
            var _a;
            (_a = book.tags) === null || _a === void 0 ? void 0 : _a.forEach(function (tag) { return tags.add(tag); });
        });
        return Array.from(tags).sort();
    }, [savedBooks]);
    // Filter and sort books
    var filteredBooks = (0, react_1.useMemo)(function () {
        var books = __spreadArray([], savedBooks, true);
        // Filter by status
        if (statusFilter !== 'all') {
            books = books.filter(function (book) {
                var status = book.status || 'want_to_read';
                return status === statusFilter;
            });
        }
        // Filter by tag
        if (selectedTag) {
            books = books.filter(function (book) { var _a; return (_a = book.tags) === null || _a === void 0 ? void 0 : _a.includes(selectedTag); });
        }
        // Filter by search query
        if (searchQuery.trim()) {
            var q_1 = searchQuery.toLowerCase();
            books = books.filter(function (book) {
                var _a;
                return book.title.toLowerCase().includes(q_1) ||
                    book.authors.some(function (a) { return a.toLowerCase().includes(q_1); }) ||
                    ((_a = book.isbn) === null || _a === void 0 ? void 0 : _a.includes(q_1));
            });
        }
        // Sort
        books.sort(function (a, b) {
            var comparison = 0;
            switch (sortField) {
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'author':
                    comparison = (a.authors[0] || '').localeCompare(b.authors[0] || '');
                    break;
                case 'date':
                default:
                    comparison = 0; // Keep original order for date (newest first)
                    break;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
        return books;
    }, [savedBooks, selectedTag, searchQuery, sortField, sortOrder]);
    var displayTags = showAllTags ? allTags : allTags.slice(0, 5);
    var toggleSort = function (field) {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortField(field);
            setSortOrder('asc');
        }
        setShowSortMenu(false);
    };
    return (<react_native_safe_area_context_1.SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <react_native_1.StatusBar barStyle={isDark ? 'light-content' : 'dark-content'}/>

      {/* Header */}
      <react_native_1.View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.cardBorder }]}>
        <react_native_1.View style={styles.headerLeft}>
          <lucide_react_native_1.Library color={theme.headerText} size={24}/>
          <react_native_1.Text style={[styles.headerTitle, { color: theme.headerText }]}>{t('myLibrary')}</react_native_1.Text>
        </react_native_1.View>
        <react_native_1.View style={[styles.countBadge, { backgroundColor: theme.primaryLight }]}>
          <react_native_1.Text style={[styles.countText, { color: theme.primary }]}>{savedBooks.length} {t('books')}</react_native_1.Text>
        </react_native_1.View>
      </react_native_1.View>

      {/* Search & Sort Bar */}
      <react_native_1.View style={[styles.searchBar, { backgroundColor: theme.card, borderBottomColor: theme.cardBorder }]}>
        <react_native_1.View style={[styles.searchInputWrapper, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
          <lucide_react_native_1.Search color={theme.textMuted} size={18}/>
          <react_native_1.TextInput style={[styles.searchInput, { color: theme.text }]} placeholder={t('filterByTitle')} placeholderTextColor={theme.textMuted} value={searchQuery} onChangeText={setSearchQuery}/>
          {searchQuery.length > 0 && (<react_native_1.TouchableOpacity onPress={function () { return setSearchQuery(''); }}>
              <lucide_react_native_1.X color={theme.textMuted} size={18}/>
            </react_native_1.TouchableOpacity>)}
        </react_native_1.View>

        <react_native_1.TouchableOpacity onPress={function () { return setShowSortMenu(!showSortMenu); }} style={[styles.sortButton, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
          {sortOrder === 'asc' ? (<lucide_react_native_1.SortAsc color={theme.text} size={20}/>) : (<lucide_react_native_1.SortDesc color={theme.text} size={20}/>)}
        </react_native_1.TouchableOpacity>
      </react_native_1.View>

      {/* Sort Menu */}
      {showSortMenu && (<react_native_1.View style={[styles.sortMenu, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <react_native_1.TouchableOpacity onPress={function () { return toggleSort('title'); }} style={[styles.sortMenuItem, sortField === 'title' && { backgroundColor: theme.primaryLight }]}>
            <react_native_1.Text style={[styles.sortMenuText, { color: theme.text }]}>{t('sortTitle')}</react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity onPress={function () { return toggleSort('author'); }} style={[styles.sortMenuItem, sortField === 'author' && { backgroundColor: theme.primaryLight }]}>
            <react_native_1.Text style={[styles.sortMenuText, { color: theme.text }]}>{t('sortAuthor')}</react_native_1.Text>
          </react_native_1.TouchableOpacity>
          <react_native_1.TouchableOpacity onPress={function () { return toggleSort('date'); }} style={[styles.sortMenuItem, sortField === 'date' && { backgroundColor: theme.primaryLight }]}>
            <react_native_1.Text style={[styles.sortMenuText, { color: theme.text }]}>{t('sortDate')}</react_native_1.Text>
          </react_native_1.TouchableOpacity>
        </react_native_1.View>)}

      <react_native_1.View style={[styles.statusTabs, { backgroundColor: theme.background, borderBottomColor: theme.cardBorder }]}>
        <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusTabsContent}>
          {[
            { id: 'all', label: t('all') || 'All' },
            { id: 'reading', label: t('reading') || 'Reading' },
            { id: 'want_to_read', label: t('wantToRead') || 'To Read' },
            { id: 'completed', label: t('completed') || 'Done' },
            { id: 'dropped', label: t('dropped') || 'Dropped' },
        ].map(function (tab) { return (<react_native_1.TouchableOpacity key={tab.id} onPress={function () { return setStatusFilter(tab.id); }} style={[
                styles.statusTab,
                statusFilter === tab.id && { borderBottomColor: theme.primary }
            ]}>
              <react_native_1.Text style={[
                styles.statusTabText,
                { color: statusFilter === tab.id ? theme.primary : theme.textSecondary }
            ]}>
                {tab.label}
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>); })}
        </react_native_1.ScrollView>
      </react_native_1.View>

      <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Tags Filter */}
        {allTags.length > 0 && (<react_native_1.View style={styles.tagsSection}>
            <react_native_1.View style={styles.tagsSectionHeader}>
              <react_native_1.View style={styles.tagsHeaderLeft}>
                <lucide_react_native_1.Tag size={16} color={theme.primary}/>
                <react_native_1.Text style={[styles.tagsTitle, { color: theme.text }]}>{t('collections')}</react_native_1.Text>
              </react_native_1.View>
              {allTags.length > 5 && (<react_native_1.TouchableOpacity onPress={function () { return setShowAllTags(!showAllTags); }} style={styles.showMoreButton}>
                  {showAllTags ? <lucide_react_native_1.ChevronUp size={16} color={theme.textMuted}/> : <lucide_react_native_1.ChevronDown size={16} color={theme.textMuted}/>}
                  <react_native_1.Text style={[styles.showMoreText, { color: theme.textMuted }]}>
                    {showAllTags ? '' : "+".concat(allTags.length - 5)}
                  </react_native_1.Text>
                </react_native_1.TouchableOpacity>)}
            </react_native_1.View>

            <react_native_1.ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
              <react_native_1.TouchableOpacity onPress={function () { return setSelectedTag(null); }} style={[
                styles.tagChip,
                {
                    backgroundColor: selectedTag === null ? theme.primary : theme.card,
                    borderColor: theme.cardBorder,
                }
            ]}>
                <react_native_1.Text style={[styles.tagChipText, { color: selectedTag === null ? '#fff' : theme.text }]}>
                  {t('all')} ({savedBooks.length})
                </react_native_1.Text>
              </react_native_1.TouchableOpacity>

              {displayTags.map(function (tag) { return (<react_native_1.TouchableOpacity key={tag} onPress={function () { return setSelectedTag(selectedTag === tag ? null : tag); }} style={[
                    styles.tagChip,
                    {
                        backgroundColor: selectedTag === tag ? theme.primary : theme.card,
                        borderColor: theme.cardBorder,
                    }
                ]}>
                  <react_native_1.Text style={[styles.tagChipText, { color: selectedTag === tag ? '#fff' : theme.text }]}>
                    {tag} ({savedBooks.filter(function (b) { var _a; return (_a = b.tags) === null || _a === void 0 ? void 0 : _a.includes(tag); }).length})
                  </react_native_1.Text>
                </react_native_1.TouchableOpacity>); })}
            </react_native_1.ScrollView>
          </react_native_1.View>)}

        {/* Books List */}
        <react_native_1.View style={[styles.libraryCard, { backgroundColor: theme.libraryCard, borderColor: theme.libraryCardBorder }]}>
          {filteredBooks.length === 0 ? (<react_native_1.View style={styles.emptyLibrary}>
              <lucide_react_native_1.Library size={48} color={theme.textMuted}/>
              <react_native_1.Text style={[styles.emptyLibraryText, { color: theme.textMuted }]}>
                {selectedTag ? "\"".concat(selectedTag, "\" ").concat(t('noBooksWith')) : t('libraryEmpty')}
              </react_native_1.Text>
            </react_native_1.View>) : (filteredBooks.map(function (book) { return (<BookItem_1.BookItem key={"lib-".concat(book.id)} book={book} isSaved={true} onToggleSave={function () { }} onRemove={removeBook} compact={true}/>); }))}
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
    countBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    countText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    searchBar: {
        flexDirection: 'row',
        padding: 12,
        gap: 8,
        borderBottomWidth: 1,
    },
    searchInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 15,
    },
    sortButton: {
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
    },
    sortMenu: {
        position: 'absolute',
        top: 130,
        right: 12,
        borderRadius: 8,
        borderWidth: 1,
        zIndex: 100,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    sortMenuItem: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    sortMenuText: {
        fontSize: 14,
    },
    statusTabs: {
        borderBottomWidth: 1,
    },
    statusTabsContent: {
        paddingHorizontal: 16,
    },
    statusTab: {
        paddingVertical: 12,
        marginRight: 20,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    statusTabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 20,
    },
    tagsSection: {
        marginBottom: 16,
    },
    tagsSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    tagsHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    tagsTitle: {
        fontSize: 14,
        fontWeight: '600',
    },
    showMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    showMoreText: {
        fontSize: 12,
    },
    tagsScroll: {
        marginBottom: 8,
    },
    tagChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        borderWidth: 1,
    },
    tagChipText: {
        fontSize: 13,
        fontWeight: '600',
    },
    libraryCard: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        minHeight: 200,
    },
    emptyLibrary: {
        padding: 40,
        alignItems: 'center',
    },
    emptyLibraryText: {
        marginTop: 12,
        textAlign: 'center',
    },
});
