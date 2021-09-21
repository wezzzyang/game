import {
  Controller,
  Inject,
  Provide,
  Post,
  Get,
  Query,
  App,
  Logger,
  Config,
} from '@midwayjs/decorator';
import { Context, Application } from 'egg';
import { CreateApiDoc } from '@midwayjs/swagger';
import { BaseController } from '../lib/baseController';
import { ILogger } from '@midwayjs/logger';
import { MinioClient } from '../utils/minioUtils';
import axios from 'axios';

@Provide()
@Controller('/api/fileSys', {
  tagName: '文件上传下载',
  description: 'DESC',
})
export class FileServiceController extends BaseController {
  @Inject()
  ctx: Context;

  @Logger()
  logger: ILogger;

  @App()
  app: Application;

  @Config('fileSys')
  fileSys;

  @Inject()
  minioClient: MinioClient;

  @(CreateApiDoc().summary('上传文件').description('上传文件!').build())
  @Post('/uploadFile')
  async uploadFile(): Promise<any> {
    try {
      const minioClient = this.minioClient.init();
      const [{ filename, filepath }] = this.ctx.request.files;
      console.log('filepath: ', filepath);
      console.log('filename: ', filename);
      const { path } = await minioClient.putObject({
        name: filename,
        path: filepath,
      });
      return this.SUCCESS_200()
        .setMessage('上传成功')
        .setData({ filename: filename, fileurl: path });
    } catch (err) {
      return this.ERROR_500().setMessage('上传失败').setData(err);
    }
  }

  @(CreateApiDoc().summary('下载文件').description('下载文件!').build())
  @Get('/downloadFile')
  async downloadFile(
    @Query() filename: string,
    @Query() fileurl: string
  ): Promise<any> {
    try {
      let buffer; // 文件buffer
      const _env_ = fileurl.split('/')[0];
      if (['dev', 'beta', 'prod'].indexOf(_env_) >= 0) {
        // minio
        const minioClient = this.minioClient.init();
        fileurl = fileurl.split('/').slice(1).join('/');
        buffer = await minioClient.getObject(fileurl);
      } else {
        // 兼容历史文件
        let url = 'http://10.1.1.176:7000/api/downloadFile';
        if (this.app.getEnv && this.app.getEnv() === 'prod') {
          url = 'http://10.1.1.175:7000/api/downloadFile';
        }
        const { data } = await axios.get(url, {
          params: { filename, fileurl },
        });
        buffer = data.message;
      }
      this.ctx.set(
        'Content-disposition',
        `attachment;filename=${encodeURI(filename).toString()}`
      );
      this.ctx.body = buffer;
    } catch (err) {
      this.ctx.body = `ERR:${err}`;
    }
  }

  @(CreateApiDoc().summary('删除文件').description('删除文件!').build())
  @Get('/deleteFile')
  async deleteFile(@Query() fileurl: string): Promise<any> {
    try {
      const minioClient = this.minioClient.init();
      const err = await minioClient.removeObject(fileurl);
      if (err) throw '删除失败';
      return this.SUCCESS_200().setMessage('删除成功');
    } catch (err) {
      return this.ERROR_500().setMessage('删除失败').setData(err);
    }
  }
}
