import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBooks } from '../src/hooks/useBooks';
import { BookItem } from '../src/components/BookItem';
import { Library, Search, Tag, ChevronDown, ChevronUp, X, SortAsc, SortDesc, BookOpen, Check, Clock, XCircle, Filter } from 'lucide-react-native';
import { useApp } from '../src/context/AppContext';
import { ReadingStatus } from '../src/types';

type SortField = 'title' | 'author' | 'date' | 'rating' | 'progress';
type SortOrder = 'asc' | 'desc';
type StatusFilter = ReadingStatus | 'all' | 'lent';

export default function LibraryScreen() {
  const { savedBooks, removeBook } = useBooks();
  const { theme, isDark, t } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    savedBooks.forEach(book => {
      book.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [savedBooks]);
  
  // Status counts
  const statusCounts = useMemo(() => {
    return {
      all: savedBooks.length,
      want_to_read: savedBooks.filter(b => b.status === 'want_to_read').length,
      reading: savedBooks.filter(b => b.status === 'reading').length,
      completed: savedBooks.filter(b => b.status === 'completed').length,
      dropped: savedBooks.filter(b => b.status === 'dropped').length,
      lent: savedBooks.filter(b => b.lendingStatus?.borrower).length,
    };
  }, [savedBooks]);

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let books = [...savedBooks];
    
    // Filter by status
    if (statusFilter !== 'all') {
      if (statusFilter === 'lent') {
        books = books.filter(book => book.lendingStatus?.borrower);
      } else {
        books = books.filter(book => book.status === statusFilter);
      }
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
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case 'progress':
          const progressA = a.totalPages ? ((a.currentPage || 0) / a.totalPages) : 0;
          const progressB = b.totalPages ? ((b.currentPage || 0) / b.totalPages) : 0;
          comparison = progressA - progressB;
          break;
        case 'date':
        default:
          comparison = 0; // Keep original order for date (newest first)
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return books;
  }, [savedBooks, selectedTag, searchQuery, sortField, sortOrder, statusFilter]);

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
  
  const statusTabs: { value: StatusFilter; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 'all', label: t('all'), icon: null, color: theme.primary },
    { value: 'want_to_read', label: t('wantToRead'), icon: <Clock size={14} color="#3b82f6" />, color: '#3b82f6' },
    { value: 'reading', label: t('reading'), icon: <BookOpen size={14} color="#f59e0b" />, color: '#f59e0b' },
    { value: 'completed', label: t('completed'), icon: <Check size={14} color="#22c55e" />, color: '#22c55e' },
    { value: 'dropped', label: t('dropped'), icon: <XCircle size={14} color="#ef4444" />, color: '#ef4444' },
    { value: 'lent', label: t('lentBooks'), icon: null, color: '#8b5cf6' },
  ];

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
      
      {/* Status Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={[styles.statusTabs, { backgroundColor: theme.card, borderBottomColor: theme.cardBorder }]}
        contentContainerStyle={styles.statusTabsContent}
      >
        {statusTabs.map((tab) => {
          const count = statusCounts[tab.value as keyof typeof statusCounts] || 0;
          const isActive = statusFilter === tab.value;
          return (
            <TouchableOpacity
              key={tab.value}
              onPress={() => setStatusFilter(tab.value)}
              style={[
                styles.statusTab,
                { 
                  backgroundColor: isActive ? tab.color : 'transparent',
                  borderColor: isActive ? tab.color : theme.inputBorder,
                }
              ]}
            >
              {tab.icon && React.cloneElement(tab.icon as React.ReactElement<any>, {
                color: isActive ? '#fff' : tab.color
              })}
              <Text style={[
                styles.statusTabText,
                { color: isActive ? '#fff' : theme.text }
              ]}>
                {tab.label}
              </Text>
              <View style={[styles.statusCount, { backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : theme.inputBg }]}>
                <Text style={[styles.statusCountText, { color: isActive ? '#fff' : theme.textSecondary }]}>
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

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
          <TouchableOpacity 
            onPress={() => toggleSort('rating')}
            style={[styles.sortMenuItem, sortField === 'rating' && { backgroundColor: theme.primaryLight }]}
          >
            <Text style={[styles.sortMenuText, { color: theme.text }]}>{t('rating')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => toggleSort('progress')}
            style={[styles.sortMenuItem, sortField === 'progress' && { backgroundColor: theme.primaryLight }]}
          >
            <Text style={[styles.sortMenuText, { color: theme.text }]}>{t('progress')}</Text>
          </TouchableOpacity>
        </View>
      )}

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
                  {t('all')} ({filteredBooks.length})
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
  statusTabs: {
    borderBottomWidth: 1,
    maxHeight: 56,
  },
  statusTabsContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',
  },
  statusTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  statusTabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusCount: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 22,
    alignItems: 'center',
  },
  statusCountText: {
    fontSize: 11,
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
    top: 180,
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
