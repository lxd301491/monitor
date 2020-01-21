export namespace globalConfig {
  export const timeout = 20000;

  /**
   * cookie过期时间
   */
  export const expiredays = 24 * 60 * 60 * 1000;
  
  /**
   * 超长消息压缩阈值
   */
  export const infoLenMax = 1000;
  
  /**
   * 是否是debug模式，打印必要日志
   */
  export let debug = false;
}
