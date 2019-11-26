interface ILiftCycle {
  [key: string]: any,
  consume: {
    before: Function,
    after: Function,
  },
  track: {
    before: Function,
    after: Function,
  }
}

export const lifeCycle: ILiftCycle = {
  consume: {
    before: () => {},
    after: () => {}
  },
  track: {
    before: () => {},
    after: () => {}
  }
}

export function before(target: Object, methodName: string, descriptor: PropertyDescriptor) {
  return {
    value: function(...args: any[]) {
      lifeCycle[methodName] && lifeCycle[methodName].before.apply(this, args);
      return descriptor.value.apply(this, args);
    }
  }
}

export function after(target: Object, methodName: string, descriptor: PropertyDescriptor) {
  return {
    value: async function(...args: any[]) {
      let result = await descriptor.value.apply(this, args);
      lifeCycle[methodName] && lifeCycle[methodName].after.apply(this, [result]);
      return result;
    }
  }
}
