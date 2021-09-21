import { Provide } from '@midwayjs/decorator';
import { BaseService } from '../lib/baseService';
import { MessageMeantime } from '../entity/messageMeantime';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

@Provide()
export class MessageMeantimeService extends BaseService<MessageMeantime> {
  constructor() {
    super(MessageMeantime);
  }

  @InjectEntityModel(MessageMeantime)
  userModel: Repository<MessageMeantime>;
}
