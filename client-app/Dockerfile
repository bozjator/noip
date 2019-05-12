FROM node:10-alpine

ARG NOIP_SERVER_URL
ARG NOIP_CLIENT_NAME
ENV NOIP_SERVER_URL=$NOIP_SERVER_URL
ENV NOIP_CLIENT_NAME=$NOIP_CLIENT_NAME

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

COPY --chown=node:node . .

USER node

CMD [ "node", "index.js" ]

# When building docker image you need to pass two variables, that will be set as env varsiables inside the image.
# docker build -t noip-client-app --build-arg NOIP_SERVER_URL=https://example.com --build-arg NOIP_CLIENT_NAME=example-name .