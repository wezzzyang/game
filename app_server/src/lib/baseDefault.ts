// 公共controller
import { STATUSCODE } from './statusCode';
import { IResultData } from '../interface/DTO/baseDefault';

export class ResultData implements IResultData {
  public code: number;
  public message: string;
  public data: any;

  constructor(STATUSCODE_CONFIG: { code: number; message: string }) {
    this.code = STATUSCODE_CONFIG.code;
    this.message = STATUSCODE_CONFIG.message;
  }

  setData(data: any) {
    this.data = data;
    return this;
  }

  setMessage(message: string) {
    this.message = message;
    return this;
  }
}

export abstract class BaseDefault {
  private _res_: any;
  SUCCESS_200: () => IResultData; // 查找成功
  ERROR_402: () => IResultData; // 校验异常-参数接收异常
  ERROR_403: () => IResultData; // 校验异常-参数校验异常
  ERROR_404: () => IResultData; // 校验异常-无数据
  ERROR_500: () => IResultData; // 服务器异常
  ERROR_501: () => IResultData; // 服务器操作异常
  ERROR_502: () => IResultData; // 系统权限配置异常
  ERROR_590: () => IResultData; // 权限异常
  ERROR_591: () => IResultData; // 用户未登录
  ERROR_592: () => IResultData; // token失效
  ERROR_593: () => IResultData; // 用户未注册

  constructor() {
    for (const key in STATUSCODE) {
      this[key] = () => {
        this._res_ = new ResultData(STATUSCODE[key]);
        Error.captureStackTrace(this._res_, this[key]);
        return this._res_;
      };
    }
  }
}
