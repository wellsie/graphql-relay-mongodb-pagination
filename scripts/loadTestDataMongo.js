import casual from 'casual';
import { MongoClient } from 'mongodb';

const mongodbUri = 'mongodb://localhost:27017';
const mongodbName = 'relaypagination';

let mongodbClient;

const users = [
  {
    username: 'janesmith',
    name: 'Jane Smith',
    token: 'TOKEN',
  },
  {
    username: 'jonsmith',
    name: 'Jon Smith',
    token: 'TOKEN2',
  },
];

const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

const main = async () => {
  mongodbClient = await MongoClient.connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const mongodb = mongodbClient.db(mongodbName);

  // indexes
  //
  await mongodb.collection('Articles').createIndex({ text: 1 });

  await mongodb.collection('Users').createIndex({ token: 1 }, { unique: true });

  // users
  //
  const { insertedIds } = await mongodb.collection('Users').insertMany(users);

  // articles
  //
  const items = [];

  for (let i = 1; i <= 20; i++) {
    const date = new Date();
    const userIndex = getRandomInt(2);
    items.push({
      text: `${i} - ${casual.sentence}`,
      createdBy: insertedIds[userIndex],
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
