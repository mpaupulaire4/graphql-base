import { makeExecutableSchema } from '@mpaupulaire/typegql';
import {
  GraphQLDate,
  GraphQLDateTime,
  GraphQLTime
} from 'graphql-iso-date';
import * as graphqlHttp from 'express-graphql'
import Container from 'typedi';

import { AuthorizationService } from '../Auth/Service';
import { pubsub } from '../Subscriptions';
import './User';

const schema = makeExecutableSchema({
  resolvers: {
    Date: GraphQLDate,
    DateTime: GraphQLDateTime,
    Time: GraphQLTime,
  },
  typeDefs: `
scalar DateTime
scalar Time
scalar Date
`,
  PubSub: pubsub,
  schemas: ['**/*.gql'],
});




export const GraphQLMiddleware = graphqlHttp(async (req) => {
  return {
    schema,
    context: {
      container: Container.of('req.user.id')
        .set(AuthorizationService, new AuthorizationService(req.user))
    },
    graphiql: true
  }
})
