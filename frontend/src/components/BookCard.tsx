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

  // Формируем полный URL для изображения
  const imageUrl = book.image_url 
    ? `http://localhost:8000/${book.image_url.replace(/\\/g, '/')}`
    : null;

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>{book.name}</CardTitle>
        <CardDescription>Автор: {book.author ? book.author : ''}</CardDescription>

      </CardHeader>
      <CardContent>
        {imageUrl && (
          <div className="mb-4">
            <img
              src={imageUrl}
              alt={`Обложка книги ${book.name}`}
              className="w-full h-48 object-cover rounded-md"
              onError={(e) => {
                // Скрываем изображение при ошибке загрузки
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
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

