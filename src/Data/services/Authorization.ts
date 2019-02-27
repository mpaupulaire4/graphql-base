import { Service } from 'typedi';
import { User } from '../User/User.entity';

@Service()
export class AuthorizationService {

  constructor(
    private currentUser: User
  ) {}

  get user(): User {
    return this.currentUser;
  }

}
