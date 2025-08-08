# Etapa 1: Construcción
FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps
COPY . .
RUN npm run build

# Etapa 2: Servidor web
FROM nginx:alpine
COPY --from=builder /usr/src/app/dist/client /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
