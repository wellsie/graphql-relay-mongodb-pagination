import dotenv from 'dotenv';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import GraphQLCursorType from './Cursor';
import GraphQLDateTimeType from './DateTime';
import { addArticle } from './Article';
import { getItems } from './Items';
import { storeUpload } from './upload';

const ARTICLE_ADDED_TOPIC = 'ARTICLE_ADDED';

dotenv.config();
const redisURI = process.env.REDIS_URI;

const pubsub = new RedisPubSub({ connection: redisURI });

const Mutation = {
  addArticle: async (_, { input }, { mongodb }) => {
    const article = await addArticle(mongodb, input);
    pubsub.publish(ARTICLE_ADDED_TOPIC, { articleAdded: article });
    return {
      article,
    };
  },

  singleUpload: (_, { file }) => storeUpload(file),

  multipleUpload: async (_, { files }) =>
    await Promise.all(files.map(storeUpload)),
};

const Subscription = {
  articleAdded: {
    subscribe: () => pubsub.asyncIterator([ARTICLE_ADDED_TOPIC]),
  },
};

const Query = {
  articles: (parent, args, { mongodb }) =>
    getItems(mongodb, 'Articles', args, 'text', -1),

  viewer: () => ({ id: 'VIEWER_ID' }),
};

const Type = {
  Article: {
    id: parent => parent._id.toString(),
  },

  ArticleConnection: {
    edges: parent => parent.items,
    nodes: parent => parent.items,
  },

  ArticleEdge: {
    cursor: parent => parent._id.toString(),
    node: parent => parent,
  },

  Cursor: GraphQLCursorType,

  DateTime: GraphQLDateTimeType,

  // suppress warning,
  // see https://github.com/apollographql/apollo-server/issues/1075
  //
  Node: {
    __resolveType() {
      return null;
    },
  },
};

export default {
  Mutation,
  Query,
  Subscription,
  ...Type,
};
