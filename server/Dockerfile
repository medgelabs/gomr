FROM node:alpine
WORKDIR /usr/src/app

COPY package.json package-lock.json /usr/src/app/
RUN npm ci

COPY index.js /usr/src/app/index.js
CMD ["node", "index.js"]


