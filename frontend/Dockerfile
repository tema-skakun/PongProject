# ---- Base Node ----
FROM node:19.8.1-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies (and any global npm dependencies)
RUN apk add --no-cache musl-dev make g++ python3 build-base cairo-dev jpeg-dev pango-dev giflib-dev libpng-dev libpq
COPY package*.json .

# ---- Dependencies ----
FROM base AS dependencies
RUN npm install

# ---- Copy Files/Build ----
FROM dependencies AS build
COPY . /app
RUN npm run build

# --- Release with Nginx ----
FROM nginx:1.21-alpine AS release
# Copy Nginx configuration template
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# Copy builded react app to nginx
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
