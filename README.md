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
docker-compose up
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
