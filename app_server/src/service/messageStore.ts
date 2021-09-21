import { Provide } from '@midwayjs/decorator';
import { BaseService } from '../lib/baseService';
import { MessageStore } from '../entity/messageStore';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

@Provide()
export class MessageStoreService extends BaseService<MessageStore> {
  constructor() {
    super(MessageStore);
  }

  @InjectEntityModel(MessageStore)
  userModel: Repository<MessageStore>;

  async test(data) {
    console.log('data: ', data);
    this.userModel.query(``);
  }
}
