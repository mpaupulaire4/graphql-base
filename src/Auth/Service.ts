import * as bcrypt from 'bcrypt';
import { User } from '../Data/User/User.entity';

export class AuthorizationService {

  get user(): User {
    return this.currentUser;
  }

  public static async hashPassword(pswd: string): Promise<string> {
    return bcrypt.hash(pswd, parseInt(process.env.SALT_ROUNDS || '5', 10));
  }

  public static async isPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  public static isValidPassword(psswd: string): boolean {
    return /\d/.test(psswd);
  }

  public static async validateAndHashPassword(data: IUserPasswordChange) {
    if (data.password !== data.passwordConfirm) { throw Error('Passwords did not match'); }
    if (!this.isValidPassword(data.password)) { throw Error('Password did not meetrequirement'); }
    delete data.passwordConfirm;
    data.password = await AuthorizationService.hashPassword(data.password);
    return data;
  }

  constructor(
    private currentUser: User
  ) {}

  public isPassword(password: string) {
    return AuthorizationService.isPassword(this.currentUser, password);
  }

  public isUser(user: User) {
    return this.currentUser.id === user.id;
  }

}

interface IUserPasswordChange {
  password: string;
  passwordConfirm: string;
}
