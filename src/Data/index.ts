import { makeExecutableSchema } from '@mpaupulaire/typegql';
import * as graphqlHttp from 'express-graphql';
import { execute, subscribe } from 'graphql';
import {
  GraphQLDate,
  GraphQLDateTime,
  GraphQLTime
} from 'graphql-iso-date';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { ContainerInstance } from 'typedi';

import { AuthorizationService } from '../Auth/Service';
import { PubSub } from './PubSub';
import { User } from './User';

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

function getContext(user: User) {
  return {
    container:  new ContainerInstance(user.id)
      .set(AuthorizationService, new AuthorizationService(user)),
  };
}

export const GraphQLMiddleware = graphqlHttp(async (req) => {
  return {
    context: getContext(req.user || new User()),
    graphiql: true,
    schema,
  };
});

export function SubscriptionsSetup(server: any, path?: string) {
  return SubscriptionServer.create({
    execute,
    onConnect: () => {
      return getContext(new User());
    },
    schema,
    subscribe,
  }, {
    path,
    server,
  });
}
