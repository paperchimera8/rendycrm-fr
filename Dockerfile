FROM nginx:1.27-alpine
ENV PORT=8080
ENV BACKEND_URL=http://rendycrm-bk.railway.internal:8080
ENV NGINX_ENTRYPOINT_WORKER_PROCESSES_AUTOTUNE=
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
RUN cat /etc/nginx/templates/default.conf.template
RUN /docker-entrypoint.d/20-envsubst-on-templates.sh && cat /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY styles.css /usr/share/nginx/html/styles.css
COPY app.js /usr/share/nginx/html/app.js
COPY config.js /usr/share/nginx/html/config.js
COPY docker-entrypoint.d/40-runtime-config.sh /docker-entrypoint.d/40-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/40-runtime-config.sh
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/health" >/dev/null || exit 1
CMD ["nginx", "-g", "daemon off;"]
