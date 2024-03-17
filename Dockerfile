FROM node:21.4.0 AS build
WORKDIR /app
RUN corepack enable pnpm
COPY . /app/
RUN pnpm install && pnpm build

FROM node:21.4.0 AS final
ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 443
WORKDIR /app
COPY --from=build /app/.output .

CMD ["node","./server/index.mjs"]