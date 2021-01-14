FROM node:12-alpine
WORKDIR /app
COPY . .

COPY package.json .
RUN npm install

COPY . .
#RUN npm install
RUN npm run build
EXPOSE 3002
EXPOSE 3003
EXPOSE 3004
CMD npm run start