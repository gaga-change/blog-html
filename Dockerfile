FROM node:8.9-alpine
ENV BUILD_PATH build
ENV PORT 3000
RUN npm install -g gulp
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
RUN gulp build
EXPOSE 3000
CMD node ./render/index.js