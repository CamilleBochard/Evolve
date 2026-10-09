# syntax=docker/dockerfile:1

# Image du site : construction avec Node, puis service des fichiers statiques
# par nginx. L'image finale ne contient ni Node, ni les sources, ni
# node_modules. Images de base épinglées par digest, comme les actions de
# la CI : un tag peut être déplacé, pas un digest.

# ---------- Étape 1 : construction du site ----------
FROM node:24.21.0-alpine3.24@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS build

WORKDIR /app

# Les dépendances d'abord : cette couche reste en cache tant que
# package.json et package-lock.json ne changent pas.
COPY package.json package-lock.json ./
RUN npm ci

COPY astro.config.mjs tsconfig.json ./
COPY public ./public
COPY src ./src
RUN npm run build

# ---------- Étape 2 : serveur web statique ----------
# Variante non-root de nginx : le processus tourne avec un utilisateur
# sans privilèges et écoute sur le port 8080.
FROM nginxinc/nginx-unprivileged:1.30.5-alpine@sha256:15c994d10d6d78658721c3bcafff14cb281fba2a4bdf9d5ba92c416a472516e3 AS runtime

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1:8080/ || exit 1
