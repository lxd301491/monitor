import { NativeHook } from "./NativeHook";
import { ErrorHook } from "./ErrorHook";
import { ActionHook } from "./ActionHook";
import { UncaughtHook } from "./UncaughtHook";
import { AbstractHook } from "./AbstractHook";
import { SPARouterHook } from "./SPARouterHook";
import { MonitorProvider } from "../MonitorProvider";
import { InfoType } from "../typings";
import { PerformanceHook } from "./PerformanceHook";
import { VueHook } from "./VueHook";

export class HooksStore {
  private provider: MonitorProvider;
  private hooks: Map<InfoType, AbstractHook> = new Map();

  constructor (provider: MonitorProvider) {
    this.provider = provider;
  }

  public getHooks() {
    return this.hooks;
  }

  public watch(info: InfoType, container?: any) {
    let hook = this.hooks.get(info);
    if (hook) {
      hook.watch(container);
      return;
    }
    switch (info) {
      case "native": 
        hook = new NativeHook(this.provider);
        break;
      case "error":
        hook = new ErrorHook(this.provider);
        break;
      case "action":
        hook = new ActionHook(this.provider);
        break;
      case "uncaught":
        hook = new UncaughtHook(this.provider);
        break;
      case "spa":
        hook = new SPARouterHook(this.provider);
        break;
      case "performance":
        hook = new PerformanceHook(this.provider);
        break;
      case "vue":
        hook = new VueHook(this.provider);
        break;
      default:
        hook = undefined;
        break;
    }
    if (hook) {
      this.hooks.set(info, hook);
    }
  }

  public unwatch(info: InfoType) {
    let hook = this.hooks.get(info);
    if (hook) {
      hook.unwatch();
      this.hooks.delete(info);
    }
  }
}  