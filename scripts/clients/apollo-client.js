import 'cross-fetch/polyfill';
import ApolloClient, { gql } from 'apollo-boost';

const endpoint = 'http://localhost:4001/graphql';

const client = new ApolloClient({
  uri: endpoint,
  request: operation => {
    operation.setContext({
      headers: {
        authorization: `Bearer TOKEN`,
      },
    });
  },
});

const query = gql`
  query GetArticles($last: Int!) {
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

client
  .query({
    query,
    variables,
  })
  .then(console.log);
