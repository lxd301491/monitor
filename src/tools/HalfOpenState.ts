import { AbstractState } from "./AbstractState";
import { OpenState } from "./OpenState";
import { CloseState } from "./CloseState";
import { CircuitBreaker } from "./CircuitBreaker";

export class HalfOpenState extends AbstractState {
  canPass(breaker: CircuitBreaker): boolean {
    let limit = parseInt(breaker.thresholdForHalfOpen[0]);
    return breaker.getCount() <= limit;
  }

  checkout(breaker: CircuitBreaker): void {
    if (breaker.getCount() > parseInt(breaker.thresholdForHalfOpen[0])) {
      // 依然超过断路阈值, 切到 `OpenState`
      breaker.setState(new OpenState());
    } else {
      // 低于断路阈值, 切到 `CloseState`
      breaker.setState(new CloseState());
    }
  }
}
