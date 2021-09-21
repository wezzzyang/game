import { Provide } from '@midwayjs/decorator';
import { IUserOptions } from '../interface/DTO/example';

@Provide()
export class ExampleService {
  async getUser(options: IUserOptions) {
    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }
}
