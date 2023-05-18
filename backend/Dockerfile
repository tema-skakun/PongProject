FROM node:19.8.1-alpine AS compile

# Existing folder in alpine
RUN mkdir app
WORKDIR /app

# Any Os-level dependencies (build dependencies)
RUN apk add --no-cache musl-dev make g++ python3 build-base cairo-dev jpeg-dev pango-dev giflib-dev libpng-dev libpq

#copying in the sources
COPY package*.json .
# install node dependencies // no --production flag yet.
COPY . .
RUN rm -rf ./dist

RUN npm i
RUN npm i -g nest

RUN npm run build

FROM node:19.8.1-alpine AS run
RUN mkdir app
WORKDIR /app

RUN export PORT=6969
EXPOSE 6969
COPY --from=compile /app/package*.json .
RUN npm i --production
COPY --from=compile /app/dist/ .

CMD ["npx", "pm2-runtime", "src/main.js"]
