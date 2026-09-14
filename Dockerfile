FROM node:26-alpine@sha256:ef24c5053d50fdc3e4e56eb4e7ddb7861874ab0fdc797046ba897581deb8e868 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG SITE_URL=https://eliasborer.ch
ARG BASE_PATH=/
ARG PUBLIC_HOSTING_PROVIDER=self-hosted
ENV SITE_URL=$SITE_URL BASE_PATH=$BASE_PATH PUBLIC_HOSTING_PROVIDER=$PUBLIC_HOSTING_PROVIDER ASTRO_TELEMETRY_DISABLED=1
RUN npm run check && npm test && npm run build && npm run verify:dist


FROM nginx:stable-alpine@sha256:dc5069ad14f19660b141b21236140b91656bf89bbc3e2417c70ae650cd66104c

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
USER 101:101
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]

EXPOSE 8080
