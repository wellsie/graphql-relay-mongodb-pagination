# graphql-relay-mongodb-pagination

Example of [Relay Cursor Connections](https://facebook.github.io/relay/graphql/connections.htm)
with [MongoDB](https://www.mongodb.com/) and
[Apollo Server 2](https://www.apollographql.com/docs/apollo-server/).
Ported from [reindexio/graphql-relay-mongodb-pagination](https://github.com/reindexio/graphql-relay-mongodb-pagination)
that provided the code accompnaying the article
[Relay-compatible GraphQL pagination with MongoDB](https://www.reindex.io/blog/relay-graphql-pagination-with-mongodb/).

The example has been enhanced so that the `ArticleConnection` objects
also support a `nodes` object like [GitHub's GraphQL API](https://developer.github.com/v4/guides/forming-calls/) does.

## Running the example

Install npm dependencies:

```bash
yarn install
```

Start MongoDB (if required):

```bash
docker-compose up mongodb
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
for [Kubernetes](https://kubernetes.io/), since the `--init` flag isn't supported there.

## References

- [Relay-compatible GraphQL pagination with MongoDB](https://www.reindex.io/blog/relay-graphql-pagination-with-mongodb/)
- [Apollo Server 2](https://www.apollographql.com/docs/apollo-server/)
- [Avoid running NodeJS as PID 1 under Docker images](https://www.elastic.io/nodejs-as-pid-1-under-docker-images/)
- [GraphQL Playground](https://github.com/prisma-labs/graphql-playground)
- [jaydenseric/apollo-upload-examples](https://github.com/jaydenseric/apollo-upload-examples)
- [jaydenseric/graphql-upload](https://github.com/jaydenseric/graphql-upload)
- [Relay Cursor Connections](https://facebook.github.io/relay/graphql/connections.htm)
- [Tini - A tiny but valid init for containers](https://github.com/krallin/tini)
- [What is advantage of Tini?](https://github.com/krallin/tini/issues/8#issuecomment-146135930)
