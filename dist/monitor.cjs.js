'use strict';

/**
 * 计数器
 */
class Counter {
    constructor(num = 0) {
        this.num = num;
    }
    get() {
        return this.num;
    }
    increase() {
        this.num += 1;
    }
    reset() {
        this.num = 0;
    }
}

// 抽象状态，闭合，断路，半开路的基类，定义基本接口
class AbstractState {
    constructor(time = Date.now()) {
        this.startTime = time;
    }
    canPass(breaker) {
        return true;
    }
    checkout(breaker) {
    }
}

class HalfOpenState extends AbstractState {
    canPass(breaker) {
        let limit = parseInt(breaker.thresholdForHalfOpen[0]);
        return breaker.getCount() <= limit;
    }
    checkout(breaker) {
        let period = parseInt(breaker.thresholdForHalfOpen[1]) * 1000;
        let now = Date.now();
        if (now >= this.startTime + period) {
            breaker.reset();
            if (breaker.getCount() > parseInt(breaker.thresholdForHalfOpen[0])) { // 依然超过断路阈值, 切到 `OpenState`
                breaker.setState(new OpenState());
            }
            else { // 低于断路阈值, 切到 `CloseState`
                breaker.setState(new CloseState());
            }
        }
    }
}

class OpenState extends AbstractState {
    canPass() {
        return false;
    }
    checkout(breaker) {
        let period = breaker.idleTimeForOpen * 1000;
        let now = Date.now();
        if (now >= this.startTime + period) { // 过了这段校验时间, 切换到 `HalfOpenState`
            breaker.setState(new HalfOpenState());
        }
    }
}

class CloseState extends AbstractState {
    canPass(breaker) {
        return true;
    }
    checkout(breaker) {
        let period = parseInt(breaker.thresholdForOpen[1]) * 1000;
        let now = Date.now();
        if (now >= this.startTime + period) { // 过了这段校验时间, 清零等待重新开始
            this.startTime = Date.now();
            breaker.reset();
        }
        if (breaker.getCount() >= parseInt(breaker.thresholdForOpen[0])) { // 在这段校验时间内, 超过断路阈值, 切换到 `OpenState`
            breaker.reset();
            breaker.setState(new OpenState());
        }
    }
}

class CircuitBreaker {
    constructor(thresholdForOpen = '600/60', idleTimeForOpen = 5 * 60, thresholdForHalfOpen = '300/60') {
        this.idleTimeForOpen = idleTimeForOpen;
        this.thresholdForOpen = thresholdForOpen.split('/');
        this.thresholdForHalfOpen = thresholdForHalfOpen.split('/');
        this.counter = new Counter(); // max times for each 60s
        this.state = new CloseState(); // default state
    }
    getState() {
        return this.state;
    }
    setState(state) {
        this.state = state;
    }
    reset() {
        this.counter.reset();
    }
    canPass() {
        return this.getState().canPass(this);
    }
    count() {
        // 计数器 +1, 同时让 当前的 state 去做条件校验
        this.counter.increase();
        this.getState().checkout(this);
    }
    getCount() {
        return this.counter.get();
    }
}

module.exports = CircuitBreaker;
