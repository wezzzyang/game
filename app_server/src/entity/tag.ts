import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@EntityModel('tag')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
  })
  title: string;

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
    type: 'varchar',
    nullable: true,
  })
  type: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  pid: string;

  @Column({
    type: 'int4',
    nullable: true,
  })
  rank: number;
}
