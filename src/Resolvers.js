import { getArticles } from './Article';
import GraphQLCursorType from './Cursor';
import GraphQLDateTimeType from './DateTime';

const Query = {
  articles: (parent, args, { mongodb }) =>
    getArticles(mongodb, args, 'text', -1),

  viewer: () => ({ id: 'VIEWER_ID' }),
};

const Type = {
  Article: {
    id: parent => parent._id.toString(),
  },

  ArticleConnection: {
    edges: parent => parent.query.toArray(),
  },

  ArticleEdge: {
    cursor: parent => parent._id.toString(),
    node: parent => parent,
  },

  Cursor: GraphQLCursorType,

  DateTime: GraphQLDateTimeType,
};

export default {
  Query,
  ...Type,
};
