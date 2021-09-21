import { Provide } from '@midwayjs/decorator';
import { BaseService } from '../lib/baseService';
import { UserTag } from '../entity/userTag';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

@Provide()
export class UserTagService extends BaseService<UserTag> {
  constructor() {
    super(UserTag);
  }

  @InjectEntityModel(UserTag)
  userModel: Repository<UserTag>;
}
