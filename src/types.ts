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
}
