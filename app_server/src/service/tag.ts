import { Provide } from '@midwayjs/decorator';
import { BaseService } from '../lib/baseService';
import { Tag } from '../entity/tag';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

@Provide()
export class TagService extends BaseService<Tag> {
  constructor() {
    super(Tag);
  }

  @InjectEntityModel(Tag)
  userModel: Repository<Tag>;

  async getTagAll() {
    let data = {};
    const resultFather = await this.userModel.query(
      'select title, rank, id, pid  from tag where rank = 0 and status = 1'
    );
    const resultSon = await this.userModel.query(
      'select title, rank, id, pid  from tag where rank = 2 and status = 1'
    );
    resultFather.forEach(x => {
      data[x.title] = resultSon.filter(y => {
        return y.pid === x.title;
      });
      data[x.title].sort((x, y) => x.title.length - y.title.length);
      if (!data[x.title].length) {
        delete data[x.title];
      }
    });

    return data;
  }
}
