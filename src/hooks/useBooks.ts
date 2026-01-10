import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types';

const STORAGE_KEY = 'poteto-library-saved-books';

export function useBooks() {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSavedBooks = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setSavedBooks(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Failed to load books', e);
    }
  }, []);

  useEffect(() => {
    loadSavedBooks();
  }, [loadSavedBooks]);

  const saveBook = useCallback(async (book: Book) => {
    try {
      // We use functional update to avoid dependency on savedBooks
      // But we need to check if already saved... this requires reading state.
      // So we must depend on savedBooks or use functional update with logic inside.
      // Let's rely on functional update pattern for setState, but for `some` check we need current state.
      // Actually, we can read from storage or just trust current state.
      setSavedBooks(currentSavedBooks => {
          if (currentSavedBooks.some((b) => b.id === book.id)) {
            return currentSavedBooks;
          }
          const newSavedBooks = [...currentSavedBooks, { ...book, savedAt: Date.now() }];
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSavedBooks)).catch(e => console.error(e));
          return newSavedBooks;
      });
    } catch (e) {
      console.error('Failed to save book', e);
    }
  }, []);

  const updateBook = useCallback(async (updatedBook: Book) => {
    try {
      setSavedBooks(currentSavedBooks => {
          const newSavedBooks = currentSavedBooks.map((b) =>
            b.id === updatedBook.id ? updatedBook : b
          );
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSavedBooks)).catch(e => console.error(e));
          return newSavedBooks;
      });
    } catch (e) {
      console.error('Failed to update book', e);
    }
  }, []);

  const removeBook = useCallback(async (id: string) => {
    try {
      setSavedBooks(currentSavedBooks => {
          const newSavedBooks = currentSavedBooks.filter((b) => b.id !== id);
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSavedBooks)).catch(e => console.error(e));
          return newSavedBooks;
      });
    } catch (e) {
      console.error('Failed to remove book', e);
    }
  }, []);

  // Simple getters, memoized to prevent re-renders of consumers if used in effects?
  // They depend on savedBooks.
  const isSaved = useCallback((id: string) => savedBooks.some((b) => b.id === id), [savedBooks]);
  const getSavedBook = useCallback((id: string) => savedBooks.find((b) => b.id === id), [savedBooks]);

  const searchBooks = useCallback(async (query: string) => {
    if (!query.trim()) return [];

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&maxResults=20`
      );
      const data = await response.json();

      if (!data.items) {
        return [];
      }

      const books: Book[] = data.items.map((item: any) => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ['Unknown'],
        thumbnail: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
        link: item.volumeInfo.infoLink,
        isbn: item.volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13')?.identifier,
        description: item.volumeInfo.description,
        publishedDate: item.volumeInfo.publishedDate,
      }));

      return books;
    } catch (err) {
      setError('Failed to fetch books');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    savedBooks,
    loadSavedBooks,
    saveBook,
    updateBook,
    removeBook,
    isSaved,
    getSavedBook,
    searchBooks,
    loading,
    error,
  };
}
