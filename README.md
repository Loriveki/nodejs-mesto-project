# Бэкенд Mesto.

## 🚀 О проекте
Mesto Backend — серверная часть проекта Mesto, предоставляющая API для работы с пользователями и карточками. Реализована на Node.js с Express, TypeScript и MongoDB. Поддерживает регистрацию, авторизацию (JWT), создание/удаление карточек, управление лайками, валидацию данных и логирование запросов/ошибок. 

## ✨ Функциональность  

🔹 API роуты:  
&nbsp;&nbsp;&nbsp;&nbsp;POST /signup — регистрация пользователя (email, password, name, about, avatar).  
&nbsp;&nbsp;&nbsp;&nbsp;POST /signin — авторизация, возвращает JWT.  
&nbsp;&nbsp;&nbsp;&nbsp;GET /users — возвращает всех пользователей.  
&nbsp;&nbsp;&nbsp;&nbsp;GET /users/:userId — возвращает пользователя по _id.  
&nbsp;&nbsp;&nbsp;&nbsp;GET /users/me — возвращает текущего пользователя.  
&nbsp;&nbsp;&nbsp;&nbsp;PATCH /users/me — обновляет профиль (name, about).  
&nbsp;&nbsp;&nbsp;&nbsp;PATCH /users/me/avatar — обновляет аватар.  
&nbsp;&nbsp;&nbsp;&nbsp;GET /cards — возвращает все карточки.  
&nbsp;&nbsp;&nbsp;&nbsp;POST /cards — создаёт карточку.  
&nbsp;&nbsp;&nbsp;&nbsp;DELETE /cards/:cardId — удаляет карточку по _id (только для автора).  
&nbsp;&nbsp;&nbsp;&nbsp;PUT /cards/:cardId/likes — добавляет лайк.  
&nbsp;&nbsp;&nbsp;&nbsp;DELETE /cards/:cardId/likes — убирает лайк.  
🔹 Авторизация — мидлвар проверяет JWT. Защищает все роуты, кроме /signin и /signup.
🔹 Валидация — на уровне схем (Mongoose, регулярное выражение для URL) и запросов (перед контроллерами).
🔹 Логирование — запросы в request.log, ошибки в error.log (JSON-формат).
🔹 Обработка ошибок — централизованный мидлвар: 400 (некорректные данные), 401 (неавторизован), 404 (сущность не найдена), 409 (дубликат email), 500 (ошибка сервера), формат { message: "..." }.
🔹 ESLint — стайлгайд Airbnb, исключение для _id (no-underscore-dangle).

## 🛠 Используемые технологии

🔹 Node.js/Express  
🔹 TypeScript  
🔹 MongoDB/Mongoose

## 📦 Структура проекта
🔹 src/ — исходный код:  
&nbsp;&nbsp;&nbsp;&nbsp; 🔹 controllers/ — контроллеры для пользователей и карточек.  
&nbsp;&nbsp;&nbsp;&nbsp; 🔹 errors/ — кастомные классы ошибок.  
&nbsp;&nbsp;&nbsp;&nbsp; 🔹 middlewares/ — мидлвары (авторизация, обработка ошибок, логирование, валидация).  
&nbsp;&nbsp;&nbsp;&nbsp; 🔹 models/ — схемы пользователей и карточек.  
&nbsp;&nbsp;&nbsp;&nbsp; 🔹 routes/ — роуты для пользователей и карточек.  
&nbsp;&nbsp;&nbsp;&nbsp; 🔹 types/ — TypeScript-типы.  
&nbsp;&nbsp;&nbsp;&nbsp; 🔹 utils/ — вспомогательные утилиты.  
&nbsp;&nbsp;&nbsp;&nbsp; 🔹 app.ts — запуск сервера, подключение MongoDB, настройка роутов.  
&nbsp;&nbsp;&nbsp;&nbsp; 🔹 config.ts — конфигурация.  
🔹 .editorconfig — настройки отступов и кодировки.  
🔹 .eslintrc — конфигурация ESLint (Airbnb, исключение _id).  
🔹 package.json — скрипты start, dev, build, lint, зависимости.  
🔹 tsconfig.json — настройки TypeScript.

## 📥 Установка и запуск

Склонируйте репозиторий:
```
git clone https://github.com/Loriveki/mesto-backend.git
```

Установите зависимости:
```
npm install
```

Убедитесь, что MongoDB запущен локально (mongodb://localhost:27017/mestodb).

Запустите сервер в режиме разработки:
```
npm run dev
```
Для сборки проекта:
```

npm run build
```

Для запуска собранного проекта:
```
npm run start
```

Проверьте код на ошибки линтера:
```
npm run lint
```

## 📬 Контакты

👩‍💻 Автор: Анастасия

