import fs from 'fs';
import { ApolloServer, gql } from 'apollo-server';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import resolvers from './Resolvers';

dotenv.config();

const mongodbUri = process.env.MONGODB_URI;
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
    introspection: true,
    context: async () => ({
      mongodb: await mongodb,
    }),
    uploads: {
      maxFileSize: 10000000,
      maxFiles: 10,
    },
    subscriptions: {
      onConnect: () => console.log('subscription: onConnect'),
      onDisconnect: () => console.log('subscription: onDisconnect'),
    },
  });

  server.listen(4001).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
};

start();
