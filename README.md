# Finance School

## Опис
**Finance School** — це веб-застосунок для управління подіями та учасниками, побудований на **React + Redux Toolkit (фронтенд)** та **Node.js + Express + MongoDB (бекенд)**.

### Функціонал
- Реєстрація та авторизація користувачів
- Створення, редагування та видалення подій
- Реєстрація учасників на події
- Перегляд списку учасників та статистики реєстрацій
- Візуалізація даних у вигляді графіків (Recharts)
- Чат у реальному часі (Socket.IO)
- Адаптивний дизайн
- Перемикання теми (light/dark)

---

# Запуск проєкту

## 1. Клонування репозиторію

```bash
git clone <url>
cd Finance-School
```

## 2. Встановлення залежностей

### Фронтенд

```bash
cd frontend
npm install
```

### Бекенд

```bash
cd backend
npm install
```

---

## 3. Налаштування .env файлів

### Backend (backend/.env)

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/finance-school?retryWrites=true&w=majority
SESSION_SECRET=yourSecretKey
```

### Frontend (frontend/.env)

```env
VITE_API_URL=http://localhost:3000
```

На продакшн (Vercel + Render) треба змінити:

```env
VITE_API_URL=https://finance-school.onrender.com
```

---

## 4. Запуск у режимі розробки

### Фронтенд

```bash
npm run dev
```

Доступно за адресою:  
http://localhost:5173

### Бекенд

```bash
npm run dev
```

Доступно за адресою:  
http://localhost:3000

---

## 5. Збірка для продакшн

### Фронтенд

```bash
npm run build
npm run preview
```

---

# Структура проєкту

```bash
Finance-School/
├── backend/
│   ├── server.js
│   ├── models.js
│   ├── graphql.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventsList.jsx
│   │   │   ├── SkeletonEventCard.jsx
│   │   │   └── Spinner.jsx
│   │   ├── features/
│   │   │   ├── analytics/
│   │   │   │   └── analyticsSlice.js
│   │   │   ├── events/
│   │   │   │   ├── eventsSelectors.js
│   │   │   │   └── eventsSlice.js
│   │   │   ├── participants/
│   │   │   │   └── articipantsSlice.js
│   │   │   └── theme/
│   │   │       └── themeSlice.js
│   │   ├── pages/
│   │   │   ├── Analytics.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Participants.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Stats.jsx
│   │   │   └── UserRegister.jsx
│   │   ├── App.jsx
│   │   ├── store.jsx
│   │   └── styles.css
│   └── .env
```

---

# API ендпоінти (бекенд)

## Аутентифікація

- POST /api/register — реєстрація користувача
- POST /api/login — логін користувача

## Події

- GET /api/events — список подій (з пагінацією)
- GET /api/events/cursor — cursor pagination
- POST /api/events — створення події
- PUT /api/events/:id — редагування події
- DELETE /api/events/:id — видалення події

## Учасники

- GET /api/participants/:eventId — список учасників
- GET /api/participants/cursor/:eventId — cursor pagination
- POST /api/participants — додати учасника
- PUT /api/participants/:id — редагувати
- DELETE /api/participants/:id — видалити

## Статистика

- GET /api/stats/participants — кількість реєстрацій по датах

---

# Використані технології

## Frontend
- React
- Redux Toolkit
- React Router
- Recharts
- React Toastify
- Socket.IO Client
- Vite

## Backend
- Node.js
- Express
- MongoDB (Mongoose)
- GraphQL
- Socket.IO
- Express-Session
- dotenv

---

# Приклади запитів (Postman)

## Реєстрація

```http
POST http://localhost:3000/api/register
Content-Type: application/json

{
  "username": "TestUser",
  "password": "123456"
}
```

## Логін

```http
POST http://localhost:3000/api/login
Content-Type: application/json

{
  "username": "TestUser",
  "password": "123456"
}
```

## Отримати події

```http
GET http://localhost:3000/api/events?page=1&limit=5
```

## Додати учасника

```http
POST http://localhost:3000/api/participants
Content-Type: application/json

{
  "eventId": "65f123abc..."
}
```

---

# Примітки

- MongoDB має бути запущена
- .env файли не додаються в Git
- Backend деплоїться на Render
- Frontend деплоїться на Vercel