import { MongoDataSource } from 'apollo-datasource-mongodb';

export class Articles extends MongoDataSource {
  getArticle(articleID) {
    return this.findOneById(articleID);
  }

  getArticles(articleIDs) {
    console.log(this.context);
    return this.findManyByIds(articleIDs);
  }
}

export class Users extends MongoDataSource {
  getUser(userID) {
    return this.findOneById(userID);
  }
}
