import * as bcrypt from 'bcrypt';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Prop, Type } from '@mpaupulaire/typegql';

@Entity()
@Type()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  @Prop('ID')
  public id: number;

  @Column()
  @Prop()
  public name: string;

  @Column()
  @Prop()
  public password: string;

  @Column({ unique: true })
  @Prop()
  public email: string;

  public async isPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

}
