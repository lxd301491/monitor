import { AbstractState } from "./AbstractState";
import { Counter } from "./Counter";
import { CloseState } from "./CloseState";

export class CircuitBreaker {
  /**
   * @param thresholdForOpen {string} format: '600/60'
   * '600/60' for instance, it means maximum allowable request is 600 times per 60 seconds, or the breaker will switch to OpenState
   */
  idleTimeForOpen: number;

  /**
   * @param idleTimeForOpen {number} unit: second
   * 600 for instance, it means if the breaker switched to OpenState, it will keep for 600 seconds
   */
  thresholdForOpen: Array<string>;

  /**
   * @param thresholdForHalfOpen {string} format: '300/60'
   * '300/60' for instance, it means the breaker will switch to OpenState if the maximum number of requests exceeds 300 per 60 seconds,
   * or the breaker switch to CloseState
   */
  thresholdForHalfOpen: Array<string>;

  counter: Counter;

  state: AbstractState;

  constructor(
    thresholdForOpen = "600/60",
    idleTimeForOpen = 5 * 60,
    thresholdForHalfOpen = "300/60"
  ) {
    this.idleTimeForOpen = idleTimeForOpen;
    this.thresholdForOpen = thresholdForOpen.split("/");
    this.thresholdForHalfOpen = thresholdForHalfOpen.split("/");
    this.counter = new Counter(); // max times for each 60s
    this.state = new CloseState(); // default state
  }

  getState(): AbstractState {
    return this.state;
  }

  setState(state: AbstractState): void {
    this.state = state;
  }

  reset(): void {
    this.counter.reset();
  }

  canPass(): boolean {
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