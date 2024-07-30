# Etapa de construcción
FROM node:lts-alpine AS build
WORKDIR /app

# Copia los archivos necesarios y ejecuta la instalación de dependencias
COPY package*.json ./
RUN npm update --location=global npm --no-cache
RUN npm ci
RUN npm install -g @nestjs/cli

# Copia todos los archivos del proyecto y construye la aplicación
COPY . .
RUN npm run build

# Establece el entorno de producción
ENV NODE_ENV=production

# Etapa de producción
FROM node:lts-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

# Copia los archivos de configuración y ejecuta la instalación de dependencias de producción
COPY package*.json ./
COPY *.env ./
RUN npm ci --only=production

# Copia los archivos construidos y los archivos estáticos
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public

# Copia los archivos construidos y los archivos estáticos
COPY --from=build /app/dist ./dist
COPY --from=build /app/uploads ./uploads

# Copia los archivos construidos y los archivos estáticos
COPY --from=build /app/dist ./dist
COPY --from=build /app/files ./files

# Expone el puerto 3000
EXPOSE 3000

# Comando para iniciar la aplicación
CMD [ "node", "dist/main" ]
