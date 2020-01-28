FROM node:10-alpine

WORKDIR /app

COPY package*.json /app/

RUN npm install --silent

COPY ./ /app/

EXPOSE 4500

CMD npm start
