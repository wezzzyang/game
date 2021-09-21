import { Provide } from '@midwayjs/decorator';
import { BaseService } from '../lib/baseService';
import { ReviewStore } from '../entity/reviewStore';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

@Provide()
export class ReviewStoreService extends BaseService<ReviewStore> {
  constructor() {
    super(ReviewStore);
  }

  @InjectEntityModel(ReviewStore)
  userModel: Repository<ReviewStore>;
}
