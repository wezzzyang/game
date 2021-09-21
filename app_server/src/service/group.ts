import { Provide } from '@midwayjs/decorator';
import { BaseService } from '../lib/baseService';
import { Group } from '../entity/group';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

@Provide()
export class GroupService extends BaseService<Group> {
  constructor() {
    super(Group);
  }

  @InjectEntityModel(Group)
  userModel: Repository<Group>;
}
