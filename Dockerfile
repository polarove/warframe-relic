FROM node:20.11.1
WORKDIR /app
RUN ["pnpm", "i"]
COPY /.output/ /app/
RUN ["node", "/app/server/index.mjs"]