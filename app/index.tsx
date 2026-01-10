import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, StatusBar, Image, ScrollView, Platform } from 'react-native';
import { Stack, useRouter, useFocusEffect } from 'expo-router';
import { useBooks } from '../src/hooks/useBooks';
import { BookItem } from '../src/components/BookItem';
import { Scanner } from '../src/components/Scanner';
import { Search, Camera, Library, Moon, Sun, Loader2 } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export default function HomeScreen() {
  const { savedBooks, loadSavedBooks, saveBook, removeBook, isSaved, searchBooks, loading, error } = useBooks();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const { colorScheme, toggleColorScheme } = useColorScheme();

  useFocusEffect(
    useCallback(() => {
      loadSavedBooks();
    }, [loadSavedBooks])
  );

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

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View className="bg-amber-900 px-4 py-3 flex-row justify-between items-center shadow-md z-10">
        <View className="flex-row items-center gap-2">
            <Library color="#fffbeb" size={24} />
            <Text className="text-amber-50 text-lg font-bold">Poteto's Library DX</Text>
        </View>
        <TouchableOpacity onPress={toggleColorScheme} className="p-2">
            {colorScheme === 'dark' ? (
                <Sun color="#fbbf24" size={20} />
            ) : (
                <Moon color="#fffbeb" size={20} />
            )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="p-4 space-y-6">
            {/* Search Section */}
            <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-2 border-amber-100 dark:border-slate-700 p-4">
                <View className="flex-row gap-2 mb-2">
                    <View className="flex-1 relative justify-center">
                        <View className="absolute left-3 z-10">
                             <Search color="#94a3b8" size={20} />
                        </View>
                        <TextInput
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white text-base"
                            placeholder="Title, Author, ISBN..."
                            placeholderTextColor="#94a3b8"
                            value={query}
                            onChangeText={setQuery}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                    </View>
                </View>

                <View className="flex-row gap-2">
                    <TouchableOpacity
                        onPress={() => setIsScannerVisible(true)}
                        className="bg-slate-800 dark:bg-slate-700 p-3 rounded-xl flex-row items-center justify-center gap-2 flex-1"
                    >
                        <Camera color="white" size={20} />
                        <Text className="text-white font-bold">Scan</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSearch}
                        disabled={loading}
                        className="bg-amber-600 dark:bg-amber-700 p-3 rounded-xl flex-row items-center justify-center gap-2 flex-1"
                    >
                        {loading ? (
                             <ActivityIndicator color="white" />
                        ) : (
                             <Text className="text-white font-bold">Search</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {error && (
                    <Text className="text-red-500 mt-2 text-sm">{error}</Text>
                )}
            </View>

            {/* Results Section */}
            <View>
                 <View className="flex-row items-center mb-3">
                    <Search size={20} className="text-amber-600 mr-2" color="#d97706" />
                    <Text className="text-lg font-bold text-slate-700 dark:text-slate-200">Results</Text>
                 </View>

                 {searchResults.length === 0 && !loading && (
                     <View className="p-8 items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                         <Text className="text-slate-400 text-center">Enter keywords or scan a barcode to search</Text>
                     </View>
                 )}

                 {searchResults.map(book => (
                     <BookItem
                        key={book.id}
                        book={book}
                        isSaved={isSaved(book.id)}
                        onToggleSave={saveBook}
                     />
                 ))}
            </View>

            {/* Library Section */}
            <View>
                <View className="flex-row items-center justify-between mb-3 bg-white dark:bg-slate-900 py-2 z-10">
                     <View className="flex-row items-center">
                        <Library size={20} className="text-amber-600 mr-2" color="#d97706" />
                        <Text className="text-lg font-bold text-slate-700 dark:text-slate-200">My Library</Text>
                     </View>
                     <View className="bg-amber-100 dark:bg-amber-900 px-2 py-1 rounded-full">
                         <Text className="text-amber-800 dark:text-amber-100 text-xs font-bold">{savedBooks.length} books</Text>
                     </View>
                </View>

                <View className="bg-amber-50 dark:bg-slate-800/50 rounded-2xl border border-amber-200 dark:border-slate-700 overflow-hidden min-h-[100px]">
                    {savedBooks.length === 0 ? (
                        <View className="p-8 items-center">
                            <Library size={48} className="text-amber-800/20" color="#92400e20" />
                            <Text className="text-amber-800/40 dark:text-slate-500 mt-2">Library is empty</Text>
                        </View>
                    ) : (
                        savedBooks.map(book => (
                            <BookItem
                                key={`saved-${book.id}`}
                                book={book}
                                isSaved={true}
                                onToggleSave={() => {}} // No toggle here, usually just remove
                                onRemove={removeBook}
                                compact={true}
                            />
                        ))
                    )}
                </View>
            </View>
        </View>
      </ScrollView>

      <Scanner
        isVisible={isScannerVisible}
        onClose={() => setIsScannerVisible(false)}
        onScan={handleScan}
      />
    </SafeAreaView>
  );
}
