FROM node:12-alpine AS build
MAINTAINER Atlas Render Farm manager. (C) Danil Andreev
#WORKDIR /app

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
#RUN find . -maxdepth 1 -type f -name ".*" -exec rm -f {} \;
#RUN find . -maxdepth 1 -type d -name ".*" -exec rm -rf {} \;
#RUN rm -rf docker-compose git-crypt kubernetes src tests
#RUN rm -f .env* .gitattributes .gitignore babel.config.js CODE_OF_CONDUCT.md CONTRIBUTING.md key nodemon.json tsconfig.json yarn.lock Dockerfile

FROM node:12-alpine

RUN mkdir /dest
COPY --from=build dest/ dest/
COPY --from=build LICENSE /
COPY --from=build package.json /
COPY --from=build README.md /
WORKDIR /dest

# Expose ports
EXPOSE 3002
EXPOSE 3003
EXPOSE 3004

CMD ["node", "index.js"]
