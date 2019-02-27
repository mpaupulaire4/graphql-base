import {
  EmailAddress,
} from '@okgrow/graphql-scalars';
import { Application } from 'express';
import {
  GraphQLDate,
  GraphQLDateTime,
  GraphQLTime
} from 'graphql-iso-date';
import { PubSub } from 'graphql-subscriptions';
import { bootstrap } from 'vesper';
import { pubsub } from '../Subscriptions';

import { AuthorizationService } from './services/Authorization';

// Modules
import { UserModule } from './User';

export async function SetUpGraqlQL(app: Application) {
  const port = parseInt(process.env.PORT || '3100', 10);
  return bootstrap({
    customResolvers: {
      Date: GraphQLDate,
      DateTime: GraphQLDateTime,
      EmailAddress,
      Time: GraphQLTime,
    },
    expressApp: app,
    modules: [
      UserModule,
    ],
    port,
    schemas: ['**/*.gql'],
    setupContainer: (container, action) => {
      const req = action.request || { user: undefined };
      const { user } = req;
      container.set(AuthorizationService, new AuthorizationService(user));
      container.set(PubSub, pubsub);
    },
    subscriptionAsyncIterator: (triggers) => pubsub.asyncIterator(triggers),
  }).then(async () => {
    console.log(`Server is running on port ${port} 🚀`);
  }).catch((err) => console.log(err));
}
