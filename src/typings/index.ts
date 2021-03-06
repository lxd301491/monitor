export type Infos = msgInfo | performanceInfo | envInfo | errorInfo | actionInfo | pvInfo;

export type EmitType = "image" | "fetch" | "beacon" | "custom";

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

export interface basicInfo extends networkInfo, envInfo {
  // 单次会话唯一表示
  uni: string
  // 当前页面
  page: string
  // 用户id
  uId: string
  // 用户角色
  rId: string
}

export interface pvInfo extends msgInfo {
  // 当前页面
  page: string
  // document title
  dot: string
  // document location
  dol: string 
  // 来源
  dr: string 
  // dpr
  dpr: number 
  // document 编码
  de: string 
}

export interface performanceInfo extends msgInfo {
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

export interface errorInfo extends msgInfo {
  // 文件名字和路径
  file: string,
  // 错误行号
  line: number,
  // 错误列号
  col: number,
  // 错误堆栈信息
  stack: string
}

export interface actionInfo extends msgInfo {
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
  y?: number,
  // 多个手指触发时，第几个
  c?: number
}

export interface uploadParams {
  data: string;
  zip?: boolean;
  [propName: string]: any;
}
