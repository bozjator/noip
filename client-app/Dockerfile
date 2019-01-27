FROM node:10-alpine

ARG NOIP_SERVER
ARG CLIENT_NAME
ENV NOIP_SERVER=$NOIP_SERVER
ENV CLIENT_NAME=$CLIENT_NAME

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

COPY --chown=node:node . .

USER node

CMD [ "node", "index.js" ]

# When building docker image you need to pass two variables, that will be set as env varsiables inside the image.
# docker build -t noip-client-app --build-arg NOIP_SERVER=https://example.com --build-arg CLIENT_NAME=example-name .