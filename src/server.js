import fs from 'fs';
import { ApolloServer, gql, AuthenticationError } from 'apollo-server';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import resolvers from './Resolvers';
import { getUserFromToken } from './User';
import { Users } from './DataSources';

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

  const db = await mongodb;

  const server = new ApolloServer({
    cors: { credentials: true, origin: '*' },
    typeDefs,
    resolvers,
    introspection: true,
    context: async context => {
      let user;

      // `req` not present on WebSocket connections
      //
      if (context.req) {
        const authorization = context.req.headers.authorization;

        if (!authorization) {
          // throw in `authentication` header is absent
          //
          throw new AuthenticationError(
            'A token must be supplied to access this schema.'
          );
        }

        user = getUserFromToken(db, authorization);
      }

      return {
        ...context,
        mongodb: db,
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
    dataSources: () => ({
      Users: new Users(db.collection('Users')),
    }),
  });

  server.listen(4001).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
};

start();
