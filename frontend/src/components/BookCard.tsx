/**
 * Переработанный компонент карточки книги в стиле библиотечной картотеки
 * С компактным Avatar для обложки
 */

import type { Book, BookStatusValue } from '@/types/book';
import { Trash2, Pencil, BookOpen, CheckCircle, Bookmark, XCircle } from 'lucide-react';
import { Avatar } from '@/components/retroui/Avatar';
import { Button } from '@/components/retroui/Button';

interface BookCardProps {
  book: Book;
  onDelete: (bookId: number) => void;
  onEdit?: (book: Book) => void;
}

// Маппинг статусов на русские названия и иконки
const STATUS_CONFIG: Record<BookStatusValue, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
}> = {
  want_to_read: {
    label: 'Хочу',
    color: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    icon: <Bookmark className="h-3 w-3" />
  },
  reading: {
    label: 'Читаю',
    color: 'text-blue-800',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    icon: <BookOpen className="h-3 w-3" />
  },
  finished: {
    label: 'Прочитал',
    color: 'text-green-800',
    bg: 'bg-green-50',
    border: 'border-green-300',
    icon: <CheckCircle className="h-3 w-3" />
  },
  dropped: {
    label: 'Бросил',
    color: 'text-gray-700',
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    icon: <XCircle className="h-3 w-3" />
  },
};

export function BookCard({ book, onDelete, onEdit }: BookCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Удалить "${book.name}" из каталога?`)) {
      onDelete(book.id);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(book);
    }
  };

  const imageUrl = book.image_url 
    ? `http://localhost:8000/${book.image_url.replace(/\\/g, '/')}`
    : null;

  const statusConfig = book.status ? STATUS_CONFIG[book.status] : null;

  // Форматирование даты добавления
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="group relative font-mono">
      {/* Основная карточка в стиле библиотечной карточки */}
      <div className="
        bg-amber-50 
        border-2 border-gray-800 
        shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]
        hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.8)]
        transition-all duration-200
        p-5
        relative
        overflow-hidden
        h-full
        flex flex-col
      ">
        {/* Верхний угол как у библиотечной карточки */}
        <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-gray-800" />
        
        {/* Угловые отметки */}
        <div className="absolute top-2 left-2 w-1.5 h-1.5 border border-gray-600 rounded-sm" />
        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border border-gray-600 rounded-sm" />

        {/* Поля для подшивки */}
        <div className="absolute left-3 top-4 bottom-4 w-3 border-r border-dashed border-gray-300" />
        <div className="absolute right-3 top-4 bottom-4 w-3 border-l border-dashed border-gray-300" />

        {/* Аватар-миниатюра обложки (как экслибрис) */}
        <div className="absolute top-4 left-4 z-20">
        <Avatar>
            <Avatar.Image src={imageUrl || ''} alt={`Обложка: ${book.name}`} />
            <Avatar.Fallback>AH</Avatar.Fallback>
          </Avatar>
          
          {/* Инвентарный номер под аватаром */}
          <div className="text-[10px] text-gray-600 text-center mt-1 font-bold tracking-wider">
            #{book.id.toString().padStart(4, '0')}
          </div>
        </div>

        {/* Контент карточки (с отступом под аватар) */}
        <div className="flex-1 pl-20 pr-4 relative z-10">
          {/* Штамп статуса */}
          {statusConfig && (
            <div className={`
              absolute top-0 right-0 
              ${statusConfig.bg} ${statusConfig.border} ${statusConfig.color}
              border-2 
              px-2 py-1 
              transform -translate-y-1/3
              flex items-center gap-1.5
              text-xs font-bold tracking-wider
              uppercase
              -rotate-3
            `}>
              {statusConfig.icon}
              <span>{statusConfig.label}</span>
            </div>
          )}

          {/* Название книги */}
          <h3 className="
            text-lg 
            font-bold 
            text-gray-900 
            mb-2
            leading-tight
            font-serif
            line-clamp-2
            min-h-[2.5rem]
          ">
            {book.name}
          </h3>

          {/* Автор */}
          <div className="mb-3">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">
              Автор
            </div>
            <div className="text-base text-gray-800 font-medium line-clamp-1">
              {book.author || 'Не указан'}
            </div>
          </div>

          {/* Жанр */}
          {book.genre && (
            <div className="mb-4">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-0.5">
                Категория
              </div>
              <div className="
                inline-block 
                px-2 py-1 
                bg-gray-800 
                text-amber-50 
                text-xs 
                font-bold 
                tracking-wider
                border border-gray-900
                max-w-full
                truncate
              ">
                {book.genre}
              </div>
            </div>
          )}

          {/* Дополнительная информация (можно добавить позже) */}
          <div className="mt-4 pt-3 border-t border-gray-300">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-gray-500 mb-0.5">Страниц</div>
                <div className="font-medium">{book.pages || '—'}</div>
              </div>
              <div>
                <div className="text-gray-500 mb-0.5">Год</div>
                <div className="font-medium">{book.year || '—'}</div>
              </div>
            </div>
          </div>

          {/* Дата добавления */}
          <div className="text-xs text-gray-500 italic mt-auto pt-3 border-t border-gray-300">
            Дата добавления: {formatDate(book.created_at)}
          </div>

            {/* Кнопки действий - появляются только при наведении */}
      <div className="
        flex gap-3 justify-end
        mt-8
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        z-20
      ">
        {onEdit && (
          <Button
            onClick={handleEdit}
            variant="default"
            className="
              text-[10px]
              tracking-wider
              uppercase
              gap-1
            "
            title="Редактировать запись"
          >
            <Pencil className="h-3 w-3" />
            <span>Редактировать</span>
          </Button>
        )}
        
        <Button
          onClick={handleDelete}
          variant="outline"
          className="
            text-[10px]
            tracking-wider
            uppercase
            gap-1
            hover:bg-red-50
            hover:text-red-700
            hover:border-red-700
          "
          title="Удалить из каталога"
        >
          <Trash2 className="h-3 w-3" />
          <span>Удалить</span>
        </Button>
      </div>
        </div>
      </div>

    
    </div>
  );
}