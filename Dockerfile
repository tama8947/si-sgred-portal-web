# --- deps ---
    FROM node:22-alpine AS deps
    WORKDIR /opt/app/server
    COPY server/package.json server/yarn.lock ./
    # toolchains para compilar dependencias nativas
    RUN apk add --no-cache python3 make g++ git
    RUN yarn install --frozen-lockfile
    
    # --- build ---
    FROM node:22-alpine AS build
    WORKDIR /opt/app/server
    COPY --from=deps /opt/app/server/node_modules ./node_modules
    COPY server/ ./
    ENV NODE_ENV=production
    RUN yarn build
    
    # --- runner ---
    FROM node:22-alpine AS runner
    WORKDIR /opt/app/server
    # libs necesarias en runtime para sharp
    RUN apk add --no-cache vips libc6-compat
    ENV NODE_ENV=production
    ENV HOST=0.0.0.0
    ENV PORT=1337
    COPY --from=build /opt/app/server ./
    EXPOSE 1337
    EXPOSE 4321
    CMD ["yarn", "start"]