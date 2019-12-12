import fs from 'fs';
import { ApolloServer, gql, AuthenticationError } from 'apollo-server';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import resolvers from './Resolvers';
import { getUser } from './User';

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
    context: async context => {
      let user;

      // `req` not present on WebSocket connections
      //
      if (context.req) {
        const authentication = context.req.headers.authentication;

        if (!authentication) {
          // throw in `authentication` header is absent
          //
          throw new AuthenticationError(
            'A token must be supplied to access this schema.'
          );
        }

        user = getUser(authentication);
      }

      return {
        ...context,
        mongodb: await mongodb,
        user,
      };
    },
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
