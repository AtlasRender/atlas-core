FROM node:12-alpine AS build
MAINTAINER Atlas Render Farm manager. (C) Danil Andreev. Dockerfile created by (c) FreddieMcHeart

# Install dependencies
COPY package.json .
RUN npm install

# Build project
COPY . .
RUN npm run build

FROM node:12-alpine

RUN mkdir /dest
COPY --from=build dest/ dest/
COPY --from=build LICENSE /
COPY --from=build package.json /
COPY --from=build README.md /
WORKDIR /

# Installing production version of node modules
RUN npm install --production
# Expose ports
EXPOSE 3002
EXPOSE 3003
EXPOSE 3004

CMD ["node", "/dest/index.js"]