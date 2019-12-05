import { getArticles } from './Article';
import GraphQLCursorType from './Cursor';

const Query = {
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

  Viewer: {
    allArticles: (parent, args, { mongodb }) =>
      getArticles(mongodb, args, 'text', -1),
  },

  Cursor: GraphQLCursorType,
};

export default {
  Query,
  ...Type,
};
