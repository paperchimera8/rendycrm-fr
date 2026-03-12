# rendycrm-fr

Минимальный фронтенд для отдельного деплоя.

Без `npm`, без TypeScript, без сборки: чистые `html/js/css` + `nginx`.

## Настройка

`API_BASE_URL` подставляется при старте контейнера из переменной окружения.

Можно оставить пустым и вводить backend URL прямо в форме (сохранится в localStorage).

## Docker Compose

```bash
cp .env.example .env
docker compose up -d --build
```

По умолчанию:

- `PORT=8081`
- `API_BASE_URL=http://localhost:3000`

## Docker (без compose)

```bash
docker build -t rendycrm-fr .
docker run --rm -p 8081:80 -e API_BASE_URL=https://your-backend.example.com rendycrm-fr
```
