import { request, GraphQLClient } from 'graphql-request';

const endpoint = 'http://localhost:4001/graphql';
const headers = {};

const query = `
query GetArticles($last: Int!){
  articles(last: $last) {
    edges {
      cursor
      node {
        text
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
`;

const variables = {
  last: 2,
};

// using request
//
request(endpoint, query, variables)
  .then(data => console.log(JSON.stringify(data, undefined, 2)))
  .catch(error => console.error(error));

// using GraphQLClient
//
const client = new GraphQLClient(endpoint, { headers });
client
  .request(query, variables)
  .then(data => {
    for (const edge of data.articles.edges) {
      console.log(edge.node.text);
    }
  })
  .catch(error => console.error(error));
