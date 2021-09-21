import { Provide } from '@midwayjs/decorator';
import { BaseService } from '../lib/baseService';
import { Topic } from '../entity/topic';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

@Provide()
export class TopicService extends BaseService<Topic> {
  constructor() {
    super(Topic);
  }

  @InjectEntityModel(Topic)
  userModel: Repository<Topic>;
}
