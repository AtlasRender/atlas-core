FROM node:12-alpine
WORKDIR /app

COPY package.json .
RUN npm install

COPY . .
#RUN npm install
RUN npm run build
EXPOSE 3002
CMD npm run start
