import { PubSub, PubSubEngine } from 'graphql-subscriptions';

const pubsub: PubSubEngine = new PubSub();

export {
  pubsub as PubSub
};
