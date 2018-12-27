import { User } from '../User/User.entity'
import { Service } from 'typedi'

@Service()
export class AuthorizationService {

  constructor(
    private currentUser: User
  ) {}

  get user(): User {
    return this.currentUser
  }

}
