FROM node:19.8.1-alpine AS compile

# Existing folder in alpine
WORKDIR /app

# Any Os-level dependencies (build dependencies)
RUN apk add --no-cache musl-dev make g++ python3 build-base cairo-dev jpeg-dev pango-dev giflib-dev libpng-dev libpq

#copying in the sources
COPY package*.json .
# install node dependencies // no --production flag yet.

COPY . .
RUN rm -rf node_modules

RUN npm i

RUN npm run build
EXPOSE 3000
CMD ["npx", "react-scripts", "start", "--host", "0.0.0.0"]
# FROM nginx:1.21.0-alpine AS run
# COPY --from=compile /app/build /usr/share/nginx/html
# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
