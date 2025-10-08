# --- deps server ---
FROM node:22-alpine AS server-deps
WORKDIR /opt/app/server
COPY server/package.json server/yarn.lock ./
# toolchains para compilar dependencias nativas
RUN apk add --no-cache python3 make g++ git
RUN yarn install --frozen-lockfile

# --- deps client ---
FROM node:22-alpine AS client-deps
WORKDIR /opt/app/client
COPY client/package.json client/yarn.lock ./
RUN yarn install --frozen-lockfile

# --- deps root ---
FROM node:22-alpine AS root-deps
WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# --- build server ---
FROM node:22-alpine AS server-build
WORKDIR /opt/app/server
COPY --from=server-deps /opt/app/server/node_modules ./node_modules
COPY server/ ./
ENV NODE_ENV=production
RUN yarn build

# --- build client ---
FROM node:22-alpine AS client-build
WORKDIR /opt/app
# Copiar dependencias del root para usar concurrently y wait-on
COPY --from=root-deps /opt/app/node_modules ./node_modules
COPY package.json yarn.lock ./
COPY copy-env.mts ./

# Copiar servidor construido para que esté disponible durante el build del cliente
COPY --from=server-build /opt/app/server ./server

# Copiar cliente
COPY --from=client-deps /opt/app/client/node_modules ./client/node_modules
COPY client/ ./client

ENV NODE_ENV=production
# Usar el script que inicia el servidor temporalmente para el build del cliente
RUN yarn build:client:with-server

# --- runner ---
FROM node:22-alpine AS runner
WORKDIR /opt/app

# libs necesarias en runtime para sharp y otros
RUN apk add --no-cache vips libc6-compat

# Variables de entorno
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

# Copiar dependencias del root
COPY --from=root-deps /opt/app/node_modules ./node_modules
COPY package.json yarn.lock ./
COPY copy-env.mts ./

# Copiar servidor construido
COPY --from=server-build /opt/app/server/dist ./server/dist
COPY --from=server-build /opt/app/server/package.json ./server/package.json

# Copiar cliente construido
COPY --from=client-build /opt/app/client/dist ./client/dist
COPY --from=client-build /opt/app/client/package.json ./client/package.json

# Exponer puertos
EXPOSE 1337
EXPOSE 4321

# Comando para iniciar ambos servicios
CMD ["yarn", "start"]