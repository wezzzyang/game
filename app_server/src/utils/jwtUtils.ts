const jwt = require('jsonwebtoken');
const secret = require('../config/secret');

// 解析token
export function parseToken(token: string): Promise<any> {
  return jwt.verify(token, secret.sign, (err, decode) => {
    return new Promise((resolve, reject) => {
      if (err) {
        reject(err);
      } else {
        resolve(decode);
      }
    });
  });
}

// 获取token
export function getToken(info: any): string {
  return jwt.sign(info, secret.sign, { expiresIn: secret.tokenExpiresTime });
}

// 解析请求头的token
export async function parseSocket(request: any): Promise<any> {
  const _loginKey_ = 'm-t-k';
  const _token_ = request.headers[_loginKey_] || null;
  if (!_token_) return null;
  return parseToken(_token_);
}
// 解析请求头的token
export async function parseLoginToken(request: any): Promise<any> {
  const _loginKey_ = 'm-t-k';
  const _token_ = request.header[_loginKey_] || null;
  if (!_token_) return null;
  return parseToken(_token_);
}
