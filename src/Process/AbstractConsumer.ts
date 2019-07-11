import { MonitorProvider } from './MonitorProvider';

export class AbstractConsumer {
  provider: MonitorProvider = new MonitorProvider();

  mounted (provider: MonitorProvider) {
    this.provider = provider;
    return this;
  }

  unmounted () {
    this.provider = new MonitorProvider();
    return this;
  }
}