import casual from 'casual';
import { MongoClient } from 'mongodb';

let mongodb;

const load = async () => {
  mongodb = await MongoClient.connect(
    'mongodb://localhost:27017/relaypagination'
  );

  const items = [];

  for (let i = 1; i <= 1000; i++) {
    const date = new Date();
    items.push({
      text: casual.sentence,
      createdAt: date,
      updatedAt: date,
    });
  }

  return mongodb.collection('Articles').insertMany(items);
};

load().then(() => {
  console.log('🚀 done');
  mongodb.close();
  process.exit(0);
});
