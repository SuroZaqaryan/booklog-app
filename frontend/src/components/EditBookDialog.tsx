/**
 * Компонент модального окна для редактирования книги
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/retroui/Dialog';
import { EditBookForm } from './EditBookForm';
import type { Book, BookUpdate } from '@/types/book';

interface EditBookDialogProps {
  book: Book;
  genres: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateBook: (bookId: number, book: BookUpdate) => Promise<void>;
}

export function EditBookDialog({ book, genres, open, onOpenChange, onUpdateBook }: EditBookDialogProps) {
  const handleSubmit = async (bookUpdate: BookUpdate) => {
    await onUpdateBook(book.id, bookUpdate);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать книгу</DialogTitle>
          {/* <DialogDescription>
            "{book.name}"
          </DialogDescription> */}
        </DialogHeader>
        <EditBookForm
          book={book}
          genres={genres}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}


