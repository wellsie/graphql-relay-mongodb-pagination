import Base64URL from 'base64-url';
import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

export function toCursor(value) {
  return Base64URL.encode(value.toString());
}

export function fromCursor(string) {
  if (!string) return null;
  return Base64URL.decode(string);
}

const GraphQLCursorType = new GraphQLScalarType({
  name: 'Cursor',
  serialize(value) {
    if (value) {
      return toCursor(value);
    } else {
      return null;
    }
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return fromCursor(ast.value);
    } else {
      return null;
    }
  },
  parseValue(value) {
    return fromCursor(value);
  },
});

export default GraphQLCursorType;
