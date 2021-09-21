import { BaseDefault } from './baseDefault';
import { getRepository } from 'typeorm';
// 公共controller
export class BaseService<T> extends BaseDefault {
  private repository: any;

  constructor(BaseDao: any, connName?: string) {
    super();
    this.repository = getRepository(BaseDao, connName);
  }

  async findAll(): Promise<any> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<any> {
    return await this.repository.findOne({ id });
  }

  async create(DO: T, user: { id: number }): Promise<any> {
    DO = this.repository.create(DO);
    return await this.repository.save(
      Object.assign({ createUserId: user.id, updateUserId: user.id }, DO)
    );
  }

  async updateById(id: number, DO: T, user: { id: number }): Promise<any> {
    return await this.repository.update(
      { id },
      Object.assign({ createUserId: user.id, updateUserId: user.id }, DO)
    );
  }

  async logicDeleteById(id: number, user: { id: number }): Promise<any> {
    return await this.repository.update({ id }, { status: 0 });
  }
}
