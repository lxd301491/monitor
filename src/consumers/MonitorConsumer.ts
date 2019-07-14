import { AbstractConsumer } from "./AbstractConsumer";
import { CircuitBreaker } from "../tools/CircuitBreaker";
import { MonitorCenter } from "../process/MonitorCenter";
import { EMIT_TYPE } from "../configs/globalEnum";

export class MonitorConsumer extends AbstractConsumer {
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
  private emitType: EMIT_TYPE;

  constructor(
    center: MonitorCenter,
    handler: string,
    api: string,
    emitType: EMIT_TYPE = EMIT_TYPE.IMAGE
  ) {
    super(center, handler);
    this.api = api;
    this.emitType = emitType;
  }

  async consume(params: any): Promise<any> {
    try {
      switch (this.emitType) {
        case EMIT_TYPE.IMAGE: {
          await this.imageConsume(params);
          break;
        }
        case EMIT_TYPE.XHR: {
          await this.xhrConsume(params);
          break;
        }
        case EMIT_TYPE.FETCH: {
          await this.fetchConsume(params);
          break;
        }
        case EMIT_TYPE.CUSTOM: {
          if (this.emitFunc) {
            await this.emitFunc(params);
            break;
          }
        }
        default:
          this.imageConsume(params);
      }
    } finally {
      super.consume(params);
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
      xhr.onerror = () => {
        this.abnormalBreaker.count();
        return;
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
        .catch(() => {
          this.abnormalBreaker.count();
        })
        .finally(() => {
          return;
        });
    } else {
      return;
    }
  }
}
