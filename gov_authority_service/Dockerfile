FROM node:13

COPY . /src

WORKDIR /src

#RUN npm install --save-dev nodemon

RUN npm install --production

EXPOSE 3000

CMD ["npm","run","start"]