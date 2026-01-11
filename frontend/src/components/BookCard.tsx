/**
 * Компонент для отображения карточки книги
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/retroui/Card';
import { Button } from '@/components/retroui/Button';
import type { Book, BookStatusValue } from '@/types/book';
import { Trash2, Pencil } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onDelete: (bookId: number) => void;
  onEdit?: (book: Book) => void;
}

// Маппинг статусов на русские названия
const STATUS_LABELS: Record<BookStatusValue, string> = {
  want_to_read: 'Хочу прочитать',
  reading: 'Читаю',
  finished: 'Прочитал',
  dropped: 'Бросил',
};

// Цвета для статусов
const STATUS_COLORS: Record<BookStatusValue, string> = {
  want_to_read: 'bg-blue-100 text-blue-800 border-blue-200',
  reading: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  finished: 'bg-green-100 text-green-800 border-green-200',
  dropped: 'bg-gray-100 text-gray-800 border-gray-200',
};

export function BookCard({ book, onDelete, onEdit }: BookCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Вы уверены, что хотите удалить книгу "${book.name}"?`)) {
      onDelete(book.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(book);
    }
  };

  // Формируем полный URL для изображения
  const imageUrl = book.image_url 
    ? `http://localhost:8000/${book.image_url.replace(/\\/g, '/')}`
    : null;

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle>{book.name}</CardTitle>
            <CardDescription>Автор: {book.author ? book.author : ''}</CardDescription>
          </div>
          {book.status && (
            <span className={`px-2 py-1 text-xs font-medium rounded-md border whitespace-nowrap ${STATUS_COLORS[book.status]}`}>
              {STATUS_LABELS[book.status]}
            </span>
          )}
        </div>
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
          <p className="text-sm mb-2">
            <span className="font-semibold">Жанр:</span> {book.genre}
          </p>
        )}
        <div className="flex justify-end gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              Редактировать
            </Button>
          )}
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

