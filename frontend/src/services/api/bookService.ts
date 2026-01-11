/**
 * Сервис для работы с книгами через API
 */

import { apiClient } from './axios';
import type { Book, BookCreate, BookStatus } from '@/types/book';

const BOOKS_ENDPOINT = '/book';

export const bookService = {
  /**
   * Получить все книги
   */
  async getAllBooks(): Promise<Book[]> {
    const response = await apiClient.get<Book[]>(BOOKS_ENDPOINT);
    return response.data;
  },

  /**
   * Создать новую книгу
   */
  async createBook(book: BookCreate): Promise<Book> {
    const formData = new FormData();
    formData.append('name', book.name);
    
    if (book.genre) {
      formData.append('genre', book.genre);
    }
    
    if (book.author) {
      formData.append('author', book.author);
    }
    
    if (book.status) {
      formData.append('book_status', book.status);
    }
    
    if (book.image) {
      formData.append('image', book.image);
    }
    
    const response = await apiClient.post<Book>(BOOKS_ENDPOINT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Удалить книгу по ID
   */
  async deleteBook(bookId: number): Promise<void> {
    await apiClient.delete(`${BOOKS_ENDPOINT}/${bookId}`);
  },

  /**
   * Получить список доступных жанров
   */
  async getGenres(): Promise<string[]> {
    const response = await apiClient.get<string[]>(`${BOOKS_ENDPOINT}/genres`);
    return response.data;
  },

  /**
   * Получить список возможных статусов книг
   */
  async getStatuses(): Promise<BookStatus[]> {
    const response = await apiClient.get<BookStatus[]>(`${BOOKS_ENDPOINT}/statuses`);
    return response.data;
  },
};

