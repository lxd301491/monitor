'use strict';

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

// 抽象状态，闭合，断路，半开路的基类，定义基本接口
var AbstractState = /** @class */ (function () {
    function AbstractState(time) {
        if (time === void 0) { time = Date.now(); }
        this.startTime = time;
    }
    AbstractState.prototype.canPass = function (breaker) {
        return true;
    };
    AbstractState.prototype.checkout = function (breaker) {
    };
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
            if (breaker.getCount() > parseInt(breaker.thresholdForHalfOpen[0])) { // 依然超过断路阈值, 切到 `OpenState`
                breaker.setState(new OpenState());
            }
            else { // 低于断路阈值, 切到 `CloseState`
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
        if (now >= this.startTime + period) { // 过了这段校验时间, 切换到 `HalfOpenState`
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
        if (now >= this.startTime + period) { // 过了这段校验时间, 清零等待重新开始
            this.startTime = Date.now();
            breaker.reset();
        }
        if (breaker.getCount() >= parseInt(breaker.thresholdForOpen[0])) { // 在这段校验时间内, 超过断路阈值, 切换到 `OpenState`
            breaker.reset();
            breaker.setState(new OpenState());
        }
    };
    return CloseState;
}(AbstractState));

var CircuitBreaker = /** @class */ (function () {
    function CircuitBreaker(thresholdForOpen, idleTimeForOpen, thresholdForHalfOpen) {
        if (thresholdForOpen === void 0) { thresholdForOpen = '600/60'; }
        if (idleTimeForOpen === void 0) { idleTimeForOpen = 5 * 60; }
        if (thresholdForHalfOpen === void 0) { thresholdForHalfOpen = '300/60'; }
        this.idleTimeForOpen = idleTimeForOpen;
        this.thresholdForOpen = thresholdForOpen.split('/');
        this.thresholdForHalfOpen = thresholdForHalfOpen.split('/');
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
                        if (!(["[object Function]", "[[object Promise]]"].indexOf(Object.prototype.toString.call(target)) > -1)) return [3 /*break*/, 8];
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

var MonitorProvider = /** @class */ (function () {
    function MonitorProvider(storage, length) {
        this.handler = Math.random()
            .toString(36)
            .substring(2);
        /**
         * 静态数据，添加后每个生成的埋点都会携带，除非主动发生改变
         */
        this.eternals = {};
        this.length = 10;
        if (storage &&
            typeof storage.setItem === "function" &&
            typeof storage.getItem === "function") {
            this.storage = storage;
        }
        this.length = length || 0;
    }
    MonitorProvider.prototype.mergeEternals = function (params, limits) {
        return __awaiter(this, void 0, void 0, function () {
            var tempObj, key;
            return __generator(this, function (_a) {
                tempObj = {};
                for (key in params) {
                    tempObj[key] = new VariableExp(params[key], limits[key] || 0);
                }
                this.eternals = __assign({}, this.eternals, tempObj);
                return [2 /*return*/];
            });
        });
    };
    MonitorProvider.prototype.mounte = function (center) {
        if (!center) {
            this.center = center;
        }
        return this.handler;
    };
    MonitorProvider.prototype.push = function (params, limits) { };
    return MonitorProvider;
}());

var Queue = /** @class */ (function () {
    function Queue(capacity) {
        this.elements = new Array();
        this._size = capacity;
    }
    Queue.prototype.push = function (o) {
        if (o == null) {
            return false;
        }
        //如果传递了size参数就设置了队列的大小
        if (this._size != undefined && !isNaN(this._size)) {
            if (this.elements.length == this._size) {
                this.pop();
            }
        }
        this.elements.unshift(o);
        return true;
    };
    Queue.prototype.pop = function () {
        return this.elements.pop();
    };
    Queue.prototype.size = function () {
        return this.elements.length;
    };
    Queue.prototype.empty = function () {
        return this.size() == 0;
    };
    Queue.prototype.clear = function () {
        delete this.elements;
        this.elements = new Array();
    };
    return Queue;
}());

var MonitorCenter = /** @class */ (function () {
    function MonitorCenter(concurrent) {
        this.providers = [];
        this.consumers = [];
        this.concurrent = 5;
        this.counter = new Counter();
        this.paramQueue = new Queue(100);
        this.curParam = undefined;
        this.curConsumerIndex = 0;
        this.concurrent = concurrent;
    }
    MonitorCenter.prototype.register = function (provider) {
        var handler = provider.mounte(this);
        this.providers.push(provider);
        return handler;
    };
    MonitorCenter.prototype.subscribe = function (consumer) {
        return consumer;
    };
    MonitorCenter.prototype.distribute = function (params) {
        this.paramQueue.push(params);
    };
    MonitorCenter.prototype.process = function () {
        var _this = this;
        setInterval(function () {
            _this.curParam = _this.curParam || _this.paramQueue.pop();
            if (_this.curParam) {
                _this.consumers.forEach(function (item, index) {
                    while (_this.counter.get() < _this.concurrent) {
                        if (item.checkHandler(_this.curParam.handler) &&
                            _this.curConsumerIndex < index) {
                            _this.curConsumerIndex = index;
                            _this.counter.increase();
                            item.notify(_this.curParam.params);
                        }
                    }
                });
            }
        }, 20);
    };
    return MonitorCenter;
}());

var index = {
    CircuitBreaker: CircuitBreaker,
    MonitorProvider: MonitorProvider,
    MonitorCenter: MonitorCenter
};

module.exports = index;
