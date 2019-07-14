import { AbstractState } from './AbstractState';
import { HalfOpenState } from './HalfOpenState';
import { CircuitBreaker } from './CircuitBreaker';

export class OpenState extends AbstractState {
  canPass () {
    return false;
  }

  checkout (breaker: CircuitBreaker): void {
    let period = breaker.idleTimeForOpen * 1000;
    let now = Date.now();
    if (now >= this.startTime + period) { // 过了这段校验时间, 切换到 `HalfOpenState`
      breaker.setState(new HalfOpenState());
    }
  }
}