class BehaviorData {
  /**
   * 单次会话唯一表示
   */
  visitFlag: string | undefined;

  // =============================== 环境信息 开始 =======================================
  /**
   * 路由参数
   */
  routerData: string | undefined;
  /**
   * 当前url
   */
  url: string | undefined;
  /**
   * 上一个url
   */
  referrer: string | undefined;
  /**
   * 当前网络状态
   */
  network: string | undefined;
  /**
   * 当前cpu占用量
   */
  cpu: string | undefined;
  /**
   * 当前内存占用量
   */
  memory: string | undefined;
  // =============================== 环境信息 结束 =======================================

  /**
   * 行为等级
   */
  actionLevel: string | undefined;
  /**
   * 行为名称
   */
  action: string | undefined;
  /**
   * 行为组
   */
  actionGroup: string | undefined;
  /**
   * 行为队列
   */
  actionStack: string | undefined;
  /**
   * 错误信息
   */
  errorMsg: string | undefined;
  /**
   * 错误类型
   */
  errorType: string | undefined;
  /**
   * 错误行号
   */
  errorLineNo: string | undefined;
  /**
   * 错误列号
   */
  errorColumnNo: string | undefined;
  /**
   * 错误文件名
   */
  errorFileName: string | undefined;
  /**
   * 行为时间
   */
  actionTime: string | undefined;

  /**
   * 是否就绪
   */
  isReady: boolean = false;

  constructor () {

  }
}