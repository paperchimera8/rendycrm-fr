# rendycrm-fr

Минимальный фронтенд для отдельного деплоя.

Без `npm`, без TypeScript, без сборки: чистые `html/js/css` + `nginx`.

## Настройка

Открой `config.js` и укажи `API_BASE_URL`:

```js
window.RUNTIME_CONFIG = {
  API_BASE_URL: "https://your-backend.example.com"
}
```

Можно не указывать, тогда URL backend задается в форме и сохраняется в localStorage.

## Docker

```bash
docker build -t rendycrm-fr .
docker run --rm -p 8081:80 rendycrm-fr
```

