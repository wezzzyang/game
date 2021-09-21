import { Provide } from '@midwayjs/decorator';
import { BaseService } from '../lib/baseService';
import { ExpressTag } from '../entity/expressTag';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

@Provide()
export class ExpressTagService extends BaseService<ExpressTag> {
  constructor() {
    super(ExpressTag);
  }

  @InjectEntityModel(ExpressTag)
  userModel: Repository<ExpressTag>;
}
