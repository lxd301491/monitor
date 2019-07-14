import { AbstractState } from './AbstractState';
import { OpenState } from './OpenState';
import { CircuitBreaker } from './CircuitBreaker';

export class CloseState extends AbstractState {
  canPass (breaker: CircuitBreaker) {
    return true;
  }

  checkout (breaker: CircuitBreaker): void {
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