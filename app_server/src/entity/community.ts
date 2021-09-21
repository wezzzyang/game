import { EntityModel } from '@midwayjs/orm';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@EntityModel('community')
export class Community {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int4',
  })
  leader: number;

  @Column({
    type: 'int4',
    default: 0,
  })
  rule: number;

  @Column({
    type: 'varchar',
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
}
