/**
 * Главная страница приложения с библиотекой книг
 */

import { useState } from 'react';
import { Header } from '@/components/Header';
import { BookList } from '@/components/BookList';
import { AddBookDialog } from '@/components/AddBookDialog';
import { EditBookDialog } from '@/components/EditBookDialog';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { useBooks } from '@/hooks/useBooks';
import { Text } from '@/components/retroui/Text';
import { Input } from '@/components/retroui/Input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/retroui/Button';
import type { Book } from '@/types/book';

export function HomePage() {
  const { books, genres, loading, error, searchQuery, setSearchQuery, addBook, deleteBook, updateBook, refetch } = useBooks();
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

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

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
  };

  const handleUpdateBook = async (bookId: number, bookData: any) => {
    try {
      setActionError(null);
      await updateBook(bookId, bookData);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Произошла ошибка при обновлении');
    }
  };

  return (
    <div className="min-h-screen bg-[#f4eadd]">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Сообщение об ошибке действия */}
        {actionError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
            <Text className="text-destructive">{actionError}</Text>
          </div>
        )}

        {/* Панель управления */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">Моя библиотека</h2>
              <Text className="text-muted-foreground">
                {books.length > 0 
                  ? `${searchQuery ? 'Найдено' : 'Всего'} книг: ${books.length}`
                  : searchQuery ? 'Ничего не найдено' : 'Библиотека пуста'}
              </Text>
            </div>
            <AddBookDialog genres={genres} onAddBook={handleAddBook} />
          </div>

          {/* Поисковая строка */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Поиск книг по названию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 font-mono"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                title="Очистить поиск"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Содержимое */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : (
          <BookList 
            books={books} 
            onDeleteBook={handleDeleteBook}
            onEditBook={handleEditBook}
          />
        )}
      </main>

      {/* Диалог редактирования */}
      {editingBook && (
        <EditBookDialog
          book={editingBook}
          genres={genres}
          open={!!editingBook}
          onOpenChange={(open) => !open && setEditingBook(null)}
          onUpdateBook={handleUpdateBook}
        />
      )}
    </div>
  );
}

