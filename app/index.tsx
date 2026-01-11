import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StatusBar, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBooks } from '../src/hooks/useBooks';
import { BookItem } from '../src/components/BookItem';
import { Scanner } from '../src/components/Scanner';
import { Search, Camera, X } from 'lucide-react-native';
import { useApp } from '../src/context/AppContext';

export default function HomeScreen() {
  const { saveBook, isSaved, searchBooks, loading, error } = useBooks();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const { theme, isDark, t } = useApp();

  const handleSearch = async () => {
    if (!query.trim()) return;
    const results = await searchBooks(query);
    setSearchResults(results);
  };

  const handleScan = async (isbn: string) => {
    setIsScannerVisible(false);
    setQuery(isbn);
    const results = await searchBooks(isbn);
    setSearchResults(results);
  };

  const clearResults = () => {
    setSearchResults([]);
    setQuery('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.header, borderBottomColor: theme.cardBorder }]}>
        <Text style={[styles.headerTitle, { color: theme.headerText }]}>{t('appName')}</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Search Section */}
        <View style={[styles.searchCard, { backgroundColor: theme.searchCard, borderColor: theme.searchCardBorder }]}>
          <View style={styles.searchInputContainer}>
            <View style={styles.searchIconContainer}>
              <Search color={theme.textMuted} size={20} />
            </View>
            <TextInput
              style={[styles.searchInput, { 
                backgroundColor: theme.inputBg, 
                borderColor: theme.inputBorder,
                color: theme.text 
              }]}
              placeholder={t('searchPlaceholder')}
              placeholderTextColor={theme.textMuted}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => setIsScannerVisible(true)}
              style={[styles.scanButton, { backgroundColor: isDark ? '#475569' : '#1e293b' }]}
            >
              <Camera color="white" size={20} />
              <Text style={styles.buttonText}>{t('scan')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSearch}
              disabled={loading}
              style={[styles.searchButton, { backgroundColor: theme.primary }]}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>{t('search')}</Text>
              )}
            </TouchableOpacity>
          </View>

          {error && (
            <Text style={styles.errorText}>{t('searchFailed')}</Text>
          )}
        </View>

        {/* Results Section */}
        {(searchResults.length > 0 || loading) && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionHeader}>
                <Search size={20} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('results')}</Text>
                <View style={[styles.badge, { backgroundColor: theme.primaryLight }]}>
                  <Text style={[styles.badgeText, { color: theme.primary }]}>{searchResults.length}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={clearResults} style={styles.clearButton}>
                <X size={20} color={theme.textMuted} />
                <Text style={[styles.clearButtonText, { color: theme.textMuted }]}>{t('clear')}</Text>
              </TouchableOpacity>
            </View>

            {searchResults.map(book => (
              <BookItem
                key={book.id}
                book={book}
                isSaved={isSaved(book.id)}
                onToggleSave={saveBook}
              />
            ))}
          </View>
        )}

        {/* Empty state */}
        {searchResults.length === 0 && !loading && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Search size={20} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('search')}</Text>
            </View>
            <View style={[styles.emptyState, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder }]}>
              <Text style={[styles.emptyStateText, { color: theme.textMuted }]}>
                {t('searchHint')}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <Scanner
        isVisible={isScannerVisible}
        onClose={() => setIsScannerVisible(false)}
        onScan={handleScan}
      />
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
});
