FROM node:18.1.0
WORKDIR /base
COPY ["package.json", "./package.json"]
COPY ["turbo.json", "./turbo.json"]
COPY ["yarn.lock", "./yarn.lock"]
COPY ["tsconfig.json", "./tsconfig.json"]
COPY ["packages/common", "./packages/common"]
COPY ["packages/common-public", "./packages/common-public"]
COPY ["backend/native/backpack-api", "./backend/native/backpack-api"]
COPY ["backend/native/zeus", "./backend/native/zeus"]
COPY ["backend/native/chat-zeus", "./backend/native/chat-zeus"]
COPY ["backend/native/tsconfig.json", "./backend/native/tsconfig.json"]

RUN cd /base
RUN yarn install
RUN yarn run build
RUN cd /base/backend/native/backpack-api && yarn run build

EXPOSE 8080

CMD ["node", "/base/backend/native/backpack-api/dist/index.js"]
