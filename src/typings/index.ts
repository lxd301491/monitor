export interface basicInfo {
  /**
   * 单次会话唯一表示
   */
  token: string
  /**
   * 设备号
   */
  deviceId?: string
  /**
   * 设备类型
   */
  deviceType?: string
  /**
   * 系统
   */
  system?: string
  /**
   * 系统版本
   */
  systemVersion?: string
  /**
   * 设备宽度像素
   */
  dpiW?: number
  /**
   * 设备高度像素
   */
  dpiH?: number
  /**
   * 当前版本号
   */
  version?: string
  /**
   * 当前页面
   */
  page: string
  /**
   * 用户id
   */
  uId: string
  /**
   * 用户角色
   */
  roleId: string
  /**
   * 网络
   */
  ct: string
  
}