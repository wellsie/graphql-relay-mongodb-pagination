import { ObjectId } from 'mongodb';
import { applyPagination } from './pagination';

export async function getItems(
  mongodb,
  collection,
  { first, last, before, after },
  orderField,
  order
) {
  let query = mongodb.collection(collection);

  if (orderField === 'id') {
    query = limitQueryWithId(query, before, after, order);
  } else {
    query = await limitQuery(query, orderField, order, before, after);
  }

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
}

function limitQueryWithId(query, before, after, order) {
  const filter = {
    _id: {},
  };

  if (before) {
    const op = order === 1 ? '$lt' : '$gt';
    filter._id[op] = ObjectId(before.value);
  }

  if (after) {
    const op = order === 1 ? '$gt' : '$lt';
    filter._id[op] = ObjectId(after.value);
  }

  return query.find(filter).sort([['_id', order]]);
}

async function limitQuery(query, field, order, before, after) {
  let filter = {};
  const limits = {};
  const ors = [];
  if (before) {
    const op = order === 1 ? '$lt' : '$gt';
    const beforeObject = await query.findOne(
      {
        _id: ObjectId(before.value),
      },
      {
        fields: {
          [field]: 1,
        },
      }
    );
    limits[op] = beforeObject[field];
    ors.push({
      [field]: beforeObject[field],
      _id: { [op]: ObjectId(before.value) },
    });
  }

  if (after) {
    const op = order === 1 ? '$gt' : '$lt';
    const afterObject = await query.findOne(
      {
        _id: ObjectId(after.value),
      },
      {
        fields: {
          [field]: 1,
        },
      }
    );
    limits[op] = afterObject[field];
    ors.push({
      [field]: afterObject[field],
      _id: { [op]: ObjectId(after.value) },
    });
  }

  if (before || after) {
    filter = {
      $or: [
        {
          [field]: limits,
        },
        ...ors,
      ],
    };
  }

  return query.find(filter).sort([
    [field, order],
    ['_id', order],
  ]);
}
