import { AbstractHook } from "./AbstractHook";
import { replace, reduction } from "../decorators/LifeCycle";
export class NativeHook extends AbstractHook {
  private nativeBridge: any;

  private handleCall(this: {call: Function, callback: Function}) {
    window._replace_center_.call.apply(this, arguments);
    console.log("call", arguments);
  }

  private handleCallBack(this: {call: Function, callback: Function}) {
    window._replace_center_.callback.apply(this, arguments);
    console.log("callback", arguments);
  }

  watch(nativeBridge?: {
    call: Function,
    callback: Function
  }): void {
    this.nativeBridge = nativeBridge || this.nativeBridge;
    if (!this.nativeBridge) {
      throw Error("NativeHook can not start watch, has not initlized");
    }
    replace(this.nativeBridge, "call", this.handleCall.bind(this.nativeBridge));
    replace(this.nativeBridge, "callback", this.handleCallBack.bind(this.nativeBridge));
  }

  unwatch(): void {
    reduction(this.nativeBridge, "call");
    reduction(this.nativeBridge, "callback");
  }
}
