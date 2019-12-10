import { getItems } from './Items';
import GraphQLCursorType from './Cursor';
import GraphQLDateTimeType from './DateTime';
import { addArticle } from './Article';

const Mutation = {
  addArticle: async (_, { input }, { mongodb }) => ({
    article: addArticle(mongodb, input),
  }),
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
  ...Type,
};
