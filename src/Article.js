export const addArticle = async (mongodb, input) => {
  const createdAt = new Date();

  const article = {
    ...input,
    createdAt,
    updatedAt: createdAt,
  };

  const { insertedId } = mongodb.collection('Articles').insertOne(article);

  article.id = insertedId;

  return article;
};
