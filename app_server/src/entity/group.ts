import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@EntityModel('group')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'char',
    nullable: true,
    default: '表达',
  })
  type: string;

  @Column({
    type: 'int4',
    nullable: true,
    name: 'community_id',
  })
  communityId: number;

  @Column({
    type: 'int4',
    nullable: true,
    name: 'express_id',
  })
  expressId: number;

  @Column({
    type: 'text',
    nullable: true,
    name: 'conversation_id',
  })
  conversationId: string;

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
