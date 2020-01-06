import { AbstractHook } from "./AbstractHook";
import { replace, reduction } from "../decorators/LifeCycle";
import { randomString, getBasicInfo, getConnection } from "../tools";
export class NativeHook extends AbstractHook {
  private nativeBridge: any;
  private handlers: Map<string, number> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private delta: number = 3;
  private deltaMax: number = 15;

  private clearCallFlag(callFlag: string) {
    this.handlers.delete(callFlag);
    this.timers.delete(callFlag);
  }

  private handleCall(component: string, action: string, opts?: {}, callback?: Function) {
    if (callback) {
      let callFlag = randomString(15);
      this.handlers.set(callFlag, Date.now());
      this.timers.set(callFlag, setTimeout(function() {
        self.provider.track({
          ...getBasicInfo(),
          ...getConnection(),
          msg: `${component}.${action} args ${JSON.stringify(opts)}, callback take over 15s`,
          ms: 'native',
          ml: 'warning'
        });
        self.clearCallFlag(callFlag);
      }, this.deltaMax * 1000))
      let _callback = callback;
      let self = this;
      callback = function() {
        let delta = Date.now() - (self.handlers.get(callFlag) || Date.now());
        if (delta > self.delta * 1000) {
          self.provider.track({
            ...getBasicInfo(),
            ...getConnection(),
            msg: `${component}.${action} args ${JSON.stringify(opts)}, callback take ${delta}ms`,
            ms: 'native',
            ml: 'info'
          });
        }
        let timer = self.timers.get(callFlag);
        if (timer) {
          clearTimeout(timer);
        }
        self.clearCallFlag(callFlag);
        _callback.apply(self, arguments);
      }
    }
    window._replace_center_.native.call.apply(this.nativeBridge, [component, action, opts, callback]);
  }

  watch(nativeBridge?: {
    call: Function,
    callback: Function
  }): void {
    this.nativeBridge = nativeBridge || this.nativeBridge;
    if (!this.nativeBridge) {
      throw Error("NativeHook can not start watch, has not initlized");
    }
    replace(this.nativeBridge, "call", this.handleCall.bind(this), "native");
  }

  unwatch(): void {
    reduction(this.nativeBridge, "call", "native");
  }
}
