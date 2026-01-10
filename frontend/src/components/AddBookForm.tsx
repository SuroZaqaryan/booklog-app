/**
 * Компонент формы для добавления новой книги
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
import type { BookCreate } from '@/types/book';

interface AddBookFormProps {
  genres: string[];
  onSubmit: (book: BookCreate) => void;
  onCancel?: () => void;
}

export function AddBookForm({ genres, onSubmit, onCancel }: AddBookFormProps) {
  const [formData, setFormData] = useState<BookCreate>({
    name: '',
    genre: null,
    author: null,
  });

  const [customGenre, setCustomGenre] = useState('');
  const [isCustomGenre, setIsCustomGenre] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bookData: BookCreate = {
      ...formData,
      genre: isCustomGenre ? (customGenre || null) : formData.genre,
    };

    // Валидация
    if (!bookData.name.trim()) {
      alert('Пожалуйста, введите название книги');
      return;
    }

    onSubmit(bookData);
    
    // Сброс формы
    setFormData({ name: '', genre: null, author: null });
    setCustomGenre('');
    setIsCustomGenre(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-4 py-6">
      <div className="space-y-2">
        <Label htmlFor="name">Название книги *</Label>
        <Input
          id="name"
          type="text"
          placeholder="Введите название книги"
          value={formData.name}
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

      <div className="flex gap-2 pt-4 justify-end">
        <Button type="submit">
          Добавить книгу
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

