FROM node:22-alpine
# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/app/server
COPY server/package.json server/yarn.lock ./
RUN rm -rf node_modules
RUN yarn install --frozen-lockfile

COPY server/ ./

RUN yarn build

EXPOSE 1337
CMD ["yarn", "start"]