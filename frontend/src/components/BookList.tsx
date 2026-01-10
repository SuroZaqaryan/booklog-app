/**
 * Компонент для отображения списка книг
 */

import { BookCard } from './BookCard';
import type { Book } from '@/types/book';

interface BookListProps {
  books: Book[];
  onDeleteBook: (bookId: number) => void;
}

export function BookList({ books, onDeleteBook }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          📚 Пока нет добавленных книг
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Добавьте свою первую книгу, чтобы начать вести учет
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onDelete={onDeleteBook} />
      ))}
    </div>
  );
}

