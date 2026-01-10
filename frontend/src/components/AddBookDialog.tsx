/**
 * Компонент модального окна для добавления книги
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/retroui/Dialog';
import { Button } from '@/components/retroui/Button';
import { AddBookForm } from './AddBookForm';
import type { BookCreate } from '@/types/book';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface AddBookDialogProps {
  genres: string[];
  onAddBook: (book: BookCreate) => Promise<void>;
}

export function AddBookDialog({ genres, onAddBook }: AddBookDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = async (book: BookCreate) => {
    await onAddBook(book);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-5 w-5" />
          Добавить книгу
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить новую книгу</DialogTitle>
        </DialogHeader>
        <AddBookForm
          genres={genres}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

