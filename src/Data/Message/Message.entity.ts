import { Prop, Type } from '@mpaupulaire/typegql';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
@Type()
export class Message extends BaseEntity {

  @PrimaryGeneratedColumn()
  @Prop('ID')
  public id: number;

  @Column()
  @Prop()
  public name: string;

}
