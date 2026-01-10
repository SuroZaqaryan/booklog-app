/**
 * Компонент заголовка приложения
 */

import { BookOpen } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">BookLog</h1>
            <p className="text-sm text-muted-foreground">
              Ваша личная библиотека
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

