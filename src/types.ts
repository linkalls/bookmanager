// Reading status types
export type ReadingStatus = 'want_to_read' | 'reading' | 'completed' | 'dropped';

// Quote/highlight from a book
export interface Quote {
  id: string;
  text: string;
  page?: number;
  comment?: string;
  createdAt: string;
}

// Lending information
export interface LendingStatus {
  borrower: string;
  lentDate: string;
  dueDate?: string;
}

export interface Book {
  id: string;
  title: string;
  authors: string[];
  publishedDate?: string;
  description?: string;
  thumbnail?: string;
  isbn?: string;
  link: string;
  tags?: string[];
  comment?: string;
  
  // Phase 1: Reading Status & Progress
  status?: ReadingStatus;
  currentPage?: number;
  totalPages?: number;
  startDate?: string;
  finishDate?: string;
  
  // Phase 2: Ratings & Reviews
  rating?: number; // 0-5
  quotes?: Quote[];
  review?: string;
  
  // Phase 4: Lending
  lendingStatus?: LendingStatus;
}

// Helper to get progress percentage
export function getProgressPercentage(book: Book): number {
  if (!book.currentPage || !book.totalPages || book.totalPages === 0) {
    return 0;
  }
  return Math.min(100, Math.round((book.currentPage / book.totalPages) * 100));
}
