import {
  Controller,
  Get,
  Inject,
  Provide,
  Post,
  Put,
  Del,
  Param,
  ALL,
  Body,
  Logger,
} from '@midwayjs/decorator';
import { Context } from 'egg';
import { UserService } from '../service/user';
import { BaseController } from '../lib/baseController';
import { CreateApiDoc } from '@midwayjs/swagger';
import { ILogger } from '@midwayjs/logger';
import { CacheManager } from '@midwayjs/cache';
import axios from 'axios';
import { getToken } from '../utils/jwtUtils';
axios;

@Provide()
@Controller('/api/user', {
  tagName: '名称：user',
  description: 'DESC',
})
export class UserController extends BaseController {
  @Inject()
  ctx: Context;

  //依赖注入CacheManager
  @Inject('cache:cacheManager')
  cache: CacheManager;

  @Logger()
  logger: ILogger;

  @Inject()
  userService: UserService;

  // findFriend
  // findFriendUnCommunity
  // findFriendUnAdmin

  @(CreateApiDoc()
    .summary('Get请求, 获取非群里人员好友')
    .description('获取非群里人员好友')
    .build())
  @Get('/findFriendUnCommunity/:community/:search')
  @Get('/findFriendUnCommunity/:community/')
  async findFriendUnCommunity(
    @Param() search: string,
    @Param() community: number
  ): Promise<any> {
    const result = await this.userService.findFriendUnCommunity(
      this.ctx.user.id,
      search,
      community
    );
    return this.SUCCESS_200().setData(result);
  }
  @(CreateApiDoc()
    .summary('Get请求, 获取群人员非管理员群主')
    .description('获取群人员非管理员群主')
    .build())
  @Get('/findFriendUnAdmin/:community/:search')
  @Get('/findFriendUnAdmin/:community/')
  async findFriendUnAdmin(
    @Param() search: string,
    @Param() community: number
  ): Promise<any> {
    const result = await this.userService.findFriendUnAdmin(search, community);
    return this.SUCCESS_200().setData(result);
  }
  @(CreateApiDoc()
    .summary('Get请求, 获取朋友数据')
    .description('获取朋友数据')
    .build())
  @Get('/searchFriend/:search')
  async searchFriend(@Param() search: string): Promise<any> {
    const result = await this.userService.findFriend(this.ctx.user.id, search);
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('Get请求, 获取朋友数据')
    .description('获取朋友数据')
    .build())
  @Get('/findFriend')
  async findFriend(): Promise<any> {
    const result = await this.userService.findFriend(this.ctx.user.id);
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('手机号登录/注册')
    .description('POST请求，登录，无则注册')
    .build())
  @Get('/phone/verify/:phone')
  async phoneVerify(): Promise<any> {
    const { phone } = this.ctx.params;
    const ifSend = await this.cache.get(phone);
    if (ifSend) return this.ERROR_402().setMessage('不能频繁发送');
    // const random = Math.ceil(Math.random() * 100000)
    //   .toString()
    //   .padStart(6, '0');
    const random = '111111';
    // const appCode = 'f0cd31e17d2e4e7fa83eb8cdd1ab43c6';
    // const host = `https://smssend.shumaidata.com/sms/send?receive=${phone}&tag=${random}&templateId=M09DD535F4`;

    // const { data } = await axios({
    //   url: host,
    //   method: 'post',
    //   headers: {
    //     Authorization: 'APPCODE ' + appCode,
    //   },
    // });

    this.cache.set(phone, random, { ttl: 58 });
    return this.SUCCESS_200().setMessage('发送成功');
    // if (data.code === 200) {
    //   this.cache.set(phone, random, { ttl: 58 });
    //   return this.SUCCESS_200().setMessage('');
    // }
    return this.ERROR_402().setMessage('发送失败，请稍后重新发送');
  }

  @(CreateApiDoc()
    .summary('手机号登录/注册')
    .description('POST请求，登录，无则注册')
    .build())
  @Post('/phone/login')
  async phoneLogin(): Promise<any> {
    const { phone, verify } = this.ctx.request.body;
    const code = await this.cache.get(phone);

    if (code && code === verify) {
      let data = await this.userService.getPhoneUser(phone);
      if (data) {
        data.token = getToken(data);
        return this.SUCCESS_200().setMessage('登录成功').setData(data);
      }
      return this.SUCCESS_200().setMessage('').setData('注册');
    }
    return this.ERROR_402().setMessage('验证码不正确');
  }

  testError(body) {
    if (!body.data && body.type !== 'phone') return '所填信息不能为空';
    const regAlias = /^[a-zA-Z0-9\u4E00-\u9FA5]{2,8}$/;
    const regAccount = /^[a-zA-Z0-9_-]{4,16}$/;
    const regPhone =
      /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/;

    if (body.type === 'newPhone' && !regPhone.test(body.data))
      return '手机号填写有误';
    if (body.type === 'alias' && !regAlias.test(body.data))
      return '昵称规则有误';
    if (
      (body.type === 'account' || body.type === 'password') &&
      !regAccount.test(body.data)
    )
      return '账号密码规则有误';

    return null;
  }

  @(CreateApiDoc().summary('修改').description('修改用户信息').build())
  @Post('/editor')
  async editor(@Body(ALL) body: any): Promise<any> {
    const message = this.testError(body);
    if (message) return this.ERROR_402().setMessage(message);

    if (body.type === 'avatar' || body.type === 'alias') {
      const result = (await this.userService.editor(body, this.ctx.user.id))[0];
      result.token = getToken(result);
      return this.SUCCESS_200().setMessage('修改成功').setData(result);
    }

    const code = await this.cache.get(body.phone);
    if (code && code === body.verify) {
      if (body.type === 'phone')
        return this.SUCCESS_200().setMessage('验证码正确');

      const result = (await this.userService.editor(body, this.ctx.user.id))[0];

      if (result == '手机号已经注册')
        return this.ERROR_402().setMessage('手机号已经注册');

      result.token = getToken(result);

      return this.SUCCESS_200().setMessage('修改成功').setData(result);
    }

    return this.ERROR_402().setMessage('验证码不正确');
  }

  @(CreateApiDoc().summary('登陆').description('登陆').build())
  @Post('/login')
  async login(): Promise<any> {
    const data = this.ctx.request.body;
    const result = await this.userService.login(data);
    if (!result) {
      return this.ERROR_402().setMessage('登录失败');
    }
    result.token = getToken(result);
    return this.SUCCESS_200().setMessage('登录成功').setData(result);
  }

  @(CreateApiDoc().summary('登陆').description('登陆').build())
  @Post('/register')
  async register(): Promise<any> {
    const data = this.ctx.request.body;
    const result = await this.userService.register(data);
    if (!result) {
      return this.ERROR_402().setMessage('注册失败');
    }
    result.token = getToken(result);
    return this.SUCCESS_200().setMessage('注册成功').setData(result);
  }

  @(CreateApiDoc()
    .summary('查找全部数据')
    .description('Get请求，查找全部数据!')
    .build())
  @Get('/findAll')
  async findAll(): Promise<any> {
    const result = await this.userService.findAll();
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('根据ID查找数据')
    .description('Get请求，根据ID查找数据!')
    .build())
  @Get('/findUser/:id')
  async findUser(@Param() id: number): Promise<any> {
    const result = await this.userService.findUser(id, this.ctx.user.id);
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('根据ID查找数据')
    .description('Get请求，根据ID查找数据!')
    .build())
  @Get('/findById/:id')
  async findById(@Param() id: number): Promise<any> {
    const result = await this.userService.findById(id);
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('新增数据')
    .description('Post请求，新增数据!')
    .build())
  @Post('/')
  async create(@Body(ALL) body: any): Promise<any> {
    const result = await this.userService.create(body, this.ctx.user);
    return this.SUCCESS_200().setMessage('新增成功').setData(result);
  }

  @(CreateApiDoc()
    .summary('修改数据')
    .description('Put请求，修改数据!')
    .build())
  @Put('/')
  async update(@Body() id: number, @Body(ALL) body: any): Promise<any> {
    const result = await this.userService.updateById(id, body, this.ctx.user);
    return this.SUCCESS_200().setMessage('修改成功').setData(result);
  }

  @(CreateApiDoc()
    .summary('逻辑删除数据')
    .description('Del请求，逻辑删除数据!')
    .build())
  @Del('/deleteById/:id')
  async delete(@Param() id: number): Promise<any> {
    const result = await this.userService.logicDeleteById(id, this.ctx.user);
    return this.SUCCESS_200().setMessage('删除成功').setData(result);
  }
}
