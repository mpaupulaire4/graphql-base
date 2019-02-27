import * as bcrypt from 'bcrypt';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {

  public static hashPassword(pswd: string): string {
    return bcrypt.hash(pswd, parseInt(process.env.SALT_ROUNDS || '5', 10));
  }

  public static async isPassword(user: User, password: string) {
    return await bcrypt.compare(password, user.password);
  }

  public static async validatePassword(user: IUserPasswordChange): Promise<void> {
    if (
      user.password &&
      user.password === user.passwordConfirm &&
      this.isValidPassword(user.password)
    ) {
      delete user.passwordConfirm;
      user.password = await this.hashPassword(user.password);
    } else {
      throw Error('Password does not meet requirements');
    }
  }

  public static isValidPassword(psswd: string): boolean {
    return /\d/.test(psswd);
  }

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public password: string;

  @Column({ unique: true })
  public email: string;

  public async isPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

}

interface IUserPasswordChange {
  password?: string;
  passwordConfirm?: string;
}
