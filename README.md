# graphql-relay-mongodb-pagination

Example of [Relay Cursor Connections](https://facebook.github.io/relay/graphql/connections.htm)
with [MongoDB](https://www.mongodb.com/) and
[Apollo Server 2](https://www.apollographql.com/docs/apollo-server/).
Ported from [reindexio/graphql-relay-mongodb-pagination](https://github.com/reindexio/graphql-relay-mongodb-pagination)
that provided the code accompnaying the article
[Relay-compatible GraphQL pagination with MongoDB](https://www.reindex.io/blog/relay-graphql-pagination-with-mongodb/).

The example has been enhanced so that the `ArticleConnection` objects
also support a `nodes` object like [GitHub's GraphQL API](https://developer.github.com/v4/guides/forming-calls/) does.

Also added are mutation and subscription with redis examples.

## Running the example

Install npm dependencies:

```bash
yarn install
```

Start MongoDB and redis (unless you have them running locally already):

```bash
docker-compose up mongodb redis
```

Load sample data directly into MongoDB:

```bash
yarn load:mongo
```

This will load 1,000 articles into the `Articles` collection of the
`relaypagination` database.

Install [MongoDB Compass](https://www.mongodb.com/products/compass):

```bash
brew cask install mongodb-compass
```

Start the server:

```bash
yarn start:dev
```

![image](https://user-images.githubusercontent.com/5160593/70457488-1b48db00-1a65-11ea-887d-7db4cd306f24.png)

Install [GraphQL Playground](https://github.com/prisma-labs/graphql-playground):

```bash
brew cask install graphql-playground
```

![image](https://user-images.githubusercontent.com/5160593/70457308-ca38e700-1a64-11ea-9133-f714d3b29a24.png)

Here is the text for the query highlighted in the screenshot:

```graphql
query Last {
  viewer {
    id
  }
  articles(last: 2) {
    nodes {
      text
    }
    edges {
      cursor
      node {
        text
        id
        createdAt
        updatedAt
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

## Articles For Viewer

```graphql
{
  viewer {
    id
    username
    articles(last: 2) {
      nodes {
        id
        text
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
}
```

```json
{
  "data": {
    "viewer": {
      "id": "5e00fcad8700880af081ab7b",
      "username": "janesmith",
      "articles": {
        "nodes": [
          {
            "id": "5e00fcad8700880af081ab8f",
            "text": "19 - Corporis voluptates magnam inventore sunt non itaque molestias."
          },
          {
            "id": "5e00fcad8700880af081ab90",
            "text": "20 - Sed harum nostrum nobis dolorum nesciunt."
          }
        ],
        "pageInfo": {
          "startCursor": "NWUwMGZjYWQ4NzAwODgwYWYwODFhYjhm",
          "endCursor": "NWUwMGZjYWQ4NzAwODgwYWYwODFhYjkw",
          "hasNextPage": false,
          "hasPreviousPage": true
        }
      }
    }
  }
}
```

## Mutations

This repository contains an example of calling a mutation with the [graphql-request](https://github.com/prisma-labs/graphql-request)
to load sample data:

- [scripts/loadTestDataApolloClient.js](scripts/loadTestDataApolloClient.js)

You can run this script with the following command:

```bash
yarn load:apollo-client
```

Here is an example of using `graphql-request` to add a single article.

```javascript
import { request } from 'graphql-request';

const endpoint = 'http://localhost:4001/graphql';

const query = `
mutation AddArticle($article:AddArticleInput!) {
  addArticle(input:$article){
    article{
      id
      text
      createdAt
      updatedAt
    }
  }
}
`;

const variables = {
  article: {
    text: 'graphql-request mutation',
  },
};

// using request
//
request(endpoint, query, variables)
  .then(data => console.log(JSON.stringify(data, undefined, 2)))
  .catch(error => console.error(error));
```

## Uploads

There are two mutations in the GraphQL schema that perform file uploads,
`singleUpload` and `multipleUpload`. The following scripts can be used
to test `singleUpload` and `multipleUpload` respectively:

- `scripts/singleUpload.sh`
- `scripts/multipleUpload.sh`

```bash
$ scripts/singleUpload.sh | jq
{
  "data": {
    "singleUpload": {
      "filename": "yarn.lock",
      "mimetype": "application/octet-stream",
      "encoding": "7bit"
    }
  }
}
```

```bash
$ scripts/multipleUpload.sh | jq
{
  "data": {
    "multipleUpload": [
      {
        "filename": "package.json",
        "mimetype": "application/octet-stream",
        "encoding": "7bit"
      },
      {
        "filename": "nodemon.json",
        "mimetype": "application/octet-stream",
        "encoding": "7bit"
      }
    ]
  }
}
```

## Subscriptions

This project uses [redis](https://redis.io/) for subscriptions by utilizing the
[davidyaha/graphql-redis-subscriptions](https://github.com/davidyaha/graphql-redis-subscriptions)
[`PubSub` implementation](https://www.apollographql.com/docs/apollo-server/data/subscriptions/#pubsub-implementations).

> Open two terminal windows and run `docker compose up --build` in one and
> `yarn start:dev` in the other. This will result in two instances of the Node.js GraphQL server
> running.

```bash
docker-compose up --build
```

```bash
yarn start:dev
```

Now open two `GraphQL Playgroud IDE` instances. One to `http://localhost:4001/graphql` and
the other to `http://localhost:4001/graphql`.

> Note that the Node.js graphql app running on port `4002` (from `docker-compose`) does not support
> `playground` since `NODE_ENV` is set to production. Thus the use of the `GraphQL Playground IDE` client.

In the first `GraphQL Playground IDE` instance enter this query and execute it:

```graphql
subscription Articles {
  articleAdded {
    id
    text
    createdAt
    updatedAt
  }
}
```

In the second `GraphQL Playground` instance enter and execute this query:

```graphql
mutation AddArticle($article: AddArticleInput!) {
  addArticle(input: $article) {
    article {
      id
      text
      createdAt
      updatedAt
    }
  }
}
```

With `query variables`:

```json
{
  "article": {
    "text": "hello there"
  }
}
```

Montioring subscriptions with `redis-cli`:

```bash
$ redis-cli
127.0.0.1:6379> monitor
OK
1576084903.219562 [0 172.27.0.1:45834] "unsubscribe" "ARTICLE_ADDED"
1576084903.219608 [0 172.27.0.1:45834] "punsubscribe" "ARTICLE_ADDED"
1576084905.559995 [0 172.27.0.1:45834] "subscribe" "ARTICLE_ADDED"
1576084910.945354 [0 172.27.0.1:45830] "publish" "ARTICLE_ADDED" "{\"articleAdded\":{\"text\":\"hello there\",\"createdAt\":\"2019-12-11T17:21:50.919Z\",\"updatedAt\":\"2019-12-11T17:21:50.919Z\",\"_id\":\"5df125ae87f96d1c3a7d25bc\"}}"
```

![apollo2-subscriptions](https://user-images.githubusercontent.com/5160593/70639205-013b0400-1bef-11ea-8075-21926f1effbe.gif)

## docker

The `docker-compose.yaml` file will by default build and use a container
for the Node.js app. This can be time consuming during development.
Running `docker-compose up mongodb` will just start a MongoDB container
that can be used with `yarn start:dev` during development.

To start the Node.js app and MongoDB together do:

```bash
docker-compose up --build
```

It is important to include `--build` if there have been changes to the
source code.

The Node.js app is available on [localhost:4002](http://localhost:4002)
when running via `docker-compose`. Note that the playground is not available
as the environment is set as production. Use
[GraphQL Playground](https://github.com/prisma-labs/graphql-playground)
to interact with GraphQL in this case.

### Node.js and Docker

Node.js doesn't like running as pid 1. Use `--init` with `docker run`
or [Tini](https://github.com/krallin/tini) if your containers are headed
to [Kubernetes](https://kubernetes.io/), since the `--init` flag isn't supported there.

## References

- [Relay-compatible GraphQL pagination with MongoDB](https://www.reindex.io/blog/relay-graphql-pagination-with-mongodb/)
- [Apollo Server 2](https://www.apollographql.com/docs/apollo-server/)
- [Avoid running NodeJS as PID 1 under Docker images](https://www.elastic.io/nodejs-as-pid-1-under-docker-images/)
- [GraphQL Playground IDE](https://github.com/prisma-labs/graphql-playground)
- [jaydenseric/apollo-upload-examples](https://github.com/jaydenseric/apollo-upload-examples)
- [jaydenseric/graphql-upload](https://github.com/jaydenseric/graphql-upload)
- [nowke/realtime-dashboard-demo](https://github.com/nowke/realtime-dashboard-demo)
- [redis-cli, the Redis command line interface](https://redis.io/topics/rediscli)
- [Relay Cursor Connections](https://facebook.github.io/relay/graphql/connections.htm)
- [Tini - A tiny but valid init for containers](https://github.com/krallin/tini)
- [What is advantage of Tini?](https://github.com/krallin/tini/issues/8#issuecomment-146135930)
