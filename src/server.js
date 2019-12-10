import fs from 'fs';
import { ApolloServer, gql } from 'apollo-server';
import { MongoClient } from 'mongodb';
import resolvers from './Resolvers';

const mongodbUri = 'mongodb://localhost:27017';
const mongodbName = 'relaypagination';

const start = async () => {
  const mongoClient = await MongoClient.connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const mongodb = mongoClient.db(mongodbName);

  const typeDefs = gql`
    ${fs.readFileSync(__dirname.concat('/../schema.graphql'), 'utf8')}
  `;

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async () => ({
      mongodb: await mongodb,
    }),
    uploads: {
      maxFileSize: 10000000,
      maxFiles: 10,
    },
  });

  server.listen(4001).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
};

start();
