import casual from 'casual';
import { MongoClient } from 'mongodb';

const mongodbUri = 'mongodb://localhost:27017';
const mongodbName = 'relaypagination';

let mongodbClient;

const main = async () => {
  mongodbClient = await MongoClient.connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const mongodb = mongodbClient.db(mongodbName);

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
    mongodbClient.close();
  })
  .catch(error => console.error(error));
