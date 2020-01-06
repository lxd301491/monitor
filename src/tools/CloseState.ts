import { AbstractState } from "./AbstractState";
import { OpenState } from "./OpenState";
import { CircuitBreaker } from "./CircuitBreaker";

export class CloseState extends AbstractState {
  canPass(breaker: CircuitBreaker) {
    return true;
  }

  checkout(breaker: CircuitBreaker): void {
    if (breaker.getCount() >= parseInt(breaker.thresholdForOpen[0])) {
      // 在这段校验时间内, 超过断路阈值, 切换到 `OpenState`
      breaker.setState(new OpenState());
    }
  }
}
