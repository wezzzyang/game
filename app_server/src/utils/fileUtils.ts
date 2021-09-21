const fs = require('fs');
const path = require('path');

const onlinePath = path.join(__dirname, '../');

// 递归创建相对位置的目录 - 同步

export async function createDirectoryRelative(fileName: string): Promise<any> {
  const createPath = path.join(onlinePath, fileName);
  return mkdirsSync(createPath);
}

// 创建文件
export async function createFile(
  filePath: string,
  title: string,
  content: string
): Promise<any> {
  const newFilePath = path.join(onlinePath, filePath, title);
  return new Promise(resolve => {
    fs.writeFile(newFilePath, content, err => {
      resolve(!err);
    });
  });
}
// 读取相对位置的文件 - 同步
export async function readFile(
  filePath: string,
  fileName: string
): Promise<any> {
  const absoluteFilePath = path.join(onlinePath, filePath, fileName);
  return new Promise(resolve => {
    fs.readFile(absoluteFilePath, 'utf-8', (err, data) => {
      if (err) {
        resolve(null);
      } else {
        resolve(data);
      }
    });
  });
}

// 递归创建目录，同步方法
export function mkdirsSync(dirname: string): boolean {
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      // console.log(path.dirname(dirname));
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

// 判断文件是否存在
export function isFileExisted(path: string): boolean {
  try {
    fs.accessSync(onlinePath + path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
}

export function wrapfunc(func) {
  return function (...arg) {
    return new Promise(r => {
      function callback(..._arg_) {
        r(_arg_);
      }
      func(...arg, callback);
    });
  };
}
