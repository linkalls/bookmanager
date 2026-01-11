import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types';

const STORAGE_KEY = '@bookmanager_books';

interface BooksContextType {
  savedBooks: Book[];
  loading: boolean;
  error: string | null;
  loadSavedBooks: () => Promise<void>;
  saveBook: (book: Book) => Promise<void>;
  updateBook: (book: Book) => Promise<void>;
  removeBook: (id: string) => Promise<void>;
  isSaved: (id: string) => boolean;
  getSavedBook: (id: string) => Book | undefined;
  searchBooks: (query: string, startIndex?: number) => Promise<Book[]>;
}

const BooksContext = createContext<BooksContextType | undefined>(undefined);

export function BooksProvider({ children }: { children: ReactNode }) {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoaded = useRef(false);

  // Load on mount
  useEffect(() => {
    if (!isLoaded.current) {
      isLoaded.current = true;
      loadSavedBooks();
    }
  }, []);

  const loadSavedBooks = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setSavedBooks(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load books:', e);
    }
  }, []);

  const saveBook = useCallback(async (book: Book) => {
    try {
      const current = await AsyncStorage.getItem(STORAGE_KEY);
      const books: Book[] = current ? JSON.parse(current) : [];
      const existingIndex = books.findIndex(b => b.id === book.id);

      if (existingIndex >= 0) {
        books[existingIndex] = book;
      } else {
        books.push(book);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books));
      setSavedBooks(books);
    } catch (e) {
      console.error('Failed to save book:', e);
    }
  }, []);

  const updateBook = useCallback(async (book: Book) => {
    await saveBook(book);
  }, [saveBook]);

  const removeBook = useCallback(async (id: string) => {
    try {
      const current = await AsyncStorage.getItem(STORAGE_KEY);
      const books: Book[] = current ? JSON.parse(current) : [];
      const newBooks = books.filter(b => b.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
      setSavedBooks(newBooks);
    } catch (e) {
      console.error('Failed to remove book:', e);
    }
  }, []);

  const isSaved = useCallback((id: string) => savedBooks.some(b => b.id === id), [savedBooks]);

  const getSavedBook = useCallback((id: string) => savedBooks.find(b => b.id === id), [savedBooks]);

  const searchBooks = useCallback(async (query: string, startIndex: number = 0): Promise<Book[]> => {
    setLoading(true);
    setError(null);

    try {
      const cleanQuery = query.replace(/-/g, '');
      const isISBN = /^\d+$/.test(cleanQuery) && (cleanQuery.length === 10 || cleanQuery.length === 13);
      const searchQuery = isISBN ? `isbn:${query}` : query;

      // Google Books API uses startIndex for pagination
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&startIndex=${startIndex}&maxResults=10`
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();

      if (!data.items) {
        return [];
      }

      const books: Book[] = data.items.map((item: any) => {
        const volumeInfo = item.volumeInfo;
        const industryIdentifiers = volumeInfo.industryIdentifiers || [];
        const isbn = industryIdentifiers.find((id: any) => id.type === 'ISBN_13')?.identifier ||
                    industryIdentifiers.find((id: any) => id.type === 'ISBN_10')?.identifier;

        return {
          id: item.id,
          title: volumeInfo.title || 'Unknown Title',
          authors: volumeInfo.authors || ['Unknown Author'],
          publishedDate: volumeInfo.publishedDate,
          description: volumeInfo.description,
          thumbnail: volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://'),
          isbn,
          link: volumeInfo.infoLink || `https://books.google.com/books?id=${item.id}`,
        };
      });

      return books;
    } catch (e) {
      setError('Failed to search books. Please try again.');
      console.error('Search error:', e);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <BooksContext.Provider value={{
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
    }}>
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BooksContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
}
