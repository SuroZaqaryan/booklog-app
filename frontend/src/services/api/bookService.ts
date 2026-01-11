/**
 * Сервис для работы с книгами через API
 */

import { apiClient } from './axios';
import type { Book, BookCreate, BookStatus, BookUpdate } from '@/types/book';

const BOOKS_ENDPOINT = '/book';

export const bookService = {
  /**
   * Получить все книги
   */
  async getAllBooks(searchQuery?: string): Promise<Book[]> {
    const params = searchQuery ? { name: searchQuery } : {};
    const response = await apiClient.get<Book[]>(BOOKS_ENDPOINT, { params });
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

  /**
   * Обновить книгу
   */
  async updateBook(bookId: number, book: BookUpdate): Promise<Book> {
    const updateData: Record<string, any> = {};
    
    if (book.name !== undefined) {
      updateData.name = book.name;
    }
    if (book.genre !== undefined) {
      updateData.genre = book.genre;
    }
    if (book.author !== undefined) {
      updateData.author = book.author;
    }
    if (book.status !== undefined) {
      updateData.status = book.status;
    }
    
    const response = await apiClient.put<Book>(`${BOOKS_ENDPOINT}/${bookId}`, updateData);
    return response.data;
  },
};

