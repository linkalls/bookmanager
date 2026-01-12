import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBooks } from '../src/hooks/useBooks';
import { BookItem } from '../src/components/BookItem';
import { Book } from '../src/types';
import { Library, Search, Tag, ChevronDown, ChevronUp, X, SortAsc, SortDesc } from 'lucide-react-native';
import { useApp } from '../src/context/AppContext';

type SortField = 'title' | 'author' | 'date';
type SortOrder = 'asc' | 'desc';

export default function LibraryScreen() {
  const { savedBooks, removeBook } = useBooks();
  const { theme, isDark, t } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | Book['status']>('all');
  const [showAllTags, setShowAllTags] = useState(false);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    savedBooks.forEach(book => {
      book.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [savedBooks]);

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let books = [...savedBooks];
    
    // Filter by status
    if (statusFilter !== 'all') {
      books = books.filter(book => {
        const status = book.status || 'want_to_read';
        return status === statusFilter;
      });
    }

    // Filter by tag
    if (selectedTag) {
      books = books.filter(book => book.tags?.includes(selectedTag));
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      books = books.filter(book => 
        book.title.toLowerCase().includes(q) ||
        book.authors.some(a => a.toLowerCase().includes(q)) ||
        book.isbn?.includes(q)
      );
    }
    
    // Sort
    books.sort((a, b) => {
      let comparison = 0;
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

  const displayTags = showAllTags ? allTags : allTags.slice(0, 5);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setShowSortMenu(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.cardBorder }]}>
        <View style={styles.headerLeft}>
          <Library color={theme.headerText} size={24} />
          <Text style={[styles.headerTitle, { color: theme.headerText }]}>{t('myLibrary')}</Text>
        </View>
        <View style={[styles.countBadge, { backgroundColor: theme.primaryLight }]}>
          <Text style={[styles.countText, { color: theme.primary }]}>{savedBooks.length} {t('books')}</Text>
        </View>
      </View>

      {/* Search & Sort Bar */}
      <View style={[styles.searchBar, { backgroundColor: theme.card, borderBottomColor: theme.cardBorder }]}>
        <View style={[styles.searchInputWrapper, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
          <Search color={theme.textMuted} size={18} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder={t('filterByTitle')}
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X color={theme.textMuted} size={18} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          onPress={() => setShowSortMenu(!showSortMenu)}
          style={[styles.sortButton, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}
        >
          {sortOrder === 'asc' ? (
            <SortAsc color={theme.text} size={20} />
          ) : (
            <SortDesc color={theme.text} size={20} />
          )}
        </TouchableOpacity>
      </View>

      {/* Sort Menu */}
      {showSortMenu && (
        <View style={[styles.sortMenu, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <TouchableOpacity 
            onPress={() => toggleSort('title')}
            style={[styles.sortMenuItem, sortField === 'title' && { backgroundColor: theme.primaryLight }]}
          >
            <Text style={[styles.sortMenuText, { color: theme.text }]}>{t('sortTitle')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => toggleSort('author')}
            style={[styles.sortMenuItem, sortField === 'author' && { backgroundColor: theme.primaryLight }]}
          >
            <Text style={[styles.sortMenuText, { color: theme.text }]}>{t('sortAuthor')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => toggleSort('date')}
            style={[styles.sortMenuItem, sortField === 'date' && { backgroundColor: theme.primaryLight }]}
          >
            <Text style={[styles.sortMenuText, { color: theme.text }]}>{t('sortDate')}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.statusTabs, { backgroundColor: theme.background, borderBottomColor: theme.cardBorder }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statusTabsContent}>
          {[
            { id: 'all', label: t('all') || 'All' },
            { id: 'reading', label: t('reading') || 'Reading' },
            { id: 'want_to_read', label: t('wantToRead') || 'To Read' },
            { id: 'completed', label: t('completed') || 'Done' },
            { id: 'dropped', label: t('dropped') || 'Dropped' },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setStatusFilter(tab.id as any)}
              style={[
                styles.statusTab,
                statusFilter === tab.id && { borderBottomColor: theme.primary }
              ]}
            >
              <Text style={[
                styles.statusTabText,
                { color: statusFilter === tab.id ? theme.primary : theme.textSecondary }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Tags Filter */}
        {allTags.length > 0 && (
          <View style={styles.tagsSection}>
            <View style={styles.tagsSectionHeader}>
              <View style={styles.tagsHeaderLeft}>
                <Tag size={16} color={theme.primary} />
                <Text style={[styles.tagsTitle, { color: theme.text }]}>{t('collections')}</Text>
              </View>
              {allTags.length > 5 && (
                <TouchableOpacity onPress={() => setShowAllTags(!showAllTags)} style={styles.showMoreButton}>
                  {showAllTags ? <ChevronUp size={16} color={theme.textMuted} /> : <ChevronDown size={16} color={theme.textMuted} />}
                  <Text style={[styles.showMoreText, { color: theme.textMuted }]}>
                    {showAllTags ? '' : `+${allTags.length - 5}`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsScroll}>
              <TouchableOpacity
                onPress={() => setSelectedTag(null)}
                style={[
                  styles.tagChip,
                  { 
                    backgroundColor: selectedTag === null ? theme.primary : theme.card,
                    borderColor: theme.cardBorder,
                  }
                ]}
              >
                <Text style={[styles.tagChipText, { color: selectedTag === null ? '#fff' : theme.text }]}>
                  {t('all')} ({savedBooks.length})
                </Text>
              </TouchableOpacity>
              
              {displayTags.map(tag => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  style={[
                    styles.tagChip,
                    { 
                      backgroundColor: selectedTag === tag ? theme.primary : theme.card,
                      borderColor: theme.cardBorder,
                    }
                  ]}
                >
                  <Text style={[styles.tagChipText, { color: selectedTag === tag ? '#fff' : theme.text }]}>
                    {tag} ({savedBooks.filter(b => b.tags?.includes(tag)).length})
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Books List */}
        <View style={[styles.libraryCard, { backgroundColor: theme.libraryCard, borderColor: theme.libraryCardBorder }]}>
          {filteredBooks.length === 0 ? (
            <View style={styles.emptyLibrary}>
              <Library size={48} color={theme.textMuted} />
              <Text style={[styles.emptyLibraryText, { color: theme.textMuted }]}>
                {selectedTag ? `"${selectedTag}" ${t('noBooksWith')}` : t('libraryEmpty')}
              </Text>
            </View>
          ) : (
            filteredBooks.map(book => (
              <BookItem
                key={`lib-${book.id}`}
                book={book}
                isSaved={true}
                onToggleSave={() => {}}
                onRemove={removeBook}
                compact={true}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
