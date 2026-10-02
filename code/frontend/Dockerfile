# Two stages: build the static site, serve it with nginx. The design is a
# static frontend; anything that needs a server is the backend's.
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund --include=dev
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
# nginx binds every address regardless; the line is kept because the scaffold
# guard (internal/tooling/scaffold_guard.go) requires it of every frontend
# Dockerfile, and an agent rewriting this file is refused without it.
ENV HOSTNAME=0.0.0.0
COPY --from=build /app/dist /usr/share/nginx/html
RUN printf 'server { listen 3000; root /usr/share/nginx/html; location / { try_files $uri $uri/ /index.html; } }\n' > /etc/nginx/conf.d/default.conf
EXPOSE 3000
