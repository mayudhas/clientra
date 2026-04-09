# ─── Stage 1: Build ───────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
# Menggunakan legacy-peer-deps jika ada depedensi vue-cli legacy yang bentrok
RUN npm ci --legacy-peer-deps

COPY . .
# Vue-cli-service build
RUN npm run build

# ─── Stage 2: Production ──────────────────────────────────
FROM nginx:alpine

# Konfigurasi Nginx untuk SPA Routing
RUN echo $'server {\n\
    listen 80;\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html index.htm;\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

# Menyalin hasil build dari vue-cli /dist ke Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
