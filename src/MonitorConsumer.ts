import { CircuitBreaker } from "./tools/CircuitBreaker";
import { EmitType } from "./typings";
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

  constructor(api: string, emitType: EmitType = "image") {
    if (emitType === "beacon" && !navigator.sendBeacon) {
      throw ReferenceError("EmitType is beacon,but navigator.setBeacon is undefined");
    }
    this.api = api;
    this.emitType = emitType;
  }

  setAbnormalBreaker (abnormalBreaker: CircuitBreaker) {
    this.abnormalBreaker = abnormalBreaker;
  }

  @before
  @after
  public async consume(data: string, zip: boolean = false): Promise<any> {
    if (!this.abnormalBreaker.canPass()) {
      console.log("abnormalBreaker count", this.abnormalBreaker.getCount(), this.abnormalBreaker.getStateName(), "Duration", this.abnormalBreaker.getDuration())
      return;
    }
    if (zip && data.length > infoLenMax) {
      console.log(`data length before gzip ${data.length}`);
      data = encodeURIComponent(data);
      data = pako.gzip(data, {to: "string"});
      console.log(`data length after gzip ${data.length}`);
    }
    try {
      switch (this.emitType) {
        case "image": {
          await this.imageConsume(data);
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

  private fetchConsume(data: string) {
    return axios.post(this.api, {
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
