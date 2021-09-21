import { Provide } from '@midwayjs/decorator';
import { BaseService } from '../lib/baseService';
import { CommunityUser } from '../entity/communityUser';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

@Provide()
export class CommunityUserService extends BaseService<CommunityUser> {
  constructor() {
    super(CommunityUser);
  }

  @InjectEntityModel(CommunityUser)
  userModel: Repository<CommunityUser>;
}
