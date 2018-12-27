import { Application } from 'express'
import {
  EmailAddress,
  NegativeFloat,
  NegativeInt,
  PhoneNumber,
  PostalCode,
  UnsignedFloat,
  UnsignedInt,
  URL,
} from '@okgrow/graphql-scalars';
import {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} from 'graphql-iso-date';
import { bootstrap } from "vesper";
import { PubSub } from 'graphql-subscriptions'
import { pubsub } from '../Subscriptions'

import { AuthorizationService } from './services/Authorization'

// Modules
import { UserModule } from './User'


export async function SetUpGraqlQL(app: Application) {
  const port = parseInt(process.env.PORT || '3100')
  return bootstrap({
    port,
    modules: [
      UserModule,
    ],
    schemas: ["**/*.gql"],
    expressApp: app,
    setupContainer: (container, action) => {
      const req = action.request || { user: undefined }
      const { user } = req
      container.set(AuthorizationService, new AuthorizationService(user))
      container.set(PubSub, pubsub)
    },
    subscriptionAsyncIterator: triggers => pubsub.asyncIterator(triggers),
    customResolvers: {
      Date: GraphQLDate,
      Time: GraphQLTime,
      DateTime: GraphQLDateTime,
      EmailAddress,
      NegativeFloat,
      NegativeInt,
      PhoneNumber,
      PostalCode,
      UnsignedFloat,
      UnsignedInt,
      URL,
    }
  }).then(async () => {
    console.log(`Server is running on port ${port} 🚀`);
  }).catch((err) => console.log(err));
}
