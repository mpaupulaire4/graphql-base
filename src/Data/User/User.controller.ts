import { Mutation, Query } from '@mpaupulaire/typegql';
import { AuthorizationService } from '../../Auth/Service';
import { User } from './User.entity';

export class UserController {
  constructor(
    private auth: AuthorizationService
  ) {}

  @Query({
    type: 'User!',
  })
  public currentUser() {
    return this.auth.user;
  }

  @Query({
    type: '[User!]!',
  })
  public users() {
    return User.find();
  }

  @Mutation({
    args: {
      data: 'UserCreate!',
    },
    type: 'User',
  })
  public async createUser({ data }: any) {
    data = AuthorizationService.validateAndHashPassword(data);
    return User.create(data).save();
  }

  @Mutation({
    args: {
      data: 'UserUpdate!',
    },
    type: 'User',
  })
  public async updateUser({ data: { id, ...data } }: any) {
    if (data.password || data.passwordConfirm) {
      data = AuthorizationService.validateAndHashPassword(data);
    }
    return User.update(id, data);
  }

  @Mutation({
    args: {
      id: 'ID!',
    },
    type: 'Boolean',
  })
  public async deleteUser({ id }: any) {
    return User.delete(id);
  }

}
