import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useBooks } from '../../src/hooks/useBooks';
import { Book } from '../../src/types';
import { ArrowLeft, Save, Trash2, Tag, MessageSquare, ExternalLink } from 'lucide-react-native';
import * as Linking from 'expo-linking';

export default function BookDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { saveBook, removeBook, getSavedBook, isSaved: checkIsSaved, updateBook } = useBooks();

  const [book, setBook] = useState<Book | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const [comment, setComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (params.bookData) {
      const parsedBook = JSON.parse(params.bookData as string);
      // Check if we have a saved version which might have more data
      const savedVersion = getSavedBook(parsedBook.id);

      if (savedVersion) {
        setBook(savedVersion);
        setTagsInput(savedVersion.tags?.join(', ') || '');
        setComment(savedVersion.comment || '');
        setIsEditing(true); // Already saved, so we are editing
      } else {
        setBook(parsedBook);
        setTagsInput('');
        setComment('');
        setIsEditing(false);
      }
    }
  }, [params.bookData, getSavedBook]); // Re-run if saved books change? Maybe.

  // Also listen to saved state changes if possible, but useBooks hook is local to component unless we use context.
  // Since we don't use context, we rely on loadSavedBooks being called inside useBooks,
  // but different useBooks instances don't share state automatically without Context/Redux.
  // This is a limitation of the current simple implementation.
  // However, `saveBook` writes to AsyncStorage.
  // If we want this screen to update when main screen updates... well main screen updates storage.
  // This screen initializes from params or storage.
  // If we save here, we update storage. Main screen might not reflect immediately if it doesn't poll.
  // Ideally we should use a Context for `useBooks`.
  // For now, I will assume basic functionality is enough.

  const handleSave = async () => {
    if (!book) return;

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const updatedBook = {
        ...book,
        tags,
        comment
    };

    if (checkIsSaved(book.id)) {
        await updateBook(updatedBook);
        Alert.alert('Updated', 'Book details updated successfully');
    } else {
        await saveBook(updatedBook);
        Alert.alert('Saved', 'Book added to library');
        setIsEditing(true);
    }
    // Update local state to reflect changes
    setBook(updatedBook);
  };

  const handleDelete = async () => {
      if (!book) return;

      Alert.alert(
          "Delete Book",
          "Are you sure you want to remove this book from your library?",
          [
              { text: "Cancel", style: "cancel" },
              {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                      await removeBook(book.id);
                      router.back();
                  }
              }
          ]
      );
  };

  if (!book) return <View className="flex-1 bg-white dark:bg-slate-900" />;

  const isSaved = checkIsSaved(book.id);

  return (
    <View className="flex-1 bg-white dark:bg-slate-900">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ArrowLeft size={24} className="text-slate-700 dark:text-slate-200" color="#334155" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-slate-800 dark:text-slate-100" numberOfLines={1}>Book Details</Text>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <ScrollView className="flex-1 p-4">
        <View className="flex-row gap-4 mb-6">
            <View className="w-32 h-48 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
                 {book.thumbnail ? (
                    <Image source={{ uri: book.thumbnail }} className="w-full h-full" resizeMode="cover" />
                 ) : (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-slate-400">No Image</Text>
                    </View>
                 )}
            </View>
            <View className="flex-1 gap-2">
                <Text className="text-xl font-bold text-slate-900 dark:text-slate-100">{book.title}</Text>
                <Text className="text-slate-600 dark:text-slate-400 font-medium">{book.authors.join(', ')}</Text>
                {book.publishedDate && (
                    <Text className="text-slate-500 dark:text-slate-500 text-sm">Published: {book.publishedDate}</Text>
                )}
                {book.isbn && (
                    <Text className="text-slate-500 dark:text-slate-500 text-sm">ISBN: {book.isbn}</Text>
                )}

                <TouchableOpacity
                    onPress={() => Linking.openURL(book.link)}
                    className="flex-row items-center mt-2 bg-slate-100 dark:bg-slate-800 self-start px-3 py-2 rounded-lg"
                >
                    <ExternalLink size={14} className="text-blue-600 mr-2" color="#2563eb" />
                    <Text className="text-blue-600 dark:text-blue-400 text-sm font-bold">Google Books</Text>
                </TouchableOpacity>
            </View>
        </View>

        <View className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 space-y-4 mb-8">
            <View>
                <View className="flex-row items-center mb-2">
                    <Tag size={16} className="text-amber-600 mr-2" color="#d97706" />
                    <Text className="font-bold text-slate-700 dark:text-slate-300">Tags</Text>
                </View>
                <TextInput
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-800 dark:text-slate-100"
                    placeholder="history, favorite, to-read (comma separated)"
                    placeholderTextColor="#94a3b8"
                    value={tagsInput}
                    onChangeText={setTagsInput}
                />
            </View>

            <View>
                <View className="flex-row items-center mb-2">
                    <MessageSquare size={16} className="text-amber-600 mr-2" color="#d97706" />
                    <Text className="font-bold text-slate-700 dark:text-slate-300">My Thoughts</Text>
                </View>
                <TextInput
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-800 dark:text-slate-100 min-h-[100px]"
                    placeholder="Write your impressions here..."
                    placeholderTextColor="#94a3b8"
                    value={comment}
                    onChangeText={setComment}
                    multiline
                    textAlignVertical="top"
                />
            </View>
        </View>

        <View className="gap-3 mb-10">
            <TouchableOpacity
                onPress={handleSave}
                className="bg-amber-600 hover:bg-amber-700 p-4 rounded-xl flex-row items-center justify-center shadow-sm"
            >
                <Save color="white" size={20} className="mr-2" />
                <Text className="text-white font-bold text-lg">{isSaved ? 'Update Library' : 'Save to Library'}</Text>
            </TouchableOpacity>

            {isSaved && (
                <TouchableOpacity
                    onPress={handleDelete}
                    className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900 p-4 rounded-xl flex-row items-center justify-center"
                >
                    <Trash2 color="#ef4444" size={20} className="mr-2" />
                    <Text className="text-red-500 font-bold text-lg">Remove from Library</Text>
                </TouchableOpacity>
            )}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
