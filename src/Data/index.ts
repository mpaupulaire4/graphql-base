import { makeExecutableSchema } from '@mpaupulaire/typegql';
import * as graphqlHttp from 'express-graphql';
import {
  GraphQLDate,
  GraphQLDateTime,
  GraphQLTime
} from 'graphql-iso-date';
import Container from 'typedi';

import { AuthorizationService } from '../Auth/Service';
import { PubSub } from './PubSub';
import './User';

const schema = makeExecutableSchema({
  logger: console,
  resolverBuilderOptions: {
    PubSub,
  },
  resolvers: {
    Date: GraphQLDate,
    DateTime: GraphQLDateTime,
    Time: GraphQLTime,
  },
  typeGeneratorOptions: {
    schemas: ['src/Data/**/*.gql'],
  },
});

export const GraphQLMiddleware = graphqlHttp(async (req) => {
  return {
    context: {
      container: Container.of('req.user.id')
      .set(AuthorizationService, new AuthorizationService(req.user)),
    },
    graphiql: true,
    schema,
  };
});
