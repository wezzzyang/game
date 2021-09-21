import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@EntityModel('message_store')
export class MessageStore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int4',
    name: 'group_id',
  })
  groupId: number;

  @Column({
    type: 'int4',
    name: 'from_user_id',
  })
  fromUserId: number;

  @Column({
    type: 'int4',
    default: 1,
  })
  state: number;

  @Column({
    type: 'int4',
    nullable: true,
    name: 'delete_person',
  })
  deletePerson: number;

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
