FROM node:10-alpine as build-stage

WORKDIR /app

COPY package*.json /app/

RUN npm install --silent

COPY ./ /app/

RUN npm run build

FROM nginx:1.17-alpine

COPY --from=build-stage /app/dist/ /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf