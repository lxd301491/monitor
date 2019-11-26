class LoginData {
  /**
   * 单次会话唯一表示
   */
  visitFlag: string | undefined;

  // =============================== 环境信息 开始 =======================================
  /**
   * 设备号
   */
  deviceId: string | undefined;
  /**
   * 设备类型
   */
  deviceType: string | undefined;
  /**
   * 设备系统
   */
  deviceSystem: string | undefined;
  /**
   * 设备宽度像素
   */
  deviceDpiW: number | undefined;
  /**
   * 设备高度像素
   */
  deviceDpiH: number | undefined;
  /**
   * 当前webview版本
   */
  webview: string | undefined;
  /**
   * 当前app版本号
   */
  appVersion: string | undefined;
  /**
   * 当前插件版本号
   */
  patchVerson: string | undefined;
  /**
   * 当前网络情况
   */
  network: string | undefined;
  /**
   * 当前userAgent
   */
  userAgent: string | undefined;
  // =============================== 环境信息 结束 =======================================

  /**
   * 用户id
   */
  userId: string | undefined;

  /**
   * 用户当前角色
   */
  roleId: string | undefined;
  /**
   * 用户角色列表
   */
  roleArr: string | undefined;
  /**
   * 是否白名单
   */
  isWhite: string | undefined;
  /**
   * 用户scc
   */
  scc: string | undefined;
  /**
   * 行为时间
   */
  actionTime: string | undefined;
}