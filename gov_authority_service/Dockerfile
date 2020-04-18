FROM node:latest

COPY . /src

WORKDIR /src

RUN npm install --save-dev nodemon

RUN npm install --production

EXPOSE 3000

CMD ["npm","run","dev"]