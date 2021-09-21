import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@EntityModel('review_store')
export class ReviewStore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int4',
    name: 'express_id',
  })
  expressId: number;

  @Column({
    type: 'int4',
    name: 'from_user_id',
  })
  fromUserId: number;

  @Column({
    type: 'int4',
    nullable: true,
    default: 0,
    name: 'like_count',
  })
  likeCount: number;

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
    type: 'int4',
    nullable: true,
    default: 1,
  })
  type: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'client_create_time',
  })
  clientCreateTime: Date;

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
