import { AuthenticationError } from 'apollo-server';

export const getUser = token => {
  const parts = token.split(' ');

  if (parts.length === 2 && parts[0] === 'Bearer') {
    token = parts[1];
  }

  if (token !== 'TOKEN') {
    throw new AuthenticationError(
      'A valid token must be supplied to access this schema.'
    );
  }

  return {
    id: 1,
    username: 'janesmith',
    admin: true,
  };
};
