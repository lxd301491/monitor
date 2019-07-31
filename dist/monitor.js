(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.PAMonitor = {}));
}(this, function (exports) { 'use strict';

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

    /**
     * 存储器
     * 用于存放所有埋点数据
     * appName app名字，必须
     * maxSize 最大存放种类，必须
     * maxWidth 最大并发数量
     * localization 本地化对象，必须实现getItem和setItem方法
     */
    var StoreArea = /** @class */ (function () {
        function StoreArea(appName, maxSize, maxWidth, localization) {
            this.maxSize = 6;
            this.width = 0;
            this.maxWidth = 6;
            this.storage = new Map();
            this.demandList = [];
            this.appName = appName;
            if (maxSize)
                this.maxSize = maxSize;
            if (maxWidth)
                this.maxWidth = maxWidth;
            if (localization) {
                this.localization = localization;
                this.storage = new Map(JSON.parse(this.localization.getItem(appName) || ''));
            }
        }
        StoreArea.prototype.createStore = function (storeName) {
            if (this.storage.has(storeName) && this.storage.size >= this.maxSize) {
                return;
            }
            this.storage.set(storeName, new Array());
        };
        StoreArea.prototype.delStore = function (storeName) {
            if (this.storage.has(storeName)) {
                this.storage.delete(storeName);
            }
        };
        StoreArea.prototype.demand = function (storeName) {
            if (this.storage.has(storeName) && this.width < this.maxWidth) {
                var arrStore = this.storage.get(storeName);
                if (arrStore && arrStore.length > 0) {
                    this.width++;
                    var point = arrStore.shift();
                    this.demandList.push(point.demandId);
                    if (this.localization) {
                        this.localization.setItem("" + this.appName, JSON.stringify(__spread(this.storage)));
                    }
                    return point;
                }
            }
            return null;
        };
        StoreArea.prototype.remand = function (demandId) {
            var index = this.demandList.indexOf(demandId);
            if (index > -1) {
                this.demandList.splice(index, 1);
                this.width--;
            }
        };
        StoreArea.prototype.store = function (storeName, point) {
            if (this.storage.has(storeName)) {
                var arrStore = this.storage.get(storeName);
                if (arrStore) {
                    point.demandId = storeName + "_" + Math.random().toString(32).substring(2) + new Date().getTime();
                    arrStore.push(point);
                    if (this.localization) {
                        this.localization.setItem("" + this.appName, JSON.stringify(__spread(this.storage)));
                    }
                    return true;
                }
            }
            return false;
        };
        return StoreArea;
    }());

    var VariableExp = /** @class */ (function () {
        function VariableExp(obj, limit) {
            if (limit === void 0) { limit = 0; }
            this.obj = obj;
            this.limit = limit;
        }
        VariableExp.prototype.toObj = function () {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, VariableExp.toObjStatic(this.obj)];
                        case 1:
                            target = _a.sent();
                            return [2 /*return*/, target];
                    }
                });
            });
        };
        VariableExp.prototype.toString = function () {
            return __awaiter(this, void 0, void 0, function () {
                var target;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, VariableExp.toStringStatic(this.obj)];
                        case 1:
                            target = _a.sent();
                            if (typeof this.limit === "number" && this.limit > 0) {
                                target = target.slice(0, this.limit);
                            }
                            return [2 /*return*/, target];
                    }
                });
            });
        };
        VariableExp.toObjStatic = function (obj) {
            return __awaiter(this, void 0, void 0, function () {
                var target, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = Object.prototype.toString.call(obj);
                            switch (_a) {
                                case "[object Array]": return [3 /*break*/, 1];
                                case "[object Object]": return [3 /*break*/, 1];
                                case "[object Number]": return [3 /*break*/, 1];
                                case "[object Undefined]": return [3 /*break*/, 1];
                                case "[object Boolean]": return [3 /*break*/, 1];
                                case "[object String]": return [3 /*break*/, 1];
                                case "[object Symbol]": return [3 /*break*/, 1];
                                case "[object Promise]": return [3 /*break*/, 2];
                                case "[object Function]": return [3 /*break*/, 4];
                            }
                            return [3 /*break*/, 5];
                        case 1:
                            target = obj;
                            return [3 /*break*/, 6];
                        case 2: return [4 /*yield*/, obj];
                        case 3:
                            target = _b.sent();
                            return [3 /*break*/, 6];
                        case 4:
                            target = obj();
                            return [3 /*break*/, 6];
                        case 5:
                            target = obj;
                            _b.label = 6;
                        case 6:
                            if (!["[object Function]", "[[object Promise]]"].includes(Object.prototype.toString.call(target))) return [3 /*break*/, 8];
                            return [4 /*yield*/, VariableExp.toObjStatic(target)];
                        case 7:
                            target = _b.sent();
                            _b.label = 8;
                        case 8: return [2 /*return*/, target];
                    }
                });
            });
        };
        VariableExp.toStringStatic = function (obj) {
            return __awaiter(this, void 0, void 0, function () {
                var target, type, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            target = "";
                            type = Object.prototype.toString.call(obj);
                            _a = type;
                            switch (_a) {
                                case "[object Array]": return [3 /*break*/, 1];
                                case "[object Object]": return [3 /*break*/, 1];
                                case "[object Number]": return [3 /*break*/, 2];
                                case "[object Undefined]": return [3 /*break*/, 3];
                                case "[object Boolean]": return [3 /*break*/, 4];
                                case "[object String]": return [3 /*break*/, 5];
                                case "[object Symbol]": return [3 /*break*/, 6];
                                case "[object Promise]": return [3 /*break*/, 7];
                                case "[object Function]": return [3 /*break*/, 9];
                            }
                            return [3 /*break*/, 10];
                        case 1:
                            target = JSON.stringify(obj);
                            return [3 /*break*/, 11];
                        case 2:
                            target = obj.toString();
                            return [3 /*break*/, 11];
                        case 3:
                            target = "undefined";
                            return [3 /*break*/, 11];
                        case 4:
                            target = obj ? "1" : "0";
                            return [3 /*break*/, 11];
                        case 5:
                            target = obj;
                            return [3 /*break*/, 11];
                        case 6:
                            target = obj.toString();
                            return [3 /*break*/, 11];
                        case 7: return [4 /*yield*/, obj];
                        case 8:
                            target = _b.sent();
                            return [3 /*break*/, 11];
                        case 9:
                            target = obj();
                            return [3 /*break*/, 11];
                        case 10:
                            target = "";
                            _b.label = 11;
                        case 11:
                            if (!(Object.prototype.toString.call(target) !== "[object String]")) return [3 /*break*/, 13];
                            return [4 /*yield*/, VariableExp.toStringStatic(target)];
                        case 12:
                            target = _b.sent();
                            _b.label = 13;
                        case 13: return [2 /*return*/, target];
                    }
                });
            });
        };
        return VariableExp;
    }());

    var limits = {
        userId: 20,
        roleId: 20,
        roleArr: 400,
        isWhite: 2,
        scc: 20,
        deviceId: 40,
        device: 40,
        system: 20,
        webview: 40,
        appVersion: 20,
        patchVersion: 400,
        network: 100,
        userAgent: 400,
        actionLevel: 20,
        action: 400,
        actionGroup: 100,
        actionStack: 100,
        actionTime: 20,
        routeData: 400,
        url: 200,
        referrer: 200,
        cpu: 20,
        memory: 20,
        disk: 20,
        jsErrorMessage: 200,
        jsErrorLineNo: 10,
        jsErrorColumnNo: 10,
        jsErrorStack: 4000,
        jsErrorFilename: 200
    };
    var MonitorProvider = /** @class */ (function () {
        function MonitorProvider(handler) {
            /**
             * 静态数据，添加后每个生成的埋点都会携带，除非主动发生改变
             */
            this.eternals = new Map();
            this.handler = "";
            this.limits = limits;
            this.handler = handler;
        }
        MonitorProvider.prototype.mountStore = function (store) {
            this.store = store;
        };
        MonitorProvider.prototype.mergeEternals = function (params, limits) {
            for (var key in params) {
                this.eternals.set(key, new VariableExp(params[key], limits[key] || 0));
            }
        };
        MonitorProvider.prototype.setCommonLimits = function (limits) {
            this.limits = limits;
        };
        MonitorProvider.prototype.track = function (params, limits) {
            if (limits === void 0) { limits = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var emitObj, _a, _b, _i, key, _c, _d;
                var _this = this;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            emitObj = {};
                            this.eternals.forEach(function (value, key) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            _a = emitObj;
                                            _b = key;
                                            return [4 /*yield*/, value.toString()];
                                        case 1:
                                            _a[_b] = _c.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            _a = [];
                            for (_b in params)
                                _a.push(_b);
                            _i = 0;
                            _e.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            key = _a[_i];
                            _c = emitObj;
                            _d = key;
                            return [4 /*yield*/, new VariableExp(params[key], limits[key] || this.limits[key] || 0).toString()];
                        case 2:
                            _c[_d] = _e.sent();
                            _e.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            if (this.store)
                                this.store.store(this.handler, emitObj);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return MonitorProvider;
    }());

    /**
     * 计数器
     */
    var Counter = /** @class */ (function () {
        function Counter(num) {
            if (num === void 0) { num = 0; }
            this.num = num;
        }
        Counter.prototype.get = function () {
            return this.num;
        };
        Counter.prototype.increase = function () {
            this.num++;
        };
        Counter.prototype.decrease = function () {
            this.num--;
        };
        Counter.prototype.reset = function () {
            this.num = 0;
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
            var period = parseInt(breaker.thresholdForHalfOpen[1]) * 1000;
            var now = Date.now();
            if (now >= this.startTime + period) {
                breaker.reset();
                if (breaker.getCount() > parseInt(breaker.thresholdForHalfOpen[0])) {
                    // 依然超过断路阈值, 切到 `OpenState`
                    breaker.setState(new OpenState());
                }
                else {
                    // 低于断路阈值, 切到 `CloseState`
                    breaker.setState(new CloseState());
                }
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
            var period = parseInt(breaker.thresholdForOpen[1]) * 1000;
            var now = Date.now();
            if (now >= this.startTime + period) {
                // 过了这段校验时间, 清零等待重新开始
                this.startTime = Date.now();
                breaker.reset();
            }
            if (breaker.getCount() >= parseInt(breaker.thresholdForOpen[0])) {
                // 在这段校验时间内, 超过断路阈值, 切换到 `OpenState`
                breaker.reset();
                breaker.setState(new OpenState());
            }
        };
        return CloseState;
    }(AbstractState));

    var CircuitBreaker = /** @class */ (function () {
        function CircuitBreaker(thresholdForOpen, idleTimeForOpen, thresholdForHalfOpen) {
            if (thresholdForOpen === void 0) { thresholdForOpen = "600/60"; }
            if (idleTimeForOpen === void 0) { idleTimeForOpen = 5 * 60; }
            if (thresholdForHalfOpen === void 0) { thresholdForHalfOpen = "300/60"; }
            this.idleTimeForOpen = idleTimeForOpen;
            this.thresholdForOpen = thresholdForOpen.split("/");
            this.thresholdForHalfOpen = thresholdForHalfOpen.split("/");
            this.counter = new Counter(); // max times for each 60s
            this.state = new CloseState(); // default state
        }
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
            return this.getState().canPass(this);
        };
        CircuitBreaker.prototype.count = function () {
            // 计数器 +1, 同时让 当前的 state 去做条件校验
            this.counter.increase();
            this.getState().checkout(this);
        };
        CircuitBreaker.prototype.getCount = function () {
            return this.counter.get();
        };
        return CircuitBreaker;
    }());

    var EMIT_TYPE;
    (function (EMIT_TYPE) {
        EMIT_TYPE[EMIT_TYPE["IMAGE"] = 0] = "IMAGE";
        EMIT_TYPE[EMIT_TYPE["XHR"] = 1] = "XHR";
        EMIT_TYPE[EMIT_TYPE["FETCH"] = 2] = "FETCH";
        EMIT_TYPE[EMIT_TYPE["WEBTRENDS_VISIT"] = 3] = "WEBTRENDS_VISIT";
        EMIT_TYPE[EMIT_TYPE["WEBTRENDS_CLICK"] = 4] = "WEBTRENDS_CLICK";
        EMIT_TYPE[EMIT_TYPE["CUSTOM"] = 5] = "CUSTOM";
    })(EMIT_TYPE || (EMIT_TYPE = {}));
    var ACTION_LEVEL;
    (function (ACTION_LEVEL) {
        ACTION_LEVEL[ACTION_LEVEL["INFO"] = 0] = "INFO";
        ACTION_LEVEL[ACTION_LEVEL["WARNING"] = 1] = "WARNING";
        ACTION_LEVEL[ACTION_LEVEL["ERROR"] = 2] = "ERROR";
        ACTION_LEVEL[ACTION_LEVEL["CARSH"] = 3] = "CARSH";
    })(ACTION_LEVEL || (ACTION_LEVEL = {}));
    var ACTION_GROUP;
    (function (ACTION_GROUP) {
        ACTION_GROUP["PERFORMANCE"] = "performance";
        ACTION_GROUP["TIMEOUT"] = "timeout";
        ACTION_GROUP["RESOURCE_ERROR"] = "resource_error";
        ACTION_GROUP["VUE_ERROR"] = "vue_error";
        ACTION_GROUP["GLOBAL_ERROR"] = "global_error";
        ACTION_GROUP["GLOBAL_UNCAUGHT"] = "global_uncaught";
        ACTION_GROUP["DEFAULT"] = "default";
    })(ACTION_GROUP || (ACTION_GROUP = {}));

    var globalEnum = /*#__PURE__*/Object.freeze({
        get EMIT_TYPE () { return EMIT_TYPE; },
        get ACTION_LEVEL () { return ACTION_LEVEL; },
        get ACTION_GROUP () { return ACTION_GROUP; }
    });

    var MonitorConsumer = /** @class */ (function () {
        function MonitorConsumer(handler, api, emitType) {
            this.frequencyBreaker = new CircuitBreaker("60/60", 5 * 60, "30/60");
            this.abnormalBreaker = new CircuitBreaker("5/60", 5 * 60, "0/60");
            this.emitType = EMIT_TYPE.IMAGE;
            this.handler = handler;
            this.api = api;
            if (emitType)
                this.emitType = emitType;
        }
        MonitorConsumer.prototype.mountStore = function (store) {
            this.store = store;
        };
        MonitorConsumer.prototype.injectCoustumEmit = function (func) {
            this.emitFunc = func;
        };
        MonitorConsumer.prototype.setBreaker = function (frequencyBreaker, abnormalBreaker) {
            if (frequencyBreaker)
                this.frequencyBreaker = frequencyBreaker;
            if (abnormalBreaker)
                this.abnormalBreaker = abnormalBreaker;
        };
        MonitorConsumer.prototype.start = function () {
            var _this = this;
            if (!this.timer) {
                this.timer = window.setInterval(function () {
                    if (_this.store) {
                        var point = _this.store.demand(_this.handler);
                        if (point) {
                            _this.consume(point);
                        }
                    }
                }, 20);
            }
        };
        MonitorConsumer.prototype.pause = function () {
            clearInterval(this.timer);
            this.timer = undefined;
        };
        MonitorConsumer.prototype.consume = function (point) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, err_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 13, 14, 15]);
                            _a = this.emitType;
                            switch (_a) {
                                case EMIT_TYPE.IMAGE: return [3 /*break*/, 1];
                                case EMIT_TYPE.XHR: return [3 /*break*/, 3];
                                case EMIT_TYPE.FETCH: return [3 /*break*/, 5];
                                case EMIT_TYPE.WEBTRENDS_VISIT: return [3 /*break*/, 7];
                                case EMIT_TYPE.WEBTRENDS_CLICK: return [3 /*break*/, 8];
                                case EMIT_TYPE.CUSTOM: return [3 /*break*/, 9];
                            }
                            return [3 /*break*/, 11];
                        case 1: return [4 /*yield*/, this.imageConsume(point)];
                        case 2:
                            _b.sent();
                            return [3 /*break*/, 12];
                        case 3: return [4 /*yield*/, this.xhrConsume(point)];
                        case 4:
                            _b.sent();
                            return [3 /*break*/, 12];
                        case 5: return [4 /*yield*/, this.fetchConsume(point)];
                        case 6:
                            _b.sent();
                            return [3 /*break*/, 12];
                        case 7:
                            {
                                this.visitConsume(point);
                                return [3 /*break*/, 12];
                            }
                            _b.label = 8;
                        case 8:
                            {
                                this.clickConsume(point);
                                return [3 /*break*/, 12];
                            }
                            _b.label = 9;
                        case 9:
                            if (!this.emitFunc) return [3 /*break*/, 11];
                            return [4 /*yield*/, this.emitFunc(point)];
                        case 10:
                            _b.sent();
                            return [3 /*break*/, 12];
                        case 11:
                            this.imageConsume(point);
                            _b.label = 12;
                        case 12: return [3 /*break*/, 15];
                        case 13:
                            err_1 = _b.sent();
                            this.abnormalBreaker.count();
                            return [3 /*break*/, 15];
                        case 14:
                            if (this.store)
                                this.store.remand(point.demandId);
                            return [7 /*endfinally*/];
                        case 15: return [2 /*return*/];
                    }
                });
            });
        };
        MonitorConsumer.prototype.obj2Search = function (params) {
            var result = "";
            for (var key in params) {
                result += key + "=" + encodeURIComponent(params[key]) + "&";
            }
            result = result.substring(0, result.length - 1);
            return result;
        };
        MonitorConsumer.prototype.imageConsume = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var img;
                var _this = this;
                return __generator(this, function (_a) {
                    this.frequencyBreaker.count();
                    img = new Image();
                    img.onerror = function () {
                        _this.abnormalBreaker.count();
                        return;
                    };
                    img.onload = function () {
                        return;
                    };
                    img.onabort = function () {
                        return;
                    };
                    img.src = this.api + "?" + this.obj2Search(params);
                    return [2 /*return*/];
                });
            });
        };
        MonitorConsumer.prototype.xhrConsume = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                var xhr_1;
                var _this = this;
                return __generator(this, function (_a) {
                    if (XMLHttpRequest) {
                        this.frequencyBreaker.count();
                        xhr_1 = new XMLHttpRequest();
                        xhr_1.open("POST", this.api, true);
                        xhr_1.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        xhr_1.onload = function () {
                            return;
                        };
                        xhr_1.onabort = function () {
                            return;
                        };
                        xhr_1.onerror = function (err) {
                            throw err;
                        };
                        xhr_1.onreadystatechange = function () {
                            if (xhr_1.readyState !== 4 || xhr_1.status !== 200) {
                                _this.abnormalBreaker.count();
                            }
                            return;
                        };
                        xhr_1.send(this.obj2Search(params));
                    }
                    else {
                        return [2 /*return*/];
                    }
                    return [2 /*return*/];
                });
            });
        };
        MonitorConsumer.prototype.fetchConsume = function (params) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (fetch) {
                        this.frequencyBreaker.count();
                        fetch(this.api, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            body: params,
                            mode: "cors",
                            cache: "no-cache"
                        })
                            .catch(function (err) {
                            throw err;
                        })
                            .finally(function () {
                            return;
                        });
                    }
                    else {
                        return [2 /*return*/];
                    }
                    return [2 /*return*/];
                });
            });
        };
        MonitorConsumer.prototype.visitConsume = function (params) {
            this.frequencyBreaker.count();
            window.WTjson = window.WTjson || {};
            for (var key in params) {
                window.WTjson[key] = params[key];
            }
            window._tag.ready(function () {
                window._tag.init();
            });
        };
        MonitorConsumer.prototype.clickConsume = function (params) {
            this.frequencyBreaker.count();
            window._tag.trackEvent(params.otitle, params.olabel, params.opts);
        };
        return MonitorConsumer;
    }());

    var AbstractHook = /** @class */ (function () {
        function AbstractHook(center, handler, api) {
            this.center = center;
            this.provider = this.center.register(new MonitorProvider(handler));
            this.consumer = this.center.subscribe(new MonitorConsumer(handler, api));
            this.consumer.start();
        }
        AbstractHook.getInstance = function (center, api, other) {
            if (!this.instance) {
                this.instance = new this(center, api, other);
            }
            return this.instance;
        };
        AbstractHook.prototype.getProvider = function () {
            return this.provider;
        };
        AbstractHook.prototype.getConsumer = function () {
            return this.consumer;
        };
        return AbstractHook;
    }());

    var AladdinHook = /** @class */ (function (_super) {
        __extends(AladdinHook, _super);
        function AladdinHook(center, api, aladdin) {
            var _this = _super.call(this, center, "alddinAbnormal", api) || this;
            _this.timers = [];
            aladdin.on("call", function (params) {
                var args = params.args, callId = params.callId;
                if (args.filter(function (item) {
                    return typeof item === "function";
                }).length > 0) {
                    _this.timers.push({
                        callId: callId,
                        args: args,
                        timestamp: new Date().getTime(),
                        handler: setTimeout(function () {
                            _this.provider.track({
                                actionLevel: ACTION_LEVEL.WARNING,
                                action: args[0].url + " 20000+",
                                actionGroup: ACTION_GROUP.TIMEOUT
                            });
                        }, 20000)
                    });
                }
            });
            aladdin.on("callback", function (params) {
                var callId = params.handlerKey.split("_")[0];
                var timer = _this.timers.filter(function (item) {
                    return item.callId === callId;
                });
                if (timer.length > 0)
                    timer = timer[0];
                clearTimeout(timer.handler);
                var duration = new Date().getTime() - timer.timestamp;
                if (duration > 5000) {
                    _this.provider.track({
                        actionLevel: ACTION_LEVEL.WARNING,
                        action: timer.args[0].url + " " + duration,
                        actionGroup: ACTION_GROUP.PERFORMANCE
                    });
                }
            });
            return _this;
        }
        return AladdinHook;
    }(AbstractHook));

    var GlobalErrorHook = /** @class */ (function (_super) {
        __extends(GlobalErrorHook, _super);
        function GlobalErrorHook(center, api) {
            var _this = _super.call(this, center, "windowError", api) || this;
            var self = _this;
            window.addEventListener("error", function (ev) {
                if (ev.target instanceof HTMLElement &&
                    ["img", "script", "link"].includes(ev.target.tagName.toLocaleLowerCase())) {
                    self.provider.track({
                        actionLevel: ACTION_LEVEL.ERROR,
                        action: "\u8D44\u6E90\u52A0\u8F7D\u5F02\u5E38 " + ev.target.getAttribute("src"),
                        actionGroup: ACTION_GROUP.GLOBAL_ERROR
                    });
                }
                else {
                    var stack = "";
                    if (!!ev.error && !!ev.error.stack) {
                        // 如果浏览器有堆栈信息 直接使用
                        stack = ev.error.stack.toString();
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
                    self.provider.track({
                        actionLevel: ACTION_LEVEL.ERROR,
                        action: "js\u5168\u5C40\u5F02\u5E38",
                        actionGroup: ACTION_GROUP.GLOBAL_ERROR,
                        jsErrorLineNo: ev.lineno,
                        jsErrorColumnNo: ev.colno,
                        jsErrorMessage: ev.message,
                        jsErrorFilename: ev.filename,
                        jsErrorStack: stack
                    });
                }
            });
            return _this;
        }
        return GlobalErrorHook;
    }(AbstractHook));

    var UIEventHook = /** @class */ (function (_super) {
        __extends(UIEventHook, _super);
        function UIEventHook(center, api) {
            var _this = _super.call(this, center, "uiEvent", api) || this;
            var self = _this;
            document.addEventListener("click", function (ev) {
                self.provider.track({
                    otitle: "123",
                    olabel: "12333",
                    opts: {
                        "WT.adb": "123"
                    }
                });
            });
            return _this;
        }
        return UIEventHook;
    }(AbstractHook));

    var UncaughtHook = /** @class */ (function (_super) {
        __extends(UncaughtHook, _super);
        function UncaughtHook(center, api) {
            var _this = _super.call(this, center, "windowUncaught", api) || this;
            var self = _this;
            window.addEventListener("unhandledrejection", function (ev) {
                self.provider.track({
                    level: ACTION_LEVEL.ERROR,
                    action: "\u5168\u5C40\u672A\u6355\u83B7\u5F02\u5E38",
                    actionGroup: ACTION_GROUP.GLOBAL_UNCAUGHT,
                    jsErrorStack: ev.reason
                });
            });
            return _this;
        }
        return UncaughtHook;
    }(AbstractHook));

    var VueHook = /** @class */ (function (_super) {
        __extends(VueHook, _super);
        function VueHook(center, api, Vue) {
            var _this = _super.call(this, center, "vueError", api) || this;
            Vue.config.errorHandler = function (err, vm, info) {
                var comFloor = "";
                if (vm) {
                    var cur = vm;
                    comFloor = vm.$options.name;
                    while ((cur = cur.$parent)) {
                        comFloor = vm.$options.name + "=>" + comFloor;
                    }
                }
                _this.provider.track({
                    actionLevel: ACTION_LEVEL.ERROR,
                    action: comFloor + " " + info,
                    actionGroup: ACTION_GROUP.TIMEOUT,
                    jsErrorMessage: err.message,
                    jsErrorLineNo: err.line,
                    jsErrorColumnNo: err.colum,
                    jsErrorStack: err.stack
                });
            };
            return _this;
        }
        return VueHook;
    }(AbstractHook));

    (function (HOOK_TYPE) {
        HOOK_TYPE["AladdinHook"] = "AladdinHook";
        HOOK_TYPE["GlobalErrorHook"] = "GlobalErrorHook";
        HOOK_TYPE["UIEventHook"] = "UIEventHook";
        HOOK_TYPE["UncaughtHook"] = "UncaughtHook";
        HOOK_TYPE["VueHook"] = "VueHook";
    })(exports.HOOK_TYPE || (exports.HOOK_TYPE = {}));

    var hooks = /*#__PURE__*/Object.freeze({
        get HOOK_TYPE () { return exports.HOOK_TYPE; },
        AladdinHook: AladdinHook,
        GlobalErrorHook: GlobalErrorHook,
        UIEventHook: UIEventHook,
        UncaughtHook: UncaughtHook,
        VueHook: VueHook
    });

    var MonitorCenter = /** @class */ (function () {
        function MonitorCenter(appName) {
            this.providers = [];
            this.consumers = [];
            this.store = new StoreArea(appName);
        }
        MonitorCenter.prototype.getStoreIns = function () {
            return this.store;
        };
        MonitorCenter.prototype.register = function (provider) {
            this.providers.push(provider);
            return provider;
        };
        MonitorCenter.prototype.subscribe = function (consumer) {
            this.consumers.push(consumer);
            return consumer;
        };
        MonitorCenter.prototype.launchHook = function (hookType, instanceParameters) {
            var greeter = hooks[hookType].getInstance.apply(hooks[hookType], instanceParameters);
            return greeter;
        };
        return MonitorCenter;
    }());

    exports.GlobalEnum = globalEnum;
    exports.MonitorCenter = MonitorCenter;
    exports.MonitorConsumer = MonitorConsumer;
    exports.MonitorProvider = MonitorProvider;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
