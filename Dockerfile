FROM node:20.11.1
WORKDIR /app
COPY . /app/
RUN ["pnpm", "i"]
RUN ["pnpm", "build"]
RUN ["node", "/app/server/index.mjs"]