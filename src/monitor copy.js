import Vue from 'vue';

const BASE_URL = ['development', 'stg'].includes(process.env.NODE_ENV) ? 'https://pacesapplystg.pingan.com/ca/ccssa' : 'https://c.pingan.com.cn/ca/ccssa';
let _network = null;
let _aladdin = null;
let _roleId = null;
let _isWhite = null;
let _visitFlag = null;

export const ACTION_LEVEL = {
  INFO: 0,
  WARNING: 1,
  ERROR: 2,
  CRASH: 3
};

export const ACTION_GROUP = {
  DEFAULT: 'default',
  ALADDIN_ERROR: 'aladdin_error',
  ALADDIN_TIMEOUT: 'aladdin_timeout',
  NETWORK_ERROR: 'network_error',
  NETWORK_TIEMOUT: 'network_timeout',
  DATA_ERROR: 'data_error',
  WEBTRENDS: 'webtrends'
};

export const MONITOR_TYPE = {
  VISIT_MONITOR: 0,
  ACTION_MONITOR: 1,
  WEBTRENDS_MONITOR: 2
};

// 通过环境配置 performance是否可用
Vue.config.performance = process.env.NODE_ENV !== 'production';

function errorHandler (err, vm, info) {
  console.error(`[errorHandler]`, err, vm, info);
  let { NSErrorFailingURLKey, NSLocalizedDescription, code } = {...err}; // aladdin jar包网络报错
  let { message, line, column, stack, filename } = {...err}; // 普通js错误捕获
  let monitor = {};
  if (NSErrorFailingURLKey && NSLocalizedDescription) {
    // 来自aladdin网络请求错误的异常
    monitor = {
      level: ACTION_LEVEL.CRASH,
      action: 'aladdin网络模块抛出异常',
      error: {
        message,
        stack: JSON.stringify({
          url: NSErrorFailingURLKey,
          desc: NSLocalizedDescription,
          code: code
        })
      }
    };
  } else {
    // 在vue提供的error对象中，script、line、column目前是空的。但这些信息其实在错误栈信息里可以看到。
    line = typeof line !== 'undefined' ? line : 0;
    column = typeof column !== 'undefined' ? column : 0;
    // 解析错误栈信息
    stack = stack ? stack.toString() : `${message}`;
    filename = typeof filename !== 'undefined' ? filename : '';
    monitor = {
      level: ACTION_LEVEL.WARNING,
      action: `errorHandler ${info || ''}`,
      error: { message, line, column, stack, filename }
    };
  }
  monitorPoolFactory.push({
    type: MONITOR_TYPE.ACTION_MONITOR,
    monitor: monitor
  });
}

Vue.config.errorHandler = this.errorHandler;
Vue.prototype.$throw = function (err) {
  errorHandler(err, this);
};

Vue.config.warnHandler = function (msg, vm, trace) {
  // `trace` 是组件的继承关系追踪
  console.warn('[warnHandler] ', msg);
};

window.addEventListener('error', function onError (event) {
  let target = event.target;
  if (target instanceof HTMLElement && ['img', 'script', 'link'].includes(target.tagName.toLocaleLowerCase())) {
    monitorPoolFactory.push({
      type: MONITOR_TYPE.ACTION_MONITOR,
      monitor: {
        level: ACTION_LEVEL.ERROR,
        action: `资源加载异常 ${target.src}`
      }
    });
    return;
  }
  let error = {};
  if (!!event.error && !!event.error.stack) {
    // 如果浏览器有堆栈信息 直接使用
    error.stack = event.error.stack.toString();
  } else if (arguments) {
    // 尝试通过callee拿堆栈信息
    let ext = [];
    let f = arguments.callee.caller;
    let c = 3;
    // 这里只拿三层堆栈信息
    while (f && (--c > 0)) {
      ext.push(f.toString());
      if (f === f.caller) {
        break;// 如果有环
      }
      f = f.caller;
    }
    ext = ext.join(',');
    error.stack = ext;
  }
  error.line = event.error.line || 0;
  error.column = event.error.column || 0;
  error.filename = event.filename || '';
  error.message = event.error.message || '';
  errorHandler(error);
}, true);

window.addEventListener('unhandledrejection', function onUnhandledrejection (error) {
  error.preventDefault();
  error.promise
    .catch(result => {
      errorHandler({
        message: result.message,
        stack: JSON.stringify(result)
      });
    });
});

function getYMD () {
  let date = new Date();
  let _year = date.getFullYear();
  let _month = date.getMonth() + 1;
  _month = _month < 10 ? '0' + _month : _month;
  let _day = date.getDate();
  _day = _day < 10 ? '0' + _day : _day;

  let _hours = date.getHours();
  _hours = _hours < 10 ? '0' + _hours : _hours;
  let _minutes = date.getMinutes();
  _minutes = _minutes < 10 ? '0' + _minutes : _minutes;
  let _seconds = date.getSeconds();
  _seconds = _seconds < 10 ? '0' + _seconds : _seconds;
  return `${_year}-${_month}-${_day} ${_hours}:${_minutes}:${_seconds}`;
}

function randomStr (len) {
  let orgStr = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*?:-_';
  let max = orgStr.length;
  let ret = '';
  while (len > 0) {
    ret += orgStr.charAt(Math.floor(Math.random() * max));
    len--;
  }
  return ret;
}

function toString (obj, limit) {
  let target = '';
  switch (typeof obj) {
    case 'object':
      target = JSON.stringify(obj);
      break;
    case 'number':
      target = obj.toString();
      break;
    case 'undefined':
      target = 'undefined';
      break;
    case 'boolean':
      target = obj ? '1' : '0';
      break;
    case 'string':
      target = obj;
      break;
    case 'symbol':
      target = obj.toString();
      break;
    default:
      target = obj.toString();
  }
  if (typeof limit === 'number' && limit > 0) {
    target = target.slice(0, limit);
  }
  return target;
}

// function sleep (numberMillis) {
//   var now = new Date();
//   var exitTime = now.getTime() + numberMillis;
//   while (true) {
//     now = new Date();
//     if (now.getTime() > exitTime) return;
//   }
// }

class UserInfo {
  constructor () {
    this.userId = '';
    this.roleId = '';
    this.roleArr = [];
    this.isWhite = '';
    this.scc = '';
  }

  async init () {
    try {
      let info = await Promise.all([
        new Promise((resolve, reject) => {
          Promise.race([
            // new Promise((resolve, reject) => {
            //   _aladdin.call('aike_tool', 'getPersonalInfoReq', (err, data) => {
            //     if (err) reject(err);
            //     resolve(data);
            //   });
            // }),
            new Promise((resolve, reject) => {
              setTimeout(() => {
                _aladdin.call('aike_tool', 'getAccount', (err, data) => {
                  if (err) reject(err);
                  resolve({
                    userId: data,
                    roles: []
                  });
                });
              }, 3000);
            })
          ])
            .then(resp => resolve(resp))
            .catch(err => reject(err));
        }),
        _roleId,
        _isWhite
      ].map(p => p.catch(err => {
        console.error('[UserInfo::init]' + err.message);
        errorHandler(err);
        return null;
      })));
      this.userId = info[0] ? info[0].userId : '';
      this.roleArr = info[0] ? info[0].roles : [];
      this.roleId = info[1] ? info[1].data : '';
      this.isWhite = info[2] ? info[2].data.whiteFlag ? 'Y' : 'N' : '';
      this.scc = '';
    } catch (err) {
      console.error('[UserInfo::init]' + err.message);
      errorHandler(err);
    }
  }

  async getAttributes () {
    await this.init();

    return {
      userId: toString(this.userId, 20),
      roleId: toString(this.roleId, 20),
      roleArr: toString(this.roleArr, 400),
      isWhite: toString(this.isWhite, 2),
      scc: toString(this.scc, 20)
    };
  }
}

class EnvInfo {
  constructor () {
    this.deviceId = '';
    this.device = '';
    this.system = '';
    this.webview = '';
    this.appVersion = '';
    this.patchVersion = '';
    this.network = '';
    this.userAgent = navigator ? navigator.userAgent : '';
  }

  makeArray (obj) {
    let res = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      res.push(obj[i]);
    }
    return res;
  }

  async getPatchVersion () {
    try {
      let userAgent = window.navigator.userAgent.toUpperCase();
      let IS_ANDROID = userAgent.indexOf('ANDROID') !== -1;
      let getPatchVersion = null;
      if (IS_ANDROID) {
        getPatchVersion = await new Promise((resolve, reject) => {
          _aladdin.call('pluginsManager', 'getPluginsInfo', {}, (err, data) => {
            if (err) reject(err);
            resolve(data.installedPlugins);
          });
        });
      } else {
        getPatchVersion = await new Promise((resolve, reject) => {
          _aladdin.call('pluginsManager', 'getPluginsInfo', (err, data) => {
            if (err) reject(err);
            resolve(data.installedPlugins);
          });
        });
      }
      let pathVersion = getPatchVersion.find(item => {
        return item && item.name === 'cardCredit';
      });
      console.log('**********************pathVersion**********************', pathVersion.version);
      this.patchVersion = (pathVersion && pathVersion.version) || '';
    } catch (err) {
      console.error('[EnvInfo::getPatchVersion]' + err.message);
      errorHandler(err);
    }
  }

  async initDeviceInfo () {
    try {
      let info = await new Promise((resolve, reject) => {
        _aladdin.call('device', 'getInfo', (err, data) => {
          if (err) reject(err);
          resolve(data);
        });
      });
      let appInfo = await new Promise((resolve, reject) => {
        _aladdin.call('aike_tool', 'getAppInfo', (err, data) => {
          if (err) reject(err);
          resolve(data);
        });
      });
      this.deviceId = info.deviceId;
      this.device = `${info.deviceModel}`;
      this.system = `${info.osName} ${info.osVersion}`;
      this.appVersion = appInfo.appVersion;
    } catch (err) {
      console.error('[EnvInfo::initDeviceInfo]' + err.message);
      errorHandler(err);
    }
  }

  async initNetWorkInfo () {
    try {
      let info = await new Promise((resolve, reject) => {
        _aladdin.call('network', 'getInfo', (err, data) => {
          if (err) reject(err);
          resolve(data);
        });
      });
      this.network = info;
    } catch (err) {
      console.error('[EnvInfo::initNetWorkInfo]' + err.message);
      errorHandler(err);
    }
  }

  async getAttributes () {
    await this.initDeviceInfo();
    await this.initNetWorkInfo();
    await this.getPatchVersion();
    return {
      deviceId: toString(this.deviceId, 40),
      device: toString(this.device, 40),
      system: toString(this.system, 20),
      webview: toString(this.webview, 40),
      appVersion: toString(this.appVersion, 20),
      patchVersion: toString(this.patchVersion, 400),
      network: toString(this.network, 100),
      userAgent: toString(this.userAgent, 400)
    };
  }
}

class ActionInfo {
  constructor (level, action, group, others, stack) {
    this.actionLevel = level || ACTION_LEVEL.INFO;
    this.action = action;
    this.actionGroup = group || ACTION_GROUP.DEFAULT;
    this.actionStack = stack;
    this.actionTime = getYMD();
    this.routeData = {
      query: typeof _vue !== 'undefined' ? _vue.$route.query : '',
      params: typeof _vue !== 'undefined' ? _vue.$route.params : ''
    };
    this.path = location.href;
    this.referrer = document.referrer;
    this.network = '';
    this.cpu = '';
    this.memory = (performance && performance.memory) ? `u:${(performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit).toFixed(2)}/t:${(performance.memory.totalJSHeapSize / performance.memory.jsHeapSizeLimit).toFixed(2)}/l:${performance.memory.jsHeapSizeLimit}` : '';
    this.disk = '';
  }

  initStorage () {
    for (let i = 0; i < localStorage.length; i++) {
      this.localStorage[localStorage.key(i)] = localStorage[localStorage.key(i)];
    }
    for (let i = 0; i < sessionStorage.length; i++) {
      this.sessionStorage[sessionStorage.key(i)] = sessionStorage[sessionStorage.key(i)];
    }
  }

  async initRunTimeEnvInfo () {
    try {
      let info = await Promise.all([
        new Promise((resolve, reject) => {
          _aladdin.call('network', 'getInfo', (err, data) => {
            if (err) reject(err);
            resolve(data);
          });
        })
      ].map(p => p.catch(err => {
        console.error('[ActionInfo::initRunTimeEnvInfo]' + err.message);
        errorHandler(err);
        return null;
      })));
      this.network = info[0] || '';
    } catch (err) {
      console.error('[ActionInfo::initRunTimeEnvInfo]' + err.message);
      errorHandler(err);
    }
  }

  async getAttributes () {
    await this.initRunTimeEnvInfo();
    return {
      actionLevel: toString(this.actionLevel, 20),
      action: toString(this.action, 400),
      actionGroup: toString(this.actionGroup, 100),
      actionStack: toString(this.actionStack, 100),
      actionTime: toString(this.actionTime, 20),
      routeData: toString(this.routeData, 400),
      url: toString(this.path, 200),
      referrer: toString(this.referrer, 200),
      network: toString(this.network, 100),
      cpu: toString(this.cpu, 20),
      memory: toString(this.memory, 20),
      disk: toString(this.disk, 20)
    };
  }
}

class ActionInfoFactory {
  constructor (stack) {
    (stack && typeof stack === 'number' && stack >= 0) ? this.stack = stack : this.stack = 0;
  }

  buildAction (name, level, action, group, others) {
    _aladdin.sessionStorage.setItem(name + '_monitor_stack', this.stack + 1, true, true, (err) => {
      if (err) throw err;
    });
    return new ActionInfo(level, action, group, others, this.stack++);
  }
}

class JSErrorInfo {
  constructor (error) {
    // 没有URL不上报！上报也不知道错误
    if (error.message === 'Script error.') {
      return true;
    }
    this.errorMessage = error.message;
    this.errorLineNo = error.line;
    this.errorColumnNo = error.column;
    this.errorStack = error.stack;
    this.errorFilename = error.filename;
  }

  getAttributes () {
    return {
      jsErrorMessage: toString(this.errorMessage, 200),
      jsErrorLineNo: toString(this.errorLineNo, 10),
      jsErrorColumnNo: toString(this.errorColumnNo, 10),
      jsErrorStack: toString(this.errorStack, 4000),
      jsErrorFilename: toString(this.errorFilename, 200)
    };
  }
}

/**
 * 计数器
 */
class Counter {
  constructor (num = 0) {
    this.num = num;
  }

  get () {
    return this.num;
  }

  increase () {
    this.num += 1;
  }

  reset () {
    this.num = 0;
  }
}

/**
 * 抽象 state 父类
 */
class AbstractState {
  constructor (time = Date.now()) {
    this.startTime = time;
    console.info(`${this.getName()} --> startTime = ${this.startTime / 1000}`);
  }

  getName () {
    return this.constructor.name;
  }

  canPass () {
    return true;
  }

  checkout (breaker) {
  }
}

/**
* 闭合
*/
class CloseState extends AbstractState {
  canPass (breaker) {
    return true;
  }

  checkout (breaker) {
    let period = breaker.thresholdForOpen[1] * 1000;
    let now = Date.now();
    if (now >= this.startTime + period) { // 过了这段校验时间, 清零等待重新开始
      this.startTime = Date.now();
      breaker.reset();
    }

    if (breaker.getCount() >= breaker.thresholdForOpen[0]) { // 在这段校验时间内, 超过断路阈值, 切换到 `OpenState`
      breaker.reset();
      breaker.setState(new OpenState());
    }
  }
}

/**
* 半开
*/
class HalfOpenState extends AbstractState {
  canPass (breaker) {
    let limit = breaker.thresholdForHalfOpen[0];
    return breaker.getCount() <= limit;
  }

  checkout (breaker) {
    let period = breaker.thresholdForHalfOpen[1] * 1000;
    let now = Date.now();
    if (now >= this.startTime + period) {
      breaker.reset();
      if (breaker.getCount() > breaker.thresholdForHalfOpen[0]) { // 依然超过断路阈值, 切到 `OpenState`
        breaker.setState(new OpenState());
      } else { // 低于断路阈值, 切到 `CloseState`
        breaker.setState(new CloseState());
      }
    }
  }
}

/**
* 断路
*/
class OpenState extends AbstractState {
  canPass () {
    return false;
  }

  checkout (breaker) {
    let period = breaker.idleTimeForOpen * 1000;
    let now = Date.now();
    if (now >= this.startTime + period) { // 过了这段校验时间, 切换到 `HalfOpenState`
      breaker.reset();
      breaker.setState(new HalfOpenState());
    }
  }
}

/**
 * 熔断器
 * @param thresholdForOpen {string} 格式: '600/60'
 * 以示例为参考，在60秒内触发大于600次则切换到断开状态
 * @param idleTimeForOpen {number} 单位: 秒
 * 处于熔断状态持续时间，超过时间后熔断状态将自动切换为半开状态
 * @param thresholdForHalfOpen {string} 格式: '300/60'
 * 以示例为参考，在60秒触发次数小于300次则切换到闭合状态
 */
export class Fuse {
  constructor (logFlag, thresholdForOpen = '600/60', idleTimeForOpen = 5 * 60, thresholdForHalfOpen = '300/60') {
    this.idleTimeForOpen = idleTimeForOpen;
    this.thresholdForOpen = thresholdForOpen.split('/');
    this.thresholdForHalfOpen = thresholdForHalfOpen.split('/');
    this.counter = new Counter(); // max times for each 60s
    this.state = new CloseState(); // default state
    this.logFlag = logFlag;
  }

  getState () {
    return this.state;
  }

  setState (state) {
    console.info(`switch state from ${this.getState().getName()} to ${state.getName()}`);
    this.state = state;
  }

  reset () {
    this.counter.reset();
  }

  canPass () {
    this.getState().checkout(this);
    return this.getState().canPass(this);
  }

  count () {
    // 计数器 +1, 同时让 当前的 state 去做条件校验
    this.counter.increase();
    this.getState().checkout(this);
    console.info(`[${this.logFlag}::count] ${this.counter.get()}`);
  }

  getCount () {
    return this.counter.get();
  }
}

/**
 * 抽象 埋点 父类
 */
class AbstractMonitor {
  constructor (api = '', type = -1, name = '', frequencyFuse = new Fuse('', '60/60', 1 * 60, '30/60'), disasterFuse = new Fuse('', '5/60', 5 * 60, '2/60')) {
    this.api = api;
    this.frequencyFuse = frequencyFuse;
    this.disasterFuse = disasterFuse;
    this.loopHandler = null;
    this.type = type;
    this.name = name;
  }

  equalType (type) {
    return this.type === type;
  }

  equalName (name) {
    return this.name === name;
  }

  emit (monitor) {
    let self = this;
    this.frequencyFuse.count();
    if (this.frequencyFuse.canPass() && this.disasterFuse.canPass()) {
      // if (navigator && navigator.sendBeacon) {
      //   try {
      //     let isSucc = navigator.sendBeacon(this.api, monitor);
      //     if (!isSucc) {
      //       self.push(monitor);
      //       self.disasterFuse.count();
      //       self.process();
      //     }
      //   } catch (e) {
      //     self.push(monitor);
      //     self.disasterFuse.count();
      //     self.process();
      //   }
      // } else {
      console.info(`[AbstractMonitor::emit] api:${this.api} params:`, monitor);
      _network.post(this.api, monitor)
        .catch(err => {
          // 出错就回流
          console.error(`[AbstractMonitor::emit] api:${this.api} err:`, err);
          self.push(monitor);
          self.disasterFuse.count();
          self.process();
        });
      // }
    }
  }

  process () {
    if (_aladdin && _network) {
      if (this.loopHandler) {
        clearTimeout(this.loopHandler);
        this.loopHandler = null;
      }
      let monitorPool = monitorPoolFactory.pull(this.name);
      while (monitorPool.length > 0) {
        let monitor = monitorPool.shift(1);
        this.emit(monitor);
      }
    } else {
      this.loop();
    }
  }

  loop () {
    if (this.loopHandler === null) { this.loopHandler = setTimeout(this.process, 500); }
  }

  push (monitor) {
    monitorPoolFactory.push({
      name: this.name,
      monitor: monitor
    });
  }
}

class VisitMonitor extends AbstractMonitor {
  constructor (api, type, name, visitFlag, frequencyFuse = new Fuse('VisitMonitor::frequencyFuse', '60/60', 1 * 60, '30/60'), disasterFuse = new Fuse('VisitMonitor::disasterFuse', '5/60', 5 * 60, '2/60')) {
    api = api || BASE_URL + '/bankAapp/app/addRequestLog';
    super(api, type, name, frequencyFuse, disasterFuse);
    this.visitFlag = visitFlag;
    this.autoEmit();
  }

  static async build (api, type, name, frequencyFuse, disasterFuse) {
    try {
      if (monitorFactory.getMonitor(type, name).length > 0) {
        throw new Error('[WebTrendsMonitor::build] 构造目标已经存在');
      }
      let visitFlag = await _visitFlag;
      return new VisitMonitor(api, type, name, visitFlag, frequencyFuse, disasterFuse);
    } catch (err) {
      console.error('[Monitor::initVisitFlag]', err);
      errorHandler(err);
    }
  }

  async autoEmit () {
    try {
      console.log('[VisitMonitor::autoEmit] start');
      let userInfo = await new UserInfo().getAttributes();
      console.log('[VisitMonitor::autoEmit] userInfo', userInfo);
      let envInfo = await new EnvInfo().getAttributes();
      console.log('[VisitMonitor::autoEmit] envInfo', envInfo);
      super.push({
        visitFlag: this.visitFlag,
        actionTime: getYMD(),
        ...userInfo,
        ...envInfo
      });
    } catch (err) {
      errorHandler(err);
    }
  }

  emit (monitor) {
    super.emit({
      requestJournal: monitor
    });
  }

  process () {
    if (this.visitFlag) {
      super.process();
    } else {
      super.loop();
    }
  }
}

class ActionMonitor extends AbstractMonitor {
  constructor (api, type, name, visitFlag, actionFactory, frequencyFuse = new Fuse('ActionMonitor::frequencyFuse', '60/60', 1 * 60, '30/60'), disasterFuse = new Fuse('ActionMonitor::disasterFuse', '5/60', 5 * 60, '2/60')) {
    api = api || BASE_URL + '/bankAapp/app/addBehaviorLog';
    super(api, type, name, frequencyFuse, disasterFuse);
    this.visitFlag = visitFlag;
    this.actionFactory = actionFactory;
  }

  static async build (api, type, name, stack, frequencyFuse, disasterFuse) {
    try {
      if (monitorFactory.getMonitor(type, name).length > 0) {
        throw new Error('[WebTrendsMonitor::build] 构造目标已经存在');
      }
      let visitFlag = await _visitFlag;
      return new ActionMonitor(api, type, name, visitFlag, new ActionInfoFactory(stack), frequencyFuse, disasterFuse);
    } catch (err) {
      console.error('[ActionMonitor::build]', err);
      errorHandler(err);
    }
  }

  async buildMonitorObj (monitor) {
    try {
      if (this.actionFactory === null) return null;
      let action = await this.actionFactory.buildAction(this.name, monitor.level, monitor.action, monitor.group, monitor.others).getAttributes();
      let jsError = {};
      if (monitor.error) {
        jsError = new JSErrorInfo(monitor.error).getAttributes();
      }
      return {
        behaviorMonitor: {
          visitFlag: this.visitFlag,
          ...action,
          ...jsError
        }
      };
    } catch (err) {
      console.error('[Monitor::buildMonitorObj]', err);
      errorHandler(err);
    }
  }

  emit (args) {
    let {level, action, group, error, others} = {...args};
    let {otitle, olabel, opts} = {...args};
    let monitor = {};
    if (typeof action !== 'undefined') {
      monitor = {level, action, group, error, others};
    } else if (typeof otitle !== 'undefined' || typeof olabel !== 'undefined') {
      monitor = {
        level: ACTION_LEVEL.INFO,
        group: group,
        action: `${olabel} ${otitle}`,
        others: opts
      };
    }
    this.buildMonitorObj(monitor)
      .then(resp => {
        if (resp) super.emit(resp);
      })
      .catch(err => {
        errorHandler(err);
      });
  }

  process () {
    if (this.visitFlag && this.actionFactory) {
      super.process();
    } else {
      super.loop();
    }
  }
}

class WebTrendsMonitor extends AbstractMonitor {
  constructor (type, name, bindAction, deviceType, roleId) {
    super('', type, name);
    this.roleId = roleId;
    this.deviceType = deviceType;
    this.bindAction = bindAction;
    this.inited = false;
  }

  static async build (type, name, bindAction = false) {
    try {
      if (monitorFactory.getMonitor(type, name).length > 0) {
        throw new Error('[WebTrendsMonitor::build] 构造目标已经存在');
      }
      let info = await Promise.all([
        new Promise((resolve, reject) => {
          _aladdin.call('aike_tool', 'getDeviceType', (err, data) => {
            if (err) reject(err);
            switch (data.toLocaleLowerCase()) {
              case 'androidphone':
                resolve('1');
                break;
              case 'androidpad':
                resolve('2');
                break;
              case 'iphone':
                resolve('3');
                break;
              case 'ipad':
                resolve('4');
                break;
              default:
                resolve('-1');
            }
          });
        }),
        _roleId
      ].map(p => p.catch(err => {
        console.error('[WebTrendsMonitor::build]', err);
        errorHandler(err);
        return null;
      })));
      return new WebTrendsMonitor(type, name, bindAction, info[0] || '-1', info[1] ? info[1].data : '');
    } catch (err) {
      console.error('[WebTrendsMonitor::build]', err);
      errorHandler(err);
    }
  }

  pageStart (args) {
    let self = this;
    let timecouter = setInterval(function () {
      if (typeof _tag !== 'undefined' && self.roleId && self.deviceType) {
        window.WTjson = window.WTjson || {};
        for (var index in args) {
          window.WTjson[index] = args[index];
        }
        window.WTjson['WT.usertag_id'] = self.roleId;
        window.WTjson['WT.mobile_model'] = self.deviceType;
        _tag.ready(function () {
          // 初始化方法
          _tag.init();
        });
        clearInterval(timecouter);
        self.inited = true;
        self.process();
      }
    }, 500);
  }

  process () {
    if (this.inited) {
      super.process();
    } else {
      super.loop();
    }
  }

  emit (monitor) {
    if (this.bindAction) {
      monitor.group = ACTION_GROUP.WEBTRENDS;
      monitorPoolFactory.push({
        type: MONITOR_TYPE.ACTION_MONITOR,
        monitor: monitor
      });
    }
    _tag.trackEvent(monitor.otitle, monitor.olabel, monitor.opts);
  }
}

class MonitorPool {
  constructor (type, name, limit) {
    this.type = type;
    this.name = name;
    this.limit = limit;
    this.store = [];
  }

  getType () {
    return this.type;
  }

  equalType (type) {
    return this.type === type;
  }

  getName () {
    return this.name;
  }

  equalName (name) {
    return this.name === name;
  }

  getLength () {
    return this.store.length;
  }

  getLimit () {
    return this.limit;
  }

  push (monitor) {
    if (this.store.length >= this.limit) return;
    this.store.push(monitor);
  }

  pull () {
    let storeClone = [...this.store];
    this.store = [];
    return storeClone;
  }
}

class MonitorPoolFactory {
  constructor () {
    this.pool = [];
  }

  build (type, name, limit = 10) {
    if (Object.values(MONITOR_TYPE).includes(type) && name) {
      let monitorPool = new MonitorPool(type, name, limit);
      this.pool.push(monitorPool);
      return true;
    }
    return false;
  }

  delete (name) {
    let index = this.pool.findIndex(item => {
      return item.getName() === name;
    });
    this.pool.splice(index, 1);
  }

  clear () {
    this.pool = [];
  }

  push (args) {
    let { type, name, monitor } = {...args};
    let { olabel, otitle } = {...args};
    if (type && name) {
      this.pool.forEach(item => {
        item && item.equalType(type) && item.equalName(name) && item.push(monitor);
      });
    } else if (type) {
      this.pool.forEach(item => {
        item && item.equalType(type) && item.push(monitor);
      });
    } else if (name) {
      this.pool.forEach(item => {
        item && item.equalName(name) && item.push(monitor);
      });
    } else if (olabel || otitle) {
      this.pool.forEach(item => {
        item && item.equalType(MONITOR_TYPE.WEBTRENDS_MONITOR) && item.push(args);
      });
      type = MONITOR_TYPE.WEBTRENDS_MONITOR;
    }
    monitorFactory.notifyProcess(type, name);
  }

  pull (name) {
    let _pool = this.pool.find(item => {
      return item && item.equalName(name);
    });
    if (_pool) {
      return _pool.pull();
    } else {
      return [];
    }
  }
}

export const monitorPoolFactory = new MonitorPoolFactory();

class MonitorFactory {
  constructor () {
    this.monitors = [];
    this.aladdinAsyncMap = new Map();
    this.inited = false;
  }

  getMonitors () {
    return this.monitors;
  }

  init (network, aladdin) {
    _network = network;
    _aladdin = aladdin;
    this.initAsyncInfo();
    this.watchAladdinAsync();
    this.inited = true;
  }

  initAsyncInfo () {
    _roleId = _network.post(BASE_URL + '/bankAapp/app/getUserRole', {});
    _isWhite = _network.post(BASE_URL + '/bankAapp/whiteList/checkUserIsWhite.do', {});
    _visitFlag = new Promise((resolve, reject) => {
      _aladdin.sessionStorage.getItem('visit_flag', true, true, (err, data) => {
        if (err) reject(err);
        if (!data || data === 'null') {
          data = new Date().getTime() + randomStr(4);
          _aladdin.sessionStorage.setItem('visit_flag', data, true, true);
        }
        resolve(data);
      });
    });
  }

  async build (args) {
    let {type, name, api, frequencyFuse, disasterFuse, bindAction} = {...args};
    let monitor = null;
    try {
      if (!this.inited) {
        throw new Error('[MonitorFactory::build] MonitorFactory尚未初始化, 请先调用init方法');
      }
      switch (type) {
        case MONITOR_TYPE.VISIT_MONITOR:
          name = name && typeof name === 'string' ? name : 'visit';
          monitor = await VisitMonitor.build(api, type, name, frequencyFuse, disasterFuse);
          this.monitors.push(monitor);
          break;
        case MONITOR_TYPE.ACTION_MONITOR:
          name = name && typeof name === 'string' ? name : 'action';
          let stack = await new Promise((resolve, reject) => {
            _aladdin.sessionStorage.getItem(name + '_monitor_stack', true, true, (err, data) => {
              if (err) reject(err);
              resolve(data);
            });
          });
          if (!isNaN(stack)) {
            monitor = await ActionMonitor.build(api, type, name, parseInt(stack), frequencyFuse, disasterFuse);
          } else {
            monitor = await ActionMonitor.build(api, type, name, 0, frequencyFuse, disasterFuse);
          }
          this.monitors.push(monitor);
          break;
        case MONITOR_TYPE.WEBTRENDS_MONITOR:
          name = name && typeof name === 'string' ? name : 'webtrends';
          monitor = await WebTrendsMonitor.build(type, name, bindAction);
          this.monitors.push(monitor);
          break;
        default:
          throw new Error('[MonitorFactory::build] 创建的监控器类型不存在');
      }
      return true;
    } catch (err) {
      console.error(`[MonitorFactory::build]`, err);
    }
  }

  watchAladdinAsync () {
    let self = this;
    _aladdin.on('call', function (_args) {
      let { component, action, args, callId } = {..._args};
      if (args.filter(item => { return typeof item === 'function'; }).length > 0) {
        let timecouter = setInterval(() => {
          if (!args[0].url || args[0].url.indexOf('addBehaviorLog') <= -1) {
            monitorPoolFactory.push({
              type: MONITOR_TYPE.ACTION_MONITOR,
              monitor: {
                level: ACTION_LEVEL.CRASH,
                group: (component === 'http' && action === 'request') ? ACTION_GROUP.NETWORK_TIEMOUT : ACTION_GROUP.ALADDIN_TIMEOUT,
                action: (component === 'http' && action === 'request') ? `网络请求20s未回调: ${args[0].url}` : `aladdin jsbridge 20s未回调: ${component} ${action}`
              }
            });
          }
          self.aladdinAsyncMap.delete(callId);
          clearInterval(timecouter);
        }, 20000);
        self.aladdinAsyncMap.set(callId, {
          timecouter: timecouter,
          time: new Date().getTime(),
          url: args[0].url || ''
        });
      }
    });
    _aladdin.on('callback', function (_args) {
      let { handlerKey } = {..._args};
      let callId = handlerKey.split('_')[0];
      if (self.aladdinAsyncMap.has(callId)) {
        let cbObj = self.aladdinAsyncMap.get(callId);
        clearInterval(cbObj.timecouter);
        if (new Date().getTime() - cbObj.time > 1000 * 5 && cbObj.url.indexOf('addBehaviorLog') <= -1) {
          monitorPoolFactory.push({
            type: MONITOR_TYPE.ACTION_MONITOR,
            monitor: {
              level: ACTION_LEVEL.WARNING,
              group: cbObj.url ? ACTION_GROUP.NETWORK_TIEMOUT : ACTION_GROUP.ALADDIN_TIMEOUT,
              action: `${handlerKey}接口返回时间超过5s: ${new Date().getTime() - cbObj.time} ${cbObj.url}`
            }
          });
        }
        self.aladdinAsyncMap.delete(callId);
        console.log(`[Monitor::watchAladdinAsync] ${JSON.stringify(handlerKey)} aladdinAsyncMap.size: ${self.aladdinAsyncMap.size}`);
      }
    });
  }

  notifyProcess (type, name) {
    if (type) {
      this.monitors.forEach(item => {
        item && item.equalType(type) && item.process();
      });
    } else if (name) {
      this.monitors.forEach(item => {
        item && item.equalName(name) && item.process();
      });
    }
  }

  getMonitor (type, name) {
    let typeValid = Object.values(MONITOR_TYPE).includes(type);
    let nameValid = typeof name === 'string' && name;
    return this.monitors.filter(item => {
      if (typeValid && nameValid) {
        return item && item.equalType(type) && item.equalName(name);
      } else if (typeValid) {
        return item && item.equalType(type);
      } else if (nameValid) {
        return item && item.equalName(name);
      } else {
        return false;
      }
    });
  }
}

export const monitorFactory = new MonitorFactory();
