# 🔧 Исправление: Экспорты RetroUI компонентов

## Проблема

При попытке импортировать отдельные компоненты из RetroUI файлов возникала ошибка:

```
Uncaught SyntaxError: The requested module doesn't provide an export named: 'CardTitle'
```

## Причина

RetroUI компоненты были экспортированы как составные объекты (Object.assign), но не экспортировали отдельные sub-компоненты.

## Решение

Добавлены отдельные экспорты для всех sub-компонентов:

### 1. Card.tsx

```typescript
export { CardComponent as Card };
export { CardHeader, CardTitle, CardDescription, CardContent };
```

### 2. Dialog.tsx

```typescript
export { DialogComponent as Dialog };
export { DialogTrigger, DialogHeader, DialogContent, DialogDescription, DialogFooter };
```

### 3. Select.tsx

```typescript
export { SelectObj as Select };
export { 
  SelectTrigger, 
  SelectValue, 
  SelectIcon, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectSeparator 
};
```

## Использование

Теперь можно импортировать компоненты двумя способами:

### Способ 1: Составной компонент (JSX стиль)

```tsx
import { Card } from '@/components/retroui/Card';

<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
</Card>
```

### Способ 2: Отдельные компоненты (предпочтительно)

```tsx
import { Card, CardHeader, CardTitle } from '@/components/retroui/Card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
</Card>
```

## Статус

✅ **Исправлено**: Все компоненты теперь экспортируют sub-компоненты
✅ **Тестировано**: Hot reload применил изменения
✅ **Работает**: Приложение должно загрузиться без ошибок

## Затронутые файлы

- `src/components/retroui/Card.tsx`
- `src/components/retroui/Dialog.tsx`
- `src/components/retroui/Select.tsx`

Все остальные RetroUI компоненты (Button, Input, Label, Text) уже экспортировались правильно.

