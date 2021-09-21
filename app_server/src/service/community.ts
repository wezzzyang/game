import { Provide } from '@midwayjs/decorator';
import { BaseService } from '../lib/baseService';
import { Community } from '../entity/community';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

@Provide()
export class CommunityService extends BaseService<Community> {
  constructor() {
    super(Community);
  }

  @InjectEntityModel(Community)
  userModel: Repository<Community>;

  async getLeader(community_id) {
    const sql = `select leader from community where id = ${community_id}`;
    return this.userModel.query(sql);
  }
  // 修改规则 完
  async editorCommunityRule(community_id, user_id, type) {
    const sql = `update community set rule = ${type} where leader = ${user_id} and id = ${community_id}`;
    return this.userModel.query(sql);
  }
  // 添加管理员
  async addCommunityAdmin(community_id, user_id, user_list) {
    let leader = (await this.getLeader(community_id))[0].leader;
    if (user_id !== leader) return false;

    let sql = `WITH qwe AS ( SELECT user_id FROM "community_user" WHERE user_id IN ( ${user_list} ) AND community_id = ${community_id} ),
asd AS (
	UPDATE "community_user" 
	SET rank_type = 1,
	status = 1 
	WHERE
		user_id IN ( SELECT * FROM qwe ) 
		AND community_id = ${community_id} 
		AND ${user_id} IN ( SELECT user_id FROM "community_user" WHERE community_id = ${community_id} AND rank_type = 0 ) RETURNING user_id 
	) 
INSERT INTO community_user ( user_id, rank_type, community_id, status ) SELECT
	* 
FROM
	(
	SELECT ID AS
		user_id,
		1 AS rank_type,
		${community_id} AS community_id,
		1 AS status 
	FROM
		( VALUES ${'(' + user_list.join('),(') + ')'} ) AS tmp ( "id" ) 
	) A 
WHERE
	user_id NOT IN ( SELECT user_id FROM community_user WHERE user_id IN ( ${user_list} ) AND community_id = ${community_id} ) 
	AND user_id IN ( SELECT user_id FROM ( VALUES
  ${'(' + user_list.join('),(') + ')'} )
  AS tmp ( "user_id" ) )
	AND ${user_id} IN ( SELECT user_id FROM "community_user" WHERE community_id = ${community_id} AND  rank_type = 0 ) RETURNING *`;

    return this.userModel.query(sql);
  }
  // 添加群员
  async addCommunityUser(community_id, user_id, user_list) {
    let sql = `WITH qwe AS ( SELECT user_id FROM "community_user" WHERE user_id IN ( ${user_list} ) AND community_id = ${community_id} ),
asd AS (
	UPDATE "community_user" 
	SET rank_type = 2,
	status = 1 
	WHERE
		user_id IN ( SELECT * FROM qwe ) 
		AND community_id = ${community_id} 
		AND ${user_id} IN ( SELECT user_id FROM "community_user" WHERE community_id = ${community_id} AND (rank_type = 0 or rank_type = 1) ) RETURNING user_id 
	) 
INSERT INTO community_user ( user_id, rank_type, community_id, status ) SELECT
	* 
FROM
	(
	SELECT ID AS
		user_id,
		2 AS rank_type,
		${community_id} AS community_id,
		1 AS status 
	FROM
		( VALUES ${'(' + user_list.join('),(') + ')'} ) AS tmp ( "id" ) 
	) A 
WHERE
	user_id NOT IN ( SELECT user_id FROM community_user WHERE user_id IN ( ${user_list} ) AND community_id = ${community_id} ) 
	AND user_id IN ( SELECT user_id FROM ( VALUES
  ${'(' + user_list.join('),(') + ')'} )
  AS tmp ( "user_id" ) )
	AND ${user_id} IN ( SELECT user_id FROM "community_user" WHERE community_id = ${community_id} AND  (rank_type = 0 or rank_type = 1) ) RETURNING *`;

    return this.userModel.query(sql);
  }
  // 解散圈子
  async dissolveCommunity(community_id, user_id) {
    let leader = (await this.getLeader(community_id))[0].leader;
    if (user_id !== leader) return false;

    const sql = `update community set status = 0 where leader = ${user_id} and id = ${community_id}`;
    return this.userModel.query(sql);
  }
  // 加入圈子
  async joinCommunity(community_id, user_id) {
    const sql = `select * from community_user where community_id = ${community_id} and user_id = ${user_id}`;
    const data = await this.userModel.query(sql);
    if (data.length) {
      const updateSql = `update  community_user set status = 1 and rank_type = 2 where community_id = ${community_id} and user_id = ${user_id}`;
      return this.userModel.query(updateSql);
    }
    const insertSql = `insert into community_user(user_id, rank_type, community_id) values(${user_id},2,${community_id})`;
    return this.userModel.query(insertSql);
  }
  // 退出圈子
  async exitCommunity(community_id, user_id) {
    const sql = `update community_user set status = 0 where user_id = ${user_id} and community_id = ${community_id} and rank_type != 0`;
    return this.userModel.query(sql);
  }

  async getCommunityMessage(community_id, user_id) {
    const sql = `
    SELECT
      ct.ID,
      ct.leader,
      ct.RULE,
      ct.title,
      cu.rank_type,
      cu.user_id,
      u.alias,
      u.avatar
    FROM
      community AS ct
      INNER JOIN community_user AS cu ON ct.ID = cu.community_id 
      INNER JOIN "user" as u on u.id = cu.user_id
      AND ct.ID = ${community_id} 
      AND cu.status = 1
      AND ct.status = 1
    ORDER BY cu.rank_type ASC;`;

    let data = {
      community_id: '',
      rule: '',
      title: '',
      user_type: 3,
      leader: {},
      people: [],
      admin: [],
    };
    let result = await this.userModel.query(sql);

    data.title = result[0].title;
    data.rule = result[0].rule;
    data.community_id = result[0].id;

    result.forEach(x => {
      if (x.user_id === user_id) data.user_type = x.rank_type;
      switch (+x.rank_type) {
        case 0:
          data.leader = x;
          data.admin.push({
            alias: x.alias,
            user_id: x.user_id,
            rank_type: x.rank_type,
            avatar: x.avatar,
          });
          break;
        case 1:
          data.admin.push({
            alias: x.alias,
            user_id: x.user_id,
            rank_type: x.rank_type,
            avatar: x.avatar,
          });
          break;
        case 2:
          data.people.push({
            alias: x.alias,
            user_id: x.user_id,
            rank_type: x.rank_type,
            avatar: x.avatar,
          });
          break;
      }
    });
    result = [];
    return data;
  }

  async getIF(community_id) {
    const sql = `
    SELECT
      ct.ID,
      ct.leader,
      ct.RULE,
      ct.title,
      cu.rank_type,
      cu.user_id,
      u.alias,
      u.avatar
    FROM
      community AS ct
      INNER JOIN community_user AS cu ON ct.ID = cu.community_id 
      INNER JOIN "user" as u on u.id = cu.user_id
      AND ct.ID = ${community_id} 
      AND ct.status = 1
      AND cu.status = 1`;
    const result = await this.userModel.query(sql);
    return result;
  }

  async getSelfCommunity(user_id) {
    const sql = `
    select
      ct.id,
      ct.title,
      u.avatar
    from community_user as cu
    left join community as ct
      on cu.community_id = ct.id
    left join "user" as u
      on cu.user_id = u.id
    where cu.user_id = ${user_id}
      and cu.status = 1
      AND ct.status = 1`;
    const result = await this.userModel.query(sql);
    return result;
  }

  async searchCommunity(user_id, str) {
    const sql = `
    select
      ct.id,
      ct.title,
      u.avatar
    from community_user as cu
    left join community as ct
      on cu.community_id = ct.id
    left join "user" as u
      on cu.user_id = u.id
    where
      cu.user_id = ${user_id}
    AND
      ct.status = 1
    and
      cu.status = 1
    and
      ct.title like '%${str}%'`;

    const noSql = `
    select
      ct.id,
      ct.title,
      u.avatar
    from community_user as cu
    left join community as ct
      on cu.community_id = ct.id
    left join "user" as u
      on cu.user_id = u.id
      where
        cu.status = 1  
      AND
        ct.status = 1
      and
        ct.title like '%${str}%'
      and
        cu.community_id
      not in
        (select cu.community_id from community_user as cu where cu.user_id = ${user_id})`;

    const list = await this.userModel.query(sql);
    const unList = await this.userModel.query(noSql);

    return {
      list,
      unList,
    };
  }

  async createCommunity({ type, select_id, title }, user_id) {
    const createSql = `insert into community(leader, rule, title) values(${user_id},${type},'${title}') returning id;`;
    const { id: community_id } = (await this.userModel.query(createSql))[0];

    if (!community_id) return false;

    if (community_id) {
      let insertSql = `insert into community_user(user_id, rank_type, community_id) values(${user_id},${0},${community_id});`;
      for (let id of select_id) {
        insertSql += `insert into community_user(user_id, rank_type, community_id) values(${id},${2},${community_id});`;
      }
      await this.userModel.query(insertSql);
    }
    return true;
  }
}
