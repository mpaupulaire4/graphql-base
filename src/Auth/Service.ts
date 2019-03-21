import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../Data/User/User.entity';

if (!process.env.TOKEN_SECRET) {
  throw Error('Must specify env variable TOKEN_SECRET');
}
const TOKEN_EXPIRE = process.env.TOKEN_EXPORE || '1d';

export class AuthorizationService {

  get user(): User {
    return this.currentUser;
  }

  public static async hashPassword(pswd: string): Promise<string> {
    return bcrypt.hash(pswd, parseInt(process.env.SALT_ROUNDS || '5', 10));
  }

  public static signToken(data: any, expires: string | number = TOKEN_EXPIRE): string {
    return jwt.sign(
      data,
      process.env.TOKEN_SECRET || '',
      { expiresIn: expires }
    );
  }

  public static verifyToken(token: string) {
    return jwt.verify(token, process.env.TOKEN_SECRET || '')
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

  public isUser(user: User) {
    return this.currentUser.id === user.id;
  }

}

interface IUserPasswordChange {
  password: string;
  passwordConfirm: string;
}
