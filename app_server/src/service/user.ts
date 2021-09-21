import { Provide } from '@midwayjs/decorator';
import { BaseService } from '../lib/baseService';
import { User } from '../entity/user';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import dayjs from 'dayjs';

@Provide()
export class UserService extends BaseService<User> {
  constructor() {
    super(User);
  }

  @InjectEntityModel(User)
  userModel: Repository<User>;

  async findFriendUnCommunity(user_id, search = null, community_id) {
    const searchSql =
      search !== null && search !== '' ? ` u.alias like '%${search}%' and` : '';
    const sql = `
    with friend as (SELECT
      like_user_id 
    FROM
      like_user 
    WHERE
      user_id = ${user_id} 
      AND TYPE = 0 
      AND like_user_id IN ( SELECT user_id FROM like_user WHERE like_user_id = ${user_id} AND TYPE = 0 ))

    select u.alias, u.avatar, u.id from "user" as u inner JOIN friend as f on u.id = f.like_user_id
    where ${searchSql}
      u.id
    not in
      (select user_id from community_user as cu where community_id = ${community_id} and status = 1) 
    ORDER BY u.alias`;
    return this.userModel.query(sql);
  }

  async findFriendUnAdmin(search = null, community_id) {
    const searchSql =
      search !== null && search !== ''
        ? `where u.alias like '%${search}%'`
        : '';
    const sql = `
    with community_user as (select user_id from community_user as cu where community_id = ${community_id} and status = 1 and rank_type = 2)
      
    select u.alias, u.avatar, u.id from "user" as u inner JOIN community_user as f on u.id = f.user_id ${searchSql} ORDER BY u.alias`;
    return this.userModel.query(sql);
  }

  async findFriend(user_id, search = null) {
    const searchSql =
      search !== null && search !== ''
        ? `where u.alias like '%${search}%'`
        : '';
    const sql = `
    with friend as (SELECT
      like_user_id 
    FROM
      like_user 
    WHERE
      user_id = ${user_id} 
      AND TYPE = 0 
      AND like_user_id IN ( SELECT user_id FROM like_user WHERE like_user_id = ${user_id} AND TYPE = 0 ))
      
    select u.alias, u.avatar, u.id from "user" as u inner JOIN friend as f on u.id = f.like_user_id ${searchSql} ORDER BY u.alias`;
    return this.userModel.query(sql);
  }

  async findUser(id, user_id) {
    let user_rlt = `,user_friend_rlt as (select type, 0 as join_id from like_user where user_id = ${user_id} and like_user_id = ${id})`;
    id == user_id && (user_rlt = '');
    const sql = `
    with user_data as
    (select
      us.id,
      us.account,
      us.phone,
      us.avatar,
      us.alias,
      0 as join_id
      from "user" as us
      where us.id = ${id}),
      
      user_fans as
      (
        SELECT
          count(*) as fans,
          0 as join_id
        FROM
          like_user AS lu
          LEFT JOIN "user" AS u ON lu.user_id = u.ID 
        WHERE
          type = 0 
          AND like_user_id = ${user_id} and user_id not in (select like_user_id from like_user where type = 0 and user_id=${user_id})
      ),

      user_belike AS (
        SELECT COUNT
          ( * ) AS belike,
          0 AS join_id 
        FROM
          user_express AS uses
          LEFT JOIN express AS es ON es.ID = uses.express_id 
        WHERE
          es.user_id = ${id} 
        AND uses.TYPE = 1 
      ),
      
      user_friend as (
        select count(*) as friend, 0 as join_id
        from like_user where user_id = ${id}  
        and  type = 0
        and like_user_id
        in (select user_id
          from like_user
          where like_user_id = ${id}
          and type = 0))

      ${user_rlt}
      
      select
        ud.id,
        ud.account,
        ud.phone,
        ud.avatar,
        ud.alias,
        ub.belike,
        uf.friend,
        ufs.fans
        ${id != user_id ? ',ufr.type' : ''}
      from user_data as ud
      join user_belike as ub on ud.join_id = ub.join_id
      join user_friend as uf on uf.join_id = ub.join_id
      join user_fans as ufs on ufs.join_id = ub.join_id
      ${
        id != user_id
          ? `LEFT JOIN user_friend_rlt as ufr on  ufr.join_id = uf.join_id`
          : ''
      }`;
    const data = await this.userModel.query(sql);
    return data[0];
  }

  async getPhoneUser(phone: string) {
    const sql = `select id, account, phone, avatar, alias, last_time from "user" where phone = '${phone}'`;
    const data = await this.userModel.query(sql);
    if (!data.length) {
      return null;
    }
    return data[0];
  }

  async editor(data, id) {
    let basicSql;
    switch (data.type) {
      case 'avatar':
        basicSql = `update "user" set ${data.type} = ${data.data} where id = ${id}`;
        break;
      case 'newPhone':
        const sql = `select id from "user" where phone = ${data.data}`;
        const result = await this.userModel.query(sql);
        if (result.length) {
          return '手机号已经注册';
        }
        basicSql = `update "user" set phone = '${data.data}' where id = ${id}`;
        break;
      default:
        basicSql = `update "user" set ${data.type} = '${data.data}' where id = ${id}`;
        break;
    }
    await this.userModel.query(basicSql);
    const sql = `select id, last_time, alias, account, avatar, phone from "user" where id = ${id}`;
    return this.userModel.query(sql);
  }

  async login(data) {
    const sql = `select id,last_time, alias, account, avatar, phone from "user" where account = '${data.account}' and password = '${data.password}'`;
    const result = await this.userModel.query(sql);
    if (!result.length) {
      return false;
    }
    return result[0];
  }
  async register(data) {
    let sql = `insert into "user"(last_time, alias, account, avatar, password, phone) values('${dayjs().format(
      'YYYY-MM-DD HH:mm:ss'
    )}','${data.alias}','${data.account}','${data.avatar}','${
      data.password
    }','${data.phone}')`;

    await this.userModel.query(sql);
    const result = await this.userModel.query(
      `select id,last_time, alias, account, avatar, phone from "user" where phone = '${data.phone}'`
    );

    if (!result.length) {
      return false;
    }
    await this.tagUser(data.tagSelect, result[0].id);

    result[0]['tag'] = data.tagSelect;
    return result[0];
  }
  async tagUser(arr, id) {
    let sql = '';
    arr.forEach(x => {
      sql =
        sql +
        `insert into user_tag(tag_id, user_id, type) values(${x},${id},0);`;
    });
    this.userModel.query(sql);
  }
}
