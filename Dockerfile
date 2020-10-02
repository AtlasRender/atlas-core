FROM node:12-alpine
WORKDIR /root
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3002
CMD npm start

