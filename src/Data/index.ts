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

import { AuthorizationService } from '../Auth';
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
  const testUser = User.create({
    email: 'test@test.test',
    id: 1,
    name: 'Testy Tester',
  });
  return {
    context: getContext(req.user || testUser),
    graphiql: true,
    schema,
  };
});

export function SubscriptionsSetup(server: any, path?: string) {
  const testUser = User.create({
    email: 'sub@test.test',
    id: 1,
    name: 'Sub Testy Tester',
  });
  return SubscriptionServer.create({
    execute,
    onConnect: () => {
      return getContext(testUser);
    },
    schema,
    subscribe,
  }, {
    path,
    server,
  });
}
