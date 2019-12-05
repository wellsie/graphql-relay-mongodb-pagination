import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

const GraphQLDateTimeType = new GraphQLScalarType({
  name: 'DateTime',

  description: 'A valid date time value.',

  parseValue: value => new Date(value),

  serialize: value => new Date(value).toISOString(),

  parseLiteral: ast => {
    if (ast.kind === Kind.INT) {
      // ast value is always in string format
      //
      return parseInt(ast.value, 10);
    }
    return null;
  },
});

export default GraphQLDateTimeType;
