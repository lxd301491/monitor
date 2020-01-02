import { expiredays } from "../configs";
import { basicInfo } from "../typings";
import { MonitorProvider } from "../MonitorProvider";

export function getBasicInfo(): basicInfo {
  return {
    ...getUniqueInfo(),
    ...getConnection(),
    page: window.location.href,
    uId: getCookie("uId") || "",
    rId: getCookie("rId") || "",
    msg: "",
    ms: "unkown",
    ml: "info",
    // 设备号
    dId: getCookie("deviceId") || "",
    // 设备类型
    dt: getCookie("deviceType") || "",
    // 系统
    sys: getCookie("sys") || "",
    //系统版本
    sv: getCookie("sysVersion") || "",
    //设备宽度像素
    sw: getScreen().w,
    // 设备高度像素
    sh: getScreen().h,
    // 当前版本号
    v: '{{VERSION}}'
  }
}

// 获取浏览器默认语言
export function getLang() {
  var lang = navigator.language || (navigator as any).userLanguage; //常规浏览器语言和IE浏览器
  lang = lang.substr(0, 2); //截取lang前2位字符
  return lang
}

export function getScreen() {
  return {
    w: document.documentElement.clientWidth || document.body.clientWidth,
    h: document.documentElement.clientHeight || document.body.clientHeight
  }
}

/**
 * 获取随机数 例子:Ab23cD_1546313114
 * @param len 长度
 */
export function randomString(len: number) {
  len = len || 10;
  const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
      pwd = pwd + $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return `${pwd}_${new Date().getTime()}`;
}

/**
 * 获取url中参数
 */
export function getQueryString(name: string) {
    let reg = new RegExp('(^|&)'+ name +'=([^&]*)(&|$)','i');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

/**
 * 获取cookie
 */
export function getCookie(name: string) {
  let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}

/**
 * 获取页面的唯一标识
 */
export function getUniqueInfo() {
  let uni = getCookie("uni");
  if (!uni) {
    uni = randomString(10);
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = "uni=" + uni + ";domain=" + document.domain + ";path=/;expires=" + exdate.toGMTString();
  }
  return {
    uni: uni
  };
}

/**
 * 统计页面性能
 */
export function perforPage() {
  if (!window.performance) return {};
  let timing = performance.timing
  return {
      // DNS解析时间
      dnst: timing.domainLookupEnd - timing.domainLookupStart || 0,
      //TCP建立时间
      tcpt: timing.connectEnd - timing.connectStart || 0,
      // 白屏时间  
      wit: timing.responseStart - timing.navigationStart || 0,
      //dom渲染完成时间
      domt: timing.domContentLoadedEventEnd - timing.navigationStart || 0,
      //页面onload时间
      lodt: timing.loadEventEnd - timing.navigationStart || 0,
      // 页面准备时间 
      radt: timing.fetchStart - timing.navigationStart || 0,
      // 页面重定向时间
      rdit: timing.redirectEnd - timing.redirectStart || 0,
      // unload时间
      uodt: timing.unloadEventEnd - timing.unloadEventStart || 0,
      //request请求耗时
      reqt: timing.responseEnd - timing.requestStart || 0,
      //页面解析dom耗时
      andt: timing.domComplete - timing.domInteractive || 0,
  }
}

/**
 * 统计页面资源性能
 */
export function perforResource(initiatorType: string) {
  if (!window.performance || !window.performance.getEntries) return "浏览器或者webview不支持performance或getEntries";
  return performance.getEntriesByType("resource")
    .filter((item: PerformanceEntry) => {
      let timing: PerformanceResourceTiming = <PerformanceResourceTiming>item;
      if (timing.initiatorType === initiatorType) return false;
    })
    .map((item: PerformanceEntry) => {
      let timing: PerformanceResourceTiming = <PerformanceResourceTiming>item;
      return {
        name: item.name,
        type: timing.initiatorType,
        nextHopProtocol: timing.nextHopProtocol,
        // 重定向的时间
        redirect: timing.redirectEnd - timing.redirectStart || 0,
        // DNS 查询时间
        lookupDomain: timing.domainLookupEnd - timing.domainLookupStart || 0,
        // 内容加载完成的时间
        request: timing.responseEnd - timing.requestStart || 0,
        // TCP 建立连接完成握手的时间
        connect: timing.connectEnd - timing.connectStart || 0,
        duration: timing.duration || 0,
      }
    })
}

/**
 * 获取网络情况
 */
export function getConnection () {
  let connection = (navigator as any).connection;
  if (!connection) {
    return {
      ct: navigator.onLine ? "online" : "offline"
    };
  }
  const { rtt, downlink, effectiveType, saveData } = connection;
  return {
    // 有效网络连接类型
    ct: effectiveType,
    // 估算的下行速度/带宽
    cs: `${downlink}Mb/s`,
    // 估算的往返时间
    cr: `${rtt}ms`,
    // 打开/请求数据保护模式
    csa: saveData
  }
}

export function on<K extends keyof WindowEventMap>(event: K, listener: (this: Window, ev: WindowEventMap[K]) => any, remove?: boolean) {
  if (window.addEventListener) {
    window.addEventListener(event, function eventHandle(ev: WindowEventMap[K]) {
      remove && window.removeEventListener(event, eventHandle, true);
      listener.call(this, ev)
    }, true) 
  }
  if (window.attachEvent) {
    window.attachEvent("on" + event, function eventHandle(this: Window, ev: WindowEventMap[K]) {
      remove && window.detachEvent("on" + event, eventHandle);
      listener.call(this, ev);
    })
  }
}

export function off<K extends keyof WindowEventMap>(event: K, listener: (this: Window, ev: WindowEventMap[K]) => any) {
  if (window.removeEventListener) {
    window.removeEventListener(event, listener);
  } 
  if (window.detachEvent) {
    window.detachEvent(event, listener);
  }
}

// 自定义事件，并dispatch
export function dispatchCustomEvent (e: string, t:string) {
  let r: any;
  CustomEvent 
    ? r = new CustomEvent(e, {
        detail: t
      }) 
    : (
      (r = window.document.createEvent("HTMLEvents")).initEvent(e, !1, !0),
      r.detail = t
    );
  window.dispatchEvent(r);
}

export function parseHash (e:string) {
  return (e ? parseUrl(e.replace(/^#\/?/, "")) : "") || "[index]";
}


export function parseUrl (e: string) {
  return e.replace(/^(https?:)?\/\//, "").replace(/\?.*$/, "");
}

export function pv(provider: MonitorProvider, page?: string) {
  provider.track({
    ...getBasicInfo(),
    dot: document.title,
    dol: location.href,
    dr: document.referrer,
    dpr: window.devicePixelRatio,
    de: document.charset,
    page: page ? page : window.location.href,
    ms: "pv",
    ml: "info"
  });
}