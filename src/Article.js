import { UserInputError } from 'apollo-server';
import { ObjectId } from 'mongodb';
import { applyPagination } from './pagination';

export const addArticle = async (mongodb, input) => {
  const createdAt = new Date();

  const article = {
    ...input,
    createdAt,
    updatedAt: createdAt,
  };

  article.createdBy = ObjectId(article.createdBy);

  const { insertedId } = mongodb.collection('Articles').insertOne(article);

  article.id = insertedId;

  return article;
};

export const articlesForUser = async (
  mongodb,
  userID,
  { first, last, before, after }
) => {
  // check for invalid `before` and `after`
  //
  if (before && after) {
    throw new UserInputError('cannot use both "before" and "after".', {
      invalidArgs: ['before', 'after'],
    });
  }

  // check for invalid `first` and `last`
  //
  if (first && last) {
    throw new UserInputError('cannot use both "first" and "last".', {
      invalidArgs: ['first', 'last'],
    });
  }

  const createdBy = ObjectId(userID);

  const beforeAfter = { _id: {} };
  let filter = {};

  if (before) {
    beforeAfter._id.$lt = ObjectId(before);
  }

  if (after) {
    beforeAfter._id.$gt = ObjectId(after);
  }

  if (before || after) {
    filter = {
      $and: [{ createdBy }, beforeAfter],
    };
  }

  const query = mongodb.collection('Articles').find(filter);

  let pageInfo = await applyPagination(query, first, last);

  const items = await query.toArray();

  let startCursor;
  let endCursor;

  if (items.length > 0) {
    startCursor = items[0]._id;
    endCursor = items[items.length - 1]._id;
  }

  pageInfo = {
    ...pageInfo,
    startCursor,
    endCursor,
  };

  return {
    items,
    pageInfo,
  };
};
