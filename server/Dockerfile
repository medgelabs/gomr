FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./
COPY index.js ./

RUN npm ci

CMD ["node", "index.js"]
