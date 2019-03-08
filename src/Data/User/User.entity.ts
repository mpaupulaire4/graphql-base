import { Prop, Type } from '@mpaupulaire/typegql';
import { AuthorizationService } from '../../Auth/Service'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    return AuthorizationService.isPassword(this, password)
  }

}
