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
import { PubSub } from 'graphql-subscriptions';

import { AuthorizationService } from '../Auth';
import { pubsub } from './PubSub';
import { User } from './User';

const schema = makeExecutableSchema({
  logger: console,
  resolverBuilderOptions: {
    PubSub: pubsub,
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
      .set(PubSub, pubsub)
      .set(AuthorizationService, new AuthorizationService(user)),
  };
}

export const GraphQLMiddleware = graphqlHttp(async (req) => {
  return {
    context: getContext(req.user),
    schema,
  };
});

export function SubscriptionsSetup(server: any, path: string) {
  return SubscriptionServer.create({
    execute,
    onConnect: async (params: any) => {
      if (!params.Authorization) throw Error('Unauthorized')
      const [ token ] = params.Authorization.match(/\S+$/)
      const data = AuthorizationService.verifyToken(token) as {id?: string}
      if (!data.id) throw Error('Unauthorized')
      const user = await User.findOneOrFail(data.id)
      return getContext(user);
    },
    schema,
    subscribe,
  }, {
    path,
    server,
  });
}
