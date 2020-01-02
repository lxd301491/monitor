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

export function replace(target: any, methodName: string, replacer: Function) {
  if (!window._replace_center_[methodName]) {
    window._replace_center_[methodName] = target[methodName];
    target[methodName] = replacer;
  }
}

export function reduction(target: any, methodName: string) {
  if (window._replace_center_[methodName]) {
    target[methodName] = window._replace_center_[methodName];
    window._replace_center_[methodName] = undefined;
  }
}
