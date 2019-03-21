import { Mutation, Query, Subscription } from '@mpaupulaire/typegql';
import { Service } from 'typedi';
import { Message } from './Message.entity';
import { PubSub } from 'graphql-subscriptions';

export const NEW_MESSAGE_TOPIC = 'NEW_MESSAGE_TOPIC'

@Service()
export class MessageController {
  constructor(
    private pubsub: PubSub,
  ) {}

  @Query({
    type: '[Message!]!',
  })
  public messages() {
    return Message.find();
  }

  @Mutation({
    args: {
      data: 'MessageCreate!',
    },
    type: 'Message',
  })
  public async createMessage({ data }: any) {
    const message = await Message.create(data).save()
    this.pubsub.publish(NEW_MESSAGE_TOPIC, { message })
    return message;
  }

  @Mutation({
    args: {
      data: 'MessageUpdate!',
    },
    type: 'Message',
  })
  public async updateMessage({ data: { id, ...data } }: any) {
    return Message.update(id, data);
  }

  @Mutation({
    args: {
      id: 'ID!',
    },
    type: 'Boolean',
  })
  public async deleteMessage({ id }: any) {
    return Message.delete(id);
  }

  @Subscription({
    type: 'Message!',
    listen: [ NEW_MESSAGE_TOPIC ],
  })
  public async newMessage({ message }: any) {
    return message;
  }

}
