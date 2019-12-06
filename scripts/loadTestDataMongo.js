import casual from 'casual';
import { MongoClient } from 'mongodb';

let mongodb;

const main = async () => {
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

  await mongodb.collection('Articles').insertMany(items);
};

main()
  .then(() => {
    console.log('🚀 done');
    mongodb.close();
  })
  .catch(error => console.error(error));
