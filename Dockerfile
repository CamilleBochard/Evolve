# syntax=docker/dockerfile:1

# Site image: built with Node, then the static files are served by nginx.
# The final image contains neither Node, nor the sources, nor node_modules.
# Base images pinned by digest, like the CI actions: a tag can be moved,
# a digest cannot.

# ---------- Stage 1: build the site ----------
FROM node:24.21.0-alpine3.24@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS build

WORKDIR /app

# Dependencies first: this layer stays cached as long as package.json and
# package-lock.json do not change.
COPY package.json package-lock.json ./
RUN npm ci

COPY astro.config.mjs tsconfig.json ./
COPY public ./public
COPY src ./src
RUN npm run build

# ---------- Stage 2: static web server ----------
# Non-root nginx variant: the process runs as an unprivileged user and
# listens on port 8080.
FROM nginxinc/nginx-unprivileged:1.30.5-alpine@sha256:15c994d10d6d78658721c3bcafff14cb281fba2a4bdf9d5ba92c416a472516e3 AS runtime

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
# Outside conf.d: nginx would load it at the http level on its own.
COPY docker/nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1:8080/ || exit 1
