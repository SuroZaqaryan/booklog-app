/**
 * Типы данных для работы с книгами
 */

export type BookStatusValue = 'want_to_read' | 'reading' | 'finished' | 'dropped';

export interface Book {
  id: number;
  name: string;
  genre: string | null;
  author: string | null;
  status: BookStatusValue | null;
  image_url: string | null;
}

export interface BookCreate {
  name: string;
  genre?: string | null;
  author?: string | null;
  status?: BookStatusValue | null;
  image?: File | null;
}

export interface BookStatus {
  label: string;
  value: BookStatusValue;
}

