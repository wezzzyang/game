import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@EntityModel('express')
export class Express {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int4',
    name: 'user_id',
  })
  userId: number;

  @Column({
    type: 'varchar',
    name: 'avatar_type',
  })
  avatarType: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  video: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  image: string;

  @Column({
    type: 'int4',
    name: 'express_id',
    nullable: true,
  })
  expressId: number;

  @Column({
    type: 'text',
  })
  content: string;

  @Column({
    type: 'int4',
    name: 'close_like',
  })
  closeLike: number;

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

  @Column({
    type: 'int4',
    nullable: true,
    name: 'share_count',
  })
  shareCount: number;
}
