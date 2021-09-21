import { Provide } from '@midwayjs/decorator';
import { BaseService } from '../lib/baseService';
import { LikeUser } from '../entity/likeUser';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

@Provide()
export class LikeUserService extends BaseService<LikeUser> {
  constructor() {
    super(LikeUser);
  }

  @InjectEntityModel(LikeUser)
  userModel: Repository<LikeUser>;

  // 获取喜欢我的,但不是朋友 粉丝
  async getLikeMe(user_id) {
    const sql = `SELECT
      u.ID AS user_id,
      u.ALIAS,
      u.avatar,
      1 AS TYPE 
    FROM
      like_user AS lu
      LEFT JOIN "user" AS u ON lu.user_id = u.ID 
    WHERE
      TYPE = 0 
      AND like_user_id = ${user_id} and user_id not in (select like_user_id from like_user where type = 0 and user_id=${user_id})`;
    return this.userModel.query(sql);
  }
  // 新增喜欢
  async getNewLikerNum(user_id) {
    const sql = `WITH qwe AS ( SELECT like_user_id FROM like_user WHERE user_id = ${user_id} AND ( TYPE = 0 OR TYPE = 1 ) )
    SELECT
      count(*)
    FROM
      like_user lu
      LEFT JOIN "user" u ON u.ID = lu.user_id 
    WHERE
      like_user_id = ${user_id} 
      AND TYPE = 0 
      AND user_id NOT IN ( SELECT * FROM qwe )`;
    return this.userModel.query(sql);
  }
  // 新增喜欢
  async getNewLikeUser(user_id) {
    const sql = `
    WITH qwe AS ( SELECT like_user_id FROM like_user WHERE user_id = ${user_id} AND ( TYPE = 0 OR TYPE = 1 ) )
    SELECT
    lu.ID,
    u.ID AS user_id,
    u.ALIAS,
    u.avatar,
    1 AS TYPE 
    FROM
    like_user lu
    LEFT JOIN "user" u ON u.ID = lu.user_id 
    WHERE
    like_user_id = ${user_id} 
    AND TYPE = 0 
    AND user_id NOT IN ( SELECT * FROM qwe )`;

    const result = await this.userModel.query(sql);

    let insertSql = ``;
    for (let item of result) {
      insertSql += `insert into like_user(like_user_id, user_id, type) values(${item.user_id},${user_id},1);`;
    }
    console.log('insertSql: ', insertSql);
    this.userModel.query(insertSql);

    return result;
  }
  // 关注
  async setLikeUser(id, user_id, type) {
    const sql = `update like_user set type = ${type} where like_user_id = ${id} and user_id = ${user_id};`;
    return this.userModel.query(sql);
  }
  // 获取所有我喜欢得
  async getLikeUser(id) {
    const sql = `SELECT
      u.ID AS user_id,
      u.ALIAS,
      u.avatar,
      lu.TYPE 
    FROM
      like_user AS lu
      LEFT JOIN "user" AS u ON lu.like_user_id = u.ID 
    WHERE
      TYPE = 0 
      AND user_id = ${id}`;
    return this.userModel.query(sql);
  }
  // 新增喜欢
  async addLikeUser(like_user_id, user_id, type) {
    const testSql = `select id from like_user where like_user_id = ${like_user_id} and user_id = ${user_id}`;
    const result = await this.userModel.query(testSql);
    let sql;
    if (result.length) {
      sql = `update like_user set  type = ${type} where like_user_id = ${like_user_id} and user_id = ${user_id}`;
    } else {
      sql = `insert into like_user(like_user_id,user_id, type) values(${like_user_id},${user_id},${type})`;
    }
    return this.userModel.query(sql);
  }

  async findLikeUser(id) {
    const sql = `select like_user_id from like_user where user_id = ${id} and type = 0`;
    let data = await this.userModel.query(sql);
    return data.map(x => {
      return x.like_user_id;
    });
  }
}
