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
import { UserExpressService } from '../service/userExpress';
import { BaseController } from '../lib/baseController';
import { CreateApiDoc } from '@midwayjs/swagger';
import { ILogger } from '@midwayjs/logger';

@Provide()
@Controller('/api/userExpress', {
  tagName: '名称：userExpress',
  description: 'DESC',
})
export class UserExpressController extends BaseController {
  @Inject()
  ctx: Context;

  @Logger()
  logger: ILogger;

  @Inject()
  userExpressService: UserExpressService;

  @(CreateApiDoc()
    .summary('用户是否喜欢文章')
    .description('Get请求，查找全部数据!')
    .build())
  @Put('/iflike/:id/:if_like')
  async iflike(@Param() id: number, @Param() if_like: number): Promise<any> {
    const result = await this.userExpressService.iflike(
      id,
      this.ctx.user.id,
      if_like
    );
    if (result) {
      return this.SUCCESS_200().setMessage('');
    }
  }

  @(CreateApiDoc()
    .summary('查找全部数据')
    .description('Get请求，查找全部数据!')
    .build())
  @Get('/findAll')
  async findAll(): Promise<any> {
    const result = await this.userExpressService.findAll();
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('根据ID查找数据')
    .description('Get请求，根据ID查找数据!')
    .build())
  @Get('/findById/:id')
  async findById(@Param() id: number): Promise<any> {
    const result = await this.userExpressService.findById(id);
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('新增数据')
    .description('Post请求，新增数据!')
    .build())
  @Post('/')
  async create(@Body(ALL) body: any): Promise<any> {
    const result = await this.userExpressService.create(body, this.ctx.user);
    return this.SUCCESS_200().setMessage('新增成功').setData(result);
  }

  @(CreateApiDoc()
    .summary('修改数据')
    .description('Put请求，修改数据!')
    .build())
  @Put('/')
  async update(@Body() id: number, @Body(ALL) body: any): Promise<any> {
    const result = await this.userExpressService.updateById(
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
    const result = await this.userExpressService.logicDeleteById(
      id,
      this.ctx.user
    );
    return this.SUCCESS_200().setMessage('删除成功').setData(result);
  }
}
