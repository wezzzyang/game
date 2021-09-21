export interface testDTO {
  id: number;
}

export interface WpRpcServer {
  /**
   * 测试Rpc访问
   * @param param
   */
  testRpc(param: testDTO);
}

export interface SelfRpcServer {
  /**
   * 测试Rpc访问
   * @param param
   */
  test(param: any);
}
