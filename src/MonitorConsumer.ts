import { CircuitBreaker } from "./tools/CircuitBreaker";
import { EMIT_TYPE } from "./configs/globalEnum";
import { StoreArea } from "./storeArea";
import * as _ from "lodash";
import { beforeConsume, afterConsume } from "./decorators/lifeCycle";
// const pako = require("pako");

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
  private bundleSize?: number;

  constructor(handler: string, api: string, bunderSize?: number, emitType?: EMIT_TYPE) {
    this.handler = handler;
    this.api = api;
    this.bundleSize = bunderSize;
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
    if (!this.timer) {
      this.timer = window.setInterval(() => {
        if (this.store) {
          let params = this.store.demand(this.handler, this.bundleSize);
          if (params) {
            this.consume(params);
          }
        }
      }, 20);
    }
  }

  pause() {
    clearInterval(this.timer);
    this.timer = undefined;
  }

  @beforeConsume
  @afterConsume
  private async consume(params: any): Promise<any> {
    // console.log(_.VERSION);
    // params.points = pako.gzip(JSON.stringify(params.points) , {to: "string"});
    let resp;
    try {
      switch (this.emitType) {
        case EMIT_TYPE.IMAGE: {
          resp = await this.imageConsume(params.points);
          break;
        }
        case EMIT_TYPE.XHR: {
          resp = await this.xhrConsume(params.points);
          break;
        }
        case EMIT_TYPE.FETCH: {
          resp = await this.fetchConsume(params.points);
          break;
        }
        case EMIT_TYPE.CUSTOM: {
          if (this.emitFunc) {
            resp = await this.emitFunc(params.points);
            break;
          }
        }
        default:
          resp = await this.imageConsume(params.points);
      }
    } catch (err) {
      this.abnormalBreaker.count();
      resp = err;
    } finally {
      if (this.store) this.store.remand(params.demandId);
      return resp;
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
    return await new Promise((resolve, reject) => {
      img.onerror = (err) => {
        this.abnormalBreaker.count();
        reject(err);
      };
      img.onload = (resp) => {
        resolve(resp);
      };
      img.onabort = (resp) => {
        reject(resp);
      };
      img.src = this.api + "?" + this.obj2Search(params);
    })
  }

  private async xhrConsume(params: any) {
    if (XMLHttpRequest) {
      this.frequencyBreaker.count();
      let xhr: XMLHttpRequest = new XMLHttpRequest();
      xhr.open("POST", this.api, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      return await new Promise((resolve, reject) => {
        xhr.onload = (resp) => {
          resolve(resp);
        };
        xhr.onabort = (resp) => {
          resolve(resp);
        };
        xhr.onerror = (err) => {
          reject(err);
        };
        xhr.onreadystatechange = () => {
          if (xhr.readyState !== 4 || xhr.status !== 200) {
            reject(xhr.readyState);
          }
        };
        xhr.send(this.obj2Search(params));
      });
    } else {
      return "XMLHttpRequest is not available";
    }
  }

  private async fetchConsume(params: any) {
    if (fetch) {
      this.frequencyBreaker.count();
      return await fetch(this.api, {
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
      return "fetch is not available";
    }
  }
}
