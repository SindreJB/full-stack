# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
# VUE_APP_API_BASE_URL must point to an address reachable by the browser.
# Default: backend exposed on host port 8081.
ARG VUE_APP_API_BASE_URL=http://localhost:8081
ENV VUE_APP_API_BASE_URL=$VUE_APP_API_BASE_URL
RUN npm run build

# ── Serve stage ───────────────────────────────────────────────────────────────
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
