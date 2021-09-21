import { EggPlugin } from 'egg';
export default {
  logrotator: false, // disable when use @midwayjs/logger
  static: false,
} as EggPlugin;

exports.cors = {
  enable: true, // csrf报错时，可考虑此处，慎重
  package: 'egg-cors',
};
