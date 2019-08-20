import { MonitorCenter, LifeCycle } from "../MonitorCenter";

export function beforeConsume(target: Object, methodName: string, descriptor: PropertyDescriptor) {
  return {
    value: function(...args: any[]) {
      let lifeCycle: LifeCycle | undefined = MonitorCenter.getInstance().getLifeCycle();
      if (lifeCycle && lifeCycle.beforeConsume) {
        lifeCycle.beforeConsume.apply(this, args);
      }
      return descriptor.value.apply(this, args);
    }
  }
}

export function afterConsume(target: Object, methodName: string, descriptor: PropertyDescriptor) {
  return {
    value: async function(...args: any[]) {
      let lifeCycle: LifeCycle | undefined = MonitorCenter.getInstance().getLifeCycle();
      let result = await descriptor.value.apply(this, args);
      if (lifeCycle && lifeCycle.afterConsume) {
        lifeCycle.afterConsume.apply(this, [result]);
      }
      return result;
    }
  }
}

export function beforeTrack(target: Object, methodName: string, descriptor: PropertyDescriptor) {
  return {
    value: function(...args: any[]) {
      let lifeCycle: LifeCycle | undefined = MonitorCenter.getInstance().getLifeCycle();
      if (lifeCycle && lifeCycle.beforeTrack) {
        lifeCycle.beforeTrack.apply(this, args);
      }
      return descriptor.value.apply(this, args);
    }
  }
}

export function afterTrack(target: Object, methodName: string, descriptor: PropertyDescriptor) {
  return {
    value: async function(...args: any[]) {
      let lifeCycle: LifeCycle | undefined = MonitorCenter.getInstance().getLifeCycle();
      let result = await descriptor.value.apply(this, args);
      if (lifeCycle && lifeCycle.afterTrack) {
        lifeCycle.afterTrack.apply(this, [result]);
      }
      return result;
    }
  }
}
