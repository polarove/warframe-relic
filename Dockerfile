FROM node:21.4.0 AS build
WORKDIR /app
RUN corepack enable pnpm
COPY . /app/
RUN pnpm install && pnpm build

FROM node:21.4.0 AS final
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV NITRO_SSL_CERT='/opt/certifications/warframe-team/other/warframe.team.pem'
ENV NITRO_SSL_KEY='/opt/certifications/warframe-team/other/warframe.team.key'
EXPOSE 3000
WORKDIR /app
COPY --from=build /app/.output .

CMD ["node","./server/index.mjs"]