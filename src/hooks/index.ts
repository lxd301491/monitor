import { AbstractHook } from "./AbstractHook";
import { ErrorHook } from "./ErrorHook";
import { ActionHook } from "./ActionHook";
import { UncaughtHook } from "./UncaughtHook";
import { SPARouterHook } from "./SPARouterHook";
import { PerformanceHook } from "./PerformanceHook";
import { MonitorProvider } from "../MonitorProvider";


export class HooksFactory {
  private hooks: Map<string, AbstractHook> = new Map();
  private provider: MonitorProvider;

  constructor (provider: MonitorProvider) {
    this.provider = provider;
  }

  public reigster<T extends AbstractHook>(key: string, hook: {new(provider: MonitorProvider): T}): HooksFactory {
    let it = this.hooks.keys();
    let r: IteratorResult<string>;
    while (r = it.next() , !r.done) {
      if (r.value === key) {
        throw TypeError(`the hook type "${key}" already exists！`);
      }
    }
    this.hooks.set(key, new hook(this.provider));
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

  public initlize(): HooksFactory {
    this.reigster("error", ErrorHook);
    this.reigster("uncaught", UncaughtHook);
    this.reigster("action", ActionHook);
    this.reigster("spa", SPARouterHook);
    this.reigster("performance", PerformanceHook);
    return this;
  }
}