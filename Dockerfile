# Slow Mo Web — production static image (Vite → nginx)
#
#   docker build \
#     --build-arg VITE_API_BASE_URL=https://api.slowmo.jahbyte.com/api/v1 \
#     --build-arg VITE_RAZORPAY_KEY_ID=rzp_live_xxx \
#     -t slowmo-web:latest .

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json components.json ./
COPY public ./public
COPY src ./src

ARG VITE_API_BASE_URL=https://api.example.invalid/api/v1
ARG VITE_RAZORPAY_KEY_ID=
ARG VITE_APP_ENV=prod

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID \
    VITE_APP_ENV=$VITE_APP_ENV

RUN npm run build

FROM nginx:1.27-alpine AS web

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.d/40-slowmo-env.sh /docker-entrypoint.d/40-slowmo-env.sh
RUN chmod +x /docker-entrypoint.d/40-slowmo-env.sh
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

# Keep the stock nginx ENTRYPOINT so /docker-entrypoint.d scripts run, then nginx starts.
