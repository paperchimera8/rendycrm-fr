# rendycrm-fr

Минимальный фронтенд для отдельного деплоя.

Без `npm`, без TypeScript, без сборки: чистые `html/js/css` + `nginx`.

## Настройка

Фронт и бэк связываются через nginx proxy:

- фронт обращается к `/api/*`
- nginx проксирует `/api/*` в `${BACKEND_UPSTREAM}`

`API_BASE_URL` нужен только для JS-клиента (по умолчанию `/api`).
Можно поменять вручную в UI на полный URL backend (сохранится в localStorage).

## Docker Compose

```bash
cp .env.example .env
docker compose up -d --build
```

По умолчанию:

- `PORT=8081`
- `BACKEND_UPSTREAM=http://host.docker.internal:3000`
- `API_BASE_URL=/api`

## Docker (без compose)

```bash
docker build -t rendycrm-fr .
docker run --rm -p 8081:80 \
  -e BACKEND_UPSTREAM=https://your-backend.example.com \
  -e API_BASE_URL=/api \
  rendycrm-fr
```
