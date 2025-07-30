FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8085

CMD [ "npx", "tsx", "watch", "src/index.ts" ]