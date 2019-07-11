/**
 * 计数器
 */
export class Counter {
  num: number;

  constructor(num = 0) {
    this.num = num;
  }

  get() {
    return this.num;
  }

  increase() {
    this.num++;
  }

  decrease() {
    this.num--;
  }

  reset() {
    this.num = 0;
  }
}
