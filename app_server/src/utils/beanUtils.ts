/**
 * 对象的公共操作
 */

// 下划线转驼峰格式的数据
export function camelCase(str: string): string {
  return str.replace(/([^_])(?:_+([^_]))/g, ($0, $1, $2) => {
    return $1 + $2.toUpperCase();
  });
}

// 下划线转连接线
export function toConnectingLine(str: string): string {
  return str.replace(/([^_])(?:_+([^_]))/g, ($0, $1, $2) => {
    return $1 + '-' + $2;
  });
}

// 下划线转斜杠
export function toItalicLine(str: string): string {
  return str.replace(/([^_])(?:_+([^_]))/g, ($0, $1, $2) => {
    return $1 + '/' + $2;
  });
}

// 首字母大写
export function firstUpperCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 去除字符串两边的引号
export function deleteQuo(str: string): string {
  return str.replace(/"/g, '');
}
