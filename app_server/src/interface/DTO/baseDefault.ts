/**
 * @description 组件层面接口
 */
export interface IResultData {
  code: number;
  message: string;
  data: any;
  setData: (data: any) => IResultData;
  setMessage: (message: string) => IResultData;
}
