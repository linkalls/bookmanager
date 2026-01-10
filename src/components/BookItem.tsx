import React from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { Book as BookType } from '../types';
import { Book as BookIcon, Check, ExternalLink, Trash2 } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';

interface BookItemProps {
  book: BookType;
  isSaved: boolean;
  onToggleSave: (book: BookType) => void;
  onRemove?: (id: string) => void;
  compact?: boolean;
}

export function BookItem({ book, isSaved, onToggleSave, onRemove, compact = false }: BookItemProps) {
  const router = useRouter();

  const handlePress = () => {
    // Navigate to details
    // If it's saved, we pass ID to look up in storage? Or pass params?
    // Passing params is easier but limited size. ID is better if we have global state.
    // For now, let's just pass the book object as params stringified or just ID if we rely on context.
    // Since useBooks is a hook, state is not global.
    // We should probably pass the book data via params for search results.
    // For saved books, we can lookup by ID.
    // Let's pass all book data as params for simplicity in this small app.
    router.push({
        pathname: "/book/[id]",
        params: { id: book.id, bookData: JSON.stringify(book) }
    });
  };

  if (compact) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        className="bg-white dark:bg-slate-800 p-3 flex-row gap-3 items-center border-b border-slate-100 dark:border-slate-700"
      >
        <View className="w-10 h-14 bg-slate-100 dark:bg-slate-700 rounded overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-600">
          {book.thumbnail ? (
            <Image source={{ uri: book.thumbnail }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <BookIcon className="text-slate-300 dark:text-slate-500" size={16} />
          )}
        </View>
        <View className="flex-1 min-w-0">
          <Text className="font-bold text-slate-800 dark:text-slate-100 text-sm" numberOfLines={1}>{book.title}</Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400" numberOfLines={1}>{book.authors.join(', ')}</Text>
        </View>
        {onRemove && (
          <TouchableOpacity
            onPress={() => onRemove(book.id)}
            className="p-2"
          >
            <Trash2 size={16} className="text-slate-400 hover:text-red-500" color="#94a3b8" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View className={`bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex-row gap-3 mb-3 ${isSaved ? 'border-green-200 dark:border-green-900 bg-green-50/30 dark:bg-green-900/10' : ''}`}>
        {/* Thumbnail */}
        <TouchableOpacity onPress={handlePress} className="w-20 h-28 bg-slate-100 dark:bg-slate-700 rounded overflow-hidden relative">
            {book.thumbnail ? (
            <Image source={{ uri: book.thumbnail }} className="w-full h-full" resizeMode="cover" />
            ) : (
            <View className="flex-1 items-center justify-center">
                <BookIcon className="text-slate-300 dark:text-slate-500" size={32} />
            </View>
            )}
            {isSaved && (
            <View className="absolute top-0 right-0 bg-green-500 p-1 rounded-bl shadow-sm">
                <Check size={12} color="white" />
            </View>
            )}
        </TouchableOpacity>

        {/* Info */}
        <View className="flex-1 justify-between py-1">
            <TouchableOpacity onPress={handlePress}>
                <Text className="font-bold text-slate-800 dark:text-slate-100 text-base leading-tight mb-1" numberOfLines={2}>
                    {book.title}
                </Text>
                <Text className="text-sm text-slate-600 dark:text-slate-400" numberOfLines={1}>
                    {book.authors.join(', ')}
                </Text>
            </TouchableOpacity>

            <View className="flex-row gap-2 mt-2">
                <TouchableOpacity
                    onPress={() => onToggleSave(book)}
                    className={`flex-1 py-2 px-3 rounded-lg flex-row items-center justify-center gap-1 ${
                        isSaved
                        ? 'bg-green-100 dark:bg-green-900/50'
                        : 'bg-indigo-600 dark:bg-indigo-500'
                    }`}
                >
                    {isSaved ? (
                        <>
                            <Check size={14} color="#15803d" />
                            <Text className="text-green-700 dark:text-green-400 text-xs font-bold">Saved</Text>
                        </>
                    ) : (
                        <Text className="text-white text-xs font-bold">Save</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => Linking.openURL(book.link)}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg items-center justify-center"
                >
                    <ExternalLink size={16} className="text-slate-500 dark:text-slate-400" color="#64748b" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
}
