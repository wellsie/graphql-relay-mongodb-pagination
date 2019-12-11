FROM node:13.3.0

LABEL maintainer="jono <_@oj.io>"

ARG TINI_URL=https://github.com/krallin/tini/releases/download
ARG TINI_VERSION=v0.18.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini.asc /tini.asc
RUN gpg --batch --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 595E85A6B1B4779EA4DAAEC70B588DFF0527A9B7 \
  && gpg --batch --verify /tini.asc /tini
RUN chmod +x /tini

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . /app

RUN yarn build

EXPOSE 4001

CMD [ "/tini", "--", "yarn", "start" ]