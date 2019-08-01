import { CircuitBreaker } from "./tools/CircuitBreaker";
import { EMIT_TYPE } from "./configs/globalEnum";
import { StoreArea } from "./storeArea";

declare global {
  interface Window {
    WTjson: any,
    _tag: any
  }
}

export class MonitorConsumer {
  private handler: string;
  private store?: StoreArea;
  private emitFunc?: Function;
  private api: string;
  private frequencyBreaker: CircuitBreaker = new CircuitBreaker(
    "60/60",
    5 * 60,
    "30/60"
  );
  private abnormalBreaker: CircuitBreaker = new CircuitBreaker(
    "5/60",
    5 * 60,
    "0/60"
  );
  private emitType: EMIT_TYPE = EMIT_TYPE.IMAGE;
  private timer?: number;

  constructor(handler: string, api: string, emitType?: EMIT_TYPE) {
    this.handler = handler;
    this.api = api;
    if (emitType) this.emitType = emitType;
  }

  mountStore(store: StoreArea) {
    this.store = store;
  }

  injectCoustumEmit(func: Function) {
    this.emitFunc = func;
  }

  setBreaker(frequencyBreaker?: CircuitBreaker, abnormalBreaker?: CircuitBreaker) {
    if (frequencyBreaker) this.frequencyBreaker = frequencyBreaker;
    if (abnormalBreaker) this.abnormalBreaker = abnormalBreaker;
  }

  start() {
    console.log(`MonitorConsumer::consume ${this.handler} ${this.emitType}`);
    if (!this.timer) {
      this.timer = window.setInterval(() => {
        if (this.store) {
          let point = this.store.demand(this.handler)
          if (point) {
            this.consume(point);
          }
        }
      }, 20);
    }
  }

  pause() {
    console.log(`MonitorConsumer::consume ${this.handler} ${this.emitType}`);
    clearInterval(this.timer);
    this.timer = undefined;
  }

  private async consume(point: any): Promise<any> {
    console.log(`MonitorConsumer::consume ${this.handler} ${this.emitType}`, point);
    try {
      switch (this.emitType) {
        case EMIT_TYPE.IMAGE: {
          await this.imageConsume(point);
          break;
        }
        case EMIT_TYPE.XHR: {
          await this.xhrConsume(point);
          break;
        }
        case EMIT_TYPE.FETCH: {
          await this.fetchConsume(point);
          break;
        }
        case EMIT_TYPE.WEBTRENDS_VISIT: {
          this.visitConsume(point);
          break;
        }
        case EMIT_TYPE.WEBTRENDS_CLICK: {
          this.clickConsume(point);
          break;
        }
        case EMIT_TYPE.CUSTOM: {
          if (this.emitFunc) {
            await this.emitFunc(point);
            break;
          }
        }
        default:
          this.imageConsume(point);
      }
    } catch (err) {
      this.abnormalBreaker.count();
    } finally {
      if (this.store) this.store.remand(point.demandId);
    }
  }

  private obj2Search(params: any): string {
    let result: string = "";
    for (let key in params) {
      result += key + "=" + encodeURIComponent(params[key]) + "&";
    }
    result = result.substring(0, result.length - 1);
    return result;
  }

  private async imageConsume(params: any) {
    this.frequencyBreaker.count();
    let img = new Image();
    img.onerror = () => {
      this.abnormalBreaker.count();
      return;
    };
    img.onload = () => {
      return;
    };
    img.onabort = () => {
      return;
    };
    img.src = this.api + "?" + this.obj2Search(params);
  }

  private async xhrConsume(params: any) {
    if (XMLHttpRequest) {
      this.frequencyBreaker.count();
      let xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open("POST", this.api, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onload = () => {
        return;
      };
      xhr.onabort = () => {
        return;
      };
      xhr.onerror = (err) => {
        throw err;
      };
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4 || xhr.status !== 200) {
          this.abnormalBreaker.count();
        }
        return;
      };
      xhr.send(this.obj2Search(params));
    } else {
      return;
    }
  }

  private async fetchConsume(params: any) {
    if (fetch) {
      this.frequencyBreaker.count();
      fetch(this.api, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params,
        mode: "cors",
        cache: "no-cache"
      })
        .catch((err) => {
          throw err;
        })
        .finally(() => {
          return;
        });
    } else {
      return;
    }
  }

  private visitConsume(params: any): void {
    this.frequencyBreaker.count();
    window.WTjson = window.WTjson || {};
    for (let key in params) {
      window.WTjson[key] = params[key];
    }
    window._tag.ready(() => {
      window._tag.init();
    });
  }

  private clickConsume(params: any): void {
    this.frequencyBreaker.count();
    window._tag.trackEvent(params.otitle, params.olabel, params.opts);
  }
}
