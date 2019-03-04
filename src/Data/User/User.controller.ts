import { Mutation, Query } from '@mpaupulaire/typegql';
import { AuthorizationService } from '../../Auth/Service';
import { User } from './User.entity';

export class UserController {
  constructor(
    private auth: AuthorizationService
  ) {}

  @Query({
    type: 'User!'
  })
  public currentUser() {
    return this.auth.user;
  }

  @Query({
    type: '[User!]!'
  })
  public users() {
    return User.find();
  }

  @Mutation({
    type: 'User',
    args: {
      data: 'UserCreate!'
    }
  })
  public async createUser({ data }: any) {
    data = AuthorizationService.validateAndHashPassword(data);
    return User.create(data).save();
  }

  @Mutation({
    type: 'User',
    args: {
      data: 'UserUpdate!'
    }
  })
  public async updateUser({ data: { id, ...data } }: any) {
    if (data.password || data.passwordConfirm) {
      data = AuthorizationService.validateAndHashPassword(data);
    }
    return User.update(id, data);
  }

  @Mutation({
    type: 'Boolean'
  })
  public async deleteUser({ id }: any) {
    return User.delete(id);
  }

}
