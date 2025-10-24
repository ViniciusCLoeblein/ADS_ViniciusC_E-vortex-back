FROM node:22-bullseye-slim

WORKDIR /usr/src/app

COPY yarn.lock ./

RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .

RUN yarn build

RUN mkdir -p uploads

EXPOSE 3000

CMD ["node", "dist/main.js"]