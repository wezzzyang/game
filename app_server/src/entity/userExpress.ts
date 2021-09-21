import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@EntityModel('user_express')
export class UserExpress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int4',
    name: 'express_id',
  })
  expressId: number;

  @Column({
    type: 'int4',
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'int4',
  })
  type: number;

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
