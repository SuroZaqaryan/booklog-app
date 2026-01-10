/**
 * Хук для работы с книгами
 */

import { useState, useEffect } from 'react';
import { bookService } from '@/services/api';
import type { Book, BookCreate } from '@/types/book';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка книг
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError('Не удалось загрузить список книг. Проверьте подключение к серверу.');
    } finally {
      setLoading(false);
    }
  };

  // Загрузка жанров
  const fetchGenres = async () => {
    try {
      const data = await bookService.getGenres();
      setGenres(data);
    } catch (err) {
      console.error('Error fetching genres:', err);
      // Не показываем ошибку для жанров, используем пустой список
    }
  };

  // Добавление книги
  const addBook = async (bookData: BookCreate) => {
    try {
      const newBook = await bookService.createBook(bookData);
      setBooks((prev) => [...prev, newBook]);
      
      // Обновляем список жанров, если добавлен новый
      if (bookData.genre && !genres.includes(bookData.genre)) {
        setGenres((prev) => [...prev, bookData.genre!]);
      }
    } catch (err) {
      console.error('Error creating book:', err);
      throw new Error('Не удалось добавить книгу. Попробуйте еще раз.');
    }
  };

  // Удаление книги
  const deleteBook = async (bookId: number) => {
    try {
      await bookService.deleteBook(bookId);
      setBooks((prev) => prev.filter((book) => book.id !== bookId));
    } catch (err) {
      console.error('Error deleting book:', err);
      throw new Error('Не удалось удалить книгу. Попробуйте еще раз.');
    }
  };

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  return {
    books,
    genres,
    loading,
    error,
    addBook,
    deleteBook,
    refetch: fetchBooks,
  };
}

