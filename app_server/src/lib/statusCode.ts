/**
 * 异常状态码配置
 * 200 正常
 *
 * 402 校验异常 - 前台参数少传输
 * 403 校验异常 - 后台校验前台参数
 * 404 没有数据
 *
 * 502 系统权限配置异常
 * 501 服务器操作异常
 * 500 服务器报错异常
 *
 * 590 权限异常
 * 591 用户未登录
 * 592 token失效
 * 593 用户未注册
 *
 * ERROR_AOTU 自定义异常
 */

export const STATUSCODE = {
  SUCCESS_200: { code: 200, message: '' },
  ERROR_402: { code: 402, message: '校验异常-参数接收异常' },
  ERROR_403: { code: 403, message: '校验异常-参数校验异常' },
  ERROR_404: { code: 404, message: '校验异常-无数据' },
  ERROR_500: { code: 500, message: '服务器异常' },
  ERROR_501: { code: 501, message: '服务器操作异常' },
  ERROR_502: { code: 502, message: '系统权限配置异常' },
  ERROR_590: { code: 590, message: '权限异常' },
  ERROR_591: { code: 591, message: '用户未登录' },
  ERROR_592: { code: 592, message: 'token失效' },
  ERROR_593: { code: 593, message: '用户未注册' },
};
