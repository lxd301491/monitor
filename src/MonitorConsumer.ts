import { CircuitBreaker } from "./tools/CircuitBreaker";
import { EmitType } from "./typings";
import { Store } from "./Store";
import { before, after } from "./decorators/LifeCycle";
import { infoLenMax } from "./configs";
import axios from 'axios';
import pako from 'pako';


export interface FetchResponse<T = any>  {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}
export interface FetchInstance {
  post<T = any, R = FetchResponse<T>>(url: string, data?: any, config?: any): Promise<R>;
}

export class MonitorConsumer {
  private api: string;
  private abnormalBreaker: CircuitBreaker = new CircuitBreaker(
    "5/60",
    5 * 60,
    "0/60"
  );
  private emitType: EmitType;
  private fetch: FetchInstance; 
  private zip: boolean;

  constructor(api: string, store: Store, emitType: EmitType = "image", fetch: FetchInstance = axios, zip: boolean = true) {
    if (emitType === "xhr" && !XMLHttpRequest) {
      throw ReferenceError("EmitType is XHR,but XMLHttpRequest is undefined");
    }
    if (emitType === "fetch" && !fetch) {
      throw ReferenceError("EmitType is FETCH,but fetch object is undefined");
    }
    this.api = api;
    this.emitType = emitType;
    this.fetch = fetch;
    this.zip = zip;
  }

  public setAbnormalBreaker (abnormalBreaker: CircuitBreaker) {
    this.abnormalBreaker = abnormalBreaker;
  }

  @before
  @after
  public async consume(data: string): Promise<any> {
    if (!this.abnormalBreaker.canPass()) {
      console.log("abnormalBreaker count", this.abnormalBreaker.getCount(), this.abnormalBreaker.getStateName(), "Duration", this.abnormalBreaker.getDuration())
      return;
    }
    data = encodeURIComponent(data);
    if (this.zip && data.length > infoLenMax) {
      console.log(`data length before gzip ${data.length}`);
      data = pako.gzip(data, {to: "string"});
      console.log(`data length after gzip ${data.length}`);
    }
    try {
      switch (this.emitType) {
        case "image": {
          await this.imageConsume(data);
          break;
        }
        case "xhr": {
          await this.xhrConsume(data);
          break;
        }
        case "fetch": {
          await this.fetchConsume(data);
          break;
        }
        case "beacon": {
          await this.beaconConsume(data);
          break;
        }
      }
    } catch (err) {
      this.abnormalBreaker.count();
    }
  }

  private imageConsume(data: string) {
    let img = new Image();
    return new Promise((resolve, reject) => {
      img.onerror = (err) => {
        reject(err);
      };
      img.onload = (resp) => {
        resolve(resp);
      };
      img.onabort = (resp) => {
        reject(resp);
      };
      img.src = this.api + "?data=" + data;
    })
  }

  private xhrConsume(data: string) {
    let xhr: XMLHttpRequest = new XMLHttpRequest();
    xhr.open("POST", this.api, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    return new Promise((resolve, reject) => {
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
      xhr.send("data=" + data);
    });
  }

  private fetchConsume(data: string) {
    if (!this.fetch) {
      return false;
    }
    return this.fetch.post(this.api, {
      data: data
    })
  }

  private beaconConsume(data: string) {
    if (!window || !window.navigator || "function" != typeof window.navigator.sendBeacon) {
      return false;
    }
    return new Promise((resolve, reject) => {
      window.navigator.sendBeacon(this.api, JSON.stringify({
        data: data
      })) ? resolve() : reject();
    })
  }
}
