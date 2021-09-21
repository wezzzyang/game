import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@EntityModel('message_meantime')
export class MessageMeantime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int4',
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'int4',
    name: 'group_id',
  })
  groupId: number;

  @Column({
    type: 'int4',
    nullable: true,
    default: 0,
    name: 'if_watch',
  })
  ifWatch: number;

  @Column({
    type: 'text',
  })
  content: string;

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
