FROM node:12-alpine
WORKDIR /app

COPY package.json .
RUN npm install

COPY . .
RUN npm run build
EXPOSE 3002
EXPOSE 3003
EXPOSE 3004
CMD npm run start
