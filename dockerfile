FROM node:16 as base

WORKDIR /app

COPY package*.json .
COPY tsconfig*.json .

RUN npm i 

FROM base as prod

EXPOSE 3000

RUN npm run build