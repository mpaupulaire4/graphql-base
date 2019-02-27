import { Controller, Mutation, Query } from 'vesper';
import { AuthorizationService } from '../services/Authorization';
import { User } from './User.entity';

@Controller()
export class UserController {
  constructor(
    private auth: AuthorizationService
  ) {}

  @Query()
  public currentUser() {
    return this.auth.user;
  }

  @Query()
  public users() {
    return User.find();
  }

  @Mutation()
  public async createUser({ data }) {
    await User.validatePassword(data);
    return User.create(data).save();
  }

  @Mutation()
  public async updateUser({ data: { id, ...data } }) {
    if (data.password || data.passwordConfirm) {
      await User.validatePassword(data);
    }
    return User.update(id, data);
  }

  @Mutation()
  public async deleteUser({ id }) {
    return User.delete(id);
  }

}
