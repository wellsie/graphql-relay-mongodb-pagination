import fs from 'fs';
import { ApolloServer, gql } from 'apollo-server';
import { MongoClient } from 'mongodb';
import resolvers from './Resolvers';

const mongodb = MongoClient.connect(
  'mongodb://localhost:27017/relaypagination'
);

const typeDefs = gql`
  ${fs.readFileSync(__dirname.concat('/../schema.graphql'), 'utf8')}
`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => ({
    mongodb: await mongodb,
  }),
});

server.listen(4001).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
