FROM node:22.13-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install && npm audit fix --force

COPY . .

EXPOSE 3000

CMD ["node", "main.js"]
