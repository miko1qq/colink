# CoLink - Troubleshooting Guide

## 🚨 Распространенные проблемы и решения

### 1. Ошибка "createRoot(...): Target container is not a DOM element"
**Проблема**: React не может найти DOM элемент для монтирования
**Решение**: 
- ✅ **ИСПРАВЛЕНО** - Обновлен `main.tsx` с проверкой DOM элемента
- ✅ **ИСПРАВЛЕНО** - Добавлен `React.lazy()` для компонентов

### 2. React Router Warnings
**Проблема**: Предупреждения о future flags в React Router
**Решение**: 
- ✅ **ИСПРАВЛЕНО** - Добавлены future flags в `BrowserRouter`
```tsx
<BrowserRouter
  future={{
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  }}
>
```

### 3. Проблемы с портом "ERR_CONNECTION_REFUSED"
**Проблема**: Сервер разработки недоступен на порту
**Решение**:
1. ✅ **ИСПРАВЛЕНО** - Изменен порт в `vite.config.ts` на стандартный 5173
2. Очистить кэш: `rm -rf node_modules/.vite dist`
3. Перезапустить сервер: `npm run dev`

---

## 🔧 Общие команды для устранения неполадок

### Очистка кэша и перезапуск
```bash
# Остановить все процессы
pkill -f "npm run dev" || pkill -f "vite"

# Очистить кэш
rm -rf node_modules/.vite dist .vite

# Перезапустить
npm run dev
```

### Переустановка зависимостей
```bash
# Полная переустановка
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Проверка портов
```bash
# Проверить какие порты заняты
lsof -i :5173
lsof -i :8080

# Убить процесс на порту
kill -9 $(lsof -t -i:5173)
```

---

## 🐛 Логи и отладка

### Если приложение не запускается:
1. Проверьте консоль браузера (F12)
2. Проверьте терминал с `npm run dev`
3. Убедитесь что `.env` файл настроен правильно

### Частые ошибки в консоли:
- **Module import errors**: Проверьте пути импорта и существование файлов
- **Supabase errors**: Проверьте переменные окружения
- **TypeScript errors**: Проверьте типы и интерфейсы

---

## ✅ Текущий статус исправлений

| Проблема | Статус | Решение |
|----------|--------|---------|
| createRoot error | ✅ ИСПРАВЛЕНО | Обновлен main.tsx |
| React Router warnings | ✅ ИСПРАВЛЕНО | Добавлены future flags |
| Порт 8080 → 5173 | ✅ ИСПРАВЛЕНО | Обновлен vite.config.ts |
| Import errors | ✅ ИСПРАВЛЕНО | Lazy loading |
| Color scheme | ✅ ИСПРАВЛЕНО | Обновлена цветовая схема |
| Logo display | ✅ ИСПРАВЛЕНО | Используется logo.png |
| Avatar upload | ✅ ИСПРАВЛЕНО | Supabase Storage |
| Login redirects | ✅ ИСПРАВЛЕНО | Role-based routing |

---

## 📞 Если проблемы продолжаются

1. **Перезапустите VS Code/редактор**
2. **Перезапустите терминал**
3. **Проверьте Node.js версию**: `node --version` (должна быть 18+)
4. **Очистите кэш браузера**: Ctrl+Shift+R или F5
5. **Проверьте сетевое подключение** для Supabase

---

## 🚀 Успешный запуск

После исправления всех проблем:
- ✅ Приложение запускается на `http://localhost:5173`
- ✅ Никаких ошибок в консоли
- ✅ React Router работает корректно
- ✅ Все компоненты загружаются

**Приложение готово к использованию!** 🎉