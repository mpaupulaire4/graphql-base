import { Controller, Query, Mutation } from "vesper";
import { AuthorizationService } from '../services/Authorization'
import { User } from './User.entity'


@Controller()
export class UserController {
  constructor(
    private auth: AuthorizationService
  ) {}

  @Query()
  currentUser() {
    return this.auth.user
  }

  @Query()
  users() {
    return User.find()
  }

  @Mutation()
  async createUser({ data }) {
    await User.validatePassword(data)
    return User.create(data).save()
  }

  @Mutation()
  async updateUser({ data: { id, ...data } }) {
    if (data.password || data.passwordConfirm) {
      await User.validatePassword(data)
    }
    return User.update(id, data)
  }

  @Mutation()
  async deleteUser({ id }){
    return User.delete(id)
  }

}
