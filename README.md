# Web Lab 4

### Стек:

- Vue3
- Pinia
- RxJS
- Vite
- Nginx
- Java 21, Jakarta EE 11
- WildFly 41
- jOOQ
- PostgreSQL 18

---

## Запуск через Docker

Необходимы Docker и Docker Compose.

Все команды ниже выполняются из корня проекта.

1. Подготовить конфигурацию:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

В `backend/.env` указать настройки БД и JWT-секрет.
В `frontend/.env` задать адрес API, период обновления таблицы
и количество записей на странице.

Файлы `.env` и JWT-ключ не коммитятся.

2. Файл ключа для проверки JWT

Создать папку:

```bash
mkdir -p backend/secrets
```

В ней создать файл `jwt-secret.jwk`:

```json
{
  "kty": "oct",
  "alg": "HS256",
  "use": "sig",
  "k": "СЮДА_ЗНАЧЕНИЕ_JWT_SECRET_BASE64URL_ИЗ_ENV"
}
```

В поле `k` вставить значение `JWT_SECRET_BASE64URL` из `backend/.env`.

3. Собрать и запустить приложение:

```bash
docker compose up --build
```

Для запуска в фоне:

```bash
docker compose up -d --build
```

Frontend собирается в два этапа: Node.js собирает Vue-приложение,
Nginx раздаёт готовые файлы и поддерживает клиентские маршруты.
Браузер обращается к backend напрямую на `http://localhost:8080/api`.

Backend после запуска контейнера генерирует jOOQ-классы и разворачивает
приложение в WildFly. Первый запуск может занять некоторое время.

Просмотр логов:

```bash
docker compose logs -f backend
```

Остановка и удаление контейнеров с сохранением данных БД:

```bash
docker compose down
```

---

Адреса:

| Сервис     | Адрес                              |
| ---------- | ---------------------------------- |
| Фронтенд   | http://localhost:2000              |
| API        | http://localhost:8080/api          |
| Swagger UI | http://localhost:8080/swagger.html |
| OpenAPI    | http://localhost:8080/openapi      |

---

## Локальная разработка frontend

Нужны Node.js и npm. Backend и PostgreSQL можно запустить в Docker:

```bash
docker compose up -d db backend
cd frontend
npm ci
npm run dev
```

Frontend: `http://localhost:5173`.
В `frontend/.env` используется `VITE_API_BASE_URL=http://localhost:8080/api`.

Проверка типов и production-сборка из папки `frontend`:

```bash
npm run build
```

## База данных

PostgreSQL работает в отдельном контейнере.
Данные сохраняются в именованном volume `postgres-data`.

При первой инициализации выполняется `backend/database/init.sql`.
При последующих запусках существующая БД сохраняется,
а скрипт повторно не выполняется.

### Пользователи и роли

Новые пользователи регистрируются с ролью USER.

| Роль  | Доступ                                             |
| ----- | -------------------------------------------------- |
| USER  | Список студентов и просмотр отдельного студента    |
| ADMIN | Просмотр, создание, изменение и удаление студентов |

Чтобы назначить администратора нужно зарегистрировать пользователя,
затем выполнить в контейнерной БД:

```sql
UPDATE users
SET role = 'ADMIN'
WHERE username = 'username'
RETURNING id, username, role;
```

---

## Аутентификация

- Пароли хешируются с помощью PBKDF2.
- Access-токен JWT подписывается HS256 и действует 15 минут.
- Access передаётся в `Authorization: Bearer <token>`.
- Refresh-токен действует 7 дней, хранится в HttpOnly cookie.
- В БД сохраняется SHA-256-хеш refresh-токена.
- При обновлении refresh заменяется новым.
- При выходе refresh отзывается, cookie удаляется.
- Уже выданный access остаётся действительным до истечения его срока.

---

## Основные ручки

| Метод  | Путь               | Назначение                              |
| ------ | ------------------ | --------------------------------------- |
| POST   | /api/auth/register | Регистрация                             |
| POST   | /api/auth/login    | Вход                                    |
| POST   | /api/auth/refresh  | Обновление токенов                      |
| POST   | /api/auth/logout   | Выход                                   |
| GET    | /api/auth/me       | Текущий пользователь                    |
| GET    | /api/students      | Список, фильтры, сортировка и пагинация |
| QUERY  | /api/students      | Фильтры в JSON-теле                     |
| GET    | /api/students/{id} | Просмотр студента                       |
| POST   | /api/students      | Создание студента                       |
| PATCH  | /api/students/{id} | Изменение студента                      |
| DELETE | /api/students/{id} | Удаление студента                       |
