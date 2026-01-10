export interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail?: string;
  link: string;
  isbn?: string; // Additional field for scanning match
  description?: string;
  publishedDate?: string;

  // User added fields
  tags?: string[];
  comment?: string;
  savedAt?: number;
}
