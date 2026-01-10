/**
 * Типы данных для работы с книгами
 */

export interface Book {
  id: number;
  name: string;
  genre: string | null;
  author: string | null;
  image_url: string | null;
}

export interface BookCreate {
  name: string;
  genre?: string | null;
  author?: string | null;
  image?: File | null;
}

export interface BookStatus {
  label: string;
  value: string;
}

