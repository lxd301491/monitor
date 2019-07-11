import { CircuitBreaker } from './CircuitBreaker';

// 抽象状态，闭合，断路，半开路的基类，定义基本接口
export class AbstractState {
  startTime: number;

  constructor (time: number = Date.now()) {
    this.startTime = time;
  }

  canPass(breaker: CircuitBreaker): boolean {
    return true;
  }

  checkout (breaker: CircuitBreaker): void {

  }
}