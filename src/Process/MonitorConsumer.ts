import { AbstractConsumer } from "./AbstractConsumer";
import { CircuitBreaker } from "../circuitBreaker/CircuitBreaker";
import { MonitorCenter } from "./MonitorCenter";
import { EMIT_TYPE } from "../config/globalEnum";

export class MonitorConsumer extends AbstractConsumer {
  private url: string;
  private frequencyBreaker: CircuitBreaker;
  private abnormalBreaker: CircuitBreaker;
  private emitFunc: Function | undefined;
  private emitType: EMIT_TYPE;

  constructor(
    center: MonitorCenter,
    handler: string,
    url: string,
    frequencyBreaker = new CircuitBreaker("60/60", 5 * 60, "30/60"),
    abnormalBreaker = new CircuitBreaker("5/60", 5 * 60, "0/60"),
    emitType: EMIT_TYPE = EMIT_TYPE.IMAGE
  ) {
    super(center, handler);
    this.url = url;
    this.frequencyBreaker = frequencyBreaker;
    this.abnormalBreaker = abnormalBreaker;
    this.emitType = emitType;
  }

  injectCoustumEmit(func: Function) {
    this.emitFunc = func;
  }

  consume(params: any): void {
    switch (this.emitType) {
      case EMIT_TYPE.IMAGE: {
        this.imageConsume(params);
        break;
      }
      case EMIT_TYPE.XHR: {
        this.xhrConsume(params);
        break;
      }
      case EMIT_TYPE.FETCH: {
        this.fetchConsume(params);
        break;
      }
      case EMIT_TYPE.CUSTOM: {
        if (this.emitFunc) {
          this.emitFunc(params);
          break;
        }
      }
      default:
        this.imageConsume(params);
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

  private imageConsume(params: any) {
    this.frequencyBreaker.count();
    let img = new Image();
    img.onerror = () => {
      this.abnormalBreaker.count();
      this.center.remandConcurrent();
    };
    img.onload = () => {
      this.center.remandConcurrent();
    };
    img.onabort = () => {
      this.center.remandConcurrent();
    };
    img.src = this.url + "?" + this.obj2Search(params);
  }

  private xhrConsume(params: any) {
    if (XMLHttpRequest) {
      this.frequencyBreaker.count();
      let xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open("POST", this.url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onload = () => {
        this.center.remandConcurrent();
      };
      xhr.onabort = () => {
        this.center.remandConcurrent();
      };
      xhr.onerror = () => {
        this.abnormalBreaker.count();
        this.center.remandConcurrent();
      };
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4 || xhr.status !== 200) {
          this.abnormalBreaker.count();
        }
        this.center.remandConcurrent();
      };
      xhr.send(this.obj2Search(params));
    }
  }

  private fetchConsume(params: any) {
    if (fetch) {
      this.frequencyBreaker.count();
      fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params,
        mode: "cors",
        cache: "no-cache"
      })
        .catch(() => {
          this.abnormalBreaker.count();
        })
        .finally(() => {
          this.center.remandConcurrent();
        });
    }
  }
}
