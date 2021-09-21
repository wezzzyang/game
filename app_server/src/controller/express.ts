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
import { ExpressService } from '../service/express';
import { BaseController } from '../lib/baseController';
import { CreateApiDoc } from '@midwayjs/swagger';
import { ILogger } from '@midwayjs/logger';

@Provide()
@Controller('/api/express', {
  tagName: '名称：express',
  description: 'DESC',
})
export class ExpressController extends BaseController {
  @Inject()
  ctx: Context;

  @Logger()
  logger: ILogger;

  @Inject()
  expressService: ExpressService;

  // getLikeOrDis;

  @(CreateApiDoc()
    .summary('get请求,搜索文章')
    .description('根据搜索内容,搜索文章,可搜索话题')
    .build())
  @Get('/getLikeOrDis/:type')
  async getLikeOrDis(@Param() type: number): Promise<any> {
    const result = await this.expressService.getLikeOrDis(
      this.ctx.user.id,
      type
    );
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('get请求,搜索文章')
    .description('根据搜索内容,搜索文章,可搜索话题')
    .build())
  @Get('/searchExpress/:str/:type')
  async searchExpress(
    @Param() str: string,
    @Param() type: number
  ): Promise<any> {
    const result = await this.expressService.searchExpress(str, type);
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('找到用户点赞、评论的数据')
    .description('找到用户点赞、评论的数据')
    .build())
  @Get('/findLikeExpress')
  async findLikeExpress(): Promise<any> {
    const result = await this.expressService.findLikeExpress(this.ctx.user.id);
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('喜欢得数据')
    .description('找到用户关注的数据')
    .build())
  @Get('/findLikeUser')
  async findLikeUser(): Promise<any> {
    const result = await this.expressService.findLikeUser(this.ctx.user.id);
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('乱序假数据模拟推荐')
    .description('Get请求，获取假数据')
    .build())
  @Get('/findRandom')
  async findRandom(): Promise<any> {
    const result = await this.expressService.findRandom(this.ctx.user.id);
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('按user_id查找所有文章')
    .description('Get请求，按user_id查找所有文章!')
    .build())
  @Get('/findOneAll')
  async findOneAll(): Promise<any> {
    const result = await this.expressService.findOneAll(this.ctx.user.id);
    if (!result) {
      return this.SUCCESS_200().setData('');
    }
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('按user_id查找所有文章')
    .description('Get请求，按user_id查找所有文章!')
    .build())
  @Get('/findOneAllOther/:id')
  async findOneAllOther(@Param() id: number): Promise<any> {
    const result = await this.expressService.findOneAll(id);
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('查找全部数据')
    .description('Get请求，查找全部数据!')
    .build())
  @Get('/findAll')
  async findAll(): Promise<any> {
    const result = await this.expressService.findAll();
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('根据ID查找数据')
    .description('Get请求，根据ID查找数据!')
    .build())
  @Get('/findById/:id')
  async findById(@Param() id: number): Promise<any> {
    const result = await this.expressService.findById(id);
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('新增数据')
    .description('Post请求，新增数据!')
    .build())
  @Post('/')
  async create(@Body(ALL) body: any): Promise<any> {
    console.log('body: ', body);
    const result = await this.expressService.create(body, this.ctx.user);
    return this.SUCCESS_200().setMessage('新增成功').setData(result);
  }

  @(CreateApiDoc()
    .summary('新增数据')
    .description('Post请求，新增数据!')
    .build())
  @Post('/publishExpress')
  async publishExpress(@Body(ALL) body: any): Promise<any> {
    await this.expressService.publishExpress(body);
    return this.SUCCESS_200().setMessage('发布成功');
  }

  @(CreateApiDoc()
    .summary('修改数据')
    .description('Put请求，修改数据!')
    .build())
  @Put('/')
  async update(@Body() id: number, @Body(ALL) body: any): Promise<any> {
    const result = await this.expressService.updateById(
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
    const result = await this.expressService.logicDeleteById(id, this.ctx.user);
    return this.SUCCESS_200().setMessage('删除成功').setData(result);
  }
}
