export const actions : any[] = ["click", "input", "blur"];

export type Infos = basicInfo | performanceInfo | envInfo | errorInfo | actionInfo | pvInfo;

export type EmitType = "image" | "fetch" | "xhr" | "beacon" | "custom";

export type MsgLevel = "info" | "warning" | "error" | "crash";

export interface msgInfo {
   // 消息说明
   msg: string
   // 消息源
   ms: string
   // 消息等级
   ml: MsgLevel
}

export interface networkInfo {
  // 有效网络连接类型
  ct: string
  // 估算的下行速度/带宽
  cs?: string
  // 估算的往返时间
  cr?: string
  // 打开/请求数据保护模式
  csa?: string
}


export interface envInfo {
  // 设备号
  dId: string
  // 设备类型
  dt: string
  // 系统
  sys: string
  //系统版本
  sv: string
  //设备宽度像素
  sw: number
  // 设备高度像素
  sh: number
  // 当前版本号
  v: string
}

export interface basicInfo extends networkInfo, msgInfo, envInfo {
  // 单次会话唯一表示
  uni: string
  // 当前页面
  page: string
  // 用户id
  uId: string
  // 用户角色
  rId: string
}

export interface pvInfo extends basicInfo {
  dot: string // document title
  dol: string // document location
  dr: string // 来源
  dpr: number // dpr
  de: string // document 编码
}

export interface performanceInfo extends basicInfo {
  // DNS解析时间
  dnst?: number
  // TCP建立时间
  tcpt?: number
  // 白屏时间  
  wit?: number
  // dom渲染完成时间
  domt?: number
  // 页面onload时间
  lodt?: number
  // 页面准备时间 
  radt?: number
  // 页面重定向时间
  rdit?: number
  // unload时间
  uodt?: number
  // request请求耗时
  reqt?: number
  // 页面解析dom耗时
  andt?: number
}

export interface errorInfo extends basicInfo {
  // 文件名字和路径
  file: string,
  // 错误行号
  line: number,
  // 错误列号
  col: number,
  // 错误堆栈信息
  stack: string
}

export interface actionInfo extends basicInfo {
  // 行为类型
  at: string,
  // 元素信息
  el?: string,
  // 行为描述
  ad?: string,
  // 键盘事件独有，表示那个按键被点击
  key?: string
  // 鼠标或者手指横坐标
  x?: number,
  // 鼠标或者手指纵坐标
  y?: number
}