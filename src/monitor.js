// ******************************** 用法介绍 BEGIN ********************************
// 引入关键对象
// import { GlobelMonitorService, MonitorProvider, MonitorConsumer, WebTrendsMonitorConsumer } from './monitor';
// 构造一个生产者，主动埋点都通过该实例填充
// let behaviorProvider = new MonitorProvider();
// 构造一个消费者，可用与一个生产者捆绑，生产者中所有埋点，都会主动获取并上报
// let behaviorConsumer = new MonitorConsumer('http://localhost:8080/hello/log.gif');
// 生产者与消费者相互捆绑，开始上送埋点信息
// behaviorProvider.mounte(behaviorConsumer);
// 给生产者添加全局到上送信息，这些通过mergeOriginalAttributes方法添加到数据都会被该生产者所有都埋点信息共享，这里不会上报埋点
// behaviorProvider
//   .mergeOriginalAttributes({a: 'aaa'}, {a: 1})
//   .mergeOriginalAttributes(
//     {
//       b: function () {
//         return new Promise(resolve => {
//           resolve('sfddsf');
//         });
//       }
//     }, {b: 3});
// 生产者主动埋点，这里是真正触发埋点都方法，该方法中埋点参数为改次埋点独立所有
// behaviorProvider.push({
//   cc: Promise.resolve('11'),
//   ddd: Promise.reject(new Error('sdf'))
// }, {cc: 1, ddd: 2});
// 由于webtrends埋点特殊行，这里单独为webtrends写了一个生产者和消费者，用来消费webtrends都埋点
// 注意：这里都webtrends消费者都类型为WebTrendsMonitorConsumer，需要提供webtrends主要对象_tag, Vue对象，全局参数（用于初始化），以及一个基础埋点都生产者（如果不存在将不会向自己都后台发送埋点，仅仅只会进行webtrends埋点）
// let webTrendsMonitor = new MonitorProvider();
// let waitTag = setInterval(function () {
//   if (window._tag) {
//     webTrendsMonitor.mounte(new WebTrendsMonitorConsumer(_tag, Vue, {
//       usertag_id: 'sdf'
//     }, behaviorProvider));
//     clearInterval(waitTag);
//   }
// }, 1000);
// 全局无埋点都初始化方法，顾名思义，该方法可用监听vue生命周期内报错，aladdin超时异常捕获，promise全局未处理异常，以及全局js报错
// let gmService = new GlobelMonitorService(null, aladdin, Vue);
// gmService
//   .listen2Aladdin(behaviorProvider)
//   .listen2Error(behaviorProvider)
//   .listen2Uncaught(behaviorProvider)
//   .listen2Vue(behaviorProvider);
// ******************************** 用法介绍 END ********************************

// ******************************** 熔断器 BEGIN ********************************
// 计数器
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

// 抽象状态，闭合，断路，半开路的基类，定义基本接口
class AbstractState {
  constructor (time = Date.now()) {
    this.startTime = time;
  }

  getName () {
    return this.constructor.name;
  }

  canPase () {
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
      breaker.setState(new HalfOpenState());
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
 * 熔断器本体
 */
class CircuitBreaker {
  /**
   * @param thresholdForOpen {string} format: '600/60'
   *              '600/60' for instance, it means maximum allowable request is 600 times per 60 seconds, or the breaker will switch to OpenState
   * @param idleTimeForOpen {number} unit: second
   *              600 for instance, it means if the breaker switched to OpenState, it will keep for 600 seconds
   * @param thresholdForHalfOpen {string} format: '300/60'
   *              '300/60' for instance, it means the breaker will switch to OpenState if the maximum number of requests exceeds 300 per 60 seconds,
   *              or the breaker switch to CloseState
   */
  constructor (thresholdForOpen = '600/60', idleTimeForOpen = 5 * 60, thresholdForHalfOpen = '300/60') {
    this.idleTimeForOpen = idleTimeForOpen;
    this.thresholdForOpen = thresholdForOpen.split('/');
    this.thresholdForHalfOpen = thresholdForHalfOpen.split('/');
    this.counter = new Counter(); // max times for each 60s
    this.state = new CloseState(); // default state
  }

  getState () {
    return this.state;
  }

  setState (state) {
    this.state = state;
  }

  reset () {
    this.counter.reset();
  }

  canPass () {
    return this.getState().canPass(this);
  }

  count () {
    // 计数器 +1, 同时让 当前的 state 去做条件校验
    this.counter.increase();
    this.getState().checkout(this);
  }

  getCount () {
    return this.counter.get();
  }
}
// ******************************** 熔断器 END ********************************

// ******************************** 埋点主要类，生产者和消费者 BEGIN ********************************
class VariableExp {
  constructor (obj, limit = 0) {
    this.obj = obj;
    this.limit = limit;
  }

  async toObj () {
    let target = await VariableExp.toObjStatic(this.obj);
    return target;
  }

  async toString () {
    let target = await VariableExp.toStringStatic(this.obj);
    if (typeof this.limit === 'number' && this.limit > 0) {
      target = target.slice(0, this.limit);
    }
    return target;
  }

  static async toObjStatic (obj) {
    let target = '';
    switch (Object.prototype.toString.call(obj)) {
      case '[object Array]':
      case '[object Object]':
      case '[object Number]':
      case '[object Undefined]':
      case '[object Boolean]':
      case '[object String]':
      case '[object Symbol]':
        target = obj;
        break;
      case '[object Promise]':
        target = await obj;
        break;
      case '[object Function]':
        target = obj();
        break;
      default:
        target = obj;
    }
    if (['[object Function]', '[[object Promise]]'].includes(Object.prototype.toString.call(target))) {
      target = await VariableExp.toObjStatic(target);
    }
    return target;
  }

  static async toStringStatic (obj) {
    let target = '';
    let type = Object.prototype.toString.call(obj);
    switch (type) {
      case '[object Array]':
      case '[object Object]':
        target = JSON.stringify(obj);
        break;
      case '[object Number]':
        target = obj.toString();
        break;
      case '[object Undefined]':
        target = 'undefined';
        break;
      case '[object Boolean]':
        target = obj ? '1' : '0';
        break;
      case '[object String]':
        target = obj;
        break;
      case '[object Symbol]':
        target = obj.toString();
        break;
      case '[object Promise]':
        target = await obj;
        break;
      case '[object Function]':
        target = obj();
        break;
      default:
        target = '';
    }
    if (Object.prototype.toString.call(target) !== '[object String]') {
      target = await VariableExp.toStringStatic(target);
    }
    return target;
  }
}

export class MonitorProvider {
  constructor () {
    this.consumer = null;
    this.oAttrs = [];
    this.pauseKeys = [];
    this.eAttrs = [];
    this.isRunning = false;
  }

  mergeOriginalAttributes (attrs, limits, replace = false) {
    let _attrs = {};
    for (let key in attrs) {
      _attrs[key] = new VariableExp(attrs[key], limits && limits[key]);
    }
    if (replace) {
      this.oAttrs = _attrs;
    } else {
      this.oAttrs = {
        ...this.oAttrs,
        ..._attrs
      };
    }

    return this;
  }

  pauseOriginalAttributes (keys) {
    this.pauseKeys = keys;
    return this;
  }

  continueOriginalAttributes (keys) {
    this.pauseKeys = this.pauseKeys.filter(item => {
      return !keys.includes(item);
    });
    return this;
  }

  removeOriginalAttributes (keys) {
    if (Object.prototype.toString.call(keys) === '[object Array]') {
      keys.forEach(key => {
        delete this.oAttrs[key];
      });
    } else {
      delete this.oAttrs[keys];
    }
    return this;
  }

  start () {
    this.isRunning = true;
  }

  pause () {
    this.isRunning = false;
  }

  mounte (consumer) {
    if (!(consumer && consumer instanceof AbstractConsumer)) {
      console.log('[MonitorProducer::mounte] mounte consumer failed, the type of consumer is not AbstractConsumer');
      return this;
    }
    this.consumer = consumer;
    this.consumer.mounted(this);
    return this;
  }

  unmounte (consumer) {
    if (this.consumer === consumer) {
      this.consumer = null;
      consumer.unmounted();
    }
    return this;
  }

  notify () {
    if (!this.consumer) return;
    while (this.eAttrs.length > 0) {
      this.consumer.consume();
    }
  }

  push (params, limits) {
    let _attrs = {};
    for (let key in params) {
      _attrs[key] = new VariableExp(params[key], limits && limits[key]);
    }
    this.eAttrs.push(_attrs);
    this.notify();
  }
}

export class AbstractConsumer {
  mounted (provider) {
    if (!(provider && provider instanceof MonitorProvider)) {
      console.log('[AbstractConsumer::mounted] mounte provider failed, the type of provider is not MonitorProvider');
      return this;
    }
    this.provider = provider;
    return this;
  }

  unmounted () {
    this.provider = null;
    return this;
  }
}

export class MonitorConsumer extends AbstractConsumer {
  constructor (
    url = '',
    frequencyBreaker = new CircuitBreaker('60/60', 5 * 60, '30/60'),
    abnormalBreaker = new CircuitBreaker('5/60', 5 * 60, '0/60')
  ) {
    super();
    this.url = url;
    this.frequencyBreaker = frequencyBreaker;
    this.abnormalBreaker = abnormalBreaker;
    this.emitFunc = null;
  }

  injectCoustumEmit (func) {
    if (Object.prototype.toString.call(func) !== '[object Function]') {
      console.error('[MonitorConsumer::injectCoustumEmit] the type of func is not Function.', Object.prototype.toString.call(func));
      return;
    }
    this.emitFunc = func;
  }

  static json2Search (obj) {
    let result = '';
    for (let key in obj) {
      result += key + '=' + encodeURIComponent(obj[key]) + '&';
    }
    result = result.substring(0, result.length - 1);
    return result;
  }

  async consume () {
    if (!this.provider || this.provider.eAttrs.length === 0) return;
    let attrs = {
      ...this.provider.oAttrs,
      ...this.provider.eAttrs.shift()
    };
    for (let key in attrs) {
      attrs[key] = await attrs[key].toString();
    }
    let actionStack = localStorage.getItem('action_stack');
    attrs.actionStack = !actionStack || isNaN(actionStack) ? 0 : parseInt(actionStack);
    attrs.actionStack++;
    localStorage.setItem('action_stack', attrs.actionStack);
    if (this.frequencyBreaker.canPass() && this.abnormalBreaker.canPass()) {
      console.log('[MonitorConsumer::consume]', attrs);
      this.frequencyBreaker.count();
      if (this.emitFunc) {
        this.emitFunc(this.url, attrs, (error) => {
          console.error('[MonitorConsumer::consume]', error);
          this.abnormalBreaker.count();
        });
      } else {
        let img = new Image();
        img.onerror = function (error) {
          console.error('[MonitorConsumer::consume]', error);
          this.abnormalBreaker.count();
        }.bind(this);
        img.src = this.url + '?' + MonitorConsumer.json2Search(attrs);
      }
    }
  }
}

export class WebTrendsMonitorConsumer extends AbstractConsumer {
  constructor (tag, Vue, options, cProvider = null, spa = true) {
    super();
    let self = this;
    this.tag = tag;
    this.isReady = false;
    this.cProvider = cProvider;
    for (let key in options) {
      options[key] = new VariableExp(options[key]);
    }
    if (spa) {
      Vue.mixin({
        beforeRouteEnter (to, from, next) {
          // ...
          console.log('[WebTrendsMonitorConsumer]', to, from);
          let mt = to.meta.MT;
          for (let key in mt) {
            options[key] = new VariableExp(mt[key]);
          }
          self.init(options);
          next();
        }
      });
    } else {
      this.init(options);
    }
  }

  async init (options) {
    for (let key in options) {
      options[key] = await options[key].toObj();
    }
    window.WTjson = window.WTjson || {};
    for (let key in options) {
      window.WTjson[key] = options[key];
    }
    this.tag.ready(() => {
      // 初始化方法
      console.log('[WebTrendsMonitorConsumer::init]', window.WTjson);
      this.tag.init();
      this.isReady = true;
      this.consume();
    });
  }

  async consume () {
    if (!this.provider || this.provider.eAttrs.length === 0 || !this.isReady) return;
    let attrs = {
      ...this.provider.oAttrs,
      ...this.provider.eAttrs.shift()
    };
    for (let key in attrs) {
      attrs[key] = await attrs[key].toObj();
    }
    console.log('[WebTrendsMonitorConsumer::consume]', attrs);
    this.tag.trackEvent(attrs.otitle, attrs.olabel, attrs.opts);
    if (this.cProvider) {
      this.cProvider.push({
        actionLevel: ACTION_LEVEL.INFO,
        action: `${attrs.olabel} ${attrs.otitle}`,
        jsErrorStack: await VariableExp.toStringStatic(attrs.opts)
      });
    }
  }
}
// ******************************** 埋点主要类，生产者和消费者 END ********************************

// ******************************** 全局无埋点 BEGIN ********************************
class TimerController {
  constructor () {
    this.timers = new Map();
  }

  setTimer (id, callback, limit = 0) {
    this.timers.set(id, {
      key: setTimeout(() => {
        callback(this.timers.get(id).tParams);
        this.delTimer(id);
      }, limit),
      startTime: new Date().getTime()
    });
    console.log('[TimerController::setTimer] timers length', this.timers.keys());
    return this;
  }

  setTimeoutParams (id, params) {
    this.timers.get(id).tParams = params;
    return this;
  }

  setDelParams (id, params) {
    this.timers.get(id).dParams = params;
    return this;
  }

  delTimer (id, callback) {
    let timer = this.timers.get(id);
    callback && callback(timer);
    clearTimeout(timer.key);
    this.timers.delete(id);
    console.log('[TimerController::delTimer] timers length', this.timers.keys());
    return this;
  }
}

export class GlobelMonitorService {
  constructor (customAction, aladdin, Vue) {
    if (customAction && Object.prototype.toString.call(customAction) !== '[object Function]') {
      throw new Error('GlobelMonitor constructor failed, the type of customAction must be Function.', Object.prototype.toString.call(customAction));
    }
    this.customAction = customAction;
    this.aladdin = aladdin;
    this.vueConfig = Vue.config;
  }

  listen2Vue (provider) {
    if (!this.vueConfig) {
      console.error('[GlobelMonitor::listen2Vue] vueConfig is not valid');
      return this;
    }
    if (!(provider && provider instanceof MonitorProvider)) {
      console.error('[MonitorConsumer::listen2Vue] the type of provider is not MonitorProducer.');
      return this;
    }
    this.vueConfig.errorHandler = (err, vm, info) => {
      this.defaultAction(ACTION_GROUP.VUE_ERROR, provider, {
        info: info,
        vm: vm,
        error: err
      });
    };
    return this;
  }

  listen2Error (provider) {
    if (!(provider && provider instanceof MonitorProvider)) {
      console.error('[MonitorConsumer::listen2Vue] the type of provider is not MonitorProducer.');
      return this;
    }
    window.addEventListener('error', (event) => {
      this.defaultAction(ACTION_GROUP.GLOBAL_ERROR, provider, event);
    });
    return this;
  }

  listen2Uncaught (provider) {
    if (!(provider && provider instanceof MonitorProvider)) {
      console.error('[MonitorConsumer::listen2Vue] the type of provider is not MonitorProducer.');
      return this;
    }
    window.addEventListener('unhandledrejection', (event) => {
      this.defaultAction(ACTION_GROUP.GLOBAL_UNCAUGHT, provider, event);
    });
    return this;
  }

  listen2Aladdin (provider) {
    if (!this.aladdin) {
      console.error('[GlobelMonitor::listen2Aladdin] aladdin is not valid.');
      return this;
    }
    if (!(provider && provider instanceof MonitorProvider)) {
      console.error('[MonitorConsumer::listen2Vue] the type of provider is not MonitorProducer.');
      return this;
    }
    let timers = new TimerController();
    this.aladdin.on('call', (params) => {
      let { args, callId } = {...params};
      if (args.filter(item => { return typeof item === 'function'; }).length > 0) {
        timers.setTimer(callId, () => {
          this.defaultAction(ACTION_GROUP.TIMEOUT, provider, {
            ...params,
            duration: '20000+'
          });
        }, 20000).setDelParams(callId, params);
      }
    });
    this.aladdin.on('callback', (params) => {
      let callId = params.handlerKey.split('_')[0];
      timers.delTimer(callId, (timer) => {
        let duration = new Date().getTime() - timer.startTime;
        if (duration > 1000 * 5) {
          this.defaultAction(ACTION_GROUP.PERFORMANCE, provider, {
            ...timer.dParams,
            duration: duration
          });
        }
      });
    });
    return this;
  }

  defaultAction (group, provider, params) {
    if (this.customAction) {
      this.customAction(group, params);
      return;
    }
    switch (group) {
      case ACTION_GROUP.GLOBAL_ERROR:
        let target = params.target;
        if (target instanceof HTMLElement && ['img', 'script', 'link'].includes(target.tagName.toLocaleLowerCase())) {
          provider.push({
            actionLevel: ACTION_LEVEL.ERROR,
            action: `资源加载异常 ${target.src}`,
            actionGroup: ACTION_GROUP.GLOBAL_ERROR
          });
        } else {
          let stack = '';
          if (!!params.error && !!params.error.stack) {
            // 如果浏览器有堆栈信息 直接使用
            stack = event.error.stack.toString();
          } else if (arguments) {
            // 尝试通过callee拿堆栈信息
            let ext = [];
            // eslint-disable-next-line no-caller
            let f = arguments.callee.caller;
            let c = 3;
            // 这里只拿三层堆栈信息
            while (f && (--c > 0)) {
              ext.push(f.Monitor.toString());
              if (f === f.caller) {
                break;// 如果有环
              }
              f = f.caller;
            }
            ext = ext.join(',');
            stack = ext;
          }
          provider.push({
            actionLevel: ACTION_LEVEL.ERROR,
            action: `发生全局错误`,
            actionGroup: ACTION_GROUP.GLOBAL_ERROR,
            jsErrorLineNo: params.lineno,
            jsErrorColumnNo: params.colno,
            jsErrorMessage: params.message,
            jsErrorFilename: params.filename,
            jsErrorStack: stack
          });
          console.log(group, params);
        }
        break;
      case ACTION_GROUP.GLOBAL_UNCAUGHT:
        provider.push({
          level: ACTION_LEVEL.ERROR,
          action: `未捕获异常`,
          actionGroup: ACTION_GROUP.GLOBAL_UNCAUGHT,
          jsErrorStack: params.reason
        });
        break;
      case ACTION_GROUP.PERFORMANCE:
        provider.push({
          actionLevel: ACTION_LEVEL.WARNING,
          action: `${params.args[0].url} ${params.duration}`,
          actionGroup: ACTION_GROUP.PERFORMANC
        });
        break;
      case ACTION_GROUP.TIMEOUT:
        provider.push({
          actionLevel: ACTION_LEVEL.ERROR,
          action: `${params.args[0].url} ${params.duration}`,
          actionGroup: ACTION_GROUP.TIMEOUT
        });
        break;
      case ACTION_GROUP.VUE_ERROR:
        let comFloor = '';
        if (params.vm) {
          let cur = params.vm;
          comFloor = params.vm.$options.name;
          while ((cur = cur.$parent)) {
            comFloor = params.vm.$options.name + '=>' + comFloor;
          }
        }
        provider.push({
          actionLevel: ACTION_LEVEL.ERROR,
          action: `${comFloor} ${params.info}`,
          actionGroup: ACTION_GROUP.TIMEOUT,
          jsErrorMessage: params.error.message,
          jsErrorLineNo: params.error.line,
          jsErrorColumnNo: params.error.colum,
          jsErrorStack: params.error.stack
        });
        break;
      default:
    }
  }
}
// ******************************** 全局无埋点 END ********************************

// ******************************** 全局变量 BEGIN ********************************
export const ACTION_LEVEL = {
  INFO: 0,
  WARNING: 1,
  ERROR: 2,
  CARSH: 3
};

export const ACTION_GROUP = {
  PERFORMANCE: 'performance',
  TIMEOUT: 'timeout',
  RESOURCE_ERROR: 'resource_error',
  VUE_ERROR: 'vue_error',
  GLOBAL_ERROR: 'global_error',
  GLOBAL_UNCAUGHT: 'global_uncaught',
  DEFAULT: 'default'
};
// ******************************** 全局变量 END ********************************
