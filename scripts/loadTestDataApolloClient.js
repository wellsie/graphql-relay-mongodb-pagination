import casual from 'casual';
import { request } from 'graphql-request';

const endpoint = 'http://localhost:4001/graphql';

const query = `
mutation AddArticle($article:AddArticleInput!) {
  addArticle(input:$article){
    article{
      id
      text
      createdAt
      updatedAt
    }
  }
}
`;

for (let i = 1; i <= 1000; i++) {
  const variables = {
    article: {
      text: casual.sentence,
    },
  };

  // using request
  //
  request(endpoint, query, variables)
    .then(data => console.log(JSON.stringify(data, undefined, 2)))
    .catch(error => console.error(error));
}
