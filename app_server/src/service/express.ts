import { Provide } from '@midwayjs/decorator';
import { BaseService } from '../lib/baseService';
import { Express } from '../entity/express';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

@Provide()
export class ExpressService extends BaseService<Express> {
  constructor() {
    super(Express);
  }

  @InjectEntityModel(Express)
  userModel: Repository<Express>;

  async getLikeOrDis(id, type) {
    const sql = `select * from express where express.id in (select express_id from user_express as ue where ue.user_id = ${id} and type = ${type})`;
    return await this.userModel.query(sql);
  }

  async searchExpress(str, type) {
    if (+type) {
      const sql = `
        SELECT
          express.*,u.alias
        FROM
          express
        left join
          "user" as u
        on
          u.id = express.user_id
        WHERE
          content LIKE '%${str}%' 
            and
          express.status = 1`;
      return await this.userModel.query(sql);
    }
    const sql = `
      select
        express.*,u.alias
      from
        express
      left join "user" as u
        on u.id = express.user_id
      where express.id
        in
      (select express_id from topic where title LIKE '%${str}%') and express.status = 1`;
    return this.userModel.query(sql);
    // string[0];
  }

  async findLikeExpress(id) {
    const sql = `select * from express where express.id in (select express_id from user_express where user_id = ${id} and type = 1)  and express.status = 1`;
    const result = await this.userModel.query(sql);
    for (let x of result) {
      x.type = 1;
      await this.findAlias(x);
      await this.findOtherExpress(x);
      await this.findlikeCount(x);
    }
    return result;
  }

  async findLikeUser(id) {
    const sql = ` select express.*,user_express.type from express left join user_express on express.id = user_express.express_id  where express.user_id in (select like_user_id from  like_user where user_id  = ${id} and type = 0 )  and express.status = 1;`;
    const result = await this.userModel.query(sql);
    for (let x of result) {
      await this.findAlias(x);
      await this.findOtherExpress(x);
      await this.findlikeCount(x);
    }
    return result;
  }

  async findAlias(data) {
    const sql = `select avatar, alias from "user" where id = ${data.user_id}`;
    const result = await this.userModel.query(sql);
    data.avatar = result[0].avatar;
  }

  async findOtherExpress(data) {
    if (data.express_id) {
      const sql = `select * from express where id = ${data.express_id} and status = 1`;
      let express_data = await this.userModel.query(sql);
      data.express_id = express_data[0];
    }
  }

  async findlikeCount(x) {
    x.dislike = 0;
    x.like = 0;
    const likeData = await this.findLikeDislike(x.id);
    likeData.forEach(y => {
      y.type === 0 && (x.dislike = y.count);
      y.type === 1 && (x.like = y.count);
    });
  }

  //测试用数组
  async findRandom(user_id) {
    const sql = `SELECT ep.*,ue.type FROM express as ep LEFT JOIN user_express as ue on ep.id = ue.express_id and ue.user_id = ${user_id} where  ep.status = 1  ORDER BY random() limit 10 `;
    const data = await this.userModel.query(sql);
    for (let x of data) {
      await this.findAlias(x);
      await this.findOtherExpress(x);
      await this.findlikeCount(x);
    }

    return data;
  }

  async findLikeDislike(id) {
    const sql = `select type ,count(*) from user_express where express_id = ${id}  GROUP BY type`;
    const data = await this.userModel.query(sql);
    return data;
  }

  async findById(id) {
    const sql = `select * from express where id = ${id} and status = 1`;
    const data = await this.userModel.query(sql);

    await this.findOtherExpress(data[0]);
    await this.findlikeCount(data[0]);
    return data[0];
  }

  async findOneAll(id) {
    const sql = `select * from express where user_id = ${id} and status = 1 ORDER BY create_time DESC`;
    const data = await this.userModel.query(sql);

    if (!data.length) {
      return [];
    }
    for (let x of data) {
      await this.findOtherExpress(x);
      await this.findlikeCount(x);
      x.image = x.image && JSON.parse(x.image);
    }
    return data;
  }
  async publishExpress({
    content,
    avatar_type,
    image,
    video,
    expressId,
    user_id,
    topic,
  }) {
    const sql = `
    insert into
      express(content, avatar_type, image, video, express_id, share_count, close_like, user_id)
      values('${content}', '${avatar_type}', '${image}', '${video}', 
      ${expressId || null}, 0, 0, ${user_id}) 
      returning id;`;

    const result = await this.userModel.query(sql);

    if (topic.length) {
      const insertTopic = `
      insert into topic(express_id, type, title)
      select ${result[0].id} as express_id, 0 as type, title 
      from (values ('${topic.join("'),('")}') ) AS tmp("title");`;
      console.log('insertTopic: ', insertTopic);
      this.userModel.query(insertTopic);
    }

    return result;
  }
}
