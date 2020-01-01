export type InfoType = "native" | "error" | "action" | "uncaught" | "vue" | "spa";

export type ActionType = "click" | "input" | "blur";

export const actions : any[] = ["click", "input", "blur"];

export type Infos = basicInfo | performanceInfo | envInfo | errorInfo | actionInfo;

export type emitType = "image" | "fetch" | "xhr" | "custom";

export type msgSource = "unkown" | "native" | "error" | "action" | "uncaught" | "vue" | "spa" | "costom";

export type msgLevel = "info" | "warning" | "error" | "crash";

export interface basicInfo {
  // 单次会话唯一表示
  uni: string
  // 当前页面
  page: string
  // 用户id
  uId: string
  // 用户角色
  rId: string
  // 网络
  ct: string
  // 消息说明
  msg: string
  // 消息源
  ms: msgSource
  // 消息等级
  ml: msgLevel
}

export interface performanceInfo extends basicInfo {
  // DNS解析时间
  dnst: number
  //TCP建立时间
  tcpt: number
  // 白屏时间  
  wit: number
  //dom渲染完成时间
  domt: number
  //页面onload时间
  lodt: number
  // 页面准备时间 
  radt: number
  // 页面重定向时间
  rdit: number
  // unload时间
  uodt: number
  //request请求耗时
  reqt: number
  //页面解析dom耗时
  andt: number
}

export interface envInfo extends basicInfo {
  // 设备号
  dId: string
  // 设备类型
  dType: string
  // 系统
  sys: string
  //系统版本
  sysV: string
  //设备宽度像素
  dpiW: number
  // 设备高度像素
  dpiH: number
  // 当前版本号
  v: string
}

export interface errorInfo extends basicInfo {
  file: string,
  line: number,
  col: number,
  stack: string
}

export interface actionInfo extends basicInfo {
  /**
   * 行为类型
   */
  at: string,
  /**
   * 元素信息
   */
  el?: string,
  /**
   * 行为描述
   */
  ad?: string,
  /**
   * 键盘事件独有，表示那个按键被点击
   */
  key?: string
  /**
   * 鼠标或者手指横坐标
   */
  x?: number,
  /**
   * 鼠标或者手指纵坐标
   */
  y?: number
}