FROM node:21.4.0 AS build
WORKDIR /app
COPY . /app/
RUN npm i && npm run build

FROM node:21.4.0 AS final
ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 3000
WORKDIR /app
COPY --from=build /app/.output .

CMD ["node","./server/index.mjs"]