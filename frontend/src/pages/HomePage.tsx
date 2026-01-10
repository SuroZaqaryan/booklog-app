/**
 * Главная страница приложения с библиотекой книг
 */

import { useState } from 'react';
import { Header } from '@/components/Header';
import { BookList } from '@/components/BookList';
import { AddBookDialog } from '@/components/AddBookDialog';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useBooks } from '@/hooks/useBooks';
import { Text } from '@/components/retroui/Text';

export function HomePage() {
  const { books, genres, loading, error, addBook, deleteBook, refetch } = useBooks();
  const [actionError, setActionError] = useState<string | null>(null);

  const handleAddBook = async (bookData: any) => {
    try {
      setActionError(null);
      await addBook(bookData);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Произошла ошибка');
    }
  };

  const handleDeleteBook = async (bookId: number) => {
    try {
      setActionError(null);
      await deleteBook(bookId);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Произошла ошибка при удалении');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Сообщение об ошибке действия */}
        {actionError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <Text className="text-destructive">{actionError}</Text>
          </div>
        )}

        {/* Панель управления */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">Моя библиотека</h2>
            <Text className="text-muted-foreground">
              {books.length > 0 
                ? `Всего книг: ${books.length}`
                : 'Библиотека пуста'}
            </Text>
          </div>
          <AddBookDialog genres={genres} onAddBook={handleAddBook} />
        </div>

        {/* Содержимое */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : (
          <BookList books={books} onDeleteBook={handleDeleteBook} />
        )}
      </main>
    </div>
  );
}

