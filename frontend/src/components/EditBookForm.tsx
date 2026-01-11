/**
 * Компонент формы для редактирования книги
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/retroui/Button';
import { Input } from '@/components/retroui/Input';
import { Label } from '@/components/retroui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/retroui/Select';
import type { Book, BookUpdate, BookStatus, BookStatusValue } from '@/types/book';
import { bookService } from '@/services/api/bookService';

interface EditBookFormProps {
  book: Book;
  genres: string[];
  onSubmit: (book: BookUpdate) => void;
  onCancel?: () => void;
}

export function EditBookForm({ book, genres, onSubmit, onCancel }: EditBookFormProps) {
  const [formData, setFormData] = useState<BookUpdate>({
    name: book.name,
    genre: book.genre,
    author: book.author,
    status: book.status,
  });

  const [customGenre, setCustomGenre] = useState('');
  const [isCustomGenre, setIsCustomGenre] = useState(false);
  const [statuses, setStatuses] = useState<BookStatus[]>([]);

  // Загрузка списка статусов
  useEffect(() => {
    const loadStatuses = async () => {
      try {
        const statusList = await bookService.getStatuses();
        setStatuses(statusList);
      } catch (error) {
        console.error('Ошибка загрузки статусов:', error);
      }
    };
    loadStatuses();
  }, []);

  // Проверяем, является ли текущий жанр кастомным (не в списке)
  useEffect(() => {
    if (book.genre && !genres.includes(book.genre)) {
      setIsCustomGenre(true);
      setCustomGenre(book.genre);
    }
  }, [book.genre, genres]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookData: BookUpdate = {
      ...formData,
      genre: isCustomGenre ? (customGenre || null) : formData.genre,
    };

    // Валидация
    if (bookData.name && !bookData.name.trim()) {
      alert('Пожалуйста, введите название книги');
      return;
    }

    onSubmit(bookData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-4 py-6">
      <div className="space-y-2">
        <Label htmlFor="name">Название книги *</Label>
        <Input
          id="name"
          type="text"
          placeholder="Введите название книги"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Автор</Label>
        <Input
          id="author"
          type="text"
          placeholder="Введите имя автора"
          value={formData.author || ''}
          onChange={(e) => setFormData({ ...formData, author: e.target.value || null })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="genre">Жанр</Label>
        {!isCustomGenre ? (
          <div className="space-y-2">
            <Select
              value={formData.genre || ''}
              onValueChange={(value) => {
                if (value === '__custom__') {
                  setIsCustomGenre(true);
                  setFormData({ ...formData, genre: null });
                } else {
                  setFormData({ ...formData, genre: value });
                }
              }}
            >
              <SelectTrigger id="genre" className="w-full h-[44px]">
                <SelectValue placeholder="Выберите жанр" />
              </SelectTrigger>
              <SelectContent className='max-h-[400px] overflow-y-auto'>
                <SelectItem value="__custom__">
                  ✏️ Свой вариант
                </SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-2">
            <Input
              id="custom-genre"
              type="text"
              placeholder="Введите свой жанр"
              value={customGenre}
              onChange={(e) => setCustomGenre(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsCustomGenre(false);
                setCustomGenre('');
              }}
            >
              ← Выбрать из списка
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Статус</Label>
        <Select
          value={formData.status || ''}
          onValueChange={(value) => setFormData({ ...formData, status: value as BookStatusValue })}
        >
          <SelectTrigger id="status" className="w-full h-[44px]">
            <SelectValue placeholder="Выберите статус" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-4 justify-end">
        <Button type="submit">
          Сохранить изменения
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        )}
      </div>
    </form>
  );
}


