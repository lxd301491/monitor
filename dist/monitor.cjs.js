'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var axios = _interopDefault(require('axios'));
var pako = _interopDefault(require('pako'));
var localForage = _interopDefault(require('localforage'));

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

function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
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
function replace(target, methodName, replacer) {
    if (!window._replace_center_)
        window._replace_center_ = {};
    if (!window._replace_center_[methodName]) {
        window._replace_center_[methodName] = target[methodName];
        target[methodName] = replacer;
    }
}
function reduction(target, methodName) {
    if (!window._replace_center_)
        window._replace_center_ = {};
    if (window._replace_center_[methodName]) {
        target[methodName] = window._replace_center_[methodName];
        window._replace_center_[methodName] = undefined;
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
    return __assign({}, getUniqueInfo(), getConnection(), { page: window.location.href, uId: getCookie("uId") || "", rId: getCookie("rId") || "", msg: "", ms: "unkown", ml: "info", 
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
        v: '1.0.19' });
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
function on(event, listener, remove) {
    if (window.addEventListener) {
        window.addEventListener(event, function eventHandle(ev) {
            remove && window.removeEventListener(event, eventHandle, true);
            listener.call(this, ev);
        }, true);
    }
    if (window.attachEvent) {
        window.attachEvent("on" + event, function eventHandle(ev) {
            remove && window.detachEvent("on" + event, eventHandle);
            listener.call(this, ev);
        });
    }
}
function off(event, listener) {
    if (window.removeEventListener) {
        window.removeEventListener(event, listener);
    }
    if (window.detachEvent) {
        window.detachEvent(event, listener);
    }
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
    provider.track(__assign({}, getBasicInfo(), { dot: document.title, dol: location.href, dr: document.referrer, dpr: window.devicePixelRatio, de: document.charset, page: page ? page : window.location.href, ms: "pv", ml: "info" }));
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
                params = __assign({}, params, getConnection());
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

var MonitorConsumer = /** @class */ (function () {
    function MonitorConsumer(api, store, emitType, fetch) {
        if (emitType === void 0) { emitType = "image"; }
        if (fetch === void 0) { fetch = axios; }
        this.abnormalBreaker = new CircuitBreaker("5/60", 5 * 60, "0/60");
        if (emitType === "xhr" && !XMLHttpRequest) {
            throw ReferenceError("EmitType is XHR,but XMLHttpRequest is undefined");
        }
        if (emitType === "fetch" && !fetch) {
            throw ReferenceError("EmitType is FETCH,but fetch object is undefined");
        }
        this.api = api;
        this.store = store;
        this.emitType = emitType;
        this.fetch = fetch;
    }
    MonitorConsumer.prototype.mountStore = function (store) {
        this.store = store;
    };
    MonitorConsumer.prototype.setAbnormalBreaker = function (abnormalBreaker) {
        this.abnormalBreaker = abnormalBreaker;
    };
    MonitorConsumer.prototype.start = function (period, storeParams) {
        var _this = this;
        if (period === void 0) { period = 15000; }
        if (this.timer)
            clearInterval(this.timer);
        this.timer = window.setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.abnormalBreaker.canPass()) {
                            console.log("abnormalBreaker count", this.abnormalBreaker.getCount(), this.abnormalBreaker.getStateName(), "Duration", this.abnormalBreaker.getDuration());
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.store.shiftMore(storeParams && storeParams.size)];
                    case 1:
                        data = _a.sent();
                        if (data) {
                            this.consume(data, storeParams && storeParams.zip);
                        }
                        return [2 /*return*/];
                }
            });
        }); }, period);
    };
    MonitorConsumer.prototype.stop = function () {
        clearInterval(this.timer);
        this.timer = undefined;
    };
    MonitorConsumer.prototype.consume = function (data, zip) {
        if (zip === void 0) { zip = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (zip && data.length > infoLenMax) {
                            console.log("data length before gzip " + data.length);
                            data = encodeURIComponent(data);
                            data = pako.gzip(data, { to: "string" });
                            console.log("data length after gzip " + data.length);
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 11, , 12]);
                        _a = this.emitType;
                        switch (_a) {
                            case "image": return [3 /*break*/, 2];
                            case "xhr": return [3 /*break*/, 4];
                            case "fetch": return [3 /*break*/, 6];
                            case "beacon": return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 10];
                    case 2: return [4 /*yield*/, this.imageConsume(data)];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 4: return [4 /*yield*/, this.xhrConsume(data)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 6: return [4 /*yield*/, this.fetchConsume(data)];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 8: return [4 /*yield*/, this.beaconConsume(data)];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 10];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        err_1 = _b.sent();
                        this.abnormalBreaker.count();
                        return [3 /*break*/, 12];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    MonitorConsumer.prototype.imageConsume = function (data) {
        var _this = this;
        var img = new Image();
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
            img.src = _this.api + "?data=" + data;
        });
    };
    MonitorConsumer.prototype.xhrConsume = function (data) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.api, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        return new Promise(function (resolve, reject) {
            xhr.onload = function (resp) {
                resolve(resp);
            };
            xhr.onabort = function (resp) {
                resolve(resp);
            };
            xhr.onerror = function (err) {
                reject(err);
            };
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4 || xhr.status !== 200) {
                    reject(xhr.readyState);
                }
            };
            xhr.send(JSON.stringify({
                data: data
            }));
        });
    };
    MonitorConsumer.prototype.fetchConsume = function (data) {
        if (!this.fetch) {
            return false;
        }
        return this.fetch.post(this.api, {
            data: data
        });
    };
    MonitorConsumer.prototype.beaconConsume = function (data) {
        var _this = this;
        if (!window || !window.navigator || "function" != typeof window.navigator.sendBeacon) {
            return false;
        }
        return new Promise(function (resolve, reject) {
            window.navigator.sendBeacon(_this.api, JSON.stringify({
                data: data
            })) ? resolve() : reject();
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
        if (size === void 0) { size = 0; }
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

var NativeHook = /** @class */ (function (_super) {
    __extends(NativeHook, _super);
    function NativeHook() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NativeHook.prototype.handleCall = function () {
        window._replace_center_.call.apply(this, arguments);
        console.log("call", arguments);
    };
    NativeHook.prototype.handleCallBack = function () {
        window._replace_center_.callback.apply(this, arguments);
        console.log("callback", arguments);
    };
    NativeHook.prototype.watch = function (nativeBridge) {
        this.nativeBridge = nativeBridge || this.nativeBridge;
        if (!this.nativeBridge) {
            throw Error("NativeHook can not start watch, has not initlized");
        }
        replace(this.nativeBridge, "call", this.handleCall.bind(this.nativeBridge));
        replace(this.nativeBridge, "callback", this.handleCallBack.bind(this.nativeBridge));
    };
    NativeHook.prototype.unwatch = function () {
        reduction(this.nativeBridge, "call");
        reduction(this.nativeBridge, "callback");
    };
    return NativeHook;
}(AbstractHook));

var ErrorHook = /** @class */ (function (_super) {
    __extends(ErrorHook, _super);
    function ErrorHook() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ErrorHook.prototype.listener = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        if (evt.target instanceof HTMLImageElement ||
            evt.target instanceof HTMLScriptElement ||
            evt.target instanceof HTMLLinkElement) {
            var src = evt.target instanceof HTMLImageElement ||
                evt.target instanceof HTMLScriptElement ? evt.target.src :
                evt.target instanceof HTMLLinkElement ? evt.target.href : "";
            this.provider.track(__assign({}, getBasicInfo(), { msg: evt.target.outerHTML, file: src, stack: evt.target.localName.toUpperCase(), line: 0, col: 0, ms: "error", ml: "error" }));
        }
        else {
            var stack = "";
            if (!!evt.error && !!evt.error.stack) {
                // 如果浏览器有堆栈信息 直接使用
                stack = evt.error.stack.toString();
            }
            else if (arguments) {
                // 尝试通过callee拿堆栈信息
                var ext = [];
                // eslint-disable-next-line no-caller
                var f = arguments.callee.caller;
                var c = 3;
                // 这里只拿三层堆栈信息
                while (f && --c > 0) {
                    ext.push(f.toString());
                    if (f === f.caller) {
                        break; // 如果有环
                    }
                    f = f.caller;
                }
                stack = ext.join(",");
            }
            this.provider.track(__assign({}, getBasicInfo(), { file: evt.filename, line: evt.lineno, col: evt.colno, stack: stack, msg: evt.message, ms: "error", ml: "error" }));
        }
    };
    ErrorHook.prototype.watch = function (container) {
        on("error", this.listener.bind(this));
    };
    ErrorHook.prototype.unwatch = function () {
        off("error", this.listener.bind(this));
    };
    return ErrorHook;
}(AbstractHook));

var actions = ["click", "input", "blur"];

var ActionHook = /** @class */ (function (_super) {
    __extends(ActionHook, _super);
    function ActionHook() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ActionHook.prototype.getCurrentElement = function (target) {
        var r = target.outerHTML.match("<.+?>");
        return r && r[0] || "";
    };
    ActionHook.prototype.listener = function (evt) {
        if (evt instanceof MouseEvent) {
            this.provider.track(__assign({}, getBasicInfo(), { msg: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : "", ms: "action", ml: "info", at: evt.type, el: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : undefined, x: evt.x, y: evt.y }));
        }
        else if (evt instanceof FocusEvent) {
            this.provider.track(__assign({}, getBasicInfo(), { msg: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : "", ms: "action", ml: "info", at: evt.type, el: evt.target instanceof HTMLElement ? this.getCurrentElement(evt.target) : undefined }));
        }
        else if (evt instanceof KeyboardEvent) {
            this.provider.track(__assign({}, getBasicInfo(), { msg: evt.type + " " + evt.key, ms: "action", ml: "info", at: evt.type, key: evt.key }));
        }
        else if (evt instanceof InputEvent) {
            this.provider.track(__assign({}, getBasicInfo(), { msg: evt.inputType + " " + evt.data, ms: "action", ml: "info", at: evt.type, key: evt.data || "" }));
        }
    };
    ActionHook.prototype.watch = function (container) {
        var e_1, _a;
        try {
            for (var actions_1 = __values(actions), actions_1_1 = actions_1.next(); !actions_1_1.done; actions_1_1 = actions_1.next()) {
                var action = actions_1_1.value;
                on(action, this.listener.bind(this));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (actions_1_1 && !actions_1_1.done && (_a = actions_1.return)) _a.call(actions_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    ActionHook.prototype.unwatch = function () {
        var e_2, _a;
        try {
            for (var actions_2 = __values(actions), actions_2_1 = actions_2.next(); !actions_2_1.done; actions_2_1 = actions_2.next()) {
                var action = actions_2_1.value;
                off(action, this.listener.bind(this));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (actions_2_1 && !actions_2_1.done && (_a = actions_2.return)) _a.call(actions_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    return ActionHook;
}(AbstractHook));

var UncaughtHook = /** @class */ (function (_super) {
    __extends(UncaughtHook, _super);
    function UncaughtHook() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UncaughtHook.prototype.listener = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        this.provider.track(__assign({}, getBasicInfo(), { msg: evt.reason, ms: "uncaught", ml: "error" }));
    };
    UncaughtHook.prototype.watch = function (container) {
        on("unhandledrejection", this.listener.bind(this));
    };
    UncaughtHook.prototype.unwatch = function () {
        off("unhandledrejection", this.listener.bind(this));
    };
    return UncaughtHook;
}(AbstractHook));

var SPARouterHook = /** @class */ (function (_super) {
    __extends(SPARouterHook, _super);
    function SPARouterHook() {
        return _super !== null && _super.apply(this, arguments) || this;
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
    SPARouterHook.prototype.watch = function (container) {
        this.hackState('pushState');
        this.hackState('replaceState');
        on('hashchange', this.handleHashchange.bind(this));
        on('historystatechanged', this.handleHistorystatechange.bind(this));
    };
    SPARouterHook.prototype.unwatch = function () {
        this.dehackState('pushState');
        this.dehackState('replaceState');
        off('hashchange', this.handleHashchange.bind(this));
        off('historystatechanged', this.handleHistorystatechange.bind(this));
    };
    return SPARouterHook;
}(AbstractHook));

var PerformanceHook = /** @class */ (function (_super) {
    __extends(PerformanceHook, _super);
    function PerformanceHook() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PerformanceHook.prototype.listener = function (evt) {
        var _this = this;
        setTimeout(function () {
            _this.provider.track(__assign({}, getBasicInfo(), perforPage()));
        }, 20);
    };
    PerformanceHook.prototype.watch = function (container) {
        on("load", this.listener.bind(this));
    };
    PerformanceHook.prototype.unwatch = function () {
        off("load", this.listener.bind(this));
    };
    return PerformanceHook;
}(AbstractHook));

var VueHook = /** @class */ (function (_super) {
    __extends(VueHook, _super);
    function VueHook() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VueHook.prototype.watch = function (container) {
        var _this = this;
        this.vue = container || this.vue;
        if (!this.vue) {
            throw Error("VueHook can not start watch, has not initlized");
        }
        this.vue.config.errorHandler = function (err, vm, info) {
            var comFloor = "";
            if (vm) {
                var cur = vm;
                comFloor = vm.$options.name;
                while ((cur = cur.$parent)) {
                    comFloor = vm.$options.name + "=>" + comFloor;
                }
            }
            _this.provider && _this.provider.track(__assign({}, getBasicInfo(), { msg: err.name + " " + err.message, file: comFloor + " " + info, stack: err.stack, ms: "vue", ml: "error" }));
        };
    };
    VueHook.prototype.unwatch = function () {
        delete this.vue.config.errorHandler;
    };
    return VueHook;
}(AbstractHook));

var HooksStore = /** @class */ (function () {
    function HooksStore(provider) {
        this.hooks = new Map();
        this.hooks.set("native", new NativeHook(provider));
        this.hooks.set("error", new ErrorHook(provider));
        this.hooks.set("action", new ActionHook(provider));
        this.hooks.set("uncaught", new UncaughtHook(provider));
        this.hooks.set("spa", new SPARouterHook(provider));
        this.hooks.set("performance", new PerformanceHook(provider));
        this.hooks.set("vue", new VueHook(provider));
    }
    HooksStore.prototype.getHooks = function () {
        return this.hooks;
    };
    return HooksStore;
}());

var MonitorCenter = /** @class */ (function () {
    function MonitorCenter(appName) {
        this.store = new Store(appName);
        this.provider = new MonitorProvider(this.store);
        this.hooks = new HooksStore(this.provider);
        pv(this.provider);
    }
    /**
     * 注册消费者
     * @param consumer 消费者实例
     */
    MonitorCenter.prototype.subscribe = function (api, emitType, fetch) {
        if (!this.store) {
            throw new ReferenceError("The init method has not be invoked, please invoke it before this");
        }
        this.consumer = new MonitorConsumer(api, this.store, emitType, fetch);
        return this.consumer;
    };
    MonitorCenter.prototype.getStore = function () {
        return this.store;
    };
    MonitorCenter.prototype.getProvider = function () {
        return this.provider;
    };
    MonitorCenter.prototype.getConsumer = function () {
        return this.consumer;
    };
    MonitorCenter.prototype.watch = function (type, container) {
        var hook = this.hooks.getHooks().get(type);
        if (hook)
            hook.watch(container);
    };
    MonitorCenter.prototype.unwatch = function (type) {
        var hook = this.hooks.getHooks().get(type);
        if (hook) {
            hook.unwatch();
        }
    };
    return MonitorCenter;
}());

exports.CircuitBreaker = CircuitBreaker;
exports.MonitorCenter = MonitorCenter;
exports.lifeCycle = lifeCycle;
