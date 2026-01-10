/**
 * Компонент для отображения карточки книги
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/retroui/Card';
import { Button } from '@/components/retroui/Button';
import type { Book } from '@/types/book';
import { Trash2 } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onDelete: (bookId: number) => void;
}

export function BookCard({ book, onDelete }: BookCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Вы уверены, что хотите удалить книгу "${book.name}"?`)) {
      onDelete(book.id);
    }
  };

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>{book.name}</CardTitle>
        <CardDescription>Автор: {book.author ? book.author : ''}</CardDescription>

      </CardHeader>
      <CardContent>
        {book.genre && (
          <p className="text-sm mb-4">
            <span className="font-semibold">Жанр:</span> {book.genre}
          </p>
        )}
        <div className="flex justify-end">
   
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Удалить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

