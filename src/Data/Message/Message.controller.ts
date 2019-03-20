import { Mutation, Query } from '@mpaupulaire/typegql';
import { Service } from 'typedi';
import { Message } from './Message.entity';

@Service()
export class MessageController {
  constructor() {}

  @Query({
    type: '[Message!]!',
  })
  public message() {
    return Message.findOne();
  }

  @Mutation({
    args: {
      data: 'MessageCreate!',
    },
    type: 'Message',
  })
  public async createMessage({ data }: any) {
    return Message.create(data).save();
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

}
