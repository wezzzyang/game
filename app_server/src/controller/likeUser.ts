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
import { LikeUserService } from '../service/likeUser';
import { BaseController } from '../lib/baseController';
import { CreateApiDoc } from '@midwayjs/swagger';
import { ILogger } from '@midwayjs/logger';

@Provide()
@Controller('/api/likeUser', {
  tagName: '名称：likeUser',
  description: 'DESC',
})
export class LikeUserController extends BaseController {
  @Inject()
  ctx: Context;

  @Logger()
  logger: ILogger;

  @Inject()
  likeUserService: LikeUserService;

  //getLikeMe
  @(CreateApiDoc().summary('获取粉丝数量').description('获取粉丝数量').build())
  @Get('/getLikeMe')
  async getLikeMe() {
    const result = await this.likeUserService.getLikeMe(this.ctx.user.id);
    return this.SUCCESS_200().setMessage('').setData(result);
  }

  @(CreateApiDoc()
    .summary('获取喜欢的用户数量')
    .description('获取喜欢的用户数量')
    .build())
  @Get('/getNewLikerNum')
  async getNewLikerNum() {
    const result = await this.likeUserService.getNewLikerNum(this.ctx.user.id);
    return this.SUCCESS_200().setMessage('').setData(result);
  }

  @(CreateApiDoc()
    .summary('获取喜欢的用户')
    .description('获取喜欢的用户')
    .build())
  @Get('/getNewLikeUser')
  async getNewLikeUser() {
    const result = await this.likeUserService.getNewLikeUser(this.ctx.user.id);
    return this.SUCCESS_200().setMessage('').setData(result);
  }

  @(CreateApiDoc()
    .summary('获取喜欢的用户')
    .description('获取喜欢的用户')
    .build())
  @Get('/setLikeUser/:id/:type')
  async setLikeUser(@Param() id: number, @Param() type: number) {
    await this.likeUserService.setLikeUser(id, this.ctx.user.id, type);
    return this.SUCCESS_200().setMessage(+type === 1 ? '已取关' : '已关注');
  }

  @(CreateApiDoc()
    .summary('获取喜欢的用户')
    .description('获取喜欢的用户')
    .build())
  @Get('/getLikeUser')
  async getLikeUser() {
    const result = await this.likeUserService.getLikeUser(this.ctx.user.id);
    return this.SUCCESS_200().setMessage('').setData(result);
  }

  @(CreateApiDoc().summary('添加好友关系').description('添加好友关系').build())
  @Put('/addLikeUser')
  async addLikeUser(
    @Body() like_user_id: any,
    @Body() type: any
  ): Promise<any> {
    await this.likeUserService.addLikeUser(
      like_user_id,
      this.ctx.user.id,
      type
    );
    return this.SUCCESS_200().setMessage(!type ? '关注成功' : '已取关');
  }

  @(CreateApiDoc()
    .summary('根据ID查找数据')
    .description('Get请求，根据ID查找数据!')
    .build())
  @Get('/findLikeUser')
  async findLikeUser(): Promise<any> {
    const result = await this.likeUserService.findLikeUser(this.ctx.user.id);
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('查找全部数据')
    .description('Get请求，查找全部数据!')
    .build())
  @Get('/findAll')
  async findAll(): Promise<any> {
    const result = await this.likeUserService.findAll();
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('根据ID查找数据')
    .description('Get请求，根据ID查找数据!')
    .build())
  @Get('/findById/:id')
  async findById(@Param() id: number): Promise<any> {
    const result = await this.likeUserService.findById(id);
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('新增数据')
    .description('Post请求，新增数据!')
    .build())
  @Post('/')
  async create(@Body(ALL) body: any): Promise<any> {
    const result = await this.likeUserService.create(body, this.ctx.user);
    return this.SUCCESS_200().setMessage('新增成功').setData(result);
  }

  @(CreateApiDoc()
    .summary('修改数据')
    .description('Put请求，修改数据!')
    .build())
  @Put('/')
  async update(@Body() id: number, @Body(ALL) body: any): Promise<any> {
    const result = await this.likeUserService.updateById(
      id,
      body,
      this.ctx.user
    );
    return this.SUCCESS_200().setMessage('修改成功').setData(result);
  }

  @(CreateApiDoc()
    .summary('逻辑删除数据')
    .description('Del请求，逻辑删除数据!')
    .build())
  @Del('/deleteById/:id')
  async delete(@Param() id: number): Promise<any> {
    const result = await this.likeUserService.logicDeleteById(
      id,
      this.ctx.user
    );
    return this.SUCCESS_200().setMessage('删除成功').setData(result);
  }
}
