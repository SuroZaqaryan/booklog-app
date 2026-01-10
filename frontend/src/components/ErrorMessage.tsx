/**
 * Компонент для отображения ошибок
 */

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/retroui/Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">Произошла ошибка</h3>
      <p className="text-muted-foreground text-center mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Попробовать снова
        </Button>
      )}
    </div>
  );
}

