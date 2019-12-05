import fs from 'fs';
import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  ${fs.readFileSync(__dirname.concat('/../schema.graphql'), 'utf8')}
`;

const server = new ApolloServer({
  typeDefs,
  mocks: true,
});

server.listen(4001).then(url => {
  console.log(`🚀 Server ready at ${url.url}`);
});
