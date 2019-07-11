import { MonitorProvider } from './MonitorProvider';

export class AbstractConsumer {
  provider: MonitorProvider | undefined;

  mounted (provider: MonitorProvider) {
    this.provider = provider;
    return this;
  }

  unmounted () {
    this.provider = undefined;
    return this;
  }
}