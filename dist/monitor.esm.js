import axios from 'axios';
import pako from 'pako';
import localForage from 'localforage';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var lifeCycle = {
    consume: {
        before: function () { },
        after: function () { }
    },
    track: {
        before: function () { },
        after: function () { }
    }
};
function before(target, methodName, descriptor) {
    return {
        value: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            lifeCycle[methodName] && lifeCycle[methodName].before.apply(this, args);
            return descriptor.value.apply(this, args);
        }
    };
}
function after(target, methodName, descriptor) {
    return {
        value: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, descriptor.value.apply(this, args)];
                        case 1:
                            result = _a.sent();
                            lifeCycle[methodName] && lifeCycle[methodName].after.apply(this, [result]);
                            return [2 /*return*/, result];
                    }
                });
            });
        }
    };
}
function replace(target, methodName, replacer, namespace) {
    var top = window || global || undefined;
    if (!top) {
        throw new ReferenceError("the top object is not exist");
    }
    if (!top._replace_center_)
        top._replace_center_ = {};
    var container = namespace ? top._replace_center_[namespace] ? top._replace_center_[namespace] : top._replace_center_[namespace] = {} : top._replace_center_;
    if (!container[methodName]) {
        container[methodName] = target[methodName];
        target[methodName] = replacer;
    }
}
function reduction(target, methodName, namespace) {
    var top = window || global || undefined;
    if (!top) {
        throw new ReferenceError("the top object is not exist");
    }
    if (!top._replace_center_)
        top._replace_center_ = {};
    var container = namespace ? top._replace_center_[namespace] ? top._replace_center_[namespace] : top._replace_center_[namespace] = {} : top._replace_center_;
    if (top._replace_center_[methodName]) {
        target[methodName] = container[methodName];
        delete container[methodName];
    }
}

/**
 * cookie过期时间
 */
var expiredays = 24 * 60 * 60 * 1000;
/**
 * 超长消息压缩阈值
 */
var infoLenMax = 1000;

function getBasicInfo() {
    return __assign(__assign(__assign({}, getUniqueInfo()), getConnection()), { page: window.location.href, uId: getCookie("uId") || "", rId: getCookie("rId") || "", 
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
        v: '1.1.10' });
}
function getScreen() {
    return {
        w: document.documentElement.clientWidth || document.body.clientWidth,
        h: document.documentElement.clientHeight || document.body.clientHeight
    };
}
/**
 * 获取随机数 例子:Ab23cD_1546313114
 * @param len 长度
 */
function randomString(len) {
    len = len || 10;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
        pwd = pwd + $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd + "_" + new Date().getTime();
}
/**
 * 获取cookie
 */
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return (arr[2]);
    else
        return null;
}
/**
 * 获取页面的唯一标识
 */
function getUniqueInfo() {
    var uni = getCookie("uni");
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
function perforPage() {
    if (!window.performance)
        return {};
    var timing = performance.timing;
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
    };
}
/**
 * 获取网络情况
 */
function getConnection() {
    var connection = navigator.connection;
    if (!connection) {
        return {
            ct: navigator.onLine ? "online" : "offline"
        };
    }
    var rtt = connection.rtt, downlink = connection.downlink, effectiveType = connection.effectiveType, saveData = connection.saveData;
    return {
        // 有效网络连接类型
        ct: effectiveType,
        // 估算的下行速度/带宽
        cs: downlink + "Mb/s",
        // 估算的往返时间
        cr: rtt + "ms",
        // 打开/请求数据保护模式
        csa: saveData
    };
}
function on(event, listener) {
    window.addEventListener && window.addEventListener(event, listener, true);
    window.attachEvent && window.attachEvent("on" + event, listener);
}
function off(event, listener) {
    window.removeEventListener && window.removeEventListener(event, listener);
    window.detachEvent && window.detachEvent(event, listener);
}
// 自定义事件，并dispatch
function dispatchCustomEvent(e, t) {
    var r;
    CustomEvent
        ? r = new CustomEvent(e, {
            detail: t
        })
        : ((r = window.document.createEvent("HTMLEvents")).initEvent(e, !1, !0),
            r.detail = t);
    window.dispatchEvent(r);
}
function parseHash(e) {
    return (e ? parseUrl(e.replace(/^#\/?/, "")) : "") || "[index]";
}
function parseUrl(e) {
    return e.replace(/^(https?:)?\/\//, "").replace(/\?.*$/, "");
}
function pv(provider, page) {
    provider.track({
        dot: document.title,
        dol: location.href,
        dr: document.referrer,
        dpr: window.devicePixelRatio,
        de: document.charset,
        page: page ? page : window.location.href,
        msg: "",
        ms: "pv",
        ml: "info"
    });
}

var MonitorProvider = /** @class */ (function () {
    function MonitorProvider(store) {
        this.store = store;
    }
    MonitorProvider.prototype.mountStore = function (store) {
        this.store = store;
    };
    MonitorProvider.prototype.track = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                params = __assign(__assign(__assign({}, getBasicInfo()), getConnection()), params);
                if (this.store)
                    this.store.push(params);
                return [2 /*return*/, this];
            });
        });
    };
    __decorate([
        before,
        after
    ], MonitorProvider.prototype, "track", null);
    return MonitorProvider;
}());

/**
 * 计数器
 */
var Counter = /** @class */ (function () {
    function Counter(reserved) {
        this.nums = [];
        this.reserved = reserved;
    }
    Counter.prototype.get = function () {
        var _this = this;
        var now = Date.now();
        this.nums = this.nums.filter(function (num) {
            return num > now - _this.reserved * 1000;
        });
        return this.nums.length;
    };
    Counter.prototype.increase = function () {
        var _this = this;
        var now = Date.now();
        this.nums = this.nums.filter(function (num) {
            return num > now - _this.reserved * 1000;
        });
        this.nums.push(Date.now());
    };
    Counter.prototype.decrease = function () {
        this.nums.shift();
    };
    Counter.prototype.reset = function () {
        this.nums = [];
    };
    return Counter;
}());

// 抽象状态，闭合，断路，半开路的基类，定义基本接口
var AbstractState = /** @class */ (function () {
    function AbstractState(time) {
        if (time === void 0) { time = Date.now(); }
        this.startTime = time;
    }
    AbstractState.prototype.canPass = function (breaker) {
        return true;
    };
    AbstractState.prototype.checkout = function (breaker) { };
    return AbstractState;
}());

var HalfOpenState = /** @class */ (function (_super) {
    __extends(HalfOpenState, _super);
    function HalfOpenState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HalfOpenState.prototype.canPass = function (breaker) {
        var limit = parseInt(breaker.thresholdForHalfOpen[0]);
        return breaker.getCount() <= limit;
    };
    HalfOpenState.prototype.checkout = function (breaker) {
        if (breaker.getCount() > parseInt(breaker.thresholdForHalfOpen[0])) {
            // 依然超过断路阈值, 切到 `OpenState`
            breaker.setState(new OpenState());
        }
        else {
            // 低于断路阈值, 切到 `CloseState`
            breaker.setState(new CloseState());
        }
    };
    return HalfOpenState;
}(AbstractState));

var OpenState = /** @class */ (function (_super) {
    __extends(OpenState, _super);
    function OpenState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OpenState.prototype.canPass = function () {
        return false;
    };
    OpenState.prototype.checkout = function (breaker) {
        var period = breaker.idleTimeForOpen * 1000;
        var now = Date.now();
        if (now >= this.startTime + period) {
            // 过了这段校验时间, 切换到 `HalfOpenState`
            breaker.setState(new HalfOpenState());
        }
    };
    return OpenState;
}(AbstractState));

var CloseState = /** @class */ (function (_super) {
    __extends(CloseState, _super);
    function CloseState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CloseState.prototype.canPass = function (breaker) {
        return true;
    };
    CloseState.prototype.checkout = function (breaker) {
        if (breaker.getCount() >= parseInt(breaker.thresholdForOpen[0])) {
            // 在这段校验时间内, 超过断路阈值, 切换到 `OpenState`
            breaker.setState(new OpenState());
        }
    };
    return CloseState;
}(AbstractState));

var CircuitBreaker = /** @class */ (function () {
    function CircuitBreaker(thresholdForOpen, idleTimeForOpen, thresholdForHalfOpen) {
        if (thresholdForOpen === void 0) { thresholdForOpen = "1/60"; }
        if (idleTimeForOpen === void 0) { idleTimeForOpen = 5 * 60; }
        if (thresholdForHalfOpen === void 0) { thresholdForHalfOpen = "1/60"; }
        this.idleTimeForOpen = idleTimeForOpen;
        this.thresholdForOpen = thresholdForOpen.split("/");
        this.thresholdForHalfOpen = thresholdForHalfOpen.split("/");
        this.counter = new Counter(Math.max(parseInt(this.thresholdForOpen[1]), parseInt(this.thresholdForHalfOpen[1]))); // max times for each 60s
        this.state = new CloseState(); // default state
    }
    CircuitBreaker.prototype.getStateName = function () {
        /^function\s(.*)\(/.exec(this.state.constructor + "");
        return RegExp.$1;
    };
    CircuitBreaker.prototype.getState = function () {
        return this.state;
    };
    CircuitBreaker.prototype.setState = function (state) {
        this.state = state;
    };
    CircuitBreaker.prototype.reset = function () {
        this.counter.reset();
    };
    CircuitBreaker.prototype.canPass = function () {
        this.getState().checkout(this);
        return this.getState().canPass(this);
    };
    CircuitBreaker.prototype.count = function () {
        // 计数器 +1, 同时让 当前的 state 去做条件校验
        this.counter.increase();
    };
    CircuitBreaker.prototype.getCount = function () {
        return this.counter.get();
    };
    CircuitBreaker.prototype.getDuration = function () {
        return (Date.now() - this.state.startTime) / 1000;
    };
    return CircuitBreaker;
}());

var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];

        if (isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }
};

var arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

var merge = function merge(target, source, options) {
    /* eslint no-param-reassign: 0 */
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (isArray(target)) {
            target.push(source);
        } else if (target && typeof target === 'object') {
            if ((options && (options.plainObjects || options.allowPrototypes)) || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (!target || typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
    }

    if (isArray(target) && isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                var targetItem = target[i];
                if (targetItem && typeof targetItem === 'object' && item && typeof item === 'object') {
                    target[i] = merge(targetItem, item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

var assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

var decode = function (str, decoder, charset) {
    var strWithoutPlus = str.replace(/\+/g, ' ');
    if (charset === 'iso-8859-1') {
        // unescape never throws, no try...catch needed:
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
    }
    // utf-8
    try {
        return decodeURIComponent(strWithoutPlus);
    } catch (e) {
        return strWithoutPlus;
    }
};

var encode = function encode(str, defaultEncoder, charset) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = str;
    if (typeof str === 'symbol') {
        string = Symbol.prototype.toString.call(str);
    } else if (typeof str !== 'string') {
        string = String(str);
    }

    if (charset === 'iso-8859-1') {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function ($0) {
            return '%26%23' + parseInt($0.slice(2), 16) + '%3B';
        });
    }

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

var compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    compactQueue(queue);

    return value;
};

var isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

var isBuffer = function isBuffer(obj) {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};

var combine = function combine(a, b) {
    return [].concat(a, b);
};

var utils = {
    arrayToObject: arrayToObject,
    assign: assign,
    combine: combine,
    compact: compact,
    decode: decode,
    encode: encode,
    isBuffer: isBuffer,
    isRegExp: isRegExp,
    merge: merge
};

var replace$1 = String.prototype.replace;
var percentTwenties = /%20/g;



var Format = {
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

var formats = utils.assign(
    {
        'default': Format.RFC3986,
        formatters: {
            RFC1738: function (value) {
                return replace$1.call(value, percentTwenties, '+');
            },
            RFC3986: function (value) {
                return String(value);
            }
        }
    },
    Format
);

var has$1 = Object.prototype.hasOwnProperty;

var arrayPrefixGenerators = {
    brackets: function brackets(prefix) {
        return prefix + '[]';
    },
    comma: 'comma',
    indices: function indices(prefix, key) {
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) {
        return prefix;
    }
};

var isArray$1 = Array.isArray;
var push = Array.prototype.push;
var pushToArray = function (arr, valueOrArray) {
    push.apply(arr, isArray$1(valueOrArray) ? valueOrArray : [valueOrArray]);
};

var toISO = Date.prototype.toISOString;

var defaultFormat = formats['default'];
var defaults = {
    addQueryPrefix: false,
    allowDots: false,
    charset: 'utf-8',
    charsetSentinel: false,
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    format: defaultFormat,
    formatter: formats.formatters[defaultFormat],
    // deprecated
    indices: false,
    serializeDate: function serializeDate(date) {
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
    return typeof v === 'string'
        || typeof v === 'number'
        || typeof v === 'boolean'
        || typeof v === 'symbol'
        || typeof v === 'bigint';
};

var stringify = function stringify(
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    formatter,
    encodeValuesOnly,
    charset
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (generateArrayPrefix === 'comma' && isArray$1(obj)) {
        obj = obj.join(',');
    }

    if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, 'key') : prefix;
        }

        obj = '';
    }

    if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, 'key');
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder, charset, 'value'))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (isArray$1(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (isArray$1(obj)) {
            pushToArray(values, stringify(
                obj[key],
                typeof generateArrayPrefix === 'function' ? generateArrayPrefix(prefix, key) : prefix,
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly,
                charset
            ));
        } else {
            pushToArray(values, stringify(
                obj[key],
                prefix + (allowDots ? '.' + key : '[' + key + ']'),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly,
                charset
            ));
        }
    }

    return values;
};

var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
    if (!opts) {
        return defaults;
    }

    if (opts.encoder !== null && opts.encoder !== undefined && typeof opts.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var charset = opts.charset || defaults.charset;
    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new TypeError('The charset option must be either utf-8, iso-8859-1, or undefined');
    }

    var format = formats['default'];
    if (typeof opts.format !== 'undefined') {
        if (!has$1.call(formats.formatters, opts.format)) {
            throw new TypeError('Unknown format option provided.');
        }
        format = opts.format;
    }
    var formatter = formats.formatters[format];

    var filter = defaults.filter;
    if (typeof opts.filter === 'function' || isArray$1(opts.filter)) {
        filter = opts.filter;
    }

    return {
        addQueryPrefix: typeof opts.addQueryPrefix === 'boolean' ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots: typeof opts.allowDots === 'undefined' ? defaults.allowDots : !!opts.allowDots,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults.charsetSentinel,
        delimiter: typeof opts.delimiter === 'undefined' ? defaults.delimiter : opts.delimiter,
        encode: typeof opts.encode === 'boolean' ? opts.encode : defaults.encode,
        encoder: typeof opts.encoder === 'function' ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === 'boolean' ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter: filter,
        formatter: formatter,
        serializeDate: typeof opts.serializeDate === 'function' ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === 'boolean' ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === 'function' ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults.strictNullHandling
    };
};

var stringify_1 = function (object, opts) {
    var obj = object;
    var options = normalizeStringifyOptions(opts);

    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (isArray$1(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (opts && opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
    } else if (opts && 'indices' in opts) {
        arrayFormat = opts.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (options.sort) {
        objKeys.sort(options.sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (options.skipNulls && obj[key] === null) {
            continue;
        }
        pushToArray(keys, stringify(
            obj[key],
            key,
            generateArrayPrefix,
            options.strictNullHandling,
            options.skipNulls,
            options.encode ? options.encoder : null,
            options.filter,
            options.sort,
            options.allowDots,
            options.serializeDate,
            options.formatter,
            options.encodeValuesOnly,
            options.charset
        ));
    }

    var joined = keys.join(options.delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    if (options.charsetSentinel) {
        if (options.charset === 'iso-8859-1') {
            // encodeURIComponent('&#10003;'), the "numeric entity" representation of a checkmark
            prefix += 'utf8=%26%2310003%3B&';
        } else {
            // encodeURIComponent('✓')
            prefix += 'utf8=%E2%9C%93&';
        }
    }

    return joined.length > 0 ? prefix + joined : '';
};

var has$2 = Object.prototype.hasOwnProperty;
var isArray$2 = Array.isArray;

var defaults$1 = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    charset: 'utf-8',
    charsetSentinel: false,
    comma: false,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    ignoreQueryPrefix: false,
    interpretNumericEntities: false,
    parameterLimit: 1000,
    parseArrays: true,
    plainObjects: false,
    strictNullHandling: false
};

var interpretNumericEntities = function (str) {
    return str.replace(/&#(\d+);/g, function ($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
    });
};

// This is what browsers will submit when the ✓ character occurs in an
// application/x-www-form-urlencoded body and the encoding of the page containing
// the form is iso-8859-1, or when the submitted form has an accept-charset
// attribute of iso-8859-1. Presumably also with other charsets that do not contain
// the ✓ character, such as us-ascii.
var isoSentinel = 'utf8=%26%2310003%3B'; // encodeURIComponent('&#10003;')

// These are the percent-encoded utf-8 octets representing a checkmark, indicating that the request actually is utf-8 encoded.
var charsetSentinel = 'utf8=%E2%9C%93'; // encodeURIComponent('✓')

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);
    var skipIndex = -1; // Keep track of where the utf8 sentinel was found
    var i;

    var charset = options.charset;
    if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
            if (parts[i].indexOf('utf8=') === 0) {
                if (parts[i] === charsetSentinel) {
                    charset = 'utf-8';
                } else if (parts[i] === isoSentinel) {
                    charset = 'iso-8859-1';
                }
                skipIndex = i;
                i = parts.length; // The eslint settings do not allow break;
            }
        }
    }

    for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
            continue;
        }
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults$1.decoder, charset, 'key');
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults$1.decoder, charset, 'key');
            val = options.decoder(part.slice(pos + 1), defaults$1.decoder, charset, 'value');
        }

        if (val && options.interpretNumericEntities && charset === 'iso-8859-1') {
            val = interpretNumericEntities(val);
        }

        if (val && typeof val === 'string' && options.comma && val.indexOf(',') > -1) {
            val = val.split(',');
        }

        if (part.indexOf('[]=') > -1) {
            val = isArray$2(val) ? [val] : val;
        }

        if (has$2.call(obj, key)) {
            obj[key] = utils.combine(obj[key], val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options) {
    var leaf = val;

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]' && options.parseArrays) {
            obj = [].concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (!options.parseArrays && cleanRoot === '') {
                obj = { 0: leaf };
            } else if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = options.depth > 0 && brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys that would overwrite object prototype properties
        if (!options.plainObjects && has$2.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has$2.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
};

var normalizeParseOptions = function normalizeParseOptions(opts) {
    if (!opts) {
        return defaults$1;
    }

    if (opts.decoder !== null && opts.decoder !== undefined && typeof opts.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    if (typeof opts.charset !== 'undefined' && opts.charset !== 'utf-8' && opts.charset !== 'iso-8859-1') {
        throw new Error('The charset option must be either utf-8, iso-8859-1, or undefined');
    }
    var charset = typeof opts.charset === 'undefined' ? defaults$1.charset : opts.charset;

    return {
        allowDots: typeof opts.allowDots === 'undefined' ? defaults$1.allowDots : !!opts.allowDots,
        allowPrototypes: typeof opts.allowPrototypes === 'boolean' ? opts.allowPrototypes : defaults$1.allowPrototypes,
        arrayLimit: typeof opts.arrayLimit === 'number' ? opts.arrayLimit : defaults$1.arrayLimit,
        charset: charset,
        charsetSentinel: typeof opts.charsetSentinel === 'boolean' ? opts.charsetSentinel : defaults$1.charsetSentinel,
        comma: typeof opts.comma === 'boolean' ? opts.comma : defaults$1.comma,
        decoder: typeof opts.decoder === 'function' ? opts.decoder : defaults$1.decoder,
        delimiter: typeof opts.delimiter === 'string' || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults$1.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: (typeof opts.depth === 'number' || opts.depth === false) ? +opts.depth : defaults$1.depth,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === 'boolean' ? opts.interpretNumericEntities : defaults$1.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === 'number' ? opts.parameterLimit : defaults$1.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === 'boolean' ? opts.plainObjects : defaults$1.plainObjects,
        strictNullHandling: typeof opts.strictNullHandling === 'boolean' ? opts.strictNullHandling : defaults$1.strictNullHandling
    };
};

var parse = function (str, opts) {
    var options = normalizeParseOptions(opts);

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options);
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};

var lib = {
    formats: formats,
    parse: parse,
    stringify: stringify_1
};

var MonitorConsumer = /** @class */ (function () {
    function MonitorConsumer(api, zip, emitType, func) {
        if (zip === void 0) { zip = true; }
        if (emitType === void 0) { emitType = "image"; }
        this.abnormalBreaker = new CircuitBreaker("5/60", 5 * 60, "0/60");
        if (emitType === "custom" && !func) {
            throw Error("When using custom mode, the custom function cannot be empty!");
        }
        if (emitType === "beacon" && !window.navigator.sendBeacon) {
            emitType = "fetch";
        }
        this.api = api;
        this.emitType = emitType;
        this.zip = zip;
        this.func = func;
    }
    MonitorConsumer.prototype.setAbnormalBreaker = function (abnormalBreaker) {
        this.abnormalBreaker = abnormalBreaker;
    };
    MonitorConsumer.prototype.consume = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var params, _a, _b, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this.abnormalBreaker.canPass()) {
                            console.log("abnormalBreaker count", this.abnormalBreaker.getCount(), this.abnormalBreaker.getStateName(), "Duration", this.abnormalBreaker.getDuration());
                            return [2 /*return*/];
                        }
                        params = {
                            data: encodeURIComponent(data)
                        };
                        if (this.zip && this.emitType != "image" && params.data.length > infoLenMax) {
                            console.log("data length before gzip " + params.data.length);
                            params.data = pako.gzip(params.data, { to: "string" });
                            console.log("data length after gzip " + params.data.length);
                            params.zip = true;
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 12, , 13]);
                        _a = this.emitType;
                        switch (_a) {
                            case "image": return [3 /*break*/, 2];
                            case "fetch": return [3 /*break*/, 4];
                            case "beacon": return [3 /*break*/, 6];
                            case "custom": return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 11];
                    case 2: return [4 /*yield*/, this.imageConsume(params)];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 11];
                    case 4: return [4 /*yield*/, this.fetchConsume(params)];
                    case 5:
                        _c.sent();
                        return [3 /*break*/, 11];
                    case 6: return [4 /*yield*/, this.beaconConsume(params)];
                    case 7:
                        _c.sent();
                        return [3 /*break*/, 11];
                    case 8:
                        _b = this.func;
                        if (!_b) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.func(params)];
                    case 9:
                        _b = (_c.sent());
                        _c.label = 10;
                    case 10:
                        _c.label = 11;
                    case 11: return [3 /*break*/, 13];
                    case 12:
                        err_1 = _c.sent();
                        this.abnormalBreaker.count();
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    MonitorConsumer.prototype.imageConsume = function (params) {
        var _this = this;
        var img = new Image(1, 1);
        return new Promise(function (resolve, reject) {
            img.onerror = function (err) {
                reject(err);
            };
            img.onload = function (resp) {
                resolve(resp);
            };
            img.onabort = function (resp) {
                reject(resp);
            };
            var paramsArr = [];
            for (var key in params) {
                paramsArr.push(key + "=" + params[key]);
            }
            img.src = _this.api + "?" + paramsArr.join("&");
        });
    };
    MonitorConsumer.prototype.fetchConsume = function (params) {
        return axios.post(this.api, lib.stringify(params), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    };
    MonitorConsumer.prototype.beaconConsume = function (params) {
        var _this = this;
        if (!window || !window.navigator || "function" != typeof window.navigator.sendBeacon) {
            return false;
        }
        var paramsForm = new FormData();
        for (var key in params) {
            paramsForm.append(key, params[key]);
        }
        return new Promise(function (resolve, reject) {
            window.navigator.sendBeacon(_this.api, paramsForm) ? resolve() : reject();
        });
    };
    __decorate([
        before,
        after
    ], MonitorConsumer.prototype, "consume", null);
    return MonitorConsumer;
}());

var Store = /** @class */ (function () {
    function Store(appName) {
        this.appName = appName;
        this.store = localForage.createInstance({
            name: appName,
            storeName: appName
        });
    }
    Store.prototype.destory = function () {
        this.store.dropInstance({
            name: this.appName,
            storeName: this.appName
        });
    };
    Store.prototype.shiftMore = function (size) {
        if (size === void 0) { size = 10; }
        return __awaiter(this, void 0, void 0, function () {
            var items, len, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        items = [];
                        return [4 /*yield*/, this.length()];
                    case 1:
                        len = _c.sent();
                        len = size > len ? len : size;
                        _c.label = 2;
                    case 2:
                        if (!(--len > -1)) return [3 /*break*/, 4];
                        _b = (_a = items).push;
                        return [4 /*yield*/, this._shift()];
                    case 3:
                        _b.apply(_a, [_c.sent()]);
                        return [3 /*break*/, 2];
                    case 4:
                        if (items.length === 0) {
                            return [2 /*return*/, ""];
                        }
                        items = JSON.stringify(items);
                        return [2 /*return*/, items];
                }
            });
        });
    };
    Store.prototype._shift = function () {
        return __awaiter(this, void 0, void 0, function () {
            var item, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        item = "";
                        return [4 /*yield*/, this.keys()];
                    case 1:
                        key = (_a.sent()).shift() || "";
                        return [4 /*yield*/, this.store.getItem(key)];
                    case 2:
                        item = _a.sent();
                        return [4 /*yield*/, this.store.removeItem(key)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, item];
                }
            });
        });
    };
    Store.prototype.push = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = this.appName + "_" + new Date().getTime();
                        return [4 /*yield*/, this.store.setItem(key, item)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Store.prototype.length = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.length()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Store.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.clear()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Store.prototype.keys = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.keys()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Store.prototype.iterate = function (iteratee) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.iterate(iteratee)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Store.prototype.customDriver = function (driver) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.store.defineDriver(driver);
                return [2 /*return*/];
            });
        });
    };
    return Store;
}());

var AbstractHook = /** @class */ (function () {
    function AbstractHook(provider) {
        this.provider = provider;
    }
    return AbstractHook;
}());

var ErrorHook = /** @class */ (function (_super) {
    __extends(ErrorHook, _super);
    function ErrorHook(provider) {
        var _this = _super.call(this, provider) || this;
        _this.handler = _this.listener.bind(_this);
        return _this;
    }
    ErrorHook.prototype.onError = function (event, source, lineno, colno, error) {
        setTimeout(function () {
            var stack;
            //不一定所有浏览器都支持col参数
            if (!!error && !!error.stack) {
                //如果浏览器有堆栈信息
                //直接使用
                stack = error.stack.toString();
            }
            else if (!!arguments.callee) {
                //尝试通过callee拿堆栈信息
                var ext = [];
                var f = arguments.callee.caller, c = 3;
                //这里只拿三层堆栈信息
                while (f && (--c > 0)) {
                    ext.push(f.toString());
                    if (f === f.caller) {
                        break; //如果有环
                    }
                    f = f.caller;
                }
                stack = ext.join(",");
            }
            if (event || error) {
                //把data上报到后台！
                this.provider.track({
                    file: source,
                    line: lineno,
                    col: colno,
                    stack: stack,
                    msg: error.message,
                    ms: "error",
                    ml: "error"
                });
            }
        }, 0);
        return true;
    };
    ErrorHook.prototype.listener = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        if (evt.target instanceof HTMLImageElement ||
            evt.target instanceof HTMLScriptElement ||
            evt.target instanceof HTMLLinkElement) {
            var src = evt.target instanceof HTMLImageElement ||
                evt.target instanceof HTMLScriptElement ? evt.target.src :
                evt.target instanceof HTMLLinkElement ? evt.target.href : "";
            this.provider.track({
                msg: evt.target.outerHTML,
                file: src,
                stack: evt.target.localName.toUpperCase(),
                line: 0,
                col: 0,
                ms: "error",
                ml: "error"
            });
        }
    };
    ErrorHook.prototype.watch = function () {
        replace(window, "onerror", this.onError);
        on("error", this.handler);
    };
    ErrorHook.prototype.unwatch = function () {
        reduction(window, "onerror");
        off("error", this.handler);
    };
    return ErrorHook;
}(AbstractHook));

var ActionEvent = /** @class */ (function () {
    function ActionEvent() {
    }
    return ActionEvent;
}());
var NodeEventHandlerMap = /** @class */ (function () {
    function NodeEventHandlerMap() {
    }
    return NodeEventHandlerMap;
}());
var ActionHook = /** @class */ (function (_super) {
    __extends(ActionHook, _super);
    function ActionHook(provider) {
        var _this = _super.call(this, provider) || this;
        _this.handlerMap = [];
        _this.observer = new MutationObserver(function (mutations, observer) {
            mutations.forEach(function (mutation) {
                _this.nodeBindActionHandler(mutation.target);
            });
        });
        _this.observer.observe(window.document, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ["jr-event", "jr-msg", "jr-area"]
        });
        return _this;
    }
    /**
     * 遍历当前突变的节点的子节点，所有存在action-data属性的节点挂载对应事件的监听
     * @param node
     * @param serializer
     */
    ActionHook.prototype.nodeBindActionHandler = function (node) {
        var _this = this;
        node.childNodes && node.childNodes.forEach(function (node) {
            _this.nodeBindActionHandler(node);
        });
        var actionEvents = [];
        var attributes = node.attributes || [];
        for (var i = 0, len = attributes.length; i < len; ++i) {
            var attr = void 0;
            if (attributes instanceof NamedNodeMap) {
                attr = attributes.item(i);
            }
            else {
                attr = attributes[i];
            }
            if (attr && attr.name === 'jr-event') {
                var events = attr.value.split(";");
                events.forEach(function (value) {
                    var actionEvent = new ActionEvent();
                    actionEvent.event = value;
                    actionEvents.push(actionEvent);
                });
            }
            if (attr && attr.name === 'jr-msg') {
                var msgs = attr.value.split(";");
                msgs.forEach(function (value, index) {
                    actionEvents[index].msg = value;
                });
            }
            if (attr && attr.name === 'jr-area') {
                var areas = attr.value.split(";");
                areas.forEach(function (value, index) {
                    actionEvents[index].area = value;
                });
            }
        }
        actionEvents.forEach(function (item) {
            _this.watch(node, item.event, item.msg, item.area);
        });
    };
    ActionHook.prototype.getCurrentElement = function (target) {
        var r = target.outerHTML.match("<.+?>");
        return r && r[0] || "";
    };
    ActionHook.prototype.listener = function (args, evt) {
        if (evt instanceof MouseEvent) {
            this.provider.track({
                msg: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : "",
                ms: "action",
                ml: "info",
                at: evt.type,
                el: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : undefined,
                x: evt.x,
                y: evt.y
            });
        }
        else if (evt instanceof DragEvent) {
            this.provider.track({
                msg: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : "",
                ms: "action",
                ml: "info",
                at: evt.type,
                el: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : undefined,
                x: evt.x,
                y: evt.y
            });
        }
        else if (evt instanceof TouchEvent) {
            for (var len = evt.changedTouches.length, i = 0; i < len; ++i) {
                this.provider.track({
                    msg: "" + evt.type,
                    ms: "action",
                    ml: "info",
                    at: evt.type,
                    el: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : undefined,
                    x: evt.changedTouches[i].clientX,
                    y: evt.changedTouches[i].clientY,
                    c: len > 1 ? i : undefined
                });
            }
        }
        else if (evt instanceof FocusEvent) {
            this.provider.track({
                msg: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : "",
                ms: "action",
                ml: "info",
                at: evt.type,
                el: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : undefined,
            });
        }
        else if (evt instanceof KeyboardEvent) {
            this.provider.track({
                msg: evt.type + " " + evt.key,
                ms: "action",
                ml: "info",
                at: evt.type,
                key: evt.key
            });
        }
        else if (evt instanceof InputEvent) {
            this.provider.track({
                msg: evt.inputType + " " + evt.data,
                ms: "action",
                ml: "info",
                at: evt.type
            });
        }
        else {
            this.provider.track({
                msg: "" + evt,
                ms: "action",
                ml: "info",
                at: evt.type
            });
        }
    };
    ActionHook.prototype.watch = function (selector, event) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (!selector || !event) {
            throw new Error("[ActionHook.watch] arguments with somethine error, start watch failed");
        }
        var handler = new NodeEventHandlerMap();
        handler.node = selector;
        handler.event = event;
        handler.handler = this.listener.bind(this, args);
        this.handlerMap.push(handler);
        selector && selector.addEventListener(event, handler.handler);
    };
    ActionHook.prototype.unwatch = function (selector, event) {
        for (var i = this.handlerMap.length - 1; i >= 0; i--) {
            if (this.handlerMap[i].node == selector && this.handlerMap[i].event == event) {
                if (selector) {
                    selector.removeEventListener(event, this.handlerMap[i].handler);
                }
                this.handlerMap.splice(i, 1);
            }
        }
    };
    return ActionHook;
}(AbstractHook));

var UncaughtHook = /** @class */ (function (_super) {
    __extends(UncaughtHook, _super);
    function UncaughtHook(provider) {
        var _this = _super.call(this, provider) || this;
        _this.handler = _this.listener.bind(_this);
        return _this;
    }
    UncaughtHook.prototype.listener = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        this.provider.track({
            msg: evt.reason,
            ms: "uncaught",
            ml: "error"
        });
    };
    UncaughtHook.prototype.watch = function () {
        on("unhandledrejection", this.handler);
    };
    UncaughtHook.prototype.unwatch = function () {
        off("unhandledrejection", this.handler);
    };
    return UncaughtHook;
}(AbstractHook));

var SPARouterHook = /** @class */ (function (_super) {
    __extends(SPARouterHook, _super);
    function SPARouterHook(provider) {
        var _this = _super.call(this, provider) || this;
        _this.hashchangeHandler = _this.handleHashchange.bind(_this);
        _this.historystatechangedHandler = _this.handleHistorystatechange.bind(_this);
        return _this;
    }
    SPARouterHook.prototype.hackState = function (e) {
        replace(history, e, function (data, title, url) {
            // 调用pushState或replaceState时hack Onpopstate
            replace(window, "onpopstate", function () {
                for (var r = arguments.length, a = new Array(r), o = 0; o < r; o++)
                    a[o] = arguments[o];
                return window._replace_center_.onpopstate.apply(this, a);
            });
            var referer = location.href;
            var f = window._replace_center_[e].apply(history, [data, title, url]);
            if (!url || url === referer)
                return f;
            try {
                var l = referer.split("#"), h = url.split("#"), p = parseUrl(l[0]), d = parseUrl(h[0]), g = l[1] && l[1].replace(/^\/?(.*)/, "$1"), v = h[1] && h[1].replace(/^\/?(.*)/, "$1");
                p !== d ? dispatchCustomEvent("historystatechanged", d) : g !== v && dispatchCustomEvent("historystatechanged", v);
            }
            catch (m) {
                console.log("[retcode] error in " + e + ": " + m);
            }
            return f;
        });
    };
    SPARouterHook.prototype.dehackState = function (e) {
        reduction(history, e);
        reduction(window, 'onpopstate');
    };
    SPARouterHook.prototype.handleHashchange = function (e) {
        var page = parseHash(location.hash.toLowerCase());
        pv(this.provider, page);
    };
    SPARouterHook.prototype.handleHistorystatechange = function (e) {
        var page = parseHash(e.detail.toLowerCase());
        pv(this.provider, page);
    };
    SPARouterHook.prototype.watch = function () {
        this.hackState('pushState');
        this.hackState('replaceState');
        on('hashchange', this.hashchangeHandler);
        on('historystatechanged', this.historystatechangedHandler);
    };
    SPARouterHook.prototype.unwatch = function () {
        this.dehackState('pushState');
        this.dehackState('replaceState');
        off('hashchange', this.hashchangeHandler);
        off('historystatechanged', this.historystatechangedHandler);
    };
    return SPARouterHook;
}(AbstractHook));

var PerformanceHook = /** @class */ (function (_super) {
    __extends(PerformanceHook, _super);
    function PerformanceHook(provider) {
        var _this = _super.call(this, provider) || this;
        _this.handler = _this.listener.bind(_this);
        return _this;
    }
    PerformanceHook.prototype.listener = function (evt) {
        var _this = this;
        setTimeout(function () {
            _this.provider.track(__assign(__assign({}, perforPage()), { msg: "", ms: "performance", ml: "info" }));
        }, 20);
    };
    PerformanceHook.prototype.watch = function () {
        on("load", this.handler);
    };
    PerformanceHook.prototype.unwatch = function () {
        off("load", this.handler);
    };
    return PerformanceHook;
}(AbstractHook));

var HooksFactory = /** @class */ (function () {
    function HooksFactory(provider) {
        this.hooks = new Map();
        this.provider = provider;
    }
    HooksFactory.prototype.reigster = function (key, hook) {
        var it = this.hooks.keys();
        var r;
        while (r = it.next(), !r.done) {
            if (r.value === key) {
                throw TypeError("the hook type \"" + key + "\" already exists\uFF01");
            }
        }
        this.hooks.set(key, new hook(this.provider));
        return this;
    };
    HooksFactory.prototype.watch = function (key) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a;
        if (!this.hooks.has(key)) {
            throw TypeError("hook type \"" + key + "\" does not exist, please register first\uFF01");
        }
        (_a = this.hooks.get(key)) === null || _a === void 0 ? void 0 : _a.watch.apply(_a, __spread(args));
        return this;
    };
    HooksFactory.prototype.unwatch = function (key) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var _a;
        if (!this.hooks.has(key)) {
            throw TypeError("hook type \"" + key + "\" does not exist, please register first\uFF01");
        }
        (_a = this.hooks.get(key)) === null || _a === void 0 ? void 0 : _a.unwatch.apply(_a, __spread(args));
        return this;
    };
    HooksFactory.prototype.initlize = function () {
        this.reigster("error", ErrorHook);
        this.reigster("uncaught", UncaughtHook);
        this.reigster("action", ActionHook);
        this.reigster("spa", SPARouterHook);
        this.reigster("performance", PerformanceHook);
        return this;
    };
    return HooksFactory;
}());

var MonitorCenter = /** @class */ (function () {
    function MonitorCenter(appName) {
        this.consumers = [];
        this.store = new Store(appName);
        this.provider = new MonitorProvider(this.store);
        this.hooks = new HooksFactory(this.provider).initlize();
        pv(this.provider);
    }
    MonitorCenter.prototype.start = function (period, size) {
        var _this = this;
        if (period === void 0) { period = 15000; }
        if (this.timer)
            clearInterval(this.timer);
        this.timer = window.setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.store.shiftMore(size)];
                    case 1:
                        data = _a.sent();
                        data && this.consumers.forEach(function (consumer) {
                            consumer.consume(data);
                        });
                        return [2 /*return*/];
                }
            });
        }); }, period);
    };
    MonitorCenter.prototype.stop = function () {
        clearInterval(this.timer);
        this.timer = undefined;
    };
    /**
     * 注册消费者
     * @param consumer 消费者实例
     */
    MonitorCenter.prototype.subscribe = function (api, zip, emitType, func) {
        this.consumers.push(new MonitorConsumer(api, zip, emitType, func));
        return this.consumers[this.consumers.length - 1];
    };
    MonitorCenter.prototype.getStore = function () {
        return this.store;
    };
    MonitorCenter.prototype.getProvider = function () {
        return this.provider;
    };
    return MonitorCenter;
}());

export { AbstractHook, CircuitBreaker, MonitorCenter, lifeCycle };
