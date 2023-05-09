FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g typescript

COPY . .

RUN tsc

RUN npm prune --production

FROM node:18-alpine

ENV NODE_ENV=production

COPY --from=builder /app/dist/ /app/dist
COPY --from=builder /app/node_modules/ /app/node_modules/
COPY --from=builder /app/package.json /app/package.json

CMD [ "node", "/app/dist/server/index.js" ]
