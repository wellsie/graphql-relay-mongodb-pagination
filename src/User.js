import { AuthenticationError } from 'apollo-server';
import { ObjectId } from 'mongodb';

export const getUserFromToken = async (mongodb, token) => {
  const parts = token.split(' ');

  if (parts.length === 2 && parts[0] === 'Bearer') {
    token = parts[1];
  }

  const user = await mongodb.collection('Users').findOne({ token });

  if (!user) {
    throw new AuthenticationError(
      'A valid token must be supplied to access this schema.'
    );
  }

  user.id = ObjectId(user._id).toString();

  delete user['_id'];

  return user;
};
