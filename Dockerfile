FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3001

EXPOSE 8080

CMD [ "npm", "start" ]

