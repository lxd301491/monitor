/**
 * 计数器
 */
export class Counter {
  nums: number[] = [];
  reserved: number;

  constructor(reserved: number) {
    this.reserved = reserved;
  }

  get() {
    let now = Date.now();
    this.nums = this.nums.filter(num => {
      return num > now - this.reserved * 1000
    });
    return this.nums.length;
  }

  increase() {
    let now = Date.now();
    this.nums = this.nums.filter(num => {
      return num > now - this.reserved * 1000
    });
    this.nums.push(Date.now());
  }

  decrease() {
    this.nums.shift();
  }

  reset() {
    this.nums = [];
  }
}
