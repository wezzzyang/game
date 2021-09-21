import { Application } from 'egg';
import { App, Provide, Config } from '@midwayjs/decorator';
const Minio = require('minio');
const crypto = require('crypto');
const fs = require('fs');

@Provide()
export class MinioClient {
  @App()
  app: Application;

  @Config('fileSys')
  fileSys;

  private env;
  client;

  init() {
    this.env = this.app.getEnv();
    this.client = new Minio.Client({
      endPoint: this.fileSys.host,
      port: +this.fileSys.port,
      useSSL: this.fileSys.useSSL,
      accessKey: this.fileSys.username,
      secretKey: this.fileSys.password,
    });
    return this;
  }
  // 从一个stream/Buffer中上传一个对象
  async putObject(file): Promise<any> {
    const { md5, buffer } = getMd5(file.path); // 获取MD5
    const objectName = getFilePath(md5); // 获取上传路径
    const ext = file.name.split('.').pop(); // 获取扩展名
    let header = null;
    if (['jpg', 'gif', 'png', 'jpeg'].indexOf(ext) >= 0) {
      header = { 'Content-type': `image/${ext}` };
    }
    await this.client.putObject(
      this.env,
      objectName,
      buffer,
      file.size,
      header
    );
    return { path: `${this.env}/${objectName}` };
  }

  // 下载对象
  async getObject(objectName: string): Promise<any> {
    return await this.client.getObject(this.env, objectName);
  }

  // 删除对象
  async removeObject(objectName: string): Promise<any> {
    return await this.client.removeObject(this.env, objectName);
  }
}

// 获取文件地址
function getFilePath(md5: string, len = 4): string {
  const res = [];
  for (let i = 0; i < len; i++) {
    res.push(md5.slice(i, i + 1));
  }
  res.push(md5);
  return res.join('/');
}
function getMd5(filePath: string): { md5: string; buffer: any } {
  const fsHash = crypto.createHash('md5');
  const buffer = fs.readFileSync(filePath);
  fsHash.update(buffer);
  return { md5: fsHash.digest('hex'), buffer };
}
