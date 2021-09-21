import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@EntityModel('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  account: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    type: 'text',
  })
  phone: string;

  @Column({
    type: 'text',
  })
  avatar: string;

  @Column({
    type: 'text',
  })
  alias: string;

  @Column({
    type: 'timestamp',
    name: 'last_time',
  })
  lastTime: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'NOW()',
    name: 'create_time',
  })
  createTime: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'NOW()',
    name: 'update_time',
  })
  updateTime: Date;

  @Column({
    type: 'int2',
    nullable: true,
    default: 1,
  })
  status: number;
}
