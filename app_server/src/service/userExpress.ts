import { Provide } from '@midwayjs/decorator';
import { BaseService } from '../lib/baseService';
import { UserExpress } from '../entity/userExpress';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

@Provide()
export class UserExpressService extends BaseService<UserExpress> {
  constructor() {
    super(UserExpress);
  }

  @InjectEntityModel(UserExpress)
  userModel: Repository<UserExpress>;

  async iflike(express_id, user_id, if_like) {
    const sql = `select * from user_express where express_id = ${express_id} and user_id = ${user_id}`;
    const data = await this.userModel.query(sql);
    if (!data.length) {
      const sql = `insert into user_express(user_id, express_id, type) values(${user_id},${express_id},${if_like})`;
      this.userModel.query(sql);
      return true;
    }
    const sqlUpadate = `update user_express set type = ${if_like} where express_id = ${express_id} and user_id = ${user_id}`;
    this.userModel.query(sqlUpadate);
  }
}
