import { AbstractHook } from "./AbstractHook";
import { ErrorHook } from "./ErrorHook";
import { ActionHook } from "./ActionHook";
import { UncaughtHook } from "./UncaughtHook";
import { SPARouterHook } from "./SPARouterHook";
import { PerformanceHook } from "./PerformanceHook";
import { MonitorProvider } from "../MonitorProvider";


export class HooksFactory {
  private hooks: Map<string, AbstractHook> = new Map();

  public reigster<T extends AbstractHook>(key: string, hook: T): HooksFactory {
    let it = this.hooks.keys();
    let r: IteratorResult<string>;
    while (r = it.next() , !r.done) {
      if (r.value === key) {
        throw TypeError(`the hook type "${key}" already exists！`);
      }
      console.log(r.value);
    }
    this.hooks.set(key, hook);
    return this;
  }

  public watch(key: string): HooksFactory {
    if (!this.hooks.has(key)) {
      throw TypeError(`hook type "${key}" does not exist, please register first！`);
    }
    this.hooks.get(key)?.watch();
    return this;
  }

  public unwatch(key: string): HooksFactory {
    if (!this.hooks.has(key)) {
      throw TypeError(`hook type "${key}" does not exist, please register first！`);
    }
    this.hooks.get(key)?.unwatch();
    return this;
  }

  public initlize(provider: MonitorProvider): HooksFactory {
    this.reigster("error", new ErrorHook(provider));
    this.reigster("uncaught", new UncaughtHook(provider));
    this.reigster("action", new ActionHook(provider));
    this.reigster("spa", new SPARouterHook(provider));
    this.reigster("performance", new PerformanceHook(provider));
    return this;
  }
}