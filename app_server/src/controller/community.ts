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
import { CommunityService } from '../service/community';
import { BaseController } from '../lib/baseController';
import { CreateApiDoc } from '@midwayjs/swagger';
import { ILogger } from '@midwayjs/logger';

@Provide()
@Controller('/api/community', {
  tagName: '名称：community',
  description: 'DESC',
})
export class CommunityController extends BaseController {
  @Inject()
  ctx: Context;

  @Logger()
  logger: ILogger;

  @Inject()
  communityService: CommunityService;

  // getCommunityMessage;
  @(CreateApiDoc()
    .summary('Put请求, 修改圈子规则')
    .description('Put请求, 修改圈子规则')
    .build())
  @Put('/editorCommunityRule')
  async editorCommunityRule(@Body(ALL) body: any): Promise<any> {
    const result = await this.communityService.editorCommunityRule(
      body.community_id,
      this.ctx.user.id,
      body.type
    );
    if (!result) return this.ERROR_402().setMessage('权限不足');
    return this.SUCCESS_200().setData(result).setMessage('修改成功');
  }

  @(CreateApiDoc()
    .summary('Put请求, 添加圈子管理员')
    .description('Put请求, 添加圈子管理员')
    .build())
  @Put('/addCommunityAdmin')
  async addCommunityAdmin(@Body(ALL) body: any): Promise<any> {
    const result = await this.communityService.addCommunityAdmin(
      body.community_id,
      this.ctx.user.id,
      body.user_list
    );
    if (!result) return this.ERROR_402().setMessage('权限不足');
    return this.SUCCESS_200().setData(result).setMessage('添加成功');
  }

  @(CreateApiDoc()
    .summary('Put请求, 添加圈子群员')
    .description('Put请求, 添加圈子群员')
    .build())
  @Put('/addCommunityUser')
  async addCommunityUser(@Body(ALL) body: any): Promise<any> {
    const result = await this.communityService.addCommunityUser(
      body.community_id,
      this.ctx.user.id,
      body.user_list
    );
    if (!result) return this.ERROR_402().setMessage('权限不足');
    return this.SUCCESS_200().setData(result).setMessage('添加成功');
  }

  @(CreateApiDoc()
    .summary('Put请求, 解散圈子')
    .description('Put请求, 解散圈子')
    .build())
  @Put('/dissolveCommunity')
  async dissolveCommunity(@Body(ALL) body: any): Promise<any> {
    const result = await this.communityService.dissolveCommunity(
      body.community_id,
      this.ctx.user.id
    );
    if (!result) return this.ERROR_402().setMessage('权限不足');
    return this.SUCCESS_200().setData(result).setMessage('解散成功');
  }

  @(CreateApiDoc()
    .summary('Put请求, 加入圈子')
    .description('Put请求, 加入圈子')
    .build())
  @Put('/joinCommunity')
  async joinCommunity(@Body(ALL) body: any): Promise<any> {
    const result = await this.communityService.joinCommunity(
      body.community_id,
      this.ctx.user.id
    );
    if (!result) return this.ERROR_402().setMessage('加入失败');
    return this.SUCCESS_200().setData(result).setMessage('加入成功');
  }

  @(CreateApiDoc()
    .summary('Put请求, 退出圈子')
    .description('Put请求, 退出圈子')
    .build())
  @Put('/exitCommunity')
  async exitCommunity(@Body(ALL) body: any): Promise<any> {
    const result = await this.communityService.exitCommunity(
      body.community_id,
      this.ctx.user.id
    );
    if (!result) return this.ERROR_402().setMessage('退出失败');
    return this.SUCCESS_200().setData(result).setMessage('退出成功');
  }

  @(CreateApiDoc()
    .summary('Get请求，获取圈子基本信息')
    .description('Get请求，获取圈子基本信息')
    .build())
  @Get('/getCommunityMessage/:community_id')
  async getCommunityMessage(@Param() community_id: number): Promise<any> {
    const result = await this.communityService.getCommunityMessage(
      community_id,
      this.ctx.user.id
    );
    if (!result) return this.ERROR_402().setMessage('获取失败');
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('Get请求，获取加入和创建得圈子')
    .description('Get请求，获取加入和创建得圈子')
    .build())
  @Get('/getSelfCommunity')
  async getSelfCommunity(): Promise<any> {
    const result = await this.communityService.getSelfCommunity(
      this.ctx.user.id
    );
    if (!result) return this.ERROR_402().setMessage('获取失败');
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('Get请求，搜索加入和创建得圈子')
    .description('Get请求，搜索加入和创建得圈子')
    .build())
  @Get('/searchCommunity/:str')
  async searchCommunity(@Param() str: string): Promise<any> {
    if (str === '') return this.ERROR_402().setMessage('输入不能为空');
    const result = await this.communityService.searchCommunity(
      this.ctx.user.id,
      str
    );
    if (!result) return this.ERROR_402().setMessage('搜索失败');
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('Post请求，创建圈子')
    .description('Post请求，创建圈子!')
    .build())
  @Post('/createCommunity')
  async createCommunity(@Body(ALL) body: any): Promise<any> {
    const result = await this.communityService.createCommunity(
      body,
      this.ctx.user.id
    );
    if (!result) {
      return this.ERROR_402().setMessage('创建失败');
    }
    return this.SUCCESS_200().setMessage('创建成功');
  }

  @(CreateApiDoc()
    .summary('查找全部数据')
    .description('Get请求，查找全部数据!')
    .build())
  @Get('/findAll')
  async findAll(): Promise<any> {
    const result = await this.communityService.findAll();
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('根据ID查找数据')
    .description('Get请求，根据ID查找数据!')
    .build())
  @Get('/findById/:id')
  async findById(@Param() id: number): Promise<any> {
    const result = await this.communityService.findById(id);
    return this.SUCCESS_200().setData(result);
  }

  @(CreateApiDoc()
    .summary('新增数据')
    .description('Post请求，新增数据!')
    .build())
  @Post('/')
  async create(@Body(ALL) body: any): Promise<any> {
    const result = await this.communityService.create(body, this.ctx.user);
    return this.SUCCESS_200().setMessage('新增成功').setData(result);
  }

  @(CreateApiDoc()
    .summary('修改数据')
    .description('Put请求，修改数据!')
    .build())
  @Put('/')
  async update(@Body() id: number, @Body(ALL) body: any): Promise<any> {
    const result = await this.communityService.updateById(
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
    const result = await this.communityService.logicDeleteById(
      id,
      this.ctx.user
    );
    return this.SUCCESS_200().setMessage('删除成功').setData(result);
  }
}
