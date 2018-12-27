import * as bcrypt from 'bcrypt'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  static hashPassword(pswd: string): string {
    return bcrypt.hash(pswd, parseInt(process.env.SALT_ROUNDS || '5'))
  }

  static async isPassword(user: User, password: string) {
    return await bcrypt.compare(password, user.password)
  }

  static async validatePassword(user: UserPasswordChange): Promise<void> {
    if (
      user.password &&
      user.password === user.passwordConfirm &&
      this.isValidPassword(user.password)
    ) {
      delete user.passwordConfirm
      user.password = await this.hashPassword(user.password)
    } else {
      throw Error('Password does not meet requirements')
    }
  }

  static isValidPassword(psswd: string): boolean {
    return /\d/.test(psswd)
  }

  async isPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
  }

}

interface UserPasswordChange {
  password?: string
  passwordConfirm?: string
}