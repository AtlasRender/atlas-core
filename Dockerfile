FROM node:12-alpine
MAINTAINER Atlas Render Farm manager. (C) Danil Andreev
WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install

# Build project
COPY . .
RUN npm run build

# Installing production version of node modules
RUN rm -rf node_modules
RUN npm install --production

# Delete all hidden files
RUN find . -maxdepth 1 -type f -name ".*" -exec rm -f {} \;
RUN find . -maxdepth 1 -type d -name ".*" -exec rm -rf {} \;
RUN rm -rf docker-compose git-crypt kubernetes src tests
RUN rm -f .env* .gitattributes .gitignore babel.config.js CODE_OF_CONDUCT.md CONTRIBUTING.md key nodemon.json tsconfig.json yarn.lock Dockerfile

# Expose ports
EXPOSE 3002
EXPOSE 3003
EXPOSE 3004

CMD npm run start
