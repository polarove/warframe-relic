FROM node:latest as build
WORKDIR /app
COPY .gitignore .
RUN mv .gitignore .dockerignore
COPY . /app
RUN yarn && yarn build


FROM node:latest as product
ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 3000
WORKDIR /app
COPY --from=build ./app/.output .

CMD [ "node", "./server/index.mjs" ]
